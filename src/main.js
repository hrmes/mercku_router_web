import Vue from 'vue';
import VueI18n from 'vue-i18n';
import languages from './i18n';
import App from './App.vue';
import router from './router';
import schema from './schema';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: languages
});

Vue.prototype.changeLanguage = function changeLanguage(lang) {
  if (!Object.keys(languages).includes(lang)) {
    console.log('language not exist!');
  } else {
    // change language
    console.log(this.$i18n, this);
    this.$i18n.locale = lang;
  }
};

Vue.prototype.routerConfig = schema;

new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
});
