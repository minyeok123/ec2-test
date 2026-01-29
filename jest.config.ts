import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};

export default config;
