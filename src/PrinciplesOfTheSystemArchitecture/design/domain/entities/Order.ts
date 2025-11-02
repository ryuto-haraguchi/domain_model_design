import { Quantity } from '../valueObjects/Quantity';

/**
 * 注文エンティティ
 * 設計意図:
 * - 注文の識別子と属性を表現
 * - 数量は値オブジェクト（Quantity）で表現し、不変条件を保証
 * - ユーザーIDと商品IDの参照を保持
 */
export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly itemId: string,
    public readonly quantity: Quantity,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * 数量を変更する
   * 設計意図: 不変条件を満たすQuantityオブジェクトのみを受け入れる
   */
  changeQuantity(newQuantity: Quantity): Order {
    return new Order(
      this.id,
      this.userId,
      this.itemId,
      newQuantity,
      this.createdAt,
      new Date() // updatedAtを更新
    );
  }
}
