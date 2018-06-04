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
    action: 'mesh.config.update'
  },
  testWan: {
    url,
    action: 'router.wan_status.get'
  },
  getTimezone: {
    url,
    action: 'router.timezone.get'
  },
  getWIFI: {
    url,
    action: 'router.wifi.get'
  },
  // new
  meshWanSpeedTest: {
    url,
    action: 'mesh.wan_speed.test'
  },
  getRouterMeta: {
    url,
    action: 'router.meta.get'
  },
  getNetInfo: {
    url,
    action: 'router.net.get'
  },
  getDeviceCount: {
    url,
    action: 'mesh.device.count.get'
  },
  getMeshNode: {
    url,
    action: 'mesh.node.get'
  },
  meshWan: {
    url,
    action: 'mesh.wan.get'
  },
  reboot: {
    url,
    action: 'mesh.node.reboot'
  },
};

const http = {
  speedTesting() {
    return axios.post(methods.meshWanSpeedTest.url, {
      method: methods.meshWanSpeedTest.action
    });
  },
  getRouter() {
    return axios.post(methods.getRouterMeta.url, {
      method: methods.getRouterMeta.action
    });
  },
  getNet(data) {
    return axios.post(methods.getNetInfo.url, {
      method: methods.getNetInfo.action,
      params: { ...data
      }
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
  getWIFI() {
    return axios.post(methods.getWIFI.url, {
      method: methods.getWIFI.action
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
<<<<<<< HEAD
    // if (config.timezone.timezone) {
    //   conf.timezone = config.timezone;
    // }
    if (config.wan && config.wan.type) {
=======
    if (config.admin.password) {
      conf.admin = config.admin;
    }
    // if (config.timezone.timezone) {
    //   conf.timezone = config.timezone;
    // }
    if (config.wan.type) {
>>>>>>> origin
      conf.wan = config.wan;
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
