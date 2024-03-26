import { PermissionFlagsBits } from 'discord-api-types/v10';
import { Bitfield, BitType } from './Bitfield';

type Flags = typeof PermissionFlagsBits;

export class PermissionBitfield extends Bitfield<Flags> {
  static all: bigint = Object.values(PermissionFlagsBits).reduce((all, p) => all | p, BigInt(0));

  constructor(bits?: BitType<Flags>) {
    super(bits, PermissionFlagsBits);
  }

  isAdmin() {
    return this.has(PermissionFlagsBits.Administrator);
  }

  missing(...bits: Array<BitType<Flags>>) {
    const missing = [];
    for (const bit of bits) {
      if (!this.has(bit)) missing.push(bit);
    }

    return missing;
  }
}
