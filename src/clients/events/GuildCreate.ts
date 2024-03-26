import { GatewayGuildCreateDispatch } from 'discord-api-types/v10';
import { Client } from '../Client';
import { Shard } from '../Shard';
import { Events } from '../../types/events/ClientEvents';

export default function (client: Client, shard: Shard, packet: GatewayGuildCreateDispatch) {
  let guild = client.guilds.get(packet.d.id);
  if (!guild) {
    const unavailable = client.guilds.unavailable.get(packet.d.id);
    if (!unavailable) {
      // ? New guild
      guild = client.guilds.add(shard, packet.d);
      client.emit(Events.GuildCreate, guild);
    } else {
      // ? Available guild
      client.guilds.unavailable.delete(unavailable.id);
      guild = client.guilds.add(shard, packet.d);
      client.emit(Events.GuildAvailable, guild);
    }
  } else {
    guild.patch(packet.d);
  }
}
