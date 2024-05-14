import { GatewayGuildDeleteDispatch } from 'discord-api-types/v10';
import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { Events } from '@typings/events/ClientEvents';
import { UnavailableGuild } from '@structures/UnavailableGuild';

export default function (client: Client, shard: Shard, packet: GatewayGuildDeleteDispatch) {
  const guild = client.guilds.get(packet.d.id);
  client.guilds.delete(packet.d.id);
  client.emit(Events.GuildDelete, guild ?? new UnavailableGuild(shard, packet.d));
}
