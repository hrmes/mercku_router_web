import Vue from 'vue';
import VueI18n from 'vue-i18n';

import intl from 'intl';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/de-DE';
import 'intl/locale-data/jsonp/nl-NL';
import 'intl/locale-data/jsonp/sr';
import 'intl/locale-data/jsonp/nb-NO';
import 'intl/locale-data/jsonp/fr-FR';
import 'intl/locale-data/jsonp/es-ES';
import {
  defaultKey,
  i18nBuilder,
  changeLanguageBuilder,
  translateBuilder,
  toLocaleNumberBuilder
} from 'base/i18n';
import extra from './extra.json';
import codeMap from './code-map.json';

Vue.use(VueI18n);

const Locales = {};
const NumberFormats = {};
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

const i18n = i18nBuilder(VueI18n, Locales, NumberFormats);
const changeLanguage = changeLanguageBuilder(i18n);
const translate = translateBuilder(i18n);
const toLocaleNumber = toLocaleNumberBuilder(intl);
export { i18n, changeLanguage, translate, toLocaleNumber };
