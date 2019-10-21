import Vue from 'vue';
import loading from 'components/loading/index';
import upgradeComponent from 'components/upgrade/index';
import toast from 'components/toast/index';
import dialog from 'components/dialog/index';
import mProgress from 'components/progress/index.vue';
import { formatSpeed, formatNetworkData, formatBandWidth } from 'util/util';
import upgradeHelper from 'util/upgrade';
import { changeLanguage, i18n, translate } from './i18n';
import router from './router';
import App from './App.vue';
import registerComponents from './register-components';
import Http from './http';
import store from './store';

// 不同客户特别的样式表
require(`./style/${process.env.CUSTOMER_CONFIG.style}`);

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
        showLoading: true
      },
      ...options
    };
    let loadingInstance;
    if (opt.showLoading) {
      loadingInstance = new (Vue.extend(mProgress))({
        propsData: {
          label: translate('trans0315'),
          during: opt.timeout
        }
      }).$mount();
      document.body.appendChild(loadingInstance.$el);
    }
    let count = opt.timeout; // 60s重试时间
    const total = opt.timeout;
    let responsed = true;
    const timer = setInterval(() => {
      count -= 1;
      const percent = ((total - count) / total).toFixed(2);
      opt.onprogress(percent);
      if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
        opt.onfinally();
        loadingInstance && loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
        loadingInstance = null;
      } else if (count !== total && count % 5 === 0) {
        if (responsed) {
          responsed = false;
          http
            .getRouter()
            .then(() => {
              responsed = true;
              clearInterval(timer);
              opt.onsuccess();
              opt.onfinally();
              loadingInstance && loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
              loadingInstance = null;
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
      title: translate('trans0212'),
      tip: translate('trans0213')
    });
    const opt = {
      ...{
        onsuccess: () => {},
        ontimeout: () => {},
        onprogress: () => {},
        onfinally: () => {
          http.getHomePage().then(res => {
            upgradeHelper(res.data);
          });
        },
        timeout: 600
      },
      ...options
    };
    reconnect({
      onsuccess: () => {
        upgrading = false;
        upgradeComponent.close();
        opt.onsuccess();
      },
      ontimeout: () => {
        upgrading = false;
        upgradeComponent.close();
        opt.ontimeout();
      },
      onfinally: opt.onfinally,
      timeout: opt.timeout,
      showLoading: false
    });
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
                okText: translate('trans0024'),
                message: translate('trans0583'),
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
          !options.hideToast && toast(translate(error.code));
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

  new Vue({
    el: '#web',
    i18n,
    router,
    store,
    render: h => h(App)
  });
};

launch();
