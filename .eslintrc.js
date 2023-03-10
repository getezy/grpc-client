module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
    node: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    ecmaFeatures: {
      jsx: false,
    },
    sourceType: 'module',
    ecmaVersion: 2021,
  },

  plugins: ['simple-import-sort', 'prettier', 'import'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        tabWidth: 2,
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],

    'no-plusplus': 'off',
    'class-methods-use-this': 'off',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'error',

    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000'], ['^[^.]'], ['^@(client|protocols|loaders)'], ['^\\.']],
      },
    ],
  },
};
