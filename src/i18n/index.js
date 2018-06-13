import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';
import codeMap from './code-map.json';

Vue.use(VueI18n);

Object.keys(codeMap).forEach(code => {
  zhCN[code] = zhCN[codeMap[code]];
  enUS[code] = enUS[codeMap[code]];
});

export const i18n = new VueI18n({
  locale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
});
export function changeLanguage(lang) {
  if (!Object.keys(i18n.messages).includes(lang)) {
    console.log('language not exist!');
  } else {
    // change language
    i18n.locale = lang;
  }
}
export function translate(key, locale) {
  return i18n.t(key, locale || i18n.locale);
}
