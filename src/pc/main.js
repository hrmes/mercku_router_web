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
            if (!window.location.href.includes('login')) {
              window.location.href = '/';
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
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.changeLanguage = changeLanguage;
  Vue.prototype.$reconnect = options => {
    const opt = {
      ...{
        onsuccess: () => {},
        ontimeout: () => {},
        onprogress: () => {}
      },
      ...options
    };
    let count = 60; // 60s重试时间
    const total = 60;
    const timer = setInterval(() => {
      count -= 1;
      const percent = ((total - count) / total).toFixed(2);
      opt.onprogress(percent);
      console.log('reconnet progress...percent:', percent);
      if (count > 0 && count % 10 === 0) {
        http.getRouter().then(() => {
          clearInterval(timer);
          opt.onsuccess();
          console.log('reconnect success');
        });
      } else if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
        console.log('reconnect timeout');
      }
    }, 1000);
  };
  new Vue({
    el: '#web',
    i18n,
    router,
    render: h => h(Desktop)
  });
};
document.addEventListener('DOMContentLoaded', launch);

console.log(`%cWeb version is : RC${v.version}`, 'color:red');
