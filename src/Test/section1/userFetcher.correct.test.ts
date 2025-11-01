/**
 * 正しい設計のテスト（Jest版）
 * 目的: 公開契約（入力→出力）を検証し、非決定性と外部I/Oはフェイクで制御する。
 */

import { UserFetcher, Clock, Http } from './userFetcher';

/** 一言説明: 固定時刻を返すClockフェイク */
class FixedClock implements Clock {
  constructor(private readonly fixed: Date) {}
  now(): Date { return this.fixed; }
}

/** 一言説明: URL→固定レスポンスを返すHTTPフェイク */
class FakeHttp implements Http {
  constructor(private readonly table: Record<string, unknown>, private readonly ok: boolean = true) {}
  async get(url: string) {
    const body = this.table[url];
    if (!this.ok || body === undefined) return { status: 404, body: {} };
    return { status: 200, body };
  }
}

/**
 * テスト: 正常にユーザー名を取得できる
 * 説明: 公開結果（name, at）のみを検証し、呼び順や内部実装には依存しない。
 */
describe('UserFetcher（正しい設計のテスト）', () => {
  it('正常: ユーザー名と取得時刻を返す', async () => {
    const when = new Date('2025-01-01T00:00:00Z');
    const http = new FakeHttp({ '/users/42': { name: 'Taro' } });
    const clock = new FixedClock(when);
    const sut = new UserFetcher(http, clock);

    const result = await sut.fetchName('42');

    expect(result.name).toBe('Taro');
    expect(result.at.toISOString()).toBe(when.toISOString());
  });

/**
 * テスト: 見つからない場合にエラーを投げる
 * 説明: 404を返すフェイクで、例外（not found）を検証。公開契約に基づく挙動を確認。
 */
  it('異常: 見つからない場合は例外', async () => {
    const http = new FakeHttp({}, false); // 常に404相当
    const clock = new FixedClock(new Date('2025-01-01T00:00:00Z'));
    const sut = new UserFetcher(http, clock);

    await expect(sut.fetchName('999')).rejects.toThrow('not found');
  });
});
