/**
 * エントリーポイント: アプリケーションの実行例
 * 設計意図:
 * - プレゼンテーション層の入口
 * - 実際のHTTPサーバーでは、この部分がルーティングハンドラーになる
 */
import { ApplicationFactory } from './ApplicationFactory';
import db from '../DB/db';

// エントリーポイント
async function main() {
  // アプリケーションの初期化
  const factory = new ApplicationFactory();

  // 非同期初期化を待機
  await factory.initializeAsync(db);

  // コントローラーの取得
  const userController = factory.createUserController();
  const orderController = factory.createOrderController();

  console.log('=== ユーザー一覧取得 ===');
  const usersResult = await userController.getUsers();
  if (usersResult.success && usersResult.data) {
    console.log(`ユーザー数: ${usersResult.data.length}`);
    usersResult.data.forEach((user) => {
      console.log(`- ${user.name} (${user.email.toString()})`);
    });
  }

  console.log('\n=== 新しいユーザー登録 ===');
  const registerResult = await userController.register(
    'Bob Smith',
    'bob.smith@example.com',
    'password123'
  );
  if (registerResult.success) {
    console.log(`ユーザー登録成功: ${registerResult.data?.name}`);
  } else {
    console.log(`エラー: ${registerResult.error}`);
  }

  console.log('\n=== 注文作成 ===');
  const orderResult = await orderController.createOrder('1', '1', 3);
  if (orderResult.success) {
    console.log(`注文作成成功: ID=${orderResult.data?.id}, 数量=${orderResult.data?.quantity.toNumber()}`);
  } else {
    console.log(`エラー: ${orderResult.error}`);
  }

  console.log('\n=== ユーザーの注文一覧取得 ===');
  const userOrdersResult = await orderController.getUserOrders('1');
  if (userOrdersResult.success && userOrdersResult.data) {
    console.log(`ユーザー1の注文数: ${userOrdersResult.data.length}`);
    userOrdersResult.data.forEach((order) => {
      console.log(`- 注文ID: ${order.id}, 商品ID: ${order.itemId}, 数量: ${order.quantity.toNumber()}`);
    });
  }
}

// 実行
main().catch(console.error);
