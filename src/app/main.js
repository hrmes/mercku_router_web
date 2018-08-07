import Vue from 'vue';
import FastClick from 'fastclick';
import dialog from './component/dialog/index';
import toast from './component/toast/index';
import { changeLanguage, i18n } from '../i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import {
  http,
  configResponseInterceptors,
  configRequestInterceptors
} from '../http';
import util from '../util/util';
import nav from './component/nav/nav-bar.vue';
import v from '../../version.json';

Vue.component('nav-bar', nav);

Vue.prototype.$toast = toast;

const launch = () => {
  FastClick.attach(document.body);
  configRequestInterceptors(config => config, error => Promise.reject(error));
  configResponseInterceptors(
    res => res,
    error => {
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
  Vue.prototype.$confirm = dialog.confirm;
  // get querystring
  const qs = window.location.search.substring(1);

  // set language
  i18n.locale = qs.includes('lang=zh') ? 'zh-CN' : 'en-US';
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
