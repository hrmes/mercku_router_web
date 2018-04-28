import Vue from 'vue';
import 'babel-polyfill';
import { Button, Field, Icon, Checkbox, Dialog, Cell, CellGroup, Toast } from 'vant';
import FastClick from 'fastclick';
import { changeLanguage, i18n } from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import { http, configResponseInterceptors, configRequestInterceptors } from './http';
import util from './util/util';
import nav from './component/nav-bar.vue';

Vue.use(Button);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.component('nav-bar', nav);

// debugger;
// Toast.setDefaultOptions({
//   duration: 5000
// });
Vue.prototype.$toast = Toast;

Vue.use(Cell);
Vue.use(CellGroup);
const loader = {
  open: false,
  instance: null
};
const launch = () => {
  FastClick.attach(document.body);
  const NO_LOADING_METHODS = ['router.check_login', 'router.is_wan_connected'];
  configRequestInterceptors(
    config => {
      const conf = config;
      conf.timeout = 20000; // add timeout
      // 添加不显示loading的例外
      if (!NO_LOADING_METHODS.includes(conf.data.method)) {
        loader.instance = Toast.loading({
          mask: true,
          message: '',
          duration: 0,
          forbidClick: true
        });
        loader.open = true;
      }
      return conf;
    },
    error => {
      if (loader.open) {
        loader.instance.clear();
      }
      return Promise.reject(error);
    }
  );
  configResponseInterceptors(
    res => {
      if (loader.open) {
        loader.instance.clear();
      }
      return res;
    },
    error => {
      if (loader.open) {
        loader.instance.clear();
      }
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
  Vue.prototype.changeLanguage = changeLanguage;
  Vue.prototype.routerConfig = schema;
  Vue.prototype.$confirm = Dialog.confirm;
  // get querystring
  const qs = window.location.search.substring(1);
  // set language
  changeLanguage(qs.includes('lang=zh') ? 'zh-CN' : 'en-US');
  Vue.prototype.webview = (() => {
    // use indexOf instead includes
    if (qs && qs.includes('fromapp=1')) {
      return true;
    }
    return false;
  })();
  util.adapt(375, 375);

  new Vue({
    el: '#app',
    i18n,
    router,
    render: h => h(App)
  });
};
document.addEventListener('DOMContentLoaded', () => {
  launch();
});
