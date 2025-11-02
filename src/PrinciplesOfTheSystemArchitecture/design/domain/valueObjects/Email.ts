import { DomainError } from '../DomainError';

/**
 * メールアドレスの値オブジェクト
 * 設計意図:
 * - メールアドレスの形式を型で保証
 * - 不変条件（形式チェック）を一箇所に集約
 */
export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new DomainError('メールアドレスは必須です');
    }

    // 簡易的なメールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new DomainError('メールアドレスの形式が不正です');
    }

    return new Email(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
