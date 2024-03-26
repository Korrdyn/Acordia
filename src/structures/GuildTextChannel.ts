import { APIGuildTextChannel, ChannelType } from 'discord-api-types/v10';
import { Guild } from './Guild';
import { GuildChannel } from './GuildChannel';
import { MessageManager } from '../managers/MessageManager';

export class GuildTextChannel extends GuildChannel {
  messages: MessageManager;
  rateLimitPerUser!: number | null;
  lastPinTimestamp!: string | null;
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
