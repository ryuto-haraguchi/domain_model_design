import { Order } from '../domain/entities/Order';
import { Quantity } from '../domain/valueObjects/Quantity';
import { IOrderRepository } from '../repository/IOrderRepository';
import { IItemRepository } from '../repository/IItemRepository';
import { IUserRepository } from '../repository/IUserRepository';
import { DomainError } from '../domain/DomainError';

/**
 * 注文作成ユースケース
 * 設計意図:
 * - 複数のリポジトリを協調させてユースケースを実現
 * - ドメインロジック（存在チェック）はドメイン層に委譲
 */
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly itemRepository: IItemRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<Order> {
    // ユーザーの存在確認
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError('ユーザーが見つかりません');
    }

    // 商品の存在確認
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new DomainError('商品が見つかりません');
    }

    // ドメインオブジェクトの生成
    const quantityObj = Quantity.create(quantity);
    const orderId = this.generateId();
    const now = new Date();

    const order = new Order(
      orderId,
      userId,
      itemId,
      quantityObj,
      now,
      now
    );

    // 永続化
    await this.orderRepository.save(order);

    return order;
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
