import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/de-DE';
import 'intl/locale-data/jsonp/fr-FR';
import 'intl/locale-data/jsonp/es-ES';

import BasicI18n from 'base/i18n';

const baseContext = require.context('./', false, /.*\.json/);
const customerContext = require.context(
  `./${process.env.CUSTOMER_CONFIG.id}`,
  false,
  /.*\.json/
);

export default new BasicI18n(baseContext, customerContext);
