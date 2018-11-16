import Vue from 'vue';
import loading from 'components/loading/index';
import upgradeComponent from 'components/upgrade/index';
import toast from 'components/toast/index';
import dialog from 'components/dialog/index';
import mProgress from 'components/progress/index.vue';
import { changeLanguage, i18n, translate } from '../i18n';
import router from './router';
import Desktop from './Desktop.vue';
import registerComponents from './register-components';
import Http from '../http';
import { formatSpeed, formatNetworkData, formatBandWidth } from '../util/util';
import store from './store';

const launch = () => {
  const http = new Http();
  registerComponents(Vue);

  const reconnect = options => {
    const opt = {
      ...{
        onsuccess: () => {},
        ontimeout: () => {},
        onprogress: () => {},
        timeout: 60,
        showLoading: true
      },
      ...options
    };
    let loadingInstance;
    if (opt.showLoading) {
      loadingInstance = new(Vue.extend(mProgress))({
        propsData: {
          label: translate('trans0315')
        }
      }).$mount();
      document.body.appendChild(loadingInstance.$el);
    }
    let count = opt.timeout; // 60s重试时间
    const total = opt.timeout;
    const timer = setInterval(() => {
      count -= 1;
      const percent = ((total - count) / total).toFixed(2);
      opt.onprogress(percent);
      if (count === 0) {
        clearInterval(timer);
        opt.ontimeout();
        loadingInstance &&
          loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
      } else if (count !== total && count % 5 === 0) {
        http.getRouter().then(() => {
          clearInterval(timer);
          opt.onsuccess();
          loadingInstance &&
            loadingInstance.$el.parentNode.removeChild(loadingInstance.$el);
        });
      }
    }, 1000);
  };

  const upgrade = options => {
    upgradeComponent.open({
      title: translate('trans0212'),
      tip: translate('trans0213')
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
        upgradeComponent.close();
        opt.onsuccess();
      },
      ontimeout: () => {
        upgradeComponent.close();
        opt.ontimeout();
      },
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
      } else if (status === 400 && data.error.code === 600007) {
        upgrade();
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

  Vue.directive('clickoutside', {
    bind(el, binding) {
      function documentHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }
        if (binding.expression) {
          binding.value(e);
        }
        return false;
      }
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    unbind(el) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    }
  });
  new Vue({
    el: '#web',
    i18n,
    router,
    store,
    render: h => h(Desktop)
  });
};

document.addEventListener('DOMContentLoaded', launch);

if (process.env.CUSTOMER_ID === '0000') {
  console.log('MERCKU!');
} else {
  console.log('CIK!');
}
