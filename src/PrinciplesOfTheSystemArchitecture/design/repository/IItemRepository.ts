import { Item } from '../domain/entities/Item';

/**
 * 商品リポジトリのインターフェース
 * 設計意図:
 * - ドメインモデル層に依存
 * - データアクセスの抽象化
 */
export interface IItemRepository {
  findById(id: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  save(item: Item): Promise<void>;
  delete(id: string): Promise<void>;
}
