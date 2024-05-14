import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { Events } from '@typings/events/ClientEvents';
import { APIDMChannel, GatewayChannelCreateDispatch, GatewayDispatchEvents } from 'discord-api-types/v10';

export default function (client: Client, shard: Shard, packet: GatewayChannelCreateDispatch) {
  if ('guild_id' in packet.d) {
    const guild = client.guilds.get(packet.d.guild_id);
    if (!guild) return shard.manager.debug(`Received ${packet.t} for uncached guild ${packet.d.guild_id}`, shard.id);

    if (packet.t === GatewayDispatchEvents.ChannelCreate) {
      const channel = guild.channels._add(packet.d);
      client.emit(Events.ChannelCreate, channel);
    } else if (packet.t === GatewayDispatchEvents.ChannelUpdate) {
      const old = guild.channels.get(packet.d.id)?.toJSON() ?? null;
      const channel = guild.channels._add(packet.d);
      client.emit(Events.ChannelUpdate, channel, old);
    }
  } else if (packet.t === GatewayDispatchEvents.ChannelCreate) {
    const channel = client.dmChannels._add(packet.d as APIDMChannel);
    client.emit(Events.ChannelCreate, channel);
  }
}
