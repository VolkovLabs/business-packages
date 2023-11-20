"use strict";

/**
 * Documentation - https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
 */
module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "simple-import-sort",
    "deprecation",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "deprecation/deprecation": ["warn"],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
  },
};
