import Http, { createMethod } from 'base/http';

const methods = {
  getSSHEnabled: createMethod('router.ssh.enabled.get'),
  setSSHEnabled: createMethod('router.ssh.enabled.update'),
  getMeshNodeStation: createMethod('mesh.node.station.get'),
  getUPNPEnabled: createMethod('mesh.upnp.enabled.get'),
  setUPNPEnabled: createMethod('mesh.upnp.enabled.update'),
  startWPS: createMethod('mesh.wps.start'),
  getMeshAutoUpgrade: createMethod('mesh.auto_upgrade.get'),
  setMeshAutoUpgrade: createMethod('mesh.auto_upgrade.set')
};

class M2Http extends Http {}

Object.keys(methods).forEach(methodName => {
  M2Http.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

export default M2Http;
