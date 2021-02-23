import Http, { createMethod } from 'base/http';

const methods = {
  getSSHEnabled: createMethod('router.ssh.enabled.get'),
  setSSHEnabled: createMethod('router.ssh.enabled.update'),
  getMeshNodeStation: createMethod('mesh.node.station.get'),
  getMeshInfoWanNetIpv6: createMethod('mesh.info.wan.net.ipv6.get'),
  updateMeshConfigWanNetIpv6: createMethod('mesh.config.wan.net.ipv6.update')
};

class M2Http extends Http {}

Object.keys(methods).forEach(methodName => {
  M2Http.prototype[methodName] = function name(params, httpConf) {
    return this.request(methods[methodName], params, httpConf);
  };
});

export default M2Http;
