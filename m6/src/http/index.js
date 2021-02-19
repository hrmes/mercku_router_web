import Http, { createMethod, commonMethods } from 'base/http';

const methods = {
  ...commonMethods,
  updateSuper: createMethod('mesh.config.super.update'),
  getMeshAutoUpgrade: createMethod('mesh.auto_upgrade.get'),
  setMeshAutoUpgrade: createMethod('mesh.auto_upgrade.set')
};

Object.keys(methods).forEach(methodName => {
  Http.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

export default Http;
