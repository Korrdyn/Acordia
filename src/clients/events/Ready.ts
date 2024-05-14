import { Client } from '@clients/Client';
import { Shard } from '@clients/Shard';
import { PartialApplication } from '@structures/PartialApplication';
import { UnavailableGuild } from '@structures/UnavailableGuild';
import { GatewayReadyDispatch } from 'discord-api-types/v10';

export default function (client: Client, shard: Shard, packet: GatewayReadyDispatch) {
  client.users._add(packet.d.user);
  client.application ??= new PartialApplication(client, packet.d.application);
  for (const guild of packet.d.guilds) {
    client.guilds.unavailable.set(guild.id, new UnavailableGuild(shard, guild));
  }

  shard.checkReady();
}
