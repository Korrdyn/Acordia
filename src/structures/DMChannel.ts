import { Client } from '@clients/Client';
import { MessageManager } from '@managers/MessageManager';
import { BaseChannel } from '@structures/BaseChannel';
import { User } from '@structures/User';
import { APIDMChannel } from 'discord-api-types/v10';

export class DMChannel extends BaseChannel {
  messages: MessageManager;
  user: User | null = null;

  constructor(client: Client, data: APIDMChannel) {
    super(client, data);
    this.messages = new MessageManager(this);
    this.messages.lastId = data.last_message_id ?? null;
    if (data.recipients?.length) this.user = client.users._add(data.recipients[0]!);
  }
}
