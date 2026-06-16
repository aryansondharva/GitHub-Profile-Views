const MAX_COUNT = 9223372036854775807n;

export class Count {
  constructor(value) {
    const count = normalizeCount(value);

    if (count > MAX_COUNT) {
      throw new RangeError('The maximum number of views has been reached');
    }

    if (count < 0n) {
      throw new RangeError('Number of views cannot be negative');
    }

    this.count = count;
  }

  static ofString(value) {
    if (!/^\d+$/.test(value)) {
      throw new TypeError('The base count must only contain digits');
    }

    return new Count(BigInt(value));
  }

  plus(that) {
    return new Count(this.count + that.toBigInt());
  }

  toBigInt() {
    return this.count;
  }

  toString() {
    return this.count.toString();
  }
}

function normalizeCount(value) {
  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      throw new TypeError('Count must be an integer');
    }

    return BigInt(value);
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return BigInt(value);
  }

  throw new TypeError('Count must be a non-negative integer');
}
