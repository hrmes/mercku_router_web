import 'intl/locale-data/jsonp/zh';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/de-DE';
import 'intl/locale-data/jsonp/fr-FR';
import 'intl/locale-data/jsonp/es-ES';

import fs from 'fs';

import BasicI18n from 'base/i18n';
import { fstat } from 'fs-extra';

const baseContext = require.context('./', false, /.*\.json/);
const dftContext = require.context('./dft', false, /.*\.json/);
// var customerContext = null;
// if (fs.existsSync(`./${process.env.CUSTOMER_CONFIG.id}`)) {
//   customerContext = require.context(
//     `./${process.env.CUSTOMER_CONFIG.id}`,
//     false,
//     /.*\.json/
//   );
// }
// try {
//   const ctx = require.context(
//     `./${process.env.CUSTOMER_CONFIG.id}`,
//     false,
//     /.*\.json/
//   );
//   customerContext = ctx;
// } catch (e) {
//   console.error(e);
//   customerContext = null;
// }
// const customerContext = require.context(
//   `./${process.env.CUSTOMER_CONFIG.id}`,
//   false,
//   /.*\.json/
// );

var context = new BasicI18n(baseContext, dftContext);
// if (customerContext) {
//   context = new BasicI18n(baseContext, dftContext, customerContext);
// }

export default context;
