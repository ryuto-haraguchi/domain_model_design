import { User } from '../domain/entities/User';

/**
 * ユーザーリポジトリのインターフェース
 * 設計意図:
 * - ドメインモデル層に依存（依存方向の逆転）
 * - 実装はインフラ層で行う（インターフェース分離の原則）
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
