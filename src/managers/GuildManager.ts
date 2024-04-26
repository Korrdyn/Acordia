import { GatewayGuildCreateDispatchData, Routes } from 'discord-api-types/v10';
import { Shard } from '@clients/Shard';
import { Collection } from '@discordjs/collection';
import { Manager } from '@managers/Manager';
import { Guild } from '@structures/Guild';
import { UnavailableGuild } from '@structures/UnavailableGuild';

export class GuildManager extends Manager<Guild> {
  unavailable = new Collection<string, UnavailableGuild>();

  /**
   * Add/update guild from payload
   *
   * @param {Shard} shard
   * @param {GatewayGuildCreateDispatchData} data
   * @return {*}  {Guild}
   * @memberof GuildManager
   * @internal
   */
  _add(shard: Shard, data: GatewayGuildCreateDispatchData): Guild {
    let guild = this.get(data.id);
    if (guild) {
      guild._patch(data);
    } else {
      guild = new Guild(shard, data);
      this.set(data.id, guild);
    }
    return guild;
  }

  /**
   * Leave a guild
   *
   * @param {string} id
   * @return {*}
   * @memberof GuildManager
   */
  leave(id: string): any {
    return this.client.rest.delete(Routes.userGuild(id)) as Promise<never>;
  }
}
