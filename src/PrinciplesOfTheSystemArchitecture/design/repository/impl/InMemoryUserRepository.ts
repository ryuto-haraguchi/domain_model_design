import { User } from '../domain/entities/User';
import { Email } from '../domain/valueObjects/Email';
import { IUserRepository } from './IUserRepository';

/**
 * ユーザーリポジトリの実装（インメモリ）
 * 設計意図:
 * - 実装はリポジトリインターフェースに依存
 * - DB層との変換を行う（プリミティブ ↔ ドメインオブジェクト）
 * - 実際のプロダクションでは別の実装（DB接続）に置き換え可能
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const emailObj = Email.create(email);
    for (const user of this.users.values()) {
      if (user.email.equals(emailObj)) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  /**
   * テスト用: 初期データを設定
   */
  async initializeWithDbData(dbData: any[]): Promise<void> {
    for (const data of dbData) {
      const user = new User(
        data.id,
        data.name,
        Email.create(data.email),
        data.password,
        data.createdAt,
        data.updatedAt
      );
      await this.save(user);
    }
  }
}
