import Vue from 'vue';
import { Button, Field, Icon, Checkbox, Dialog, Cell, CellGroup, Toast } from 'vant';
import { changeLanguage, i18n, translate } from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import { http, configResponseInterceptors } from './http';
import util from './util/util';
import nav from './component/nav-bar.vue';

Vue.use(Button);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Checkbox);
Vue.component('nav-bar', nav);

Vue.prototype.$toast = Toast;

Vue.use(Cell);
Vue.use(CellGroup);

configResponseInterceptors(
  res => res,
  error => {
    // test translate
    // console.log(translate('trans0001'));
    // Do something with response error
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
Vue.prototype.webview = (() => {
  const qs = window.location.search.substring(1);
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
