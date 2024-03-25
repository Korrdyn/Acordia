import { Collection } from '@discordjs/collection';
import { Client } from '../clients/Client';
import { Base } from '../structures/Base';

export class Manager<T extends Base> extends Collection<string, T> {
  client: Client;
  
  constructor(client: Client) {
    super();
    this.client = client;
  }
}
