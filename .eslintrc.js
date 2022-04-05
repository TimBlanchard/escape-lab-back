module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/prettier'],
  plugins: ['unused-imports', 'simple-import-sort'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 11
  },
  rules: {
    'vue/no-unused-components': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    quotes: ['error', 'single'],
    'prettier/prettier': ['error', { singleQuote: true }],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  }
}
