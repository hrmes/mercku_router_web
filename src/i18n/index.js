import Vue from 'vue';
import VueI18n from 'vue-i18n';

import extra from './extra.json';
import codeMap from './code-map.json';

Vue.use(VueI18n);

let zhCN;
let enUS;

if (process.env.CUSTOMER_CONFIG.isMercku || process.env.CUSTOMER_CONFIG.isInternal) {
  zhCN = require('./zh-CN.json');
  enUS = require('./en-US.json');
} else if (process.env.CUSTOMER_CONFIG.isCik) {
  zhCN = require('./cik-zh-CN.json');
  enUS = require('./cik-en-US.json');
}

Object.keys(codeMap).forEach(code => {
  zhCN[code] = zhCN[codeMap[code]];
  enUS[code] = enUS[codeMap[code]];
});
Object.keys(extra).forEach(ex => {
  zhCN[ex] = zhCN[extra[ex]];
  enUS[ex] = enUS[extra[ex]];
});

export const i18n = new VueI18n({
  locale: localStorage.getItem('lang'),
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
    // i18n.locale = lang;
    localStorage.setItem('lang', lang);
    window.location.reload();
  }
}
export function translate(key, locale) {
  return i18n.t(key, locale || i18n.locale);
}
