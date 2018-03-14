import Vue from 'vue';
import { Button, Field, Icon, Checkbox, Dialog, Cell, CellGroup, Toast } from 'vant';
import { changeLanguage, i18n } from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import http from './http';
import util from './util/util';

Vue.use(Button);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Checkbox);

Vue.prototype.$toast = Toast;

Vue.use(Cell);
Vue.use(CellGroup);

Vue.prototype.$http = http;
Vue.prototype.changeLanguage = changeLanguage;
Vue.prototype.routerConfig = schema;
Vue.prototype.$confirm = Dialog.confirm;
Vue.prototype.webview = (() => {
  debugger;
  const qs = window.location.search.substring(1);
  if (qs && qs.includes('fromapp=1')) {
    return true;
  }
  return false;
})();

console.log(Vue.prototype.webview);

util.adapt(375, 375);

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
});
