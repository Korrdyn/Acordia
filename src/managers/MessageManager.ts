import { Message } from '../structures/Message';
import { APIMessage } from 'discord-api-types/v10';
import { Manager } from './Manager';
import { TextBasedChannel } from '../types/ChannelTypes';

export class MessageManager extends Manager<Message> {
  channel: TextBasedChannel;
  
  constructor(channel: TextBasedChannel) {
    super(channel.client);
    this.channel = channel;
  }

  add(data: APIMessage) {
    let message = this.get(data.id);
    if (message) {
      message.patch(data);
    } else {
      message = new Message(this.channel, data);
      this.set(message.id, message);
    }
    this.prune();
    return message;
  }

  prune() {
    if (this.size <= this.client.options.messageCacheSize) return;
    const toRemove = this.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)).firstKey(this.size - this.client.options.messageCacheSize);
    for (const id of toRemove) this.delete(id);
  }
}
