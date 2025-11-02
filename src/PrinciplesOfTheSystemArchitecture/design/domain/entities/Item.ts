import { Price } from '../valueObjects/Price';

/**
 * 商品エンティティ
 * 設計意図:
 * - 商品の識別子と属性を表現
 * - 価格は値オブジェクト（Price）で表現し、不変条件を保証
 */
export class Item {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: Price,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * 価格を変更する
   * 設計意図: 不変条件を満たすPriceオブジェクトのみを受け入れる
   */
  changePrice(newPrice: Price): Item {
    return new Item(
      this.id,
      this.name,
      newPrice,
      this.createdAt,
      new Date() // updatedAtを更新
    );
  }
}
