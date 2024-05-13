import { Collection } from '@discordjs/collection';
import { GuildChannel } from '@structures/GuildChannel';

export class GuildCategoryChannel extends GuildChannel {
  /**
   * Get all children of this category
   *
   * @readonly
   * @memberof GuildCategoryChannel
   */
  get channels() {
    const channels = new Collection<string, GuildChannel>();
    const children = this.guild.channels.filter((channel) => channel.parentId === this.id);
    for (const [id, child] of children) channels.set(id, child);
    return channels;
  }
}
