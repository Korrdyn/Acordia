import { Manager } from '@managers/Manager';
import { Guild } from '@structures/Guild';
import { GuildThreadChannel } from '@structures/GuildThreadChannel';
import { APIThreadChannel } from 'discord-api-types/v10';

export class GuildThreadManager extends Manager<GuildThreadChannel> {
  guild: Guild;

  constructor(guild: Guild) {
    super(guild.client);
    this.guild = guild;
  }

  _add(data: APIThreadChannel): GuildThreadChannel {
    let channel = this.get(data.id);
    if (channel) {
      channel._patch(data);
    } else {
      channel = new GuildThreadChannel(this.guild, data);
      this.set(channel.id, channel);
    }
    return channel;
  }
}
