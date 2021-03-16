const path = require('path');
module.exports = {
  root: false,
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              base: path.resolve(__dirname, '../base/src')
            }
          }
        }
      }
    }
  }
};
