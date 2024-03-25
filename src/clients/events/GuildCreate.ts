import { GatewayGuildCreateDispatch } from 'discord-api-types/v10';
import { Client } from '../Client';
import { Shard } from '../Shard';

export default function (client: Client, shard: Shard, packet: GatewayGuildCreateDispatch) {
  client.guilds.add(shard, packet.d);
}
