import { APIGuildTextChannel, ChannelType } from 'discord-api-types/v10';
import { Guild } from '@structures/Guild';
import { GuildChannel } from '@structures/GuildChannel';
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
  rateLimitPerUser!: number | null;

  /**
   * Last pinned timestamp
   *
   * @type {(string | null)}
   * @memberof GuildTextChannel
   */
  lastPinTimestamp!: string | null;

  /**
   * Default auto archive duration for threads
   *
   * @type {(number | null)}
   * @memberof GuildTextChannel
   */
  defaultAutoArchiveDuration!: number | null;

  constructor(guild: Guild, data: APIGuildTextChannel<ChannelType.GuildText>) {
    super(guild, data);
    this.messages = new MessageManager(this);
  }

  override patch(data: APIGuildTextChannel<ChannelType.GuildText>) {
    super.patch(data);
    this.rateLimitPerUser = data.rate_limit_per_user ?? null;
    this.lastPinTimestamp = data.last_pin_timestamp ?? null;
    this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
  }
}
