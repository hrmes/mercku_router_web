const SAFE_DEFAULTS = Object.freeze({
  productName: 'Router',
  website: Object.freeze({ text: '', url: '' }),
  policyUrl: '',
  appDownloadUrl: '',
  languages: Object.freeze(['en-US']),
  defaultLanguage: 'en-US',
  logoUrl: '',
  darkLogoUrl: '',
  loginLogoUrl: '',
  darkLoginLogoUrl: '',
  qrCodeUrl: '',
  appIconUrl: '',
  legacyAssetFolder: '',
});

function asObject(value) {
  if (typeof value === 'string') {
    try {
      return asObject(JSON.parse(value));
    } catch (error) {
      return {};
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value;
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asLanguages(value) {
  if (!Array.isArray(value)) return [...SAFE_DEFAULTS.languages];
  const languages = value.filter(language => typeof language === 'string' && language);
  return languages.length ? languages : [...SAFE_DEFAULTS.languages];
}

function normalizeRuntimeBranding(branding) {
  const website = asObject(branding.website);
  const languages = asLanguages(branding.languages);

  return {
    productName: asString(branding.productName, SAFE_DEFAULTS.productName),
    website: {
      text: asString(website.text),
      url: asString(website.url),
    },
    policyUrl: asString(branding.policyUrl),
    appDownloadUrl: asString(branding.appDownloadUrl),
    languages,
    defaultLanguage: asString(branding.defaultLanguage, languages[0]),
    logoUrl: asString(branding.logoUrl),
    darkLogoUrl: asString(branding.darkLogoUrl),
    loginLogoUrl: asString(branding.loginLogoUrl),
    darkLoginLogoUrl: asString(branding.darkLoginLogoUrl),
    qrCodeUrl: asString(branding.qrCodeUrl),
    appIconUrl: asString(branding.appIconUrl),
    legacyAssetFolder: '',
  };
}

function normalizeLegacyBranding(config) {
  const website = asObject(config.website);
  const languages = asLanguages(config.languages);

  return {
    productName: asString(config.title, SAFE_DEFAULTS.productName),
    website: {
      text: asString(website.text),
      url: asString(website.url),
    },
    policyUrl: asString(config.policy),
    appDownloadUrl: asString(config.appDownloadUrl),
    languages,
    defaultLanguage: asString(config.defaultLanguage, languages[0]),
    logoUrl: '',
    qrCodeUrl: '',
    appIconUrl: '',
    legacyAssetFolder: asString(config.title).toLowerCase(),
  };
}

export function resolveUiBranding(store, legacyConfig = process.env.CUSTOMER_CONFIG) {
  const getters = asObject(store && store.getters);
  const runtimeBranding = asObject(getters.branding);
  if (Object.keys(runtimeBranding).length) return normalizeRuntimeBranding(runtimeBranding);

  return normalizeLegacyBranding(asObject(legacyConfig));
}

export function resolveSupportedLanguages(store, availableLanguages) {
  const available = Array.isArray(availableLanguages) ? availableLanguages : [];
  const getters = asObject(store && store.getters);
  const runtimeBranding = asObject(getters.branding);

  if (Object.keys(runtimeBranding).length) {
    const requested = new Set(resolveUiBranding(store).languages);
    const supported = available.filter(language => requested.has(language.value));
    return supported.length ? supported : available.filter(language => language.value === 'en-US');
  }

  const legacyConfig = asObject(process.env.CUSTOMER_CONFIG);
  if (!Array.isArray(legacyConfig.languages)) return [...available];

  const requested = new Set(legacyConfig.languages);
  const supported = available.filter(language => requested.has(language.value));
  return supported.length ? supported : available.filter(language => language.value === 'en-US');
}

export default resolveUiBranding;
