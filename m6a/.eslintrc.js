let Service = require('@vue/cli-service/lib/Service');
const context = process.cwd() + '/m6a';
const service = new Service(context);
service.init(process.env.VUE_CLI_MODE || process.env.NODE_ENV);

const config = service.resolveWebpackConfig();
console.log(config);
module.exports = {
  root: false,
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: config.resolve.alias
          }
        }
      }
    }
  }
};
