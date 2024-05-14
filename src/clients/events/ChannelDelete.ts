import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { Events } from '@typings/events/ClientEvents';
import { GatewayChannelDeleteDispatch } from 'discord-api-types/v10';

export default function (client: Client, shard: Shard, packet: GatewayChannelDeleteDispatch) {
  if ('guild_id' in packet.d) {
    const guild = client.guilds.get(packet.d.guild_id);
    if (!guild) return shard.manager.debug(`Received ${packet.t} for uncached guild ${packet.d.guild_id}`, shard.id);

    const channel = guild.channels.get(packet.d.id)!;
    guild.channels.delete(channel.id);
    client.emit(Events.ChannelDelete, channel);
  } else {
    const channel = client.dmChannels.get(packet.d.id)!;
    client.dmChannels.delete(packet.d.id);
    client.emit(Events.ChannelDelete, channel);
  }
}
