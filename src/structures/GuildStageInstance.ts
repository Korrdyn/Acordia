import { Base } from '@structures/Base';
import { Guild } from '@structures/Guild';
import { GuildBasedChannel } from '@typings/ChannelTypes';
import { AcordiaError } from '@utils/AcordiaError';
import {
  APIStageInstance,
  RESTPatchAPIStageInstanceJSONBody,
  RESTPatchAPIStageInstanceResult,
  Routes,
  Snowflake,
  StageInstancePrivacyLevel,
} from 'discord-api-types/v10';

export class GuildStageInstance extends Base {
  channel: GuildBasedChannel;
  guild: Guild;
  privacyLevel = StageInstancePrivacyLevel.GuildOnly;
  topic!: string;
  scheduledEventId!: Snowflake | null;

  constructor(guild: Guild, data: APIStageInstance) {
    super(guild.client, data.id);
    this.guild = guild;
    this.channel = guild.channels.get(data.channel_id) as GuildBasedChannel;
  }

  override _patch(data: APIStageInstance): void {
    this.topic = data.topic;
    this.privacyLevel = data.privacy_level;
    this.scheduledEventId = data.guild_scheduled_event_id ?? null;
  }

  /**
   * Delete this stage instance
   *
   * @param {string} [reason]
   * @return {*}  {Promise<never>}
   * @memberof GuildStageInstance
   */
  delete(reason?: string): Promise<never> {
    return this.client.rest.delete(Routes.stageInstance(this.channel.id), { reason }) as Promise<never>;
  }

  async modify({ topic, privacyLevel, reason }: { topic?: string; privacyLevel?: StageInstancePrivacyLevel; reason?: string }): Promise<GuildStageInstance> {
    if (topic === undefined && privacyLevel === undefined) throw new AcordiaError('Topic or privacy level must be provided');

    const response = (await this.client.rest.patch(Routes.stageInstance(this.channel.id), {
      body: { topic, privacy_level: privacyLevel } as RESTPatchAPIStageInstanceJSONBody,
      reason,
    })) as RESTPatchAPIStageInstanceResult;
    this._patch(response);
    return this;
  }
}
