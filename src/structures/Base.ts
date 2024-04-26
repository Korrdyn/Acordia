import { Client } from '@clients/Client';
import { flatten } from '@utils/Utils';
import { Snowflake } from 'discord-api-types/globals';

export class Base {
  client: Client;
  id: Snowflake;

  constructor(client: Client, id: Snowflake) {
    this.client = client;
    this.id = id;
  }

  /**
   * @param {unknown} _
   * @memberof Base
   * @internal
   */
  _patch(_: unknown) {}

  toJSON(...props: any) {
    return flatten(this, props);
  }
}
