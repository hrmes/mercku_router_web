import Vue from 'vue';
import { changeLanguage, i18n } from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';
import http from './http';

Vue.prototype.$http = http;

Vue.prototype.changeLanguage = changeLanguage;

Vue.prototype.routerConfig = schema;

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
});
