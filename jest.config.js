module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Ensures that Babel transforms the JSX
  },
  testEnvironment: 'jsdom',  // Use jsdom for testing React components
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',  // Mocking stylesheets in tests
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // for extended matchers in tests
};
