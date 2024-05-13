import { GuildStageInstance } from '@structures/GuildStageInstance';
import { GuildVoiceChannel } from '@structures/GuildVoiceChannel';
import { RESTPostAPIStageInstanceJSONBody, RESTPostAPIStageInstanceResult, Routes, Snowflake, StageInstancePrivacyLevel } from 'discord-api-types/v10';

export class GuildStageChannel extends GuildVoiceChannel {
  
  /**
   * Create a stage instance
   * @param {Object} options
   * @param {string} options.topic - The topic of the instance. 1-120 characters
   * @param {StageInstancePrivacyLevel} [options.privacyLevel] - The privacy of the instance.
   * @param {boolean} [options.sendNotification] - Should a notification be sent to everyone
   * @param {Snowflake} [options.eventId] - Id of scheduled guild event
   * @param {string} [options.reason] - Reason for creating instance
   * @return {*}  {Promise<GuildStageInstance>}
   * @memberof GuildStageChannel
   */
  async createInstance({
    topic,
    privacyLevel,
    sendNotification,
    eventId,
    reason,
  }: {
    topic: string;
    privacyLevel?: StageInstancePrivacyLevel;
    sendNotification?: boolean;
    eventId?: Snowflake;
    reason?: string;
  }): Promise<GuildStageInstance> {
    const response = (await this.client.rest.post(Routes.stageInstances(), {
      body: {
        channel_id: this.id,
        topic,
        privacy_level: privacyLevel,
        send_start_notification: sendNotification,
        guild_scheduled_event_id: eventId,
      } as RESTPostAPIStageInstanceJSONBody,
      reason,
    })) as RESTPostAPIStageInstanceResult;
    return new GuildStageInstance(this.guild, response);
  }
}
