import Http, { createMethod } from 'base/http';

const methods = {
  updateSuper: createMethod('mesh.config.super.update'),
  getMeshAutoUpgrade: createMethod('mesh.auto_upgrade.get'),
  setMeshAutoUpgrade: createMethod('mesh.auto_upgrade.set'),
  getNewMeshNodeInfo: createMethod('mesh.node.new.info'),
  getChildLockStatus: createMethod('mesh.child_lock.enabled.get'),
  updateChildLockStatus: createMethod('mesh.child_lock.enabled.update'),
  getMeshApclientScanList: createMethod('mesh.apclient.scan')
};

class M6cHttp extends Http {}

Object.keys(methods).forEach(methodName => {
  M6cHttp.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

export default M6cHttp;
