import Vue from 'vue';
import 'babel-polyfill';
import { Button, Field, Icon, Checkbox, Dialog, Cell, CellGroup, Toast } from 'vant';
import FastClick from 'fastclick';
import { changeLanguage, i18n } from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import { http, configResponseInterceptors, configRequestInterceptors } from './http';
import util from './util/util';
import nav from './component/nav-bar.vue';

Vue.use(Button);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.component('nav-bar', nav);

Vue.prototype.$toast = Toast;

Vue.use(Cell);
Vue.use(CellGroup);
const loader = {
  open: false,
  instance: null
};
const launch = () => {
  FastClick.attach(document.body);
  const NO_LOADING_METHODS = ['router.check_login', 'router.is_wan_connected'];
  const ROUTER_LOGIN = 'router.login';
  configRequestInterceptors(
    config => {
      const conf = config;
      conf.timeout = 20000; // add timeout
      // 添加不显示loading的例外
      if (
        !loader.instance &&
        !(
          NO_LOADING_METHODS.includes(conf.data.method) ||
          (conf.data.method === ROUTER_LOGIN && !conf.data.params.admin_password)
        )
      ) {
        loader.instance = Toast.loading({
          mask: true,
          message: '',
          duration: 0,
          forbidClick: true
        });
        loader.open = true;
      }
      return conf;
    },
    error => {
      if (loader.open) {
        loader.instance.clear();
        loader.open = false;
        loader.instance = null;
      }
      return Promise.reject(error);
    }
  );
  configResponseInterceptors(
    res => {
      if (loader.open) {
        loader.instance.clear();
        loader.open = false;
        loader.instance = null;
      }
      return res;
    },
    error => {
      if (loader.open) {
        loader.instance.clear();
        loader.open = false;
        loader.instance = null;
      }
      if (error.response) {
        const href = window.location.href;
        switch (error.response.status) {
          case 401:
            // 欢迎页和登录页不记录returnURL
            if (href.includes('/login') && href.includes('/welcome')) {
              router.returnUrl = window.location.href;
            }
            window.location.hash = '#/login';
            break;
          default:
            break;
        }
      }
      return Promise.reject(error.response.data);
    }
  );
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = changeLanguage;
  Vue.prototype.routerConfig = schema;
  Vue.prototype.$confirm = Dialog.confirm;
  // get querystring
  const qs = window.location.search.substring(1);
  // set language
  changeLanguage(qs.includes('lang=zh') ? 'zh-CN' : 'en-US');
  Vue.prototype.webview = (() => {
    // use indexOf instead includes
    if (qs && qs.includes('fromapp=1')) {
      return true;
    }
    return false;
  })();
  util.adapt(375, 375);

  let loginChecked = false;
  const Pages = {
    welcome: '/welcome',
    login: '/login',
    wlan: '/wlan'
  };
  router.beforeEach((to, form, next) => {
    // 欢迎页不需要检查登录
    if (to.path !== Pages.welcome && !loginChecked) {
      loginChecked = true;
      http.checkLogin().then(res => {
        if (!res.data.result) {
          // 未登录
          http
            .login('')
            .then(() => {
              if (to.path === Pages.login) {
                next({ path: Pages.wlan });
              } else {
                next();
              }
            })
            .catch(() => {
              next({ path: Pages.login });
            });
        } else {
          if (to.path === Pages.login) {
            next({ path: Pages.wlan });
          }
          next();
        }
      });
    } else {
      next();
    }
  });
  new Vue({
    el: '#app',
    i18n,
    router,
    render: h => h(App)
  });
};
document.addEventListener('DOMContentLoaded', () => {
  launch();
});
