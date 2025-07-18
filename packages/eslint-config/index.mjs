'use strict';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

/**
 * Get Naming Convention Rule
 */
const getNamingConventionRule = ({ target = 'default' }) => ({
  '@typescript-eslint/naming-convention': [
    'error',
    target === 'component' && {
      selector: ['default'],
      format: ['strictCamelCase', 'StrictPascalCase'],
      filter: {
        regex: '^__html$',
        match: false,
      },
    },
    target === 'default' && {
      selector: ['default'],
      format: ['strictCamelCase'],
    },
    target === 'decorator' && {
      selector: ['default'],
      format: ['strictCamelCase', 'StrictPascalCase'],
    },
    target === 'constant' && {
      selector: 'variable',
      modifiers: ['global'],
      format: ['UPPER_CASE'],
    },
    {
      selector: 'typeLike',
      format: ['StrictPascalCase'],
    },
    {
      selector: 'typeParameter',
      format: ['StrictPascalCase'],
      prefix: ['T', 'K'],
    },
    {
      selector: 'enumMember',
      format: ['UPPER_CASE'],
    },
    {
      selector: ['classProperty', 'objectLiteralProperty'],
      format: null,
      modifiers: ['requiresQuotes'],
    },
  ].filter(Boolean),
});

/**
 * Documentation - https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
 */
export default defineConfig(
  tsEslint.config(
    tsEslint.configs.recommended,
    {
      plugins: { '@typescript-eslint/eslint-plugin': tsPlugin, 'simple-import-sort': eslintPluginSimpleImportSort },
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            ignoreRestSiblings: true,
            vars: 'all',
          },
        ],
        '@typescript-eslint/no-deprecated': 'warn',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
        'sort-imports': [
          'error',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
        'no-console': ['error', {}],
        'no-debugger': 'error',
        ...getNamingConventionRule({ target: 'default' }),
      },
    },
    {
      files: ['**/*.tsx'],
      rules: {
        ...getNamingConventionRule({ target: 'component' }),
      },
    },
    {
      files: ['**/constants/*.ts', '**/constants.ts'],
      rules: {
        ...getNamingConventionRule({ target: 'constant' }),
      },
    },
    {
      files: ['**/*.decorator.ts', '**/*.rule.ts'],
      rules: {
        ...getNamingConventionRule({ target: 'decorator' }),
      },
    }
  )
);
