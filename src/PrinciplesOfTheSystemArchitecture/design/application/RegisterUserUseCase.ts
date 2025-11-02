import { User } from '../domain/entities/User';
import { Email } from '../domain/valueObjects/Email';
import { IUserRepository } from '../repository/IUserRepository';
import { DomainError } from '../domain/DomainError';

/**
 * ユーザー登録ユースケース
 * 設計意図:
 * - アプリケーション層の責務: ユースケースの実行順序とトランザクション境界を管理
 * - ドメインロジックは呼び出すだけで、実装は持たない（責務分離）
 */
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    // 既存ユーザーのチェック（ビジネスルール）
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DomainError('このメールアドレスは既に登録されています');
    }

    // ドメインオブジェクトの生成
    const emailObj = Email.create(email);
    const userId = this.generateId();
    const now = new Date();

    const user = new User(
      userId,
      name,
      emailObj,
      password, // 実際の実装ではハッシュ化が必要
      now,
      now
    );

    // 永続化
    await this.userRepository.save(user);

    return user;
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
