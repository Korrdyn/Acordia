import { Guild } from '@structures/Guild';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { APINewsChannel, RESTPostAPIChannelFollowersJSONBody, RESTPostAPIChannelFollowersResult, Routes, Snowflake } from 'discord-api-types/v10';

export class GuildNewsChannel extends GuildTextChannel {
  constructor(guild: Guild, data: APINewsChannel) {
    super(guild, data);
  }

  /**
   * Follow this channel in another channel
   *
   * @param {Snowflake} channelId - Target channel id
   * @return {*}  {Promise<RESTPostAPIChannelFollowersResult>}
   * @memberof GuildNewsChannel
   */
  follow(channelId: Snowflake): Promise<RESTPostAPIChannelFollowersResult> {
    return this.client.rest.post(Routes.channelFollowers(this.id), {
      body: { webhook_channel_id: channelId } as RESTPostAPIChannelFollowersJSONBody,
    }) as Promise<RESTPostAPIChannelFollowersResult>;
  }
}
