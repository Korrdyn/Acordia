import { MessageFlags } from 'discord-api-types/v10';
import { BitType, Bitfield } from './Bitfield';

type Flags = typeof MessageFlags;

export class MessageFlagBitfield extends Bitfield<Flags> {
  constructor(bits?: BitType<Flags>) {
    super(bits, MessageFlags);
  }
}
