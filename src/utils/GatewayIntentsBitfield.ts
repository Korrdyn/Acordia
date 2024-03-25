import { GatewayIntentBits } from 'discord-api-types/v10';
import { BitType, Bitfield } from './Bitfield';

type Flags = typeof GatewayIntentBits;

export class GatewayIntentBitfield extends Bitfield<Flags> {
  constructor(bits?: BitType<Flags>) {
    super(bits, GatewayIntentBits);
  }
}
