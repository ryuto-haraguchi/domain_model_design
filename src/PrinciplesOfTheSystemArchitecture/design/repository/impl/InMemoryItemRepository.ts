import { Item } from '../domain/entities/Item';
import { Price } from '../domain/valueObjects/Price';
import { IItemRepository } from '../IItemRepository';

/**
 * 商品リポジトリの実装（インメモリ）
 * 設計意図:
 * - 実装はリポジトリインターフェースに依存
 * - DB層との変換を行う（プリミティブ ↔ ドメインオブジェクト）
 */
export class InMemoryItemRepository implements IItemRepository {
  private items: Map<string, Item> = new Map();

  async findById(id: string): Promise<Item | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async save(item: Item): Promise<void> {
    this.items.set(item.id, item);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  /**
   * テスト用: 初期データを設定
   */
  async initializeWithDbData(dbData: any[]): Promise<void> {
    for (const data of dbData) {
      const item = new Item(
        data.id,
        data.name,
        Price.create(data.price),
        data.createdAt,
        data.updatedAt
      );
      await this.save(item);
    }
  }
}
