import Vue from 'vue';
import VueI18n from 'vue-i18n';

import extra from './extra.json';
import codeMap from './code-map.json';

Vue.use(VueI18n);

const Locales = {};
const NumberFormats = {};
const defaultKey = 'decimal';

const files = require.context(
  `./${process.env.CUSTOMER_CONFIG.id}`,
  false,
  /.*\.json/
);

files.keys().forEach(key => {
  const matched = key.match(/([A-Za-z0-9-_]+)\./i);
  if (matched && matched.length > 1) {
    const locale = matched[1];
    NumberFormats[locale] = {
      [defaultKey]: {
        style: 'decimal'
      }
    };
    const source = files(key);
    Locales[locale] = source;
  }
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
  locale:
    localStorage.getItem('lang') || process.env.CUSTOMER_CONFIG.defaultLanguage,
  messages: Locales,
  numberFormats: NumberFormats
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

export const toLocaleNumber = (
  number,
  locale = 'en-US',
  minimumFractionDigits = 1,
  maximumFractionDigits = 1
) => {
  // 有时候传入是不是数字，是占位符字符串
  if (typeof number === 'number') {
    return i18n.n(number, {
      key: defaultKey,
      locale,
      minimumFractionDigits,
      maximumFractionDigits
    });
  }
  return number;
};
