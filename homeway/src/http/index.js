import Http, { createMethod } from 'base/http';

const methods = {
  getMeshAutoUpgrade: createMethod('mesh.auto_upgrade.get'),
  setMeshAutoUpgrade: createMethod('mesh.auto_upgrade.set'),
  getChildLockStatus: createMethod('mesh.child_lock.enabled.get'),
  updateChildLockStatus: createMethod('mesh.child_lock.enabled.update')
  // updateSuper: createMethod('mesh.config.super.update'),
  // getNewMeshNodeInfo: createMethod('mesh.node.new.info')
};

class HomewayHttp extends Http {}

Object.keys(methods).forEach(methodName => {
  HomewayHttp.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

export default HomewayHttp;
