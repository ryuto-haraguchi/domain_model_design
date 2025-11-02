import { DomainError } from '../DomainError';

/**
 * 数量の値オブジェクト
 * 設計意図:
 * - 数量の不変条件（1以上）を型で表現
 * - 業務ルール「数量は1以上」を保証
 */
export class Quantity {
  private constructor(private readonly value: number) {}

  static readonly MIN = 1;

  static create(value: number): Quantity {
    if (!Number.isFinite(value)) {
      throw new DomainError('数量が数値ではありません');
    }
    if (!Number.isInteger(value)) {
      throw new DomainError('数量は整数である必要があります');
    }
    if (value < Quantity.MIN) {
      throw new DomainError('数量は1以上である必要があります');
    }
    return new Quantity(value);
  }

  toNumber(): number {
    return this.value;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }
}
