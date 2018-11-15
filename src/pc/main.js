import Vue from 'vue';
import loading from 'components/loading/index';
import toast from 'components/toast/index';
import dialog from 'components/dialog/index';
import { changeLanguage, i18n, translate } from '../i18n';
import router from './router';
import Desktop from './Desktop.vue';
import registerComponents from './register-components';
import Http from '../http';

import { formatSpeed, formatNetworkData, formatBandWidth } from '../util/util';
import store from './store';

const launch = () => {
  const http = new Http();

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
      if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
      } else if (count !== total && count % 5 === 0) {
        http
          .getRouter()
          .then(() => {
            clearInterval(timer);
            opt.onsuccess();
          })
          .catch(() => {
            // nothing to do
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
          title: `${translate('trans0212')}`,
          template: `<div class="upgrade-tip">${translate('trans0213')}</span>`
        });
        const opt = {
          ...{
            onsuccess: () => {},
            ontimeout: () => {},
            onprogress: () => {},
            timeout: 600
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
            loading.close();
            opt.ontimeout();
          },
          timeout: opt.timeout
        });
      }
    };
  };
  const upgrade = upgradeService();

  http.setExHandler(err => {
    const { response } = err;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        if (!window.location.href.includes('login')) {
          window.location.href = '/';
        }
      } else if (status === 400 && data.error.code === 600007) {
        upgrade();
        return;
      } else {
        const { error } = data;
        if (error && error.code) {
          toast(translate(error.code));
        } else {
          router.push({ path: '/unconnect' });
        }
      }
      throw data;
    }
    throw err;
  });

  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = changeLanguage;
  Vue.prototype.$reconnect = reconnect;
  Vue.prototype.$upgrade = upgrade;
  Vue.prototype.formatNetworkData = formatNetworkData;
  Vue.prototype.formatSpeed = formatSpeed;
  Vue.prototype.formatBandWidth = formatBandWidth;

  registerComponents(Vue);

  new Vue({
    el: '#web',
    i18n,
    router,
    store,
    render: h => h(Desktop)
  });
};
document.addEventListener('DOMContentLoaded', launch);
