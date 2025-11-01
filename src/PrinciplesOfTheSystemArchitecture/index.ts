// ESM 実行判定（Node）：直接起動時のみ main 実行
import { fileURLToPath } from 'node:url';
import { Amount } from './section1/Amount.ts';

function main(): void {
  const amount1 = Amount.create(100);
  const amount2 = Amount.create(200);
  const total = amount1.add(amount2);
  console.log(total.toNumber());
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) main();
