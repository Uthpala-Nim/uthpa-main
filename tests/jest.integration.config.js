module.exports = {
  preset: 'jest-preset-kubernetes',
  testMatch: ['**/integration.test.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],
  testTimeout: 30000 // 30 seconds timeout for integration tests
};
