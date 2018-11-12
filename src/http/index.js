import axios from 'axios';

axios.defaults.timeout = 60000;
const createMethods = url => action => ({ url, action });
const url = '/app';
const methods = {
  routerIsLogin: createMethods(url)('router.is_login'),
  routerLogin: createMethods(url)('router.login'),
  routerLogout: {
    url,
    action: 'router.logout'
  },
  routerIsInitial: {
    url,
    action: 'router.is_initial'
  },
  meshConfigUpdate: {
    url,
    action: 'mesh.config.update' // (已拆分)
  },
  meshWanStatusGet: {
    url,
    action: 'mesh.wan.status.get' // 获取WAN口状态
  },
  meshInfoTimezoneGet: {
    url,
    action: 'mesh.info.timezone.get'
  },
  meshConfigTimezoneUpdate: {
    url,
    action: 'mesh.config.timezone.update'
  },
  meshNodeScan: {
    url,
    action: 'mesh.node.scan'
  },
  // new
  meshWanSpeedTest: {
    url,
    action: 'mesh.wan.speed.test' // WAN口速度测试
  },
  routerMetaGet: {
    url,
    action: 'router.meta.get' // 获取路由器基础信息
  },
  meshNodeDelete: {
    url,
    action: 'mesh.node.delete'
  },
  meshNodeUpdate: {
    url,
    action: 'mesh.node.update'
  },
  meshNodeReset: {
    url,
    action: 'mesh.node.reset'
  },
  meshNodeReboot: {
    url,
    action: 'mesh.node.reboot' // 路由器重启
  },
  meshNodeAdd: {
    url,
    action: 'mesh.node.add'
  },
  meshMetaGet: {
    url,
    action: 'mesh.meta.get' // 获取组网信息
  },
  deviceCountGet: {
    url,
    action: 'mesh.device.count.get' // 获取连接设备数量
  },
  meshNodeGet: {
    url,
    action: 'mesh.node.get' // 获取当前组网状态
  },
  // v0.8这里改动比较大
  routerNetGet: {
    url,
    action: 'router.net.get' // 已修改 => mesh.info.wan.net.get
  },
  meshWanGet: {
    url,
    action: 'mesh.wan.get' // 已修改为 => mesh.info.wan.stats.get
  },
  meshWanNetGet: {
    url,
    action: 'mesh.info.wan.net.get' // 获取组网WAN口上网信息
  },
  meshBlacklistDelete: {
    url,
    action: 'mesh.blacklist.delete'
  },
  meshBlacklistGet: {
    url,
    action: 'mesh.blacklist.get'
  },
  meshWanStatsGet: {
    url,
    action: 'mesh.info.wan.stats.get' // 获取组网WAN口统计状态
  },
  meshWifiUpdate: {
    url,
    action: 'mesh.config.wifi.update' // 组网wifi配置更新
  },
  meshWanUpdate: {
    url,
    action: 'mesh.config.wan.net.update' // 组网WAN口配置更新
  },
  nodeIsInMesh: {
    url,
    action: 'mesh.node.is_in_mesh'
  },
  meshLanUpdate: {
    url,
    action: 'mesh.config.lan.net.update' // 组网Lan口配置更新
  },
  meshAdminUpdate: {
    url,
    action: 'mesh.config.admin.update'
  },
  routerAdminGet: {
    url,
    action: 'router.config.admin.get'
  },
  // v0.9
  firmwareUpload: {
    url: '/firmware_upload' // 上传固件
  },
  firmwareList: {
    url,
    action: 'mesh.node.upgradability.get' // 检测在线升级列表
  },
  meshNodeUpgrade: {
    url,
    action: 'mesh.node.upgrade' // 升级
  },
  routerModeGet: {
    url,
    action: 'router.mode.get'
  },
  meshDeviceGet: {
    url,
    action: 'mesh.device.get'
  },
  meshDeviceUpdate: {
    url,
    action: 'mesh.device.update'
  },
  addToblackList: {
    url,
    action: 'mesh.blacklist.add'
  },
  addSpeedLimit: {
    url,
    action: 'mesh.device.speed_limit.add'
  },
  getSpeedLimit: {
    url,
    action: 'mesh.device.speed_limit.get'
  },
  speedLimitUpdate: {
    url,
    action: 'mesh.device.speed_limit.update'
  },
  addTimeLimit: {
    url,
    action: 'mesh.device.time_limit.add'
  },
  getTimeLimit: {
    url,
    action: 'mesh.device.time_limit.get'
  },
  timeLimitUpdate: {
    url,
    action: 'mesh.device.time_limit.update'
  },
  timeLimitDel: {
    url,
    action: 'mesh.device.time_limit.delete'
  },
  parentControlLimitGet: {
    url,
    action: 'mesh.device.parent_control.get'
  },
  parentControlLimitUpdate: {
    url,
    action: 'mesh.device.parent_control.update'
  },
  parentControlLimitAdd: {
    url,
    action: 'mesh.device.parent_control.add'
  },
  parentControlLimitDel: {
    url,
    action: 'mesh.device.parent_control.delete'
  },
  getLocalDevice: {
    url,
    action: 'request.get'
  },
  meshInfoFirewallGet: {
    url,
    action: 'mesh.info.firewall.get'
  },
  meshConfigFirewallUpdate: {
    url,
    action: 'mesh.config.firewall.update'
  }
};

const noop = () => {};
class Http {
  constructor() {
    this.exHandler = error => {
      throw error;
    };
  }

  setInterceptors(options) {
    console.log(this); // avoid lint
    const defaultOpt = {
      reqInterceptor: {
        success: noop,
        error: noop
      },
      resInterceptor: {
        success: noop,
        error: noop
      }
    };
    const opt = {
      reqInterceptor: {
        ...defaultOpt.reqInterceptor,
        ...options.reqInterceptor
      },
      resInterceptor: {
        ...defaultOpt.resInterceptor,
        ...options.resInterceptor
      }
    };

    axios.interceptors.response.use(
      opt.resInterceptor.success,
      opt.resInterceptor.error
    );
    axios.interceptors.request.use(
      opt.reqInterceptor.success,
      opt.reqInterceptor.error
    );
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
  static firmwareUpload(params, callback) {
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
  removeBlacklist(macs) {
    return this.request(methods.meshBlacklistDelete, { macs });
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
  testSpeed(force) {
    return this.request(methods.meshWanSpeedTest, { force });
  }
  addMeshNode(node) {
    return this.request(methods.meshNodeAdd, node);
  }
  updateMeshNode(nodeId, data) {
    return this.request(methods.meshNodeUpdate, {
      node_id: nodeId,
      data
    });
  }
  isInMesh(node) {
    return this.request(methods.nodeIsInMesh, node);
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
  setTimezone(timezone) {
    return this.request(methods.meshConfigTimezoneUpdate, timezone);
  }
  static post2native(action, type, data) {
    const message = {
      action,
      type,
      data
    };
    const messageString = JSON.stringify(message);
    try {
      window.webkit.messageHandlers.callbackHandler.postMessage(messageString);
    } catch (err) {
      window.android && window.android.call(messageString);
    }
  }
}
export default Http;
