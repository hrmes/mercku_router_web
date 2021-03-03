const path = require('path');
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  extends: ['plugin:vue/base', '@vue/airbnb'],
  // required to lint *.vue files
  plugins: ['vue'],
  rules: {
    'no-console': 0,
    'no-new': 0,
    'comma-dangle': 0,
    'global-require': 0,
    'no-debugger': 0,
    'no-unused-expressions': 0,
    'no-mixed-operators': 0,
    'no-unused-vars': 'warn',
    'import/no-dynamic-require': 0,
    'arrow-parens': 0,
    'no-param-reassign': 0,
    indent: 0,
    'no-underscore-dangle': 0,
    'no-bitwise': 0,
    'no-restricted-properties': 0,
    'class-methods-use-this': 0,
    'no-trailing-spaces': 0,
    'object-curly-newline': ['error', { consistent: true }],
    'operator-linebreak': [
      2,
      'after',
      { overrides: { '?': 'before', ':': 'before' } }
    ],
    'linebreak-style': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'implicit-arrow-linebreak': 0,
    'import/no-extraneous-dependencies': [
      'error',
      { packageDir: [path.join(__dirname, './')] }
    ]
  }
};
