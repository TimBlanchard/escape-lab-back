module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'airbnb-base'],
  plugins: ['unused-imports', 'simple-import-sort', 'eslint-plugin-prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 11,
  },
  rules: {
    quotes: ['error', 'single'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-loss-of-precision': 'off',
    'no-nonoctal-decimal-escape': 'off',
    'no-unsafe-optional-chaining': 'off',
    'no-useless-backreference': 'off',
    semi: ['error', 'never'],
  },
}
