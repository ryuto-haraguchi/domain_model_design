import type { Config } from 'jest';

// ESM + TypeScript 用の ts-jest 設定
const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  // macOS環境等でwatchmanへのアクセス権がない場合の回避
  watchman: false,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { useESM: true, tsconfig: 'tsconfig.json' }
    ],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};

export default config;
