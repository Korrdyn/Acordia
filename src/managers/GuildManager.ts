import { GatewayGuildCreateDispatchData, Routes } from 'discord-api-types/v10';
import { Manager } from './Manager';
import { Shard } from '../clients/Shard';
import { Guild } from '../structures/Guild';
import { Collection } from '@discordjs/collection';
import { UnavailableGuild } from '../structures/UnavailableGuild';

export class GuildManager extends Manager<Guild> {
  unavailable = new Collection<string, UnavailableGuild>();

  add(shard: Shard, data: GatewayGuildCreateDispatchData) {
    let guild = this.get(data.id);
    if (guild) {
      guild.patch(data);
    } else {
      guild = new Guild(shard, data);
      this.set(data.id, guild);
    }
    return guild;
  }

  leave(id: string) {
    return this.client.rest.delete(Routes.userGuild(id));
  }
}
