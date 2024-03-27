import { GatewayGuildDeleteDispatch } from 'discord-api-types/v10';
import { Client } from '../Client';
import { Shard } from '../Shard';
import { Events } from '../../types/events/ClientEvents';
import { UnavailableGuild } from '../../structures/UnavailableGuild';

export default function (client: Client, _: Shard, packet: GatewayGuildDeleteDispatch) {
  const guild = client.guilds.get(packet.d.id);
  client.guilds.delete(packet.d.id);
  client.emit(Events.GuildDelete, guild ?? new UnavailableGuild(client, packet.d));
}
