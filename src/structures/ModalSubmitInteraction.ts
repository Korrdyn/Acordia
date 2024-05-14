import { Client } from '@clients/Client';
import { Interaction } from '@structures/Interaction';
import { Message } from '@structures/Message';
import { APIModalSubmitInteraction } from 'discord-api-types/v10';

export class ModalSubmitInteraction extends Interaction {
  message: Message | null = null;
  data: APIModalSubmitInteraction['data'];
  constructor(client: Client, data: APIModalSubmitInteraction) {
    super(client, data);
    this.data = data.data;
    if (data.message !== undefined && this.channel) {
      this.message = this.channel.messages._add(data.message);
    }
  }

  get fields() {
    return this.data.components.flatMap((row) => row.components);
  }
}
