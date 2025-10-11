/* eslint-env node */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/testing/config/jest.setup.js'],
  testMatch: [
    '<rootDir>/testing/unit/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/testing/integration/**/*.test.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/',
    '<rootDir>/web-build/',
    '<rootDir>/web-build-temp/',
    '<rootDir>/testing/e2e/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-native-async-storage/async-storage|react-native-web|react-native-webview)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    'store/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.expo/**',
    '!**/web-build/**',
    '!**/web-build-temp/**',
    '!**/coverage/**',
    '!**/testing/**',
  ],
  coverageDirectory: '<rootDir>/testing/coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@testing/(.*)$': '<rootDir>/testing/$1',
  },
  rootDir: '../..',
  testEnvironment: 'jsdom',
  verbose: true,
};
