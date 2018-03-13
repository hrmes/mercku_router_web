import axios from 'axios';

// axios.defaults.headers['content-type'] = 'application/json';

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

let methods;
if (process.env.NODE_ENV === 'development') {
  methods = {
    checkLogin: {
      url: 'https://mock.hyku.org/api/app1',
      action: 'router.check_login'
    },
    login: {
      url: 'https://mock.hyku.org/api/app2',
      action: 'router.login'
    },
    isinitial: {
      url: 'https://mock.hyku.org/api/app3',
      action: 'is_initial'
    },
    update: {
      url: 'https://mock.hyku.org/api/app4',
      action: 'router.config.update'
    },
    testWan: {
      url: 'https://mock.hyku.org/api/app5',
      action: 'router.test_wan'
    }
  };
} else {
  methods = {
    checkLogin: {
      url: '/app',
      action: 'router.check_login'
    },
    login: {
      url: '/app',
      action: 'router.login'
    },
    isinitial: {
      url: '/app',
      action: 'is_initial'
    },
    update: {
      url: '/app',
      action: 'router.config.update'
    },
    testWan: {
      url: '/app',
      action: 'router.test_wan'
    }
  };
}
export default {
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
