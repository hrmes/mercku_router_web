import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

const url = '/app';
const methods = {
  checkLogin: {
    url,
    action: 'router.is_login'
  },
  login: {
    url,
    action: 'router.login'
  },
  isinitial: {
    url,
    action: 'router.is_initial'
  },
  update: {
    url,
    action: 'mesh.config.update' // (已拆分)
  },
  testWan: {
    url,
    action: 'mesh.wan.status.get' // 获取WAN口状态
  },
  getTimezone: {
    url,
    action: 'router.timezone.get'
  },
  // new
  meshWanSpeedTest: {
    url,
    action: 'mesh.wan.speed.test' // WAN口速度测试
  },
  getRouterMeta: {
    url,
    action: 'router.meta.get' // 获取路由器基础信息
  },

  reboot: {
    url,
    action: 'mesh.node.reboot' // 路由器重启
  },
  meshMeta: {
    url,
    action: 'mesh.meta.get' // 获取组网信息
  },
  getDeviceCount: {
    url,
    action: 'mesh.device.count.get' // 获取连接设备数量
  },
  getMeshNode: {
    url,
    action: 'mesh.node.get' // 获取当前组网状态
  },
  // v0.8这里改动比较大
  getNetInfo: {
    url,
    action: 'router.net.get' // 已修改 => mesh.info.wan.net.get
  },
  meshWan: {
    url,
    action: 'mesh.wan.get' // 已修改为 => mesh.info.wan.stats.get
  },
  getWanNetInfo: {
    url,
    action: 'mesh.info.wan.net.get' // 获取组网WAN口上网信息
  },
  getWanNetStats: {
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
    action: 'router.admin.get'
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
  upgrade: {
    url,
    action: 'mesh.node.upgrade' // 升级
  }
};

const http = {
  getAdmin() {
    return axios.post(methods.routerAdminGet.url, {
      method: methods.meshAdminUpdate.action
    });
  },
  updateAdmin(params) {
    return axios.post(methods.meshAdminUpdate.url, {
      method: methods.meshAdminUpdate.action,
      params
    });
  },
  /* v0.9 start */
  firmwareUpload(parmas, callback) {
    const {
      CancelToken
    } = axios;
    const source = CancelToken.source();
    return axios({
      url: `/${methods.firmwareUpload.action}`,
      method: 'post',
      data: parmas,
      cancelToken: source.token,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        callback(progressEvent);
      }
    });
  },
  firmwareList() {
    return axios.post(methods.firmwareList.url, {
      method: methods.firmwareList.action
    });
  },
  upgrade(params) {
    return axios.post(methods.upgrade.url, {
      method: methods.upgrade.action,
      params
    });
  },
  /* v0.9 end */
  /* v0.8 start */
  getWanNetInfo() {
    return axios.post(methods.getWanNetInfo.url, {
      method: methods.getWanNetInfo.action
    });
  },
  getWanNetStats() {
    return axios.post(methods.getWanNetStats.url, {
      method: methods.getWanNetStats.action
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
    return axios.post(methods.reboot.url, {
      method: methods.reboot.action
    });
  },
  getMeshMeta() {
    return axios.post(methods.meshMeta.url, {
      method: methods.meshMeta.action
    });
  },
  speedTesting(force) {
    return axios.post(methods.meshWanSpeedTest.url, {
      method: methods.meshWanSpeedTest.action,
      parmas: {
        force
      }
    });
  },
  getRouter() {
    return axios.post(methods.getRouterMeta.url, {
      method: methods.getRouterMeta.action
    });
  },
  getNet(params) {
    return axios.post(methods.getNetInfo.url, {
      method: methods.getNetInfo.action,
      params
    });
  },
  getDeviceCount() {
    return axios.post(methods.getDeviceCount.url, {
      method: methods.getDeviceCount.action
    });
  },
  getTraffic() {
    return axios.post(methods.meshWan.url, {
      method: methods.meshWan.action
    });
  },
  getMeshNode() {
    return axios.post(methods.getMeshNode.url, {
      method: methods.getMeshNode.action
    });
  },
  checkLogin() {
    return axios.post(methods.checkLogin.url, {
      method: methods.checkLogin.action
    });
  },
  login(pwd) {
    return axios.post(methods.login.url, {
      method: methods.login.action,
      params: {
        admin_password: pwd
      }
    });
  },
  isinitial() {
    return axios.post(methods.isinitial.url, {
      method: methods.isinitial.action
    });
  },
  update(config) {
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
    return axios.post(methods.update.url, {
      method: methods.update.action,
      params: {
        config: conf
      }
    });
  },
  testWan() {
    return axios.post(methods.testWan.url, {
      method: methods.testWan.action
    });
  },
  getTimezone() {
    return axios.post(methods.getTimezone.url, {
      method: methods.getTimezone.action
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
export {
  http,
  configResponseInterceptors,
  configRequestInterceptors
};
