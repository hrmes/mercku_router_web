import Vue from 'vue';
import 'babel-polyfill';

import Button from 'vant/lib/button';
import Field from 'vant/lib/field';
import Icon from 'vant/lib/icon';
import Checkbox from 'vant/lib/checkbox';
import Dialog from 'vant/lib/dialog';
import Toast from 'vant/lib/toast';

import FastClick from 'fastclick';
import { changeLanguage, i18n } from '../i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import {
  http,
  configResponseInterceptors,
  configRequestInterceptors
} from '../http';
import util from './util/util';
import nav from './component/nav-bar.vue';
import v from '../../version.json';

Vue.use(Button);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Checkbox);

Vue.component('nav-bar', nav);

Vue.prototype.$toast = Toast;

const loader = {
  open: false,
  instance: null
};
const launch = () => {
  FastClick.attach(document.body);
  const NO_LOADING_METHODS = ['router.is_login', 'mesh.wan.status.get'];
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
          (conf.data.method === ROUTER_LOGIN &&
            !conf.data.params.admin_password)
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
        switch (error.response.status) {
          case 401:
            if (!window.location.href.includes('/login')) {
              window.location.hash = '#/pre-login';
            }
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
  i18n.locale = qs.includes('lang=zh') ? 'zh-CN' : 'en-US';
  // Vue.prototype.webview = (() => {
  //   // use indexOf instead includes
  //   if (qs && qs.includes('fromapp=1')) {
  //     return true;
  //   }
  //   return false;
  // })();
  util.adapt(375, 375);

  Vue.prototype.authorize = {
    authorized: false,
    get() {
      return this.authorized;
    },
    set(authorize) {
      this.authorized = authorize;
    }
  };

  const PagesRequireAuth = [];
  router.options.routes.forEach(route => {
    if (route.requireAuth) {
      PagesRequireAuth.push(route.name);
    }
  });

  router.beforeEach((to, form, next) => {
    if (PagesRequireAuth.includes(to.name) && !Vue.prototype.authorize.get()) {
      next({
        path: `/pre-login/${encodeURIComponent(to.path)}`
      });
    } else {
      // 不需要授权的页面，这里有个问题，如果用户直接输入了登陆页面，是不会尝试自动登陆的
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
document.addEventListener('DOMContentLoaded', launch);
// 通过pre-commit每次自动新增
console.log(`%cWeb version is : RC${v.version}`, 'color:red');
