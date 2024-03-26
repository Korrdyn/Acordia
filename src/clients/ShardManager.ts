import { Collection } from '@discordjs/collection';
import { CloseCodes, WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { Client } from './Client';
import { GatewayIntentBitfield } from '../utils/GatewayIntentsBitfield';
import { Shard } from './Shard';
import { ShardEvents } from '../types/events/ShardEvents';
import { Status } from '../utils/Status';
import { Events } from '../types/events/ClientEvents';
import { GatewayCloseCodes, GatewayDispatchEvents, GatewayDispatchPayload } from 'discord-api-types/v10';
import * as PacketHandlers from './events';
import { PartialApplication } from '../structures/PartialApplication';

const readyWhitelist = [
  GatewayDispatchEvents.Ready,
  GatewayDispatchEvents.Resumed,
  GatewayDispatchEvents.GuildCreate,
  GatewayDispatchEvents.GuildDelete,
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayDispatchEvents.GuildMemberAdd,
  GatewayDispatchEvents.GuildMemberRemove,
];

const guildEvents = [GatewayDispatchEvents.GuildCreate, GatewayDispatchEvents.GuildDelete];

const closeCodes = [CloseCodes.Normal, GatewayCloseCodes.AlreadyAuthenticated, GatewayCloseCodes.InvalidSeq];

export class ShardManager extends Collection<number, Shard> {
  ws!: WebSocketManager | null;
  client: Client;
  intents: GatewayIntentBitfield;
  gateway!: string;
  status = Status.Idle;
  destroyed = false;
  packetQueue: Array<{ packet: GatewayDispatchPayload; shard: Shard }> = [];
  constructor(client: Client) {
    super();
    this.client = client;
    this.intents = client.options.intents as GatewayIntentBitfield;
  }

  async connect() {
    if (this.ws && this.ws.options.token !== this.client.options.token) {
      await this.ws.destroy({ code: CloseCodes.Normal, reason: 'Logging in with different token' });
      this.ws = null;
    }
    if (!this.ws) {
      this.ws = new WebSocketManager({
        intents: Number(this.intents.bits),
        rest: this.client.rest,
        token: this.client.options.token,
        shardCount: this.client.options.shardCount === 'auto' ? null : (this.client.options.shardCount as number),
        shardIds: this.client.options.shards ?? null,
        largeThreshold: this.client.options.largeThreshold ?? null,
        initialPresence: this.client.options.presence ?? null,
        retrieveSessionInfo: (id) => this.get(id)?.session ?? null,
        updateSessionInfo: (id, data) => {
          this.get(id)!.session = data;
        },
      });
      this.registerEvents();
    }

    const { url, shards, session_start_limit } = await this.ws.fetchGatewayInformation();

    this.debug(`Gateway Information\nURL: ${url}\nRecommended Shards: ${shards}`);
    this.debug(`Session Limit Information\nTotal: ${session_start_limit.total}\nRemaining: ${session_start_limit.remaining}`);

    this.gateway = `${url}/`;

    this.client.options.shards = await this.ws.getShardIds();
    this.client.options.shardCount = await this.ws.getShardCount();

    for (const id of this.client.options.shards) {
      if (this.has(id)) continue;

      const shard = new Shard(this, id);
      this.set(id, shard);

      shard.on(ShardEvents.Ready, (unavailable) => {
        this.client.emit('shardReady', shard.id, unavailable);
        this.checkReady();
      });
      shard.status = Status.Connecting;
    }

    await this.ws.connect();
  }

  private registerEvents() {
    this.ws!.on(WebSocketShardEvents.Debug, (data) => this.debug(data.message, data.shardId));

    this.ws!.on(WebSocketShardEvents.Dispatch, ({ data, shardId }) => {
      this.client.emit(Events.Raw, data as GatewayDispatchPayload, shardId);
      const shard = this.get(shardId)!;
      this.handlePacket(data as GatewayDispatchPayload, shard);
      if (shard.status === Status.WaitingForGuilds && guildEvents.includes(data.t)) {
        // @ts-ignore -- We are checking the packet type
        shard.handleGuild(data.d.id);
      }
    });

    this.ws!.on(WebSocketShardEvents.Ready, ({ data, shardId }) => {
      this.get(shardId)!.handleReadyPacket(data);
      this.client.application ??= new PartialApplication(this.client, data.application);
      this.client.users.add(data.user);
    });

    this.ws!.on(WebSocketShardEvents.Closed, ({ code, shardId }) => {
      const shard = this.get(shardId)!;
      shard.emit(ShardEvents.Close, code);
      if (closeCodes.includes(code) && this.destroyed) {
        shard.status = Status.Disconnected;

        this.client.emit(Events.ShardDisconnect, shardId, code);
        this.debug(`Shard not resumable: ${code} (${GatewayCloseCodes[code] ?? CloseCodes[code]})`, shardId);
        return;
      }

      shard.status = Status.Connecting;
      this.client.emit(Events.ShardReconnecting, shardId);
    });

    this.ws!.on(WebSocketShardEvents.Hello, ({ shardId }) => {
      const shard = this.get(shardId)!;
      if (shard.session) {
        shard.sequence = shard.session.sequence;
        shard.status = Status.Resuming;
      } else {
        shard.status = Status.Identifying;
      }
    });

    this.ws!.on(WebSocketShardEvents.Resumed, ({ shardId }) => {
      const shard = this.get(shardId)!;
      shard.status = Status.Ready;
      shard.emit(ShardEvents.Resume);
    });

    this.ws!.on(WebSocketShardEvents.HeartbeatComplete, ({ heartbeatAt, latency, shardId }) => {
      this.debug(`Heartbeat acknowledged, latency of ${latency}ms.`, shardId);
      const shard = this.get(shardId)!;
      shard.lastHeartbeat = heartbeatAt;
      shard.ping = latency;
    });

    this.ws!.on(WebSocketShardEvents.Error, ({ error, shardId }) => {
      this.client.emit(Events.ShardError, shardId, error);
    });
  }

  debug(message: string, shard?: number) {
    this.client.emit(Events.Debug, `[${shard ? `Shard ${shard}` : 'Manager'}] ${message}`);
  }

  private checkReady() {
    if (this.status === Status.Ready) return;
    if (this.size !== this.client.options.shards?.length || this.some((s) => s.status !== Status.Ready)) return;
    this.setReady();
  }

  private setReady() {
    this.status = Status.Ready;
    this.client.readyTimestamp = Date.now();
    this.client.emit(Events.Ready);
    this.handlePacket();
  }

  async destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    await this.ws?.destroy({ code: CloseCodes.Normal, reason: 'Manager was destroyed' });
  }

  private handlePacket(packet?: GatewayDispatchPayload, shard?: Shard) {
    if (packet && shard && this.status !== Status.Ready) {
      if (!readyWhitelist.includes(packet.t)) {
        this.packetQueue.push({ packet, shard });
        return false;
      }
    }

    if (this.packetQueue.length) {
      const item = this.packetQueue.shift()!;
      setImmediate(() => {
        this.handlePacket(item.packet, item.shard);
      }).unref();
    }

    // TODO: Remove expect error when all events added
    // @ts-expect-error -- Haven't added all the events yet
    if (packet && PacketHandlers[packet.t]) {
      // @ts-expect-error -- Haven't added all the events yet
      PacketHandlers[packet.t](this.client, shard, packet);
    }

    return true;
  }
}
