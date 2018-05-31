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
import toast from './component/toast/index';
import dialog from './component/dialog/index';
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
  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.changeLanguage = changeLanguage;


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
// 通过pre-commit每次自动新 增
console.log(`%cWeb version is : RC${v.version}`, 'color:red');
