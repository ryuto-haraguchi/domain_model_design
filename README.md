# TypeScript ローカル実行セットアップ（docker-mcp なし）

このリポジトリは、ローカルで TypeScript を実行確認する最小構成です。
Dockerfile や docker-compose は含めていません（ローカル確認のみ想定）。

## 必要要件
- Node.js 20 以上
- npm

## セットアップ
```bash
npm install
```

## 開発（ウォッチ）
```bash
npm run dev
```

## ビルド & 実行
```bash
npm run build
npm start
```

## 補足（docker-mcp を使う場合）
- 今回はローカル確認のみのため docker-mcp は未使用です。
- 将来的に docker-mcp（MCP サーバで Docker 操作）を使う場合は、
  MCP クライアント側に docker サーバの設定を追加し、`docker build/run`
  を MCP 経由でトリガーする形に置き換え可能です。

