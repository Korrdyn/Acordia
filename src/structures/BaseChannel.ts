import { APIPartialChannel, ChannelType } from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { Client } from '@clients/Client';
import { GuildBasedChannel, TextBasedChannel } from '@typings/ChannelTypes';

export class BaseChannel extends Base {
  /**
   * Channel name
   *
   * @type {string}
   * @memberof BaseChannel
   */
  name!: string;

  /**
   * Type of channel
   *
   * @type {ChannelType}
   * @memberof BaseChannel
   */
  type!: ChannelType;

  constructor(client: Client, data: APIPartialChannel) {
    super(client, data.id);
  }

  override patch(data: APIPartialChannel) {
    this.name = data.name ?? '';
    this.type = data.type;
  }

  isTextBased(): this is TextBasedChannel {
    return 'messages' in this;
  }

  inGuild(): this is GuildBasedChannel {
    return 'guild' in this;
  }
}
