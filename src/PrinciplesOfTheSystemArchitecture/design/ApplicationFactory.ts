/**
 * 依存関係の注入と初期化を行うファクトリ
 * 設計意図:
 * - 各層の依存関係を一箇所で管理
 * - 実際のプロダクションではDIコンテナを使用することを推奨
 */
import { IUserRepository } from './repository/IUserRepository';
import { IItemRepository } from './repository/IItemRepository';
import { IOrderRepository } from './repository/IOrderRepository';
import { InMemoryUserRepository } from './repository/impl/InMemoryUserRepository';
import { InMemoryItemRepository } from './repository/impl/InMemoryItemRepository';
import { InMemoryOrderRepository } from './repository/impl/InMemoryOrderRepository';
import { RegisterUserUseCase } from './application/RegisterUserUseCase';
import { GetUsersUseCase } from './application/GetUsersUseCase';
import { CreateOrderUseCase } from './application/CreateOrderUseCase';
import { GetUserOrdersUseCase } from './application/GetUserOrdersUseCase';
import { UserController } from './presentation/UserController';
import { OrderController } from './presentation/OrderController';

/**
 * アプリケーションの初期化と依存関係の解決
 * 設計意図:
 * - 各層のオブジェクトを生成し、依存関係を注入
 * - DBの初期データをリポジトリに設定
 */
export class ApplicationFactory {
  private userRepository: IUserRepository;
  private itemRepository: IItemRepository;
  private orderRepository: IOrderRepository;

  constructor(dbData: any) {
    // リポジトリ層の初期化
    this.userRepository = new InMemoryUserRepository();
    this.itemRepository = new InMemoryItemRepository();
    this.orderRepository = new InMemoryOrderRepository();

    // 初期データの設定（同期的に実行）
    this.initializeRepositoriesSync(dbData);
  }

  private initializeRepositoriesSync(dbData: any): void {
    // 非同期処理を同期的に実行するため、Promiseを待機しない
    // 実際の使用時は initializeAsync を呼び出すことを推奨
    this.userRepository.initializeWithDbData(dbData.users).catch(console.error);
    this.itemRepository.initializeWithDbData(dbData.items).catch(console.error);
    this.orderRepository.initializeWithDbData(dbData.orders).catch(console.error);
  }

  /**
   * 非同期で初期化する場合のメソッド
   * 設計意図: コンストラクタでは非同期処理ができないため、別メソッドを提供
   */
  async initializeAsync(dbData: any): Promise<void> {
    await this.userRepository.initializeWithDbData(dbData.users);
    await this.itemRepository.initializeWithDbData(dbData.items);
    await this.orderRepository.initializeWithDbData(dbData.orders);
  }

  /**
   * ユーザーコントローラーを作成
   */
  createUserController(): UserController {
    const registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    const getUsersUseCase = new GetUsersUseCase(this.userRepository);

    return new UserController(registerUserUseCase, getUsersUseCase);
  }

  /**
   * 注文コントローラーを作成
   */
  createOrderController(): OrderController {
    const createOrderUseCase = new CreateOrderUseCase(
      this.orderRepository,
      this.itemRepository,
      this.userRepository
    );
    const getUserOrdersUseCase = new GetUserOrdersUseCase(this.orderRepository);

    return new OrderController(createOrderUseCase, getUserOrdersUseCase);
  }

  /**
   * リポジトリへの直接アクセス（テスト用）
   */
  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  getItemRepository(): IItemRepository {
    return this.itemRepository;
  }

  getOrderRepository(): IOrderRepository {
    return this.orderRepository;
  }
}
