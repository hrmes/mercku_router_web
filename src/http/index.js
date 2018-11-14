import axios from 'axios';

axios.defaults.timeout = 60000;

const defaultUrl = '/app';
const createMethod = (action, url = defaultUrl) => ({ url, action });

const methods = {
  routerIsLogin: createMethod('router.is_login'),
  routerLogin: createMethod('router.login'),
  routerLogout: createMethod('router.logout'),
  routerIsInitial: createMethod('router.is_initial'),
  meshConfigUpdate: createMethod('mesh.config.update'),
  meshWanStatusGet: createMethod('mesh.wan.status.get'),
  meshInfoTimezoneGet: createMethod('mesh.info.timezone.get'),
  meshConfigTimezoneUpdate: createMethod('mesh.config.timezone.update'),
  meshNodeScan: createMethod('mesh.node.scan'),
  meshWanSpeedTest: createMethod('mesh.wan.speed.test'),
  routerMetaGet: createMethod('router.meta.get'),
  meshNodeDelete: createMethod('mesh.node.delete'),
  meshNodeUpdate: createMethod('mesh.node.update'),
  meshNodeReset: createMethod('mesh.node.reset'),
  meshNodeReboot: createMethod('mesh.node.reboot'),
  meshNodeAdd: createMethod('mesh.node.add'),
  meshMetaGet: createMethod('mesh.meta.get'),
  deviceCountGet: createMethod('mesh.device.count.get'),
  meshNodeGet: createMethod('mesh.node.get'),
  routerNetGet: createMethod('router.net.get'),
  meshWanGet: createMethod('mesh.wan.get'),
  meshWanNetGet: createMethod('mesh.info.wan.net.get'),
  meshBlacklistDelete: createMethod('mesh.blacklist.delete'),
  meshBlacklistGet: createMethod('mesh.blacklist.get'),
  meshWanStatsGet: createMethod('mesh.info.wan.stats.get'),
  meshWifiUpdate: createMethod('mesh.config.wifi.update'),
  meshWanUpdate: createMethod('mesh.config.wan.net.update'),
  nodeIsInMesh: createMethod('mesh.node.is_in_mesh'),
  meshLanUpdate: createMethod('mesh.config.lan.net.update'),
  meshAdminUpdate: createMethod('mesh.config.admin.update'),
  routerAdminGet: createMethod('router.config.admin.get'),
  firmwareUpload: createMethod('/firmware_upload'),
  firmwareList: createMethod('mesh.node.upgradability.get'),
  meshNodeUpgrade: createMethod('mesh.node.upgrade'),
  routerModeGet: createMethod('router.mode.get'),
  meshDeviceGet: createMethod('mesh.device.get'),
  meshDeviceUpdate: createMethod('mesh.device.update'),
  addToblackList: createMethod('mesh.blacklist.add'),
  addSpeedLimit: createMethod('mesh.device.speed_limit.add'),
  getSpeedLimit: createMethod('mesh.device.speed_limit.get'),
  speedLimitUpdate: createMethod('mesh.device.speed_limit.update'),
  addTimeLimit: createMethod('mesh.device.time_limit.add'),
  getTimeLimit: createMethod('mesh.device.time_limit.get'),
  timeLimitUpdate: createMethod('mesh.device.time_limit.update'),
  timeLimitDel: createMethod('mesh.device.time_limit.delete'),
  parentControlLimitGet: createMethod('mesh.device.parent_control.get'),
  parentControlLimitUpdate: createMethod('mesh.device.parent_control.update'),
  parentControlLimitAdd: createMethod('mesh.device.parent_control.add'),
  parentControlLimitDel: createMethod('mesh.device.parent_control.delete'),
  getLocalDevice: createMethod('request.get'),
  meshInfoFirewallGet: createMethod('mesh.info.firewall.get'),
  meshConfigFirewallUpdate: createMethod('mesh.config.firewall.update'),
  meshPortfwGet: createMethod('mesh.portfw.get'),
  meshPortfwUpdate: createMethod('mesh.portfw.update'),
  meshPortfwAdd: createMethod('mesh.portfw.add'),
  meshPortfwDelete: createMethod('mesh.portfw.delete'),
  meshDMZGet: createMethod('mesh.dmz.get'),
  meshDMZUpdate: createMethod('mesh.dmz.update'),
  meshDDNSGet: createMethod('mesh.ddns.get'),
  meshDDNSUpdate: createMethod('mesh.ddns.update'),
  meshInfoWanMacGet: createMethod('mesh.info.wan.mac.get'),
  meshConfigWanMacUpdate: createMethod('mesh.config.wan.mac.update')
};

