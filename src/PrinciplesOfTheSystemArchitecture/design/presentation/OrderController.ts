import { Order } from '../domain/entities/Order';
import { CreateOrderUseCase } from '../application/CreateOrderUseCase';
import { GetUserOrdersUseCase } from '../application/GetUserOrdersUseCase';

/**
 * 注文コントローラー
 * 設計意図:
 * - プレゼンテーション層の責務: HTTPリクエスト/レスポンスの変換
 * - アプリケーション層のユースケースを呼び出すだけ
 */
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase
  ) {}

  /**
   * 注文作成
   */
  async createOrder(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const order = await this.createOrderUseCase.execute(userId, itemId, quantity);
      return { success: true, data: order };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
      };
    }
  }

  /**
   * ユーザーの注文一覧取得
   */
  async getUserOrders(userId: string): Promise<{ success: boolean; data?: Order[]; error?: string }> {
    try {
      const orders = await this.getUserOrdersUseCase.execute(userId);
      return { success: true, data: orders };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
      };
    }
  }
}
