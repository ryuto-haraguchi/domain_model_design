/**
 * 誤った設計のテスト（Jest版・アンチパターン）
 * 目的: モック過多や実装詳細への依存が生む脆さを具体例で示す。
 * 注意: ここでの「誤り」は原理的なアンチパターンであり、動作は通っても設計を固定化し保守性を損なう。
 */

import { UserFetcher, Clock, Http } from './userFetcher';

/** 一言説明: 呼び出し順や回数を検証するモック（過度な結合の例） */
class OrderSensitiveMockHttp implements Http {
  calls: string[] = [];
  async get(url: string) {
    this.calls.push(`get:${url}`);
    if (url === '/users/42') return { status: 200, body: { name: 'Taro' } };
    return { status: 404, body: {} };
  }
}

/** 一言説明: 呼び出し回数/順序を検証するClockモック（実装依存の例） */
class SpyClock implements Clock {
  calls: string[] = [];
  constructor(private readonly when: Date) {}
  now(): Date {
    this.calls.push('now');
    return this.when;
  }
}

/**
 * アンチパターン: 内部の「呼び順」や「回数」を前提に合否判定する
 * 説明: 公開契約（結果）ではなく内部実装の詳細に依存するため、リファクタに極めて脆い。
 */
describe('UserFetcher（誤った設計のテスト・アンチパターン）', () => {
  it('内部の呼び順や回数に依存して合否判定する（悪い例）', async () => {
    const http = new OrderSensitiveMockHttp();
    const clock = new SpyClock(new Date('2025-01-01T00:00:00Z'));
    const sut = new UserFetcher(http, clock);

    const result = await sut.fetchName('42');

    // 悪い例: 呼び順・回数を固定化（設計の自由度を奪う）
    const timeline = [...http.calls, ...clock.calls];
    expect(timeline[0]).toBe('get:/users/42');
    expect(timeline[1]).toBe('now');
    expect(result.name).toBe('Taro');
  });

/**
 * アンチパターン: 具体URL文字列まで固定して検証する
 * 説明: ドメインサービスの公開契約は「id→名前取得」であり、URLはアダプタ側の関心事。
 *       単体テストでURL形式に結合すると、契約をまたぐ変更に極端に弱くなる。
 */
  it('具体的なURL文字列の完全一致に依存する（悪い例）', async () => {
    const http = new OrderSensitiveMockHttp();
    const clock = new SpyClock(new Date('2025-01-01T00:00:00Z'));
    const sut = new UserFetcher(http, clock);

    await sut.fetchName('42');

    expect(http.calls).toContain('get:/users/42');
  });

/**
 * アンチパターン（参考・非推奨）: グローバルDateをモンキーパッチして制御
 * 説明: シーム注入ではなくグローバルを書き換えると、並列実行や他テストへ副作用が波及する。
 *       本リポジトリの設計ではClockポートを注入して決定性を得るため、これは不要かつ危険。
 *       実害を避けるため実際のパッチコードは記述しない（意図のみ説明）。
 */
  it('グローバルDateのモンキーパッチは副作用が強く非推奨（説明のみ）', () => {
    // 例: (非推奨) (global as any).Date = class extends Date { constructor(){ super('2025-01-01T00:00:00Z'); } } as any;
    // → グローバル副作用で他のテストが壊れる可能性。テストは独立・決定性が原則。
  });
});
