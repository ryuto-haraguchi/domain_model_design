import { Order } from '../domain/entities/Order';
import { IOrderRepository } from '../repository/IOrderRepository';

/**
 * ユーザーの注文一覧取得ユースケース
 * 設計意図:
 * - 特定ユーザーの注文を取得するビジネスロジック
 */
export class GetUserOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return await this.orderRepository.findByUserId(userId);
  }
}
