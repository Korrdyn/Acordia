import { GatewayIntentBits } from 'discord-api-types/v10';
import GatewayIntentBitfield from '../utils/GatewayIntentsBitfield';

export interface ClientOptions {
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
   * @type {(number | bigint | Array<number | bigint | keyof typeof GatewayIntentBits> | GatewayIntentBitfield)}
   * @memberof ClientOptions
   */
  intents?: number | bigint | Array<number | bigint | keyof typeof GatewayIntentBits> | GatewayIntentBitfield;
}
