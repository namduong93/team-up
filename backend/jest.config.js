/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    // Map to allow imports without .js in TypeScript
    '^(.*)\\.js$': '$1',
  },
};
