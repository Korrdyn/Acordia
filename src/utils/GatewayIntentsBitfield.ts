import { GatewayIntentBits } from 'discord-api-types/v10';
import Bitfield from './Bitfield';

export default class GatewayIntentBitfield extends Bitfield<typeof GatewayIntentBits> {
  override flags = GatewayIntentBits;
}