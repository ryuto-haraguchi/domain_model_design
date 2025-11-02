/**
 * ドメイン層のエラー
 * 設計意図: ドメインロジックの不変条件違反を表現する
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
