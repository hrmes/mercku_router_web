import Vue from 'vue';
import loading from 'components/loading/index';
import upgradeComponent from 'components/upgrade/index';
import toast from 'components/toast/toast';
import dialog from 'components/dialog/index';
import mProgress from 'components/progress/progress.vue';
import { formatSpeed, formatNetworkData, formatBandWidth } from 'util/util';
import upgradeHelper from 'util/upgrade';
import { changeLanguage, i18n, translate } from './i18n';
import router from './router';
import App from './App.vue';
import registerComponents from './register-components';
import Http from './http';
import store from './store';

// 样式表
if (process.env.CUSTOMER_CONFIG.isCik) {
  require('style/cik.scss');
} else if (process.env.CUSTOMER_CONFIG.isMercku) {
  require('style/mercku.scss');
} else {
  // TODO
}

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

  http.setExHandler(err => {
    const { response } = err;
    if (response) {
      const { status, data } = response;
      if (status === 401) {
        if (!window.location.href.includes('login')) {
          window.location.href = '/';
        }
      } else if (status === 400 && (data.error.code === 600007 || data.error.code === 600402)) {
        !upgrading && upgrade();
        throw err;
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

  new Vue({
    el: '#web',
    i18n,
    router,
    store,
    render: h => h(App)
  });
};

launch();
