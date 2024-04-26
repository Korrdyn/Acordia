import { Collection } from '@discordjs/collection';
import { Guild } from '@structures/Guild';
import { GuildChannel } from '@structures/GuildChannel';
import { APIGuildStageVoiceChannel, APIGuildVoiceChannel, VideoQualityMode } from 'discord-api-types/v10';
import { GuildMember } from './GuildMember';

export class GuildVoiceChannel extends GuildChannel {
  /**
   * Members in voice channel
   *
   * @memberof GuildVoiceChannel
   */
  members = new Collection<string, GuildMember>();

  /**
   * Bitrate
   *
   * @memberof GuildVoiceChannel
   */
  bitrate = 64_000;

  /**
   * RTC region of channel
   *
   * @type {(string | null)}
   * @memberof GuildVoiceChannel
   */
  region: string | null = null;

  /**
   * Max users in channel
   *
   * @type {(number | null)}
   * @memberof GuildVoiceChannel
   */
  userLimit: number | null = null;

  /**
   * Stream quality
   *
   * @type {(VideoQualityMode | null)}
   * @memberof GuildVoiceChannel
   */
  videoQuality: VideoQualityMode | null = null;

  constructor(guild: Guild, data: APIGuildVoiceChannel | APIGuildStageVoiceChannel) {
    super(guild, data);
  }

  override _patch(data: APIGuildVoiceChannel | APIGuildStageVoiceChannel): void {
    super._patch(data);
    if (data.bitrate) this.bitrate = data.bitrate;
    if (data.rtc_region) this.region = data.rtc_region;
    if (data.user_limit !== undefined) this.userLimit = data.user_limit;
    if (data.video_quality_mode !== undefined) this.videoQuality = data.video_quality_mode;
  }
}
