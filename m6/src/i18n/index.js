import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/de-DE';
import 'intl/locale-data/jsonp/nl-NL';
import 'intl/locale-data/jsonp/sr';
import 'intl/locale-data/jsonp/nb-NO';
import 'intl/locale-data/jsonp/fr-FR';
import 'intl/locale-data/jsonp/es-ES';
import 'intl/locale-data/jsonp/sv-SE';

import BasicI18n from 'base/i18n';

import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n);

const context = require.context('./', true, /.*\.json/);

export default new BasicI18n(context);
