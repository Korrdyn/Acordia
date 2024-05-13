import { Guild } from '@structures/Guild';
import { APIGuildChannelType, GuildChannel } from '@structures/GuildChannel';
import { MessageManager } from '@managers/MessageManager';

export class GuildTextChannel extends GuildChannel {
  /**
   * Messages sent in channel
   *
   * @type {MessageManager}
   * @memberof GuildTextChannel
   */
  messages: MessageManager;

  /**
   * Rate limit per user
   *
   * @type {(number | null)}
   * @memberof GuildTextChannel
   */
  rateLimitPerUser: number | null = null;

  /**
   * Last pinned timestamp
   *
   * @type {(string | null)}
   * @memberof GuildTextChannel
   */
  lastPinTimestamp: string | null = null;

  /**
   * Default auto archive duration for threads
   *
   * @type {(number | null)}
   * @memberof GuildTextChannel
   */
  defaultAutoArchiveDuration: number | null = null;

  constructor(guild: Guild, data: APIGuildChannelType) {
    super(guild, data);
    this.messages = new MessageManager(this);
  }

  /**
   * @internal
   */
  override _patch(data: APIGuildChannelType) {
    super._patch(data);
    if ('rate_limit_per_user' in data) this.rateLimitPerUser = data.rate_limit_per_user ?? null;
    if ('last_pin_timestamp' in data) this.lastPinTimestamp = data.last_pin_timestamp ?? null;
    if ('default_auto_archive_duration' in data) this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
  }
}
