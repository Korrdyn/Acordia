import { GatewayGuildCreateDispatchData } from 'discord-api-types/v10';
import { Manager } from './Manager';
import { Shard } from '../clients/Shard';
import { Guild } from '../structures/Guild';

export class GuildManager extends Manager<Guild> {
  add(shard: Shard, data: GatewayGuildCreateDispatchData) {
    const guild = this.get(data.id);
    if (guild) {
      guild.patch(data);
    } else {
      this.set(data.id, new Guild(shard, data));
    }
  }
}
