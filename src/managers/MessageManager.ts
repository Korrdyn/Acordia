import { APIMessage } from 'discord-api-types/v10';
import { TextBasedChannel } from '@typings/ChannelTypes';
import { Manager } from '@managers/Manager';
import { Message } from '@structures/Message';

export class MessageManager extends Manager<Message> {
  channel: TextBasedChannel;

  constructor(channel: TextBasedChannel) {
    super(channel.client);
    this.channel = channel;
  }

  /**
   * Add/update message from payload
   *
   * @param {APIMessage} data
   * @return {*}  {Message}
   * @memberof MessageManager
   * @internal
   */
  _add(data: APIMessage): Message {
    let message = this.get(data.id);
    if (message) {
      message._patch(data);
    } else {
      message = new Message(this.channel, data);
      this.set(message.id, message);
    }
    this.prune();
    return message;
  }

  /**
   * Prune message from cache
   *
   * @return {*}
   * @memberof MessageManager
   */
  prune() {
    if (this.size <= this.client.options.messageCacheSize) return;
    const toRemove = this.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)).firstKey(this.size - this.client.options.messageCacheSize);
    for (const id of toRemove) this.delete(id);
  }
}
