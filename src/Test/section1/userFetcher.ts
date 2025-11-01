/**
 * ユースケース: ユーザー名を取得するドメインサービス
 * ねらい: 非決定性（時間）と外部I/O（HTTP）をシーム（ポート）として注入し、
 *        テストで置換できる設計を最小構成で示す。
 */

/** HTTP応答の最小型 */
export type HttpResponse = { status: number; body: unknown };

/** 外部I/O（HTTP）ポートの抽象 */
export interface Http {
  /** 抽象化されたHTTP GET */
  get(url: string): Promise<HttpResponse>;
}

/** 非決定性（現在時刻）のシーム */
export interface Clock {
  /** 現在時刻を返す（テストで固定可能） */
  now(): Date;
}

/**
 * 実運用向けのシステム時刻実装
 */
export class SystemClock implements Clock {
  now(): Date { return new Date(); }
}

/**
 * ユーザー名を取得するサービス（公開契約は入力→結果オブジェクト）
 */
export class UserFetcher {
  constructor(private readonly http: Http, private readonly clock: Clock) {}

  /**
   * 指定IDのユーザー名を取得し、取得時刻を付与して返す
   * @param id ユーザーID
   * @returns ユーザー名と取得時刻
   * @throws not found: HTTPステータスが200以外のとき
   */
  async fetchName(id: string): Promise<{ name: string; at: Date }> {
    const res = await this.http.get(`/users/${id}`);
    if (res.status !== 200) throw new Error("not found");
    const name = (res.body as { name: string }).name;
    return { name, at: this.clock.now() };
  }
}

