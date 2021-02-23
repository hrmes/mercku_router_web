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
import BasicI18n from 'base/i18n';
import extra from './extra.json';
import codeMap from './code-map.json';

const files = require.context(
  `./${process.env.CUSTOMER_CONFIG.id}`,
  false,
  /.*\.json/
);

const i18nInstance = new BasicI18n(Vue, VueI18n, files, extra, codeMap);
const { i18n } = i18nInstance;
const changeLanguage = i18nInstance.changeLanguage(i18n);
const translate = i18nInstance.translate(i18n);
const toLocaleNumber = i18nInstance.toLocaleNumber(intl);
export { i18n, changeLanguage, translate, toLocaleNumber };
