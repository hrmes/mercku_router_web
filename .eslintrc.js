module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: 'airbnb-base',

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
    'arrow-parens': 0
  }
};
