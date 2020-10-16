module.exports = {
  preset: '@testing-library/react-native',
  setupFilesAfterEnv: [
    '@testing-library/react-native/cleanup-after-each.js',
    '<rootDir>/src/shared/jest/mock-react-async-storage.js',
  ],
  setupFiles: [
    '<rootDir>/src/shared/jest/mock-react-native-localize.js',
    '<rootDir>/src/shared/jest/mock-react-native-netinfo.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.styl$': '<rootDir>/scripts/jest-css-transform.js',
  },
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'styl'],
  testEnvironment: './testEnvironmentContext',
};
