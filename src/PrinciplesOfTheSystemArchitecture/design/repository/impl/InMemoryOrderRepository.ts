import { Order } from '../../domain/entities/Order';
import { Quantity } from '../../domain/valueObjects/Quantity';
import { IOrderRepository } from '../IOrderRepository';

/**
 * 注文リポジトリの実装（インメモリ）
 * 設計意図:
 * - 実装はリポジトリインターフェースに依存
 * - DB層との変換を行う（プリミティブ ↔ ドメインオブジェクト）
 */
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async delete(id: string): Promise<void> {
    this.orders.delete(id);
  }

  /**
   * テスト用: 初期データを設定
   */
  async initializeWithDbData(dbData: any[]): Promise<void> {
    for (const data of dbData) {
      const order = new Order(
        data.id,
        data.userId,
        data.itemId,
        Quantity.create(data.quantity),
        data.createdAt,
        data.updatedAt
      );
      await this.save(order);
    }
  }
}
