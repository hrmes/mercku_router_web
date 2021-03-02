import axios from 'axios';

axios.defaults.timeout = 60000;
const defaultUrl = '/app';

export const createMethod = (action, url = defaultUrl) => ({
  url,
  action
});

class Http {
  constructor() {
    this.exHandler = error => {
      throw error;
    };
  }

  setExHandler(fn) {
    this.exHandler = fn;
  }

  request(config, params, axiosCfg = {}) {
    const data = { method: config.action };

    if (params) {
      data.params = params;
    }
    const options = {
      ...axiosCfg,
      url: config.url,
      method: 'post',
      data
    };
    return axios(options).catch(err => {
      this.exHandler(err, options);
    });
  }
}

const commonMethods = {
  checkLogin: createMethod('router.is_login'),
  login: createMethod('router.login'),
  loginout: createMethod('router.logout'),
  isinitial: createMethod('router.is_initial'),
  updateMeshConfig: createMethod('mesh.config.update'),
  getWanStatus: createMethod('mesh.wan.status.get'),
  getTimezone: createMethod('mesh.info.timezone.get'),
  setTimezone: createMethod('mesh.config.timezone.update'),
  scanMeshNode: createMethod('mesh.node.scan'),
  testSpeed: createMethod('mesh.wan.speed.test'),
  getRouter: createMethod('router.meta.get'),
  deleteMeshNode: createMethod('mesh.node.delete'),
  updateMeshNode: createMethod('mesh.node.update'),
  resetMeshNode: createMethod('mesh.node.reset'),
  reboot: createMethod('mesh.node.reboot'),
  addMeshNode: createMethod('mesh.node.add'),
  getMeshMeta: createMethod('mesh.meta.get'),
  getDeviceCount: createMethod('mesh.device.count.get'),
  getMeshNode: createMethod('mesh.node.get'),
  getNet: createMethod('router.net.get'),
  getTraffic: createMethod('mesh.wan.get'),
  getWanNetInfo: createMethod('mesh.info.wan.net.get'),
  removeBlacklist: createMethod('mesh.blacklist.delete'),
  getBlacklist: createMethod('mesh.blacklist.get'),
  getWanNetStats: createMethod('mesh.info.wan.stats.get'),
  meshWifiUpdate: createMethod('mesh.config.wifi.update'),
  meshWanUpdate: createMethod('mesh.config.wan.net.update'),
  isInMesh: createMethod('mesh.node.is_in_mesh'),
  meshLanUpdate: createMethod('mesh.config.lan.net.update'),
  updateAdmin: createMethod('mesh.config.admin.update'),
  getAdmin: createMethod('router.config.admin.get'),
  firmwareList: createMethod('mesh.node.upgradability.get'),
  upgradeMeshNode: createMethod('mesh.node.upgrade'),
  getRouterMode: createMethod('router.mode.get'),
  getDeviceList: createMethod('mesh.device.get'),
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
  getFirewall: createMethod('mesh.info.firewall.get'),
  updateFirewall: createMethod('mesh.config.firewall.update'),
  meshPortfwGet: createMethod('mesh.portfw.get'),
  meshPortfwUpdate: createMethod('mesh.portfw.update'),
  meshPortfwAdd: createMethod('mesh.portfw.add'),
  meshPortfwDelete: createMethod('mesh.portfw.delete'),
  getDMZ: createMethod('mesh.dmz.get'),
  updateDMZ: createMethod('mesh.dmz.update'),
  getDDNS: createMethod('mesh.ddns.get'),
  updateDDNS: createMethod('mesh.ddns.update'),
  getWanMac: createMethod('mesh.info.wan.mac.get'),
  updateWanMac: createMethod('mesh.config.wan.mac.update'),
  meshRsvdipGet: createMethod('mesh.rsvdip.get'),
  meshRsvdipUpdate: createMethod('mesh.rsvdip.update'),
  meshRsvdipAdd: createMethod('mesh.rsvdip.add'),
  meshRsvdipDelete: createMethod('mesh.rsvdip.delete'),
  meshInfolanNetGet: createMethod('mesh.info.lan.net.get'),
  diagnosis: createMethod('mesh.tools.execute'),
  getSyslogEnabled: createMethod('mesh.syslog.enabled.get'),
  updateSyslogEnabled: createMethod('mesh.syslog.enabled.update'),
  getVPNlist: createMethod('mesh.vpn.get'),
  addVPN: createMethod('mesh.vpn.add'),
  updateVPN: createMethod('mesh.vpn.update'),
  deleteVPN: createMethod('mesh.vpn.delete'),
  getVPNInfo: createMethod('mesh.vpn.info.get'),
  updateVPNConfig: createMethod('mesh.vpn.config.update'),
  setTelnetEnabled: createMethod('router.telnet.enabled.update'),
  getTelnetEnabled: createMethod('router.telnet.enabled.get'),
  getTr069: createMethod('router.tr069.get'),
  updateTr069: createMethod('router.tr069.update'),
  getTFTP: createMethod('router.tftp.get'),
  updateTFTP: createMethod('router.tftp.update'),
  meshNetworkReboot: createMethod('mesh.network.reboot'),
  getWWA: createMethod('router.wwa.get'),
  updateWWA: createMethod('router.wwa.update'),
  meshGuestGet: createMethod('mesh.guestwifi.get'),
  meshGuestUpdate: createMethod('mesh.guestwifi.update'),
  meshGuestAdd: createMethod('mesh.guestwifi.add'),
  meshGuestDel: createMethod('mesh.guestwifi.delete'),
  meshDevicesOfflineDel: createMethod('mesh.device.offline.delete'),
  getMeshMode: createMethod('mesh.mode.get'),
  updateMeshMode: createMethod('mesh.mode.update'),
  getMeshBand: createMethod('mesh.band.get'),
  updateMeshBand: createMethod('mesh.band.update'),
  getRegion: createMethod('mesh.region.get'),
  getSupportChannel: createMethod('mesh.channel.supported.get'),
  getSupportRegions: createMethod('mesh.region.supported.get'),
  setRegion: createMethod('mesh.region.update'),
  getUPNPEnabled: createMethod('mesh.upnp.enabled.get'),
  setUPNPEnabled: createMethod('mesh.upnp.enabled.update')
};

// 获取主页
Http.prototype.getHomePage = function getHomePage() {
  return axios.get(`/index.html?t=${Date.now()}`);
};
// 系统日志
Http.prototype.getSysLog = function getSysLog() {
  return axios.get(`/log.log?t=${Date.now()}`);
};
// 上传镜像
Http.prototype.uploadFirmware = function uploadFirmware(params, callback) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  return axios({
    url: '/firmware_upload',
    method: 'post',
    data: params,
    cancelToken: source.token,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      callback(progressEvent, source);
    }
  });
};
// 上传文件
Http.prototype.uploadFile = function uploadFile(params, callback) {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  return axios({
    url: '/file_upload',
    method: 'post',
    data: params,
    cancelToken: source.token,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: progressEvent => {
      callback(progressEvent, source);
    }
  });
};
Object.keys(commonMethods).forEach(methodName => {
  Http.prototype[methodName] = function name(params, httpConf) {
    return this.request(commonMethods[methodName], params, httpConf);
  };
});

export default Http;
