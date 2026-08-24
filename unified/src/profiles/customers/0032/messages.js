import buildMessages from '../build-messages';
import codeMap from '../../../../../m6a/src/i18n/code-map.json';
import extra from '../../../../../m6a/src/i18n/extra.json';
import bgBG from '../../../../../m6a/src/i18n/0032/bg-BG.json';
import deDE from '../../../../../m6a/src/i18n/0032/de-DE.json';
import enUS from '../../../../../m6a/src/i18n/0032/en-US.json';
import fiFI from '../../../../../m6a/src/i18n/0032/fi-FI.json';
import zhCN from '../../../../../m6a/src/i18n/0032/zh-CN.json';

export default buildMessages({
  'bg-BG': bgBG,
  'de-DE': deDE,
  'en-US': enUS,
  'fi-FI': fiFI,
  'zh-CN': zhCN,
}, codeMap, extra);
