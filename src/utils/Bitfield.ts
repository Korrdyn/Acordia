export type BitType<Flags extends Record<string, number | bigint | string>> = number | bigint | Bitfield<Flags> | Array<BitType<Flags>> | keyof Flags;
export type BitfieldResolvable = number | bigint | string | Array<number | bigint | string>;

export class Bitfield<Flags extends Record<string, number | bigint | string>> {
  bits: bigint;
  flags: Flags;
  defaultBit = BigInt(0);

  constructor(bits?: BitType<Flags>, flags?: Flags) {
    this.flags = flags ?? ({} as Flags);
    this.bits = this.resolve((bits as BitfieldResolvable) ?? this.defaultBit);
  }

  has(bit: BitType<Flags>): boolean {
    const resolved = this.resolve(bit as BitfieldResolvable);
    return (this.bits & resolved) === resolved;
  }

  add(...bits: Array<BitType<Flags>>) {
    let total = this.defaultBit;
    for (const bit of bits) {
      total |= this.resolve(bit as BitfieldResolvable);
    }
    this.bits |= total;
    return this;
  }

  remove(...bits: Array<BitType<Flags>>) {
    let total = this.defaultBit;
    for (const bit of bits) {
      total |= this.resolve(bit as BitfieldResolvable);
    }
    this.bits &= ~total;
    return this;
  }

  get json() {
    const obj: Record<string, number | bigint | string> = {
      _bits: this.bits,
    };

    for (const flag in this.flags) {
      if (this.has(this.flags[flag]!)) obj[flag] = this.flags[flag]!;
    }
    return obj;
  }

  resolve(bit: BitfieldResolvable): bigint {
    const { defaultBit } = this;
    if (typeof bit === 'number' || typeof bit === 'bigint') return BigInt(bit);
    if (bit instanceof Bitfield) return bit.bits;
    if (Array.isArray(bit)) {
      return bit.map((bit_) => this.resolve(bit_)).reduce((prev, bit_) => prev | bit_, defaultBit);
    }
    if (typeof bit === 'string') {
      if (!isNaN(Number(bit))) return BigInt(bit);
      if (this.flags[bit] !== undefined) return BigInt(this.flags[bit]!);
    }
    throw new Error(`Unknown bit ${String(bit)}`);
  }
}
