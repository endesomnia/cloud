import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  roots: ['<rootDir>/src/'],

  setupFilesAfterEnv: ['./src/__test__/setupTests.ts'],
}

export default config
