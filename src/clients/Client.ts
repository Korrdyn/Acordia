import EventEmitter from 'eventemitter3';
import { Events, IEvents } from '@typings/events/ClientEvents';
import { IClientOptions } from '@typings/ClientOptions';
import { REST } from '@discordjs/rest';
import pkg from '../../package.json';
import { AcordiaError } from '@utils/AcordiaError';
import { ShardManager } from '@clients/ShardManager';
import { GuildManager } from '@managers/GuildManager';
import { UserManager } from '@managers/UserManager';
import { PartialApplication } from '@structures/PartialApplication';
import { IClientOptionDefaults, Options } from '@utils/Options';
import { flatten } from '@utils/Utils';
import { DMChannelManager } from '@managers/DMChannelManager';

export class Client extends EventEmitter<IEvents> {
  readonly options: IClientOptionDefaults;
  readonly rest: REST;
  readonly shards: ShardManager;
  readyTimestamp?: number;
  readonly guilds: GuildManager;
  readonly users: UserManager;
  application!: PartialApplication;
  readonly dmChannels: DMChannelManager;

  constructor(options: IClientOptions) {
    super();

    if (options.shardCount === 'auto' && options.shards !== undefined)
      throw new AcordiaError('shardCount cannot be auto while also providing an array of shards to run');
    if (options.shards && !options.shardCount) throw new AcordiaError('shardCount cannot be undefined while providing an array of shards');
    if (!options.shardCount) options.shardCount = 'auto';

    this.options = Options.client(options);
    this.rest = new REST({ userAgentAppendix: `Acordia/${pkg.version}` }).setToken(options.token);

    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);
    this.dmChannels = new DMChannelManager(this);

    this.shards = new ShardManager(this);
  }

  /**
   * Get the currently logged in user
   *
   * @readonly
   * @memberof Client
   */
  get user() {
    return this.users.get(this.application.id)!;
  }

  async connect() {
    await this.shards.connect();
  }

  async disconnect() {
    await this.shards.destroy();
  }

  override emit<T extends keyof IEvents>(event: T, ...args: EventEmitter.ArgumentMap<IEvents>[Extract<T, keyof IEvents>]): boolean {
    const result = super.emit(event, ...args);
    super.emit(Events.Event, event, ...args);
    return result;
  }

  toJSON(props?: Record<string, string | boolean>) {
    return flatten(this, { guilds: false, ...props });
  }
}
