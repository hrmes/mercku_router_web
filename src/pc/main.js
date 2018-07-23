import Vue from 'vue';
import { changeLanguage, i18n, translate } from '../i18n';
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
  const reconnect = options => {
    const opt = {
      ...{
        onsuccess: () => {},
        ontimeout: () => {},
        onprogress: () => {},
        timeout: 60
      },
      ...options
    };
    let count = opt.timeout; // 60s重试时间
    const total = opt.timeout;
    const timer = setInterval(() => {
      count -= 1;
      const percent = ((total - count) / total).toFixed(2);
      opt.onprogress(percent);
      console.log('reconnet progress...percent:', percent);
      if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
        console.log('reconnect timeout');
      } else if (count !== total && count % 10 === 0) {
        http.getRouter().then(() => {
          clearInterval(timer);
          opt.onsuccess();
          console.log('reconnect success');
        });
      }
    }, 1000);
  };

  const upgradeService = () => {
    let serviceStarted = false;
    return options => {
      if (!serviceStarted) {
        serviceStarted = true;
        loading.open({
          template: `<div class="upgrade-tip">${translate('trans0213')}</span>`
        });
        const opt = {
          ...{
            onsuccess: () => {},
            ontimeout: () => {},
            onprogress: () => {},
            timeout: 99999999
          },
          ...options
        };
        reconnect({
          onsuccess: () => {
            serviceStarted = false;
            loading.close();
            opt.onsuccess();
          },
          ontimeout: () => {
            serviceStarted = false;
            this.$loading.close();
            opt.ontimeout();
          },
          timeout: opt.timeout
        });
      }
    };
  };

  const upgrade = upgradeService();
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
      const { response } = error;
      if (!response) {
        return Promise.reject(error);
      }
      if (response.status === 401 && !window.location.href.includes('login')) {
        window.location.href = '/';
      } else if (
        response.status === 400 &&
        response.data.error.code === 600007
      ) {
        upgrade();
      }
      return Promise.reject(error.response.data);
    }
  );

  Vue.prototype.$http = http;
  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.changeLanguage = changeLanguage;
  Vue.prototype.$reconnect = reconnect;
  Vue.prototype.$upgrade = upgrade;

  new Vue({
    el: '#web',
    i18n,
    router,
    render: h => h(Desktop)
  });
};
document.addEventListener('DOMContentLoaded', launch);

console.log(`%cWeb version is : RC${v.version}`, 'color:red');
