import { GatewayIntentBits, GatewayPresenceUpdateData } from 'discord-api-types/v10';
import { GatewayIntentBitfield } from '../utils/GatewayIntentsBitfield';

export interface IClientOptions {
  /**
   * Token for authenticating with Discord
   *
   * @type {string}
   * @memberof ClientOptions
   */
  token: string;

  /**
   * A list of intents to subscribe to
   *
   * @type {(number | Array<number | keyof typeof GatewayIntentBits> | GatewayIntentBitfield)}
   * @memberof ClientOptions
   */
  intents?: number | Array<number | keyof typeof GatewayIntentBits> | GatewayIntentBitfield;

  /**
   * Array of shards this client will run
   *
   * @type {number[]}
   * @memberof ClientOptions
   */
  shards?: number[];

  /**
   * Total amount of shards or 'auto' to use recommended shards from gateway
   *
   * @type {('auto' | number)}
   * @memberof ClientOptions
   */
  shardCount?: 'auto' | number;
  largeThreshold?: number;
  guildTimeout?: number;
  presence?: GatewayPresenceUpdateData;
}
