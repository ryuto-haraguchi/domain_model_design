import { Email } from '../valueObjects/Email';
import { DomainError } from '../DomainError';

/**
 * ユーザーエンティティ
 * 設計意図:
 * - ユーザーの識別子と属性を表現
 * - 同一性はidで判断（エンティティの特性）
 * - 値オブジェクト（Email）を使用して属性の不変条件を保証
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: string, // 実際の実装ではハッシュ化済みの値
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * ユーザー名を変更する
   * 設計意図: エンティティの状態変更は新しいインスタンスを返す（不変性の原則）
   */
  changeName(newName: string): User {
    if (!newName || newName.trim().length === 0) {
      throw new DomainError('ユーザー名は必須です');
    }
    return new User(
      this.id,
      newName,
      this.email,
      this.password,
      this.createdAt,
      new Date() // updatedAtを更新
    );
  }
}
