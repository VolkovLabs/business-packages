import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

import config from './index.mjs';

export default defineConfig(
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
      },
    },
  },
  ...config
);
