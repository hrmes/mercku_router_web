import Vue from 'vue';
import 'babel-polyfill';

import {
  changeLanguage,
  i18n
} from '../i18n';
import router from './router';
import Desktop from './Desktop.vue';
import {
  http,
  configResponseInterceptors,
  configRequestInterceptors
} from '../http';
import loading from './component/loading/index';
import v from '../../version.json';

const launch = () => {
  configRequestInterceptors(
    config => {
      const conf = config;
      return conf;
    },
    error => Promise.reject(error)
  );
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
  Vue.prototype.$loading = loading;
  Vue.prototype.changeLanguage = changeLanguage;
  // set language
  changeLanguage('en-US');

  new Vue({
    el: '#web',
    i18n,
    router,
    render: h => h(Desktop)

  });
};
document.addEventListener('DOMContentLoaded', () => {
  launch();
});
// 通过pre-commit每次自动新增
console.log(`%cWeb version is : RC${v.version}`, 'color:red');
