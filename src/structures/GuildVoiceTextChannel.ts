import { MessageManager } from '@managers/MessageManager';
import { Guild } from '@structures/Guild';
import { GuildVoiceChannel } from '@structures/GuildVoiceChannel';
import { APIGuildVoiceChannel } from 'discord-api-types/v10';

export class GuildVoiceTextChannel extends GuildVoiceChannel {
  /**
   * Messages sent in channel
   *
   * @type {MessageManager}
   * @memberof GuildVoiceTextChannel
   */
  messages: MessageManager;

  /**
   * Rate limit per user
   *
   * @type {(number | null)}
   * @memberof GuildVoiceTextChannel
   */
  rateLimitPerUser!: number | null;

  /**
   * Last message id
   *
   * @type {(string | null)}
   * @memberof GuildVoiceTextChannel
   */
  lastMessageId!: string | null;
  
  constructor(guild: Guild, data: APIGuildVoiceChannel) {
    super(guild, data);
    this.messages = new MessageManager(this);
  }

  override _patch(data: APIGuildVoiceChannel): void {
    super._patch(data);
    if (data.rate_limit_per_user !== undefined) this.rateLimitPerUser = data.rate_limit_per_user;
    if (data.last_message_id !== undefined) this.lastMessageId = data.last_message_id;
  }
}
