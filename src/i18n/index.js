import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
});

// export default {
//   ,
//   i18n
// };
export function changeLanguage(lang) {
  if (!Object.keys(i18n.messages).includes(lang)) {
    console.log('language not exist!');
  } else {
    // change language
    i18n.locale = lang;
  }
}
