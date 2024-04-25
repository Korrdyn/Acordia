import { APIUnavailableGuild } from 'discord-api-types/v10';
import { Client } from '@clients/Client';
import { Base } from '@structures/Base';

export class UnavailableGuild extends Base {
  unavailable: boolean;

  constructor(client: Client, data: APIUnavailableGuild) {
    super(client, data.id);
    this.unavailable = data.unavailable;
  }
}
