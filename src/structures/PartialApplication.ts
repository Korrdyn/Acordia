import { APIApplication, ApplicationFlags } from 'discord-api-types/v10';
import { Client } from '../clients/Client';
import { Base } from './Base';

export class PartialApplication extends Base {
  flags: ApplicationFlags;

  constructor(client: Client, data: Pick<APIApplication, 'id' | 'flags'>) {
    super(client, data.id);
    this.flags = data.flags;
  }
}
