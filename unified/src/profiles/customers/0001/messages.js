import buildMessages from '../build-messages';
import codeMap from '../../../../../m6s/src/i18n/code-map.json';
import extra from '../../../../../m6s/src/i18n/extra.json';
import bgBG from '../../../../../m6s/src/i18n/0001/bg-BG.json';
import deDE from '../../../../../m6s/src/i18n/0001/de-DE.json';
import enUS from '../../../../../m6s/src/i18n/0001/en-US.json';
import fiFI from '../../../../../m6s/src/i18n/0001/fi-FI.json';
import frFR from '../../../../../m6s/src/i18n/0001/fr-FR.json';
import zhCN from '../../../../../m6s/src/i18n/0001/zh-CN.json';

export default buildMessages({
  'bg-BG': bgBG,
  'de-DE': deDE,
  'en-US': enUS,
  'fi-FI': fiFI,
  'fr-FR': frFR,
  'zh-CN': zhCN,
}, codeMap, extra);
