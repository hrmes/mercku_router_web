module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
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
    'import/no-unresolved': [
      2,
      {
        ignore: ['base/']
      }
    ],
    'import/extensions': 0,
    'linebreak-style': 0,
    'implicit-arrow-linebreak': 0
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('@vue/cli-service/webpack.config.js')
      }
    }
  }
};
