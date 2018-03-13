import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  (error) => {
    // Do something with response error
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.hash = '#/login';
          break;
        default:
          break;
      }
    }
    return Promise.reject(error.response.data);
  }
);

const methods = {
  checkLogin: 'router.check_login',
  login: 'router.login',
  isinitial: 'is_initial',
  update: 'router.config.update',
  testWan: 'router.test_wan'
};

const baseUrl = '/app';
export default {
  checkLogin() {
    return axios.post(baseUrl, {
      method: methods.login
    });
  },
  login(pwd) {
    return axios.post(baseUrl, {
      method: methods.login,
      params: {
        admin_password: pwd
      }
    });
  },
  isinitial() {
    return axios.post(baseUrl, {
      method: methods.isinitial
    });
  },
  update(config) {
    return axios.post(baseUrl, {
      method: methods.update,
      params: {
        config
      }
    });
  },
  testWan() {
    return axios.post(baseUrl, {
      method: methods.testWan
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
