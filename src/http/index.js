import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

const url = '/app';
const methods = {
  routerIsLogin: {
    url,
    action: 'router.is_login'
  },
  routerLogin: {
    url,
    action: 'router.login'
  },
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
  addTimeLimit: {
    url,
    action: 'mesh.device.time_limit.add'
  },
  getTimeLimit: {
    url,
    action: 'mesh.device.time_limit.get'
  }
};
const request = (config, params) => {
  const data = { method: config.action };
  if (params) {
    data.params = params;
  }
  return axios({
    url: config.url,
    method: 'post',
    data
  });
};
const http = {
  getTimeLimit(params) {
    return request(methods.getTimeLimit, params);
  },
  addTimeLimit(params) {
    return request(methods.addTimeLimit, params);
  },
  addSpeedLimit(params) {
    return request(methods.addSpeedLimit, params);
  },
  addToblackList(params) {
    return request(methods.addToblackList, params);
  },
  meshDeviceUpdate(params) {
    return request(methods.meshDeviceUpdate, params);
  },
  meshDeviceGet() {
    return request(methods.meshDeviceGet);
  },
  loginout() {
    return request(methods.routerLogout);
  },
  getRouterMode() {
    return request(methods.routerModeGet);
  },
  getAdmin() {
    return request(methods.routerAdminGet);
  },
  updateAdmin(params) {
    return request(methods.meshAdminUpdate, params);
  },
  /* v0.9 start */
  firmwareUpload(params, callback) {
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
  },
  firmwareList() {
    return request(methods.firmwareList);
  },
  upgradeMeshNode(params) {
    return request(methods.meshNodeUpgrade, params);
  },
  /* v0.9 end */
  /* v0.8 start */
  getWanNetInfo() {
    return request(methods.meshWanNetGet);
  },
  scanMeshNode() {
    return request(methods.meshNodeScan);
  },
  getWanNetStats() {
    return request(methods.meshWanStatsGet);
  },
  getBlacklist() {
    return request(methods.meshBlacklistGet);
  },
  removeBlacklist(macs) {
    return request(methods.meshBlacklistDelete, { macs });
  },
  meshWifiUpdate(params) {
    return request(methods.meshWifiUpdate, params);
  },
  meshWanUpdate(params) {
    return request(methods.meshWanUpdate, params);
  },
  deleteMeshNode(node) {
    return request(methods.meshNodeDelete, node);
  },
  resetMeshNode(nodeIds) {
    return request(methods.meshNodeReset, nodeIds);
  },
  /* v0.8 end */
  reboot(nodeIds) {
    return request(methods.meshNodeReboot, nodeIds);
  },
  getMeshMeta() {
    return request(methods.meshMetaGet);
  },
  testSpeed(force) {
    return request(methods.meshWanSpeedTest, { force });
  },
  addMeshNode(node) {
    return request(methods.meshNodeAdd, node);
  },
  updateMeshNode(nodeId, data) {
    return request(methods.meshNodeUpdate, { node_id: nodeId, data });
  },
  isInMesh(node) {
    return request(methods.nodeIsInMesh, node);
  },
  getRouter() {
    return request(methods.routerMetaGet);
  },
  getNet(params) {
    return request(methods.routerNetGet, params);
  },
  getDeviceCount() {
    return request(methods.deviceCountGet);
  },
  getTraffic() {
    return request(methods.meshWanGet);
  },
  getMeshNode() {
    return request(methods.meshNodeGet);
  },
  checkLogin() {
    return request(methods.routerIsLogin);
  },
  login(password) {
    return request(methods.routerLogin, { password });
  },
  isinitial() {
    return request(methods.routerIsInitial);
  },
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
    return request(methods.meshConfigUpdate, { config: conf });
  },
  getWanStatus() {
    return request(methods.meshWanStatusGet);
  },
  getTimezone() {
    return request(methods.meshInfoTimezoneGet);
  },
  setTimezone(timezone) {
    return request(methods.meshConfigTimezoneUpdate, timezone);
  },
  post2native(action, type, data) {
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
};

const configResponseInterceptors = (success, error) => {
  const noop = res => res;
  const successCallback = success || noop;
  const errorCallback = error || noop;
  axios.interceptors.response.use(successCallback, errorCallback);
};

const configRequestInterceptors = (before, error) => {
  const noop = res => res;
  const beforeFn = before || noop;
  const errorCallback = error || noop;
  axios.interceptors.request.use(beforeFn, errorCallback);
};
export { http, configResponseInterceptors, configRequestInterceptors };
