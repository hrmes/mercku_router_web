/** Compatibility bridge for reused legacy modules importing `@/i18n`. */
let currentI18n = null;

export function setCurrentI18n(i18n) {
  currentI18n = i18n;
}

function requireI18n() {
  if (!currentI18n) throw new Error('unified i18n bridge used before createApp');
  return currentI18n;
}

export default {
  translate(...args) {
    return requireI18n().translate(...args);
  },
  toLocaleNumber(...args) {
    return requireI18n().toLocaleNumber(...args);
  },
  changeLanguage(...args) {
    return requireI18n().changeLanguage(...args);
  },
};
