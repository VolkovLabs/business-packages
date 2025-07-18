import tsParser from '@typescript-eslint/parser';
import eslintConfig from '@volkovlabs/eslint-config';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';

export default defineConfig([
  eslintConfig,
  prettierConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]);
