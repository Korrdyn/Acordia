import { ForumTag } from '@structures/ForumTag';
import { Guild } from '@structures/Guild';
import { GuildChannel } from '@structures/GuildChannel';
import { APIGuildForumChannel, APIGuildForumDefaultReactionEmoji, ForumLayoutType, SortOrderType } from 'discord-api-types/v10';

export class GuildForumChannel extends GuildChannel {
  defaultAutoArchiveDuration!: number | null;
  // TODO: Create and use Emoji class
  defaultReactionEmoji!: APIGuildForumDefaultReactionEmoji | null;
  tags!: ForumTag[];
  defaultSortOrder!: SortOrderType | null;
  defaultForumLayout!: ForumLayoutType | null;
  defaultRateLimitPerUser!: number | null;

  constructor(guild: Guild, data: APIGuildForumChannel) {
    super(guild, data);
    this._patch(data);
  }

  /**
   * @internal
   */
  override _patch(data: APIGuildForumChannel): void {
    super._patch(data);
    this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
    this.defaultReactionEmoji = data.default_reaction_emoji;
    this.tags = data.available_tags.map((tag) => new ForumTag(this.guild, tag));
    this.defaultSortOrder = data.default_sort_order;
    this.defaultForumLayout = data.default_forum_layout;
    this.defaultRateLimitPerUser = data.rate_limit_per_user ?? null;
  }

  // TODO: Get threads
  get threads() {
    return null;
  }
}
