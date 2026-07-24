import buildMessages from '../build-messages';
import codeMap from '../../../../../m6/src/i18n/code-map.json';
import extra from '../../../../../m6/src/i18n/extra.json';
import enUS from '../../../../../m6/src/i18n/0029/en-US.json';
import svSE from '../../../../../m6/src/i18n/0029/sv-SE.json';

export default buildMessages({
  'en-US': enUS,
  'sv-SE': svSE,
}, codeMap, extra);
