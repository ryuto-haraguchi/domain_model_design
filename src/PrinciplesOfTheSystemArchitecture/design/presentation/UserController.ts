import { User } from '../domain/entities/User';
import { RegisterUserUseCase } from '../application/RegisterUserUseCase';
import { GetUsersUseCase } from '../application/GetUsersUseCase';

/**
 * ユーザーコントローラー
 * 設計意図:
 * - プレゼンテーション層の責務: HTTPリクエスト/レスポンスの変換
 * - アプリケーション層のユースケースを呼び出すだけ（薄い層）
 * - エラーハンドリングとレスポンス形式の統一
 */
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  /**
   * ユーザー登録
   * 設計意図: リクエストをドメインオブジェクトに変換し、ユースケースに委譲
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const user = await this.registerUserUseCase.execute(name, email, password);
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
      };
    }
  }

  /**
   * ユーザー一覧取得
   * 設計意図: シンプルな取得処理をユースケースに委譲
   */
  async getUsers(): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const users = await this.getUsersUseCase.execute();
      return { success: true, data: users };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
      };
    }
  }
}
