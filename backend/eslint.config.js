import tseslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**', '../backend/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/explicit-member-accessibility': ['warn', {
        accessibility: 'no-public'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      // Code readability and formatting
      'arrow-parens': ['warn', 'always'],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['warn', 'always'],
    }
  }
];