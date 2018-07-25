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
  routerTimezoneGet: {
    url,
    action: 'router.timezone.get'
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
  meshNodeReboot: {
    url,
    action: 'mesh.node.reboot' // 路由器重启
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
    url,
    action: 'firmware_upload' // 上传固件
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
  }
};

const http = {
  getRouterMode() {
    return axios.post(methods.routerModeGet.url, {
      method: methods.routerModeGet.action
    });
  },
  getAdmin() {
    return axios.post(methods.routerAdminGet.url, {
      method: methods.routerAdminGet.action
    });
  },
  updateAdmin(params) {
    return axios.post(methods.meshAdminUpdate.url, {
      method: methods.meshAdminUpdate.action,
      params
    });
  },
  /* v0.9 start */
  firmwareUpload(params, callback) {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    return axios({
      url: `/${methods.firmwareUpload.action}`,
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
    return axios.post(methods.firmwareList.url, {
      method: methods.firmwareList.action
    });
  },
  upgradeMeshNode(params) {
    return axios.post(methods.meshNodeUpgrade.url, {
      method: methods.meshNodeUpgrade.action,
      params
    });
  },
  /* v0.9 end */
  /* v0.8 start */
  getWanNetInfo() {
    return axios.post(methods.meshWanNetGet.url, {
      method: methods.meshWanNetGet.action
    });
  },
  getWanNetStats() {
    return axios.post(methods.meshWanStatsGet.url, {
      method: methods.meshWanStatsGet.action
    });
  },
  meshWifiUpdate(config) {
    return axios.post(methods.meshWifiUpdate.url, {
      method: methods.meshWifiUpdate.action,
      params: {
        ...config.wifi
      }
    });
  },
  meshWanUpdate(config) {
    return axios.post(methods.meshWanUpdate.url, {
      method: methods.meshWanUpdate.action,
      params: {
        ...config.wan
      }
    });
  },
  /* v0.8 end */
  reboot() {
    return axios.post(methods.meshNodeReboot.url, {
      method: methods.meshNodeReboot.action
    });
  },
  getMeshMeta() {
    return axios.post(methods.meshMetaGet.url, {
      method: methods.meshMetaGet.action
    });
  },
  speedTesting(force) {
    return axios.post(methods.meshWanSpeedTest.url, {
      method: methods.meshWanSpeedTest.action,
      params: {
        force
      }
    });
  },
  getRouter() {
    return axios.post(methods.routerMetaGet.url, {
      method: methods.routerMetaGet.action
    });
  },
  getNet(params) {
    return axios.post(methods.routerNetGet.url, {
      method: methods.routerNetGet.action,
      params
    });
  },
  getDeviceCount() {
    return axios.post(methods.deviceCountGet.url, {
      method: methods.deviceCountGet.action
    });
  },
  getTraffic() {
    return axios.post(methods.meshWanGet.url, {
      method: methods.meshWanGet.action
    });
  },
  getMeshNode() {
    return axios.post(methods.meshNodeGet.url, {
      method: methods.meshNodeGet.action
    });
  },
  checkLogin() {
    return axios.post(methods.routerIsLogin.url, {
      method: methods.routerIsLogin.action
    });
  },
  login(pwd) {
    return axios.post(methods.routerLogin.url, {
      method: methods.routerLogin.action,
      params: {
        password: pwd
      }
    });
  },
  isinitial() {
    return axios.post(methods.routerIsInitial.url, {
      method: methods.routerIsInitial.action
    });
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
    return axios.post(methods.meshConfigUpdate.url, {
      method: methods.meshConfigUpdate.action,
      params: {
        config: conf
      }
    });
  },
  getWanStatus() {
    return axios.post(methods.meshWanStatusGet.url, {
      method: methods.meshWanStatusGet.action
    });
  },
  getTimezone() {
    return axios.post(methods.routerTimezoneGet.url, {
      method: methods.routerTimezoneGet.action
    });
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
