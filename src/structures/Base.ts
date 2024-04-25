import { Client } from '@clients/Client';
import { flatten } from '@utils/Utils';

export class Base {
  client: Client;
  id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  patch(_: unknown) {}

  toJSON(...props: any) {
    console.log(Object.keys(this));
    return flatten(this, props);
  }
}
