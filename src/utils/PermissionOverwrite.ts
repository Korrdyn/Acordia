import { APIOverwrite, PermissionFlagsBits } from 'discord-api-types/v10';
import { BitType } from './Bitfield';
import { PermissionBitfield } from './PermissionBitfield';

type Flags = typeof PermissionFlagsBits;

export class PermissionOverwrite {
  id: string;
  allow: PermissionBitfield;
  deny: PermissionBitfield;
  type: APIOverwrite['type'];

  constructor(data: APIOverwrite) {
    this.id = data.id;
    this.type = data.type;
    this.allow = new PermissionBitfield(data.allow);
    this.deny = new PermissionBitfield(data.deny);
  }

  has(bit: BitType<Flags>) {
    return this.allow.has(bit);
  }
}
