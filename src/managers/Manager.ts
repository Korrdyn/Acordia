import { Collection } from '@discordjs/collection';
import { Client } from '@clients/Client';
import { Base } from '../structures/Base';
import { flatten } from '@utils/Utils';

export class Manager<T extends Base> extends Collection<string, T> {
  client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  override toJSON(): any {
    const objects = [];
    for (const [key, object] of this.entries()) {
      objects.push([key, flatten(object, { client: false })]);
    }
    return objects;
  }
}
