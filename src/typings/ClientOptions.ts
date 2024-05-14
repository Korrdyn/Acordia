import { GatewayIntentBits, GatewayPresenceUpdateData } from 'discord-api-types/v10';
import { GatewayIntentBitfield } from '@utils/GatewayIntentBitfield';
import { Interaction } from '@structures/Interaction';
import { CooldownLogic } from '@clients/CooldownHandler';

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
  messageCacheSize?: number;
}

export interface ICommandClientOptions<Context = any, MiddlewareData = any> extends IClientOptions {
  /**
   * Custom cooldown logic for use with slash commands
   *
   * @type {CooldownLogic}
   * @memberof ICommandClientOptions
   */
  cooldown?: CooldownLogic;

  /**
   * Context to be passed into the first argument of commands
   *
   * @type {Context}
   * @memberof ICommandClientOptions
   */
  context?: Context;

  /**
   * Middleware that will be ran and the result passed as last argument of commands
   *
   * @memberof ICommandClientOptions
   */
  middleware?: (interaction: Interaction) => Promise<MiddlewareData> | MiddlewareData;
}
