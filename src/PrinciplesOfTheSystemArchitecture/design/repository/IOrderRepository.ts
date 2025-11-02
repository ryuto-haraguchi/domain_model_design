import { Order } from '../domain/entities/Order';

/**
 * 注文リポジトリのインターフェース
 * 設計意図:
 * - ドメインモデル層に依存
 * - データアクセスの抽象化
 */
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  save(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
}
