class BasicI18n {
  constructor(Vue, VueI18n, files, extra, codeMap) {
    const Locales = {};
    const NumberFormats = {};
    const defaultKey = 'decimal';

    files.keys().forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        NumberFormats[locale] = {
          [defaultKey]: {
            style: 'decimal'
          }
        };
        const source = files(key);
        Locales[locale] = source;
      }
    });
    Object.keys(codeMap).forEach(code => {
      Object.keys(Locales).forEach(locale => {
        Locales[locale][code] = Locales[locale][codeMap[code]];
      });
    });
    Object.keys(extra).forEach(ex => {
      Object.keys(Locales).forEach(locale => {
        Locales[locale][ex] = Locales[locale][extra[ex]];
      });
    });
    Vue.use(VueI18n);
    this.i18n = new VueI18n({
      locale:
        localStorage.getItem('lang') ||
        process.env.CUSTOMER_CONFIG.defaultLanguage,
      messages: Locales,
      numberFormats: NumberFormats
    });
  }

  changeLanguage(i18n) {
    return lang => {
      if (!Object.keys(i18n.messages).includes(lang)) {
        console.log('language not exist!');
      } else {
        localStorage.setItem('lang', lang);
        window.location.reload();
      }
    };
  }

  translate(i18n) {
    return (key, locale) => i18n.t(key, locale || i18n.locale);
  }

  toLocaleNumber(intl) {
    return (
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
  }
}

export default BasicI18n;
