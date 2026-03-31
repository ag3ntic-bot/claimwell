module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^expo-linear-gradient$': '<rootDir>/src/testing/mocks/expo-linear-gradient.js',
    '^@expo/vector-icons$': '<rootDir>/src/testing/mocks/expo-vector-icons.js',
    '^@expo/vector-icons/(.*)$': '<rootDir>/src/testing/mocks/expo-vector-icons.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@tanstack|zustand|@react-native-async-storage/async-storage)',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/testing/**',
    '!src/theme/**',
    '!src/types/**',
    '!**/*.d.ts',
  ],
};
