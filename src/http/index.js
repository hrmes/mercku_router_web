import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

const mockServer = 'https://mock.hyku.org/api';
const url = '/app';
const develop = process.env.NODE_ENV === 'development';
const methods = {
  checkLogin: {
    url: develop ? `${mockServer}/app1` : url,
    action: 'router.check_login'
  },
  login: {
    url: develop ? `${mockServer}/app2` : url,
    action: 'router.login'
  },
  isinitial: {
    url: develop ? `${mockServer}/app3` : url,
    action: 'router.is_initial'
  },
  update: {
    url: develop ? `${mockServer}/app4` : url,
    action: 'router.config.update'
  },
  testWan: {
    url: develop ? `${mockServer}/app5` : url,
    action: 'router.is_wan_connected'
  },
  getTimezone: {
    url: develop ? `${mockServer}/app6` : url,
    action: 'router.timezone.get'
  }
};

const http = {
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
    return axios.post(methods.update.url, {
      method: methods.update.action,
      params: {
        config
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
