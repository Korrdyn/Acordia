import EventEmitter from 'eventemitter3';
import { ShardManager } from './ShardManager';
import { Status } from '@utils/Status';
import { SessionInfo } from '@discordjs/ws';
import { GatewayReadyDispatchData, GatewaySendPayload } from 'discord-api-types/v10';
import { IShardEvents, ShardEvents } from '@typings/events/ShardEvents';
import { Client } from './Client';

export class Shard extends EventEmitter<IShardEvents> {
  client: Client;
  manager: ShardManager;
  id: number;
  status = Status.Idle;
  ping = -1;
  lastHeartbeat = -1;
  guilds = new Set<string>();
  session: SessionInfo | null = null;
  sequence = 0;
  timeout: NodeJS.Timeout | null = null;

  constructor(manager: ShardManager, id: number) {
    super();
    this.client = manager.client;
    this.manager = manager;
    this.id = id;
  }

  /**
   * Handle the ready packet sent by gateway
   *
   * @param {GatewayReadyDispatchData} packet
   * @memberof Shard
   */
  handleReadyPacket(packet: GatewayReadyDispatchData) {
    this.emit(ShardEvents.WaitingForGuilds);
    this.guilds = new Set(packet.guilds.map((g) => g.id));
    this.status = Status.WaitingForGuilds;
  }

  /**
   * Remove guild from list when received
   *
   * @param {string} id
   * @memberof Shard
   */
  handleGuild(id: string) {
    this.manager.debug(`Got guild ${id}`, this.id);
    this.guilds.delete(id);
    this.checkReady();
  }

  /**
   * Check if shard got all guilds
   *
   * @return {*}
   * @memberof Shard
   */
  checkReady() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (!this.guilds.size) {
      this.status = Status.Ready;
      this.emit(ShardEvents.Ready);
      return;
    }

    const hasIntent = this.manager.intents.has('Guilds');
    this.timeout = setTimeout(
      () => {
        this.manager.debug('Guild timeout expired. Will have unavailable guilds', this.id);
        this.timeout = null;
        this.status = Status.Ready;
        this.emit(ShardEvents.Ready, this.guilds);
      },
      hasIntent ? this.client.options.guildTimeout ?? 15000 : 0,
    ).unref();
  }

  /**
   * Send data to gateway
   *
   * @param {GatewaySendPayload} data
   * @memberof Shard
   */
  send(data: GatewaySendPayload) {
    this.manager.ws!.send(this.id, data);
  }
}
