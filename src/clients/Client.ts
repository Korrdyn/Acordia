import EventEmitter from 'eventemitter3';
import { IEvents } from '../types/events/ClientEvents';
import { IClientOptions } from '../types/ClientOptions';
import { GatewayIntentBitfield } from '../utils/GatewayIntentsBitfield';
import { REST } from '@discordjs/rest';
import pkg from '../../package.json';
import { AcordiaError } from '../utils/AcordiaError';
import { ShardManager } from './ShardManager';
import { GuildManager } from '../managers/GuildManager';
import { UserManager } from '../managers/UserManager';

export class Client extends EventEmitter<IEvents> {
  readonly options: IClientOptions;
  readonly rest: REST;
  readonly shards: ShardManager;
  readyTimestamp?: number;
  guilds: GuildManager;
  users: UserManager;

  constructor(options: IClientOptions) {
    super();

    options.intents = new GatewayIntentBitfield(options.intents);
    if (options.shardCount === 'auto' && options.shards !== undefined)
      throw new AcordiaError('shardCount cannot be auto while also providing an array of shards to run');
    if (options.shards && !options.shardCount) throw new AcordiaError('shardCount cannot be undefined while providing an array of shards');
    if (!options.shardCount) options.shardCount = 'auto';

    this.options = options;
    this.rest = new REST({ userAgentAppendix: `Acordia/${pkg.version}` }).setToken(options.token);

    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);

    this.shards = new ShardManager(this);
  }

  async connect() {
    await this.shards.connect();
  }

  async disconnect() {
    await this.shards.destroy();
  }
}
