export class Amount {
  private constructor(private readonly value: number) {}

  static readonly MIN = 0;
  static readonly MAX = 10_000;

  static create(n: number): Amount {
    if (!Number.isFinite(n)) throw new DomainError("金額が数値ではありません");
    if (!Number.isInteger(n))
      throw new DomainError("金額は整数である必要があります");
    if (n < Amount.MIN) throw new DomainError("金額が最小値を下回っています");
    if (n > Amount.MAX) throw new DomainError("金額が上限を超えています");
    return new Amount(n);
  }

  add(other: Amount): Amount {
    return Amount.create(this.value + other.value);
  }

  toNumber(): number {
    return this.value;
  }
}

export class DomainError extends Error {}
