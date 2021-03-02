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

const transFiles = require.context(
  `./${process.env.CUSTOMER_CONFIG.id}`,
  false,
  /.*\.json/
);

const codeFiles = require.context('../i18n', false, /.*\.json/);

const i18nInstance = new BasicI18n(Vue, VueI18n, intl, transFiles, codeFiles);
const { i18n } = i18nInstance;
const changeLanguage = lang => i18nInstance.changeLanguage(lang);
const translate = (key, locale) => i18nInstance.translate(key, locale);
const toLocaleNumber = (
  number,
  locale,
  minimumFractionDigits,
  maximumFractionDigits
) =>
  i18nInstance.toLocaleNumber(
    number,
    locale,
    minimumFractionDigits,
    maximumFractionDigits
  );
export { i18n, changeLanguage, translate, toLocaleNumber };
