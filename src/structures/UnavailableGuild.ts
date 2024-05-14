import { APIUnavailableGuild } from 'discord-api-types/v10';
import { Base } from '@structures/Base';
import { Shard } from '@clients/Shard';

export class UnavailableGuild extends Base {
  unavailable: boolean;
  shard: Shard;

  constructor(shard: Shard, data: APIUnavailableGuild) {
    super(shard.client, data.id);
    this.unavailable = data.unavailable;
    this.shard = shard;
  }
}
