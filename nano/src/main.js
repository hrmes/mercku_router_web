import Vue from 'vue';

import upgradeHelper from 'base/util/upgrade';
import {
  formatSpeed,
  formatNetworkData,
  formatBandWidth
} from 'base/util/util';
import toast from 'base/component/toast/index';
import dialog from 'base/component/dialog/index';
import mProgress from 'base/component/progress/index.vue';
import upgradeComponent from 'base/component/upgrade/index';
import loading from 'base/component/loading/index';
import registerComponents from 'base/register-components';
import store from './store';
import App from './App.vue';
import Http from './http';
import i18nInstance from './i18n';
import router from './router';

require('base/style/common.scss');
require('base/style/theme-mode.scss');
require('@/style/router-model.scss');
// 不同客户特别的样式表
require(`./style/${process.env.CUSTOMER_CONFIG.id}/custom.scss`);

const launch = () => {
  const http = new Http();
  registerComponents(Vue);

  const reconnect = options => {
    const opt = {
      ...{
        onsuccess: () => {},
        ontimeout: () => {},
        onprogress: () => {},
        onfinally: () => {},
        timeout: 60,
        showLoading: true,
        delayTime: 0,
        text: 'trans0315'
      },
      ...options
    };
    let loadingInstance;
    if (opt.showLoading) {
      loadingInstance = new (Vue.extend(mProgress))({
        propsData: {
          label: i18nInstance.translate(opt.text),
          during: opt.timeout
        }
      }).$mount();
      document.body.appendChild(loadingInstance.$el);
    }
    let count = opt.timeout; // 60s重试时间
    let countDelay = opt.delayTime; // 延迟执行时间
    const total = opt.timeout;
    const isDelay = countDelay > 0;
    let responsed = true;
    const timer = setInterval(() => {
      count -= 1;
      if (countDelay > 0) countDelay -= 1;
      const percent = ((total - count) / total).toFixed(2);
      opt.onprogress(percent);
      if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
        opt.onfinally();

        if (loadingInstance) {
          loadingInstance.$destroy();
          loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
          loadingInstance = null;
        }
      } else if (count !== total && count % 5 === 0) {
        if (responsed && countDelay <= 0) {
          // changeMode为false表示切换工作模式失败
          if (isDelay && store.state.changeMode === false) return;
          responsed = false;
          http
            .getRouter(undefined, { isReconnect: true })
            .then(() => {
              responsed = true;
              clearInterval(timer);
              opt.onsuccess();
              opt.onfinally();

              if (loadingInstance) {
                loadingInstance.$destroy();
                loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
                loadingInstance = null;
              }
            })
            .catch(() => {
              responsed = true;
            });
        }
      }
    }, 1000);
  };

  let upgrading = false;
  const upgrade = options => {
    upgrading = true;
    upgradeComponent.open({
      title: i18nInstance.translate('trans0212'),
      tip: i18nInstance.translate('trans0213')
    });
    const opt = {
      ...{
        onsuccess: () => {
          http.getHomePage().then(res => {
            upgradeHelper(res.data, upgrade, upgradeComponent);
          });
        },
        ontimeout: () => {},
        onprogress: () => {},
        onfinally: () => {},
        timeout: 600
      },
      ...options
    };
    setTimeout(() => {
      reconnect({
        onsuccess: opt.onsuccess,
        ontimeout: () => {
          upgrading = false;
          upgradeComponent.close();
          opt.ontimeout();
        },
        onfinally: () => {
          upgrading = false;
        },
        timeout: opt.timeout,
        showLoading: false
      });
    }, 20000);
  };

  let modeNotMatchDialogVisble = false;
  http.setExHandler((err, options) => {
    const { response } = err;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        if (!window.location.href.includes('login')) {
          window.location.href = '/';
        }
      } else {
        const { error } = data;
        if (error) {
          // token过期
          if (error.code === 200103) {
            if (!window.location.href.includes('login')) {
              window.location.href = '/';
            }
          }
          // 升级中
          if (error.code === 600402) {
            !upgrading && upgrade();
            throw err;
          }
          // 工作模式不支持当前操作
          if (error.code === 200202 || error.code === 200203) {
            if (!modeNotMatchDialogVisble) {
              modeNotMatchDialogVisble = true;
              dialog.info({
                okText: i18nInstance.translate('trans0024'),
                message: i18nInstance.translate('trans0583'),
                callback: {
                  ok: () => {
                    modeNotMatchDialogVisble = false;
                    router.push({ path: '/login' });
                  }
                }
              });
            }

            throw err;
          }
          !options?.hideToast && toast(i18nInstance.translate(error.code));
        } else {
          !options?.isReconnect && router.push({ path: '/unconnect' });
        }
      }
      throw data;
    }
    throw err;
  });

  Vue.prototype.loadingColor = process.env.CUSTOMER_CONFIG.loading.color;
  Vue.prototype.$loading = loading;
  Vue.prototype.$toast = toast;
  Vue.prototype.$dialog = dialog;
  Vue.prototype.$http = http;
  Vue.prototype.changeLanguage = i18nInstance.changeLanguage.bind(i18nInstance);
  Vue.prototype.$reconnect = reconnect;
  Vue.prototype.$upgrade = upgrade;

  Vue.prototype.formatNetworkData = value => {
    const result = formatNetworkData(value);
    return {
      value: i18nInstance.toLocaleNumber(
        result.value,
        i18nInstance.i18n.locale
      ),
      unit: result.unit
    };
  };
  Vue.prototype.formatSpeed = value => {
    const result = formatSpeed(value);
    return {
      value: i18nInstance.toLocaleNumber(
        result.value,
        i18nInstance.i18n.locale
      ),
      unit: result.unit
    };
  };
  Vue.prototype.formatBandWidth = value => {
    const result = formatBandWidth(value);
    return {
      value: i18nInstance.toLocaleNumber(
        result.value,
        i18nInstance.i18n.locale
      ),
      unit: result.unit
    };
  };
  new Vue({
    el: '#web',
    i18n: i18nInstance.i18n,
    router,
    store,
    render: h => h(App)
  });
};

launch();
