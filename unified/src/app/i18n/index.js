/**
 * Profile-driven i18n.
 *
 * Locale + message selection is driven by the composed AppRuntimeContext
 * (`branding.languages`, `branding.defaultLanguage`) instead of
 * `process.env.CUSTOMER_CONFIG`. The constructor receives the runtime
 * context explicitly so the module does not read compile-time globals.
 *
 * v1 (Task 7 sample link) ships with an EMPTY message catalogue. The
 * sample pages (`login`, `dashboard`, `wlan`, `mode`, `unconnect`) call
 * `this.$t('transNNNN')` for translation keys; VueI18n 8.x returns the
 * key verbatim when no message is registered, so the build is valid and
 * the runtime renders the key. Loading real locale JSON (code-map, extra,
 * per-customer `*.json`) is deferred until Task 9 — see
 * `docs/superpowers/plans/2026-07-21-model-unification-b-v4.md` §5.
 *
 * The methods mirror the legacy `BasicI18n` surface so legacy page
 * components (`this.$t`, `this.changeLanguage`, `toLocaleNumber`) work
 * unchanged.
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { NumberFormat } from 'intl';

Vue.use(VueI18n);

function readStoredLang() {
  try {
    return localStorage.getItem('lang') || null;
  } catch (err) {
    return null;
  }
}

function writeStoredLang(lang) {
  try {
    localStorage.setItem('lang', lang);
  } catch (err) {
    // Ignore — persistence is best-effort.
  }
}

export class UnifiedI18n {
  constructor(runtimeContext) {
    if (!runtimeContext || !runtimeContext.branding) {
      throw new TypeError('UnifiedI18n: runtimeContext.branding is required');
    }
    const branding = runtimeContext.branding;
    const languages = Array.isArray(branding.languages) ? branding.languages : [];
    const defaultLanguage = branding.defaultLanguage
      || (languages.length > 0 ? languages[0] : 'en-US');
    const stored = readStoredLang();
    const initialLocale = (stored && languages.includes(stored)) ? stored : defaultLanguage;

    const messages = {};
    languages.forEach((lang) => { messages[lang] = {}; });

    this._languages = languages.slice();
    this._defaultLanguage = defaultLanguage;
    this.i18n = new VueI18n({
      locale: initialLocale,
      fallbackLocale: defaultLanguage,
      messages,
    });
  }

  changeLanguage(lang) {
    if (!this._languages.includes(lang)) {
      // eslint-disable-next-line no-console
      console.warn(`changeLanguage: "${lang}" is not in branding.languages`);
      return;
    }
    writeStoredLang(lang);
    // Legacy semantics: a language change reloads the page so all components
    // re-render against the new messages.
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      window.location.reload();
    }
  }

  translate(key, locale) {
    return this.i18n.t(key, locale || this.i18n.locale);
  }

  toLocaleNumber(number, locale, minimumFractionDigits = 1, maximumFractionDigits = 1) {
    if (typeof number !== 'number') return number;
    const loc = locale || this.i18n.locale || 'en-US';
    return NumberFormat.call(null, loc, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(number);
  }
}

export function createI18n(runtimeContext) {
  return new UnifiedI18n(runtimeContext);
}

export default UnifiedI18n;
