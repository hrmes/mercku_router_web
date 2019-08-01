import Vue from 'vue';
import VueI18n from 'vue-i18n';

import extra from './extra.json';
import codeMap from './code-map.json';

Vue.use(VueI18n);

const Locales = {
  'zh-CN': {},
  'en-US': {},
  'de-DE': {},
  'nl-NL': {}
};

Object.keys(Locales).forEach(locale => {
  const { langPrefix } = process.env.CUSTOMER_CONFIG;
  const prefix = langPrefix ? `${langPrefix}-` : '';
  Locales[locale] = require(`./${prefix}${locale}.json`);
});

Object.keys(codeMap).forEach(code => {
  Object.keys(Locales).forEach(locale => {
    Locales[locale][code] = Locales[locale][codeMap[code]];
  });
});

Object.keys(extra).forEach(ex => {
  Object.keys(Locales).forEach(locale => {
    Locales[locale][ex] = Locales[locale][extra[ex]];
  });
});

export const i18n = new VueI18n({
  locale: localStorage.getItem('lang'),
  messages: Locales
});
export function changeLanguage(lang) {
  if (!Object.keys(i18n.messages).includes(lang)) {
    console.log('language not exist!');
  } else {
    localStorage.setItem('lang', lang);
    window.location.reload();
  }
}
export function translate(key, locale) {
  return i18n.t(key, locale || i18n.locale);
}
