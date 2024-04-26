import { ChannelType } from 'discord-api-types/v10';
import { APIGuildChannelType, GuildChannel } from '@structures/GuildChannel';
import { GuildTextChannel } from '@structures/GuildTextChannel';
import { Manager } from '@managers/Manager';
import { Guild } from '@structures/Guild';
import { GuildVoiceTextChannel } from '@structures/GuildVoiceTextChannel';
import { GuildStageChannel } from '@structures/GuildStageChannel';

export class GuildChannelManager extends Manager<GuildChannel> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  /**
   * Add/update channel from payload
   *
   * @param {APIGuildChannelType} data
   * @return {*}  {GuildChannel}
   * @memberof GuildChannelManager
   * @internal
   */
  _add(data: APIGuildChannelType): GuildChannel {
    let channel = this.get(data.id);
    if (channel) {
      channel._patch(data);
    } else {
      switch (data.type) {
        case ChannelType.GuildText:
          channel = new GuildTextChannel(this.guild, data);
          break;
        case ChannelType.GuildStageVoice:
          channel = new GuildStageChannel(this.guild, data);
          break;
        case ChannelType.GuildVoice:
          channel = new GuildVoiceTextChannel(this.guild, data);
          break;
        default:
          channel = new GuildChannel(this.guild, data);
      }
      channel._patch(data);
      this.set(channel.id, channel);
    }

    return channel;
  }
}
