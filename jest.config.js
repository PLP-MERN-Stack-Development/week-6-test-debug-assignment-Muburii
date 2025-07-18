export default {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/tests/**/*.test.{js,jsx}'],
      setupFilesAfterEnv: ['<rootDir>/client/src/tests/utils/test-utils.jsx'],
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/tests/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/server/setup.js'],
      globalSetup: '<rootDir>/server/globalSetup.js',
      globalTeardown: '<rootDir>/server/globalTeardown.js',
    },
  ],
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    'server/**/*.js',
    '!client/src/main.jsx',
    '!**/node_modules/**',
    '!**/tests/**',
  ],
};