'use strict';

/**
 * Get Naming Convention Rule
 */
const getNamingConventionRule = ({ target = 'default' }) => ({
  '@typescript-eslint/naming-convention': [
    'error',
    target === 'component'
      ? {
          selector: ['default'],
          format: ['strictCamelCase', 'StrictPascalCase'],
        }
      : {
          selector: ['default'],
          format: ['strictCamelCase'],
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
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort', 'deprecation'],
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
    'deprecation/deprecation': ['warn'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    ...getNamingConventionRule({ target: 'default' }),
  },
  overrides: [
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
  ],
};
