import Vue from 'vue';
import { Button, Field, Icon, Checkbox, Dialog, Cell, CellGroup } from 'vant';
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
Vue.use(Cell);
Vue.use(CellGroup);
Vue.prototype.$http = http;
Vue.prototype.changeLanguage = changeLanguage;
Vue.prototype.routerConfig = schema;
Vue.prototype.$confirm = Dialog.confirm;

util.adapt(375, 100);

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
});
