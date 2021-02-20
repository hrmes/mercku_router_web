export const defaultKey = 'decimal';

export const i18nBuilder = (VueI18n, locales, numberFormats) =>
  new VueI18n({
    locale:
      localStorage.getItem('lang') ||
      process.env.CUSTOMER_CONFIG.defaultLanguage,
    messages: locales,
    numberFormats
  });
export const changeLanguageBuilder = i18n => lang => {
  if (!Object.keys(i18n.messages).includes(lang)) {
    console.log('language not exist!');
  } else {
    localStorage.setItem('lang', lang);
    window.location.reload();
  }
};
export const translateBuilder = i18n => (key, locale) =>
  i18n.t(key, locale || i18n.locale);

export const toLocaleNumberBuilder = intl => (
  number,
  locale = 'en-US',
  minimumFractionDigits = 1,
  maximumFractionDigits = 1
) => {
  // 有时候传入是不是数字，是占位符字符串
  if (typeof number === 'number') {
    // 这里是采用浏览器自带的intl对象实现的，某些浏览器会存在兼容性问题，暂时停止使用
    // return i18n.n(number, {
    //   key: defaultKey,
    //   locale,
    //   minimumFractionDigits,
    //   maximumFractionDigits
    // });
    return intl.NumberFormat.call(null, locale, {
      minimumFractionDigits,
      maximumFractionDigits
    }).format(number);
  }
  return number;
};
