import { User } from '../domain/entities/User';
import { IUserRepository } from '../repository/IUserRepository';

/**
 * ユーザー一覧取得ユースケース
 * 設計意図:
 * - シンプルな取得処理でもユースケースとして定義
 * - 将来的に認証・認可などの横断的関心事を追加可能
 */
export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
