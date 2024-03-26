import { APIPartialChannel, ChannelType } from 'discord-api-types/v10';
import { Base } from './Base';
import { Client } from '../clients/Client';
import { GuildBasedChannel, TextBasedChannel } from '../types/ChannelTypes';

export class BaseChannel extends Base {
  name!: string | null;
  type!: ChannelType;

  constructor(client: Client, data: APIPartialChannel) {
    super(client, data.id);
  }

  override patch(data: APIPartialChannel) {
    this.name = data.name ?? null;
    this.type = data.type;
  }

  isTextBased(): this is TextBasedChannel {
    return 'messages' in this;
  }

  inGuild(): this is GuildBasedChannel {
    return 'guild' in this;
  }
}
