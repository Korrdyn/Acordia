import { GatewayGuildCreateDispatch } from 'discord-api-types/v10';
import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { Events } from '@typings/events/ClientEvents';

export default function (client: Client, shard: Shard, packet: GatewayGuildCreateDispatch) {
  let guild = client.guilds.get(packet.d.id);
  if (!guild) {
    const unavailable = client.guilds.unavailable.get(packet.d.id);
    if (!unavailable) {
      // ? New guild
      guild = client.guilds._add(shard, packet.d);
      client.emit(Events.GuildCreate, guild);
    } else {
      // ? Available guild
      client.guilds.unavailable.delete(unavailable.id);
      guild = client.guilds._add(shard, packet.d);
      client.emit(Events.GuildAvailable, guild);
    }
  } else {
    guild._patch(packet.d);
  }
}
