import { ChannelType } from 'discord-api-types/v10';
import { Guild } from '../structures/Guild';
import { APIGuildChannelType, GuildChannel } from '../structures/GuildChannel';
import { Manager } from './Manager';
import { GuildTextChannel } from '../structures/GuildTextChannel';

export class GuildChannelManager extends Manager<GuildChannel> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  add(data: APIGuildChannelType) {
    let channel = this.get(data.id);
    if (channel) {
      channel.patch(data);
    } else {
      switch (data.type) {
        case ChannelType.GuildText:
          channel = new GuildTextChannel(this.guild, data);
          break;
        default:
          channel = new GuildChannel(this.guild, data);
      }
      channel.patch(data);
      this.set(channel.id, channel);
    }

    return channel;
  }
}
