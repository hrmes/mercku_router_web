import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

const url = '/app';
const methods = {
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
    action: 'router.is_wan_connected'
  },
  getTimezone: {
    url,
    action: 'router.timezone.get'
  },
  getWIFI: {
    url,
    action: 'router.wifi.get'
  }
};

const http = {
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
    if (config.wifi.ssid) {
      conf.wifi = config.wifi;
    }
    if (config.admin.password) {
      conf.admin = config.admin;
    }
    if (config.timezone.timezone) {
      conf.timezone = config.timezone;
    }
    if (config.wan.type) {
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
export { http, configResponseInterceptors };
