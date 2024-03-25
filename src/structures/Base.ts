import { Client } from '../clients/Client';

export class Base {
  client: Client;
  id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  patch(_: unknown) {}
}