class Http {
  constructor() {
    this.exHandler = error => {
      throw error;
    };
  }
  setExHandler(fn) {
    this.exHandler = fn;
  }
  request(config, params) {
    const data = {
      method: config.action
    };
    if (params) {
      data.params = params;
    }
    return axios({ url: config.url, method: 'post', data }).catch(
      this.exHandler
    );
  }
  getWanMac() {
    return this.request(methods.meshInfoWanMacGet);
  }
  updateWanMac(params) {
    return this.request(methods.meshConfigWanMacUpdate, params);
  }
  getDDNS() {
    return this.request(methods.meshDDNSGet);
  }
  updateDDNS(params) {
    return this.request(methods.meshDDNSUpdate, params);
  }
  getDMZ() {
    return this.request(methods.meshDMZGet);
  }
  updateDMZ(params) {
    return this.request(methods.meshDMZUpdate, params);
  }
  meshPortfwGet() {
    return this.request(methods.meshPortfwGet);
  }
  meshPortfwUpdate(params) {
    return this.request(methods.meshPortfwUpdate, params);
  }
  meshPortfwAdd(params) {
    return this.request(methods.meshPortfwAdd, params);
  }
  meshPortfwDelete(params) {
    return this.request(methods.meshPortfwDelete, params);
  }
  getFirewall() {
    return this.request(methods.meshInfoFirewallGet);
  }
  updateFirewall(params) {
    return this.request(methods.meshConfigFirewallUpdate, params);
  }
  getSpeedLimit(params) {
    return this.request(methods.getSpeedLimit, params);
  }
  getLocalDevice(params) {
    return this.request(methods.getLocalDevice, params);
  }
  parentControlLimitDel(params) {
    return this.request(methods.parentControlLimitDel, params);
  }
  parentControlLimitAdd(params) {
    return this.request(methods.parentControlLimitAdd, params);
  }
  parentControlLimitUpdate(params) {
    return this.request(methods.parentControlLimitUpdate, params);
  }
  parentControlLimitGet(params) {
    return this.request(methods.parentControlLimitGet, params);
  }
  timeLimitUpdate(params) {
    return this.request(methods.timeLimitUpdate, params);
  }
  timeLimitDel(params) {
    return this.request(methods.timeLimitDel, params);
  }
  getTimeLimit(params) {
    return this.request(methods.getTimeLimit, params);
  }
  addTimeLimit(params) {
    return this.request(methods.addTimeLimit, params);
  }
  addSpeedLimit(params) {
    return this.request(methods.addSpeedLimit, params);
  }
  speedLimitUpdate(params) {
    return this.request(methods.speedLimitUpdate, params);
  }
  addToblackList(params) {
    return this.request(methods.addToblackList, params);
  }
  meshDeviceUpdate(params) {
    return this.request(methods.meshDeviceUpdate, params);
  }
  meshDeviceGet() {
    return this.request(methods.meshDeviceGet);
  }
  loginout() {
    return this.request(methods.routerLogout);
  }
  getRouterMode() {
    return this.request(methods.routerModeGet);
  }
  getAdmin() {
    return this.request(methods.routerAdminGet);
  }
  updateAdmin(params) {
    return this.request(methods.meshAdminUpdate, params);
  }
  /* v0.9 start */
  uploadFirmware(params, callback) {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    return axios({
      url: methods.firmwareUpload.url,
      method: 'post',
      data: params,
      cancelToken: source.token,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        callback(progressEvent, source);
      }
    });
  }
  firmwareList() {
    return this.request(methods.firmwareList);
  }
  upgradeMeshNode(params) {
    return this.request(methods.meshNodeUpgrade, params);
  }
  /* v0.9 end */
  /* v0.8 start */
  getWanNetInfo() {
    return this.request(methods.meshWanNetGet);
  }
  scanMeshNode() {
    return this.request(methods.meshNodeScan);
  }
  getWanNetStats() {
    return this.request(methods.meshWanStatsGet);
  }
  getBlacklist() {
    return this.request(methods.meshBlacklistGet);
  }
  removeBlacklist(params) {
    return this.request(methods.meshBlacklistDelete, params);
  }
  meshWifiUpdate(params) {
    return this.request(methods.meshWifiUpdate, params);
  }
  meshWanUpdate(params) {
    return this.request(methods.meshWanUpdate, params);
  }
  deleteMeshNode(node) {
    return this.request(methods.meshNodeDelete, node);
  }
  resetMeshNode(nodeIds) {
    return this.request(methods.meshNodeReset, nodeIds);
  }
  reboot(nodeIds) {
    return this.request(methods.meshNodeReboot, nodeIds);
  }
  getMeshMeta() {
    return this.request(methods.meshMetaGet);
  }
  testSpeed(params) {
    return this.request(methods.meshWanSpeedTest, params);
  }
  addMeshNode(params) {
    return this.request(methods.meshNodeAdd, params);
  }
  updateMeshNode(params) {
    return this.request(methods.meshNodeUpdate, params);
  }
  isInMesh(params) {
    return this.request(methods.nodeIsInMesh, params);
  }
  getRouter() {
    return this.request(methods.routerMetaGet);
  }
  getNet(params) {
    return this.request(methods.routerNetGet, params);
  }
  getDeviceCount() {
    return this.request(methods.deviceCountGet);
  }
  getTraffic() {
    return this.request(methods.meshWanGet);
  }
  getMeshNode() {
    return this.request(methods.meshNodeGet);
  }
  checkLogin() {
    return this.request(methods.routerIsLogin);
  }
  login(password) {
    return this.request(methods.routerLogin, { password });
  }
  isinitial() {
    return this.request(methods.routerIsInitial);
  }
  updateMeshConfig(config) {
    // check params
    const conf = {};
    if (config.wifi && config.wifi.ssid) {
      conf.wifi = config.wifi;
    }
    if (config.wan && config.wan.type) {
      conf.wan = config.wan;
    }
    if (config.admin && config.admin.password) {
      conf.admin = config.admin;
    }
    return this.request(methods.meshConfigUpdate, { config: conf });
  }
  getWanStatus() {
    return this.request(methods.meshWanStatusGet);
  }
  getTimezone() {
    return this.request(methods.meshInfoTimezoneGet);
  }
  setTimezone(params) {
    return this.request(methods.meshConfigTimezoneUpdate, params);
  }
  post2native(action, type, data) {
    const message = JSON.stringify({
      action,
      type,
      data
    });
    try {
      window.webkit.messageHandlers.callbackHandler.postMessage(message);
    } catch (err) {
      window.android && window.android.call(message);
    }
  }
}
export default Http;
