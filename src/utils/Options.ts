import { GatewayPresenceUpdateData } from 'discord-api-types/v10';
import { IClientOptions } from '@typings/ClientOptions';
import { GatewayIntentBitfield } from './GatewayIntentBitfield';

export interface IClientOptionDefaults {
  token: string;
  intents: GatewayIntentBitfield;
  shards: number[] | undefined;
  shardCount: 'auto' | number | undefined;
  largeThreshold: number;
  guildTimeout: number;
  presence: GatewayPresenceUpdateData | undefined;
  messageCacheSize: number;
}

export class Options {
  static client(options: IClientOptions): IClientOptionDefaults {
    return {
      token: options.token,
      intents: new GatewayIntentBitfield(options.intents),
      shards: options.shards,
      shardCount: options.shardCount,
      largeThreshold: options.largeThreshold ?? 250,
      guildTimeout: options.guildTimeout ?? 15000,
      presence: options.presence,
      messageCacheSize: options.messageCacheSize ?? 50,
    };
  }
}
