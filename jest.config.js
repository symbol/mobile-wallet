module.exports = {
    preset: '@testing-library/react-native',
    setupFilesAfterEnv: ['./setupTests.js'],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [],
    transform: {
        '^.+\\.styl$': '<rootDir>/scripts/jest-css-transform.js',
    },
    modulePaths: ['<rootDir>'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'json', 'styl'],
    testEnvironment: './testEnvironmentContext',
    testMatch: ['<rootDir>/__tests__/**/*.spec.js'],
};
