import { APIOverwrite, PermissionFlagsBits } from 'discord-api-types/v10';
import { BitType } from '@utils/Bitfield';
import { PermissionBitfield } from '@utils/PermissionBitfield';
import { Base } from '@structures/Base';
import { Client } from '../clients/Client';

type Flags = typeof PermissionFlagsBits;

export class PermissionOverwrite extends Base {
  allow: PermissionBitfield;
  deny: PermissionBitfield;
  type: APIOverwrite['type'];

  constructor(client: Client, data: APIOverwrite) {
    super(client, data.id);
    this.type = data.type;
    this.allow = new PermissionBitfield(data.allow);
    this.deny = new PermissionBitfield(data.deny);
  }

  has(bit: BitType<Flags>) {
    return this.allow.has(bit);
  }
}
