import { DomainError } from '../DomainError';

/**
 * 価格の値オブジェクト
 * 設計意図:
 * - 価格の不変条件（0以上）を型で表現
 * - 業務ルールを値オブジェクトに集約
 */
export class Price {
  private constructor(private readonly value: number) {}

  static readonly MIN = 0;

  static create(value: number): Price {
    if (!Number.isFinite(value)) {
      throw new DomainError('価格が数値ではありません');
    }
    if (value < Price.MIN) {
      throw new DomainError('価格は0以上である必要があります');
    }
    return new Price(value);
  }

  multiply(quantity: number): Price {
    if (quantity < 0) {
      throw new DomainError('数量は0以上である必要があります');
    }
    return Price.create(this.value * quantity);
  }

  toNumber(): number {
    return this.value;
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
