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

const context = require.context('./', true, /.*\.json/);

const i18nInstance = new BasicI18n(Vue, VueI18n, intl, context);
const { i18n } = i18nInstance;
const changeLanguage = (...args) => i18nInstance.changeLanguage(...args);
const translate = (...args) => i18nInstance.translate(...args);
const toLocaleNumber = (...args) => i18nInstance.toLocaleNumber(...args);
export { i18n, changeLanguage, translate, toLocaleNumber };
