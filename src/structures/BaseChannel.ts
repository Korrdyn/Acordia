import { APIPartialChannel, ChannelType } from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { Client } from '@clients/Client';
import { GuildBasedChannel, TextBasedChannel } from '@typings/ChannelTypes';
import { DMChannel } from '@structures/DMChannel';

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

  /**
   * @internal
   */
  override _patch(data: APIPartialChannel) {
    this.name = data.name ?? '';
    this.type = data.type;
  }

  isTextBased(): this is TextBasedChannel {
    return 'messages' in this;
  }

  inGuild(): this is GuildBasedChannel {
    return 'guild' in this && !!this.guild;
  }

  isDM(): this is DMChannel {
    return this.type === ChannelType.DM;
  }
}
