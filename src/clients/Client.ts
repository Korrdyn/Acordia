import EventEmitter from 'eventemitter3';
import { ClientEvents } from '../types/events/ClientEvents';
import { ClientOptions } from '../types/ClientOptions';
import GatewayIntentBitfield from '../utils/GatewayIntentsBitfield';
import { REST } from '@discordjs/rest';
import pkg from '../../package.json';

export class Client extends EventEmitter<ClientEvents> {
  readonly options: ClientOptions;
  readonly rest: REST;

  constructor(options: ClientOptions) {
    super();

    if (options.intents) options.intents = new GatewayIntentBitfield(options.intents);

    this.options = options;
    this.rest = new REST({ userAgentAppendix: `Acordia/${pkg.version}` }).setToken(options.token);
  }
}
