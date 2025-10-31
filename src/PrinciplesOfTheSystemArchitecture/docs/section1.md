## 独自のデータ型（値オブジェクト）を設計する

問題の言い換え
- プリミティブ型（例: `number`）は表現できる範囲が広すぎるため、業務ルール（例: マイナスは不可、上限あり）を型として表現できない。
- その結果、「どの値が妥当か」を各所の条件分岐に散らばせてしまい、バグや重複が発生する。

用語定義（ユビキタス言語）
- 値オブジェクト: ドメイン上の値とその不変条件をカプセル化する型。等価性は“同じ値”で判断し、基本的に不変。
- 不変条件: 常に満たされなければならない条件（例: 0 <= 金額 <= 10,000）。
- ファクトリ: 不変条件を満たす値オブジェクトのみを生成するための生成手続き。

モデル候補
- 特化型で表す: `Amount`（0..10,000）、`Percentage`（0..100）など、文脈ごとに専用の値オブジェクトを定義する。
- 汎用の境界付き数値で表す: `BoundedNumber(min, max)` の上にエイリアスを重ねる。ただし過度な一般化は避ける。

境界/ルール（設計方針）
- 生成は必ずファクトリを通す（コンストラクタは非公開）。
- 不変条件を内部でチェックし、破れた場合はエラーを返す（例外 or 戻り値で表現）。
- 不変オブジェクトとし、演算は新しいインスタンスを返す（閉包性）。
- シリアライズ/デシリアライズの経路を用意し、UI/DB 層との境界でのみプリミティブへ変換する。

例外/不変条件
- 無効値は作れない: 生成時に `DomainError` を投げる、または `Result` で失敗を返す。
- 関連操作でも不変条件を守る（例: 加算結果が上限を超えない）。

最小実装（TypeScript 例: 金額 0..10,000）

```ts
// 設計意図:
// - 業務ルール「金額は 0..10,000」を型で表現
// - 生成をファクトリに限定し、不変条件を一箇所に集約
// - UI/DB との境界でのみ number に出入り

export class Amount {
  private constructor(private readonly value: number) {}

  static readonly MIN = 0;
  static readonly MAX = 10_000;

  static create(n: number): Amount {
    if (!Number.isFinite(n)) throw new DomainError('金額が数値ではありません');
    if (!Number.isInteger(n)) throw new DomainError('金額は整数である必要があります');
    if (n < Amount.MIN) throw new DomainError('金額が最小値を下回っています');
    if (n > Amount.MAX) throw new DomainError('金額が上限を超えています');
    return new Amount(n);
  }

  add(other: Amount): Amount {
    return Amount.create(this.value + other.value);
  }

  toNumber(): number {
    return this.value;
  }
}

export class DomainError extends Error {}
```

振る舞い駆動のシナリオ（ユースケース）
- ユーザーが UI で金額を入力 → アプリ層で `Amount.create(parseInt(input, 10))` を試みる。
- 失敗したら入力エラーを表示（例: 上限超過）。成功したらドメイン操作（合計、割引適用など）に渡す。
- リポジトリへ保存する直前に `toNumber()` でプリミティブへ変換。

トレードオフ
- メリット: 業務ルールの集約、重複/抜け漏れの削減、テスト容易性、IDE 補完の恩恵。
- コスト: 型の追加・変換のオーバーヘッド。早すぎる一般化は避け、まずは高リスク箇所のみ導入。

検討観点・次の一手
- 高リスク値を洗い出す（ID、金額、率、日付・期間、件数、数量等）。
- その中から 1〜2 個だけ値オブジェクト化して、UI/DB 境界での変換とテストを追加。
- 「生成失敗の扱い」を統一（例外運用 or `Result` 型）。
- 境界値テスト（MIN-1、MIN、MAX、MAX+1、NaN、Infinity、文字列）を用意。
