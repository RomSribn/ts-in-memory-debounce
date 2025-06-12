import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: { import: importPlugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'import/order': 'warn',
      'import/no-unresolved': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    files: ['*.ts', '*.js'],
    ignores: ['src/**/*'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  }
];
