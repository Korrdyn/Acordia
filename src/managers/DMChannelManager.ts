import { Manager } from '@managers/Manager';
import { DMChannel } from '@structures/DMChannel';
import { APIDMChannel } from 'discord-api-types/v10';

export class DMChannelManager extends Manager<DMChannel> {
  _add(data: APIDMChannel) {
    const channel = new DMChannel(this.client, data);
    this.set(data.id, channel);
    return channel;
  }
}
