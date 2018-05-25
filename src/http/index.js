import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

const url = '/app';
const Methods = {
  checkLogin: {
    url,
    action: 'router.check_login'
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
    action: 'router.config.update'
  },
  testWan: {
    url,
    action: 'router.check_wan_status'
  },
  getTimezone: {
    url,
    action: 'router.timezone.get'
  },
  getWIFI: {
    url,
    action: 'router.wifi.get'
  },
  logout: {
    url,
    action: 'router.logout'
  },
  reboot: {
    url,
    action: 'router.reboot'
  },
  getWanRTInfo: {
    url,
    action: 'router.wan.rt_info.get'
  },
  getWanInfo: {
    url,
    action: 'router.wan.config.get'
  },
  testSpeed: {
    url,
    action: ''
  },
  getMeshInfo: {
    url,
    action: ''
  }
};

const http = {
  logout() {
    return axios.post(Methods.logout.url, {
      method: Methods.logout.action
    });
  },
  reboot() {
    return axios.post(Methods.reboot.url, {
      method: Methods.reboot.action
    });
  },
  getWanRTInfo() {
    return axios.post(Methods.getWanRTInfo.url, {
      method: Methods.getWanRTInfo.action
    });
  },
  getWanInfo() {
    return axios.post(Methods.getWanInfo.url, {
      method: Methods.getWanInfo.action
    });
  },
  getMeshInfo() {
    return axios.post(Methods.getMeshInfo.url, {
      method: Methods.getMeshInfo.action
    });
  },
  testSpeed() {
    return axios.post(Methods.testSpeed.url, {
      method: Methods.testSpeed.action
    });
  },
  getWIFI() {
    return axios.post(Methods.getWIFI.url, {
      method: Methods.getWIFI.action
    });
  },
  checkLogin() {
    return axios.post(Methods.checkLogin.url, {
      method: Methods.checkLogin.action
    });
  },
  login(pwd) {
    return axios.post(Methods.login.url, {
      method: Methods.login.action,
      params: {
        admin_password: pwd
      }
    });
  },
  isinitial() {
    return axios.post(Methods.isinitial.url, {
      method: Methods.isinitial.action
    });
  },
  update(config) {
    // check params
    const conf = {};
    if (config.wifi.ssid) {
      conf.wifi = config.wifi;
    }
    if (config.admin.password) {
      conf.admin = config.admin;
    }
    // if (config.timezone.timezone) {
    //   conf.timezone = config.timezone;
    // }
    if (config.wan.type) {
      conf.wan = config.wan;
    }
    return axios.post(Methods.update.url, {
      method: Methods.update.action,
      params: {
        config: conf
      }
    });
  },
  testWan() {
    return axios.post(Methods.testWan.url, {
      method: Methods.testWan.action
    });
  },
  getTimezone() {
    return axios.post(Methods.getTimezone.url, {
      method: Methods.getTimezone.action
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
