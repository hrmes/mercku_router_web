const CodeKey = {
  codeMap: 'code-map',
  extra: 'extra'
};
const readFiles = (files, action) => {
  files.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      action(key, matched);
    }
  });
};
const parseCode = (Code, key, Locales) => {
  Object.keys(Code[key]).forEach(code => {
    Object.keys(Locales).forEach(locale => {
      Locales[locale][code] = Locales[locale][Code[key][code]];
    });
  });
  return Locales;
};
class BasicI18n {
  constructor(Vue, VueI18n, intl, transFiles, codeFiles) {
    let Locales = {};
    const NumberFormats = {};
    const defaultKey = 'decimal';
    const Code = {
      [CodeKey.codeMap]: null,
      [CodeKey.extra]: null
    };
    readFiles(transFiles, (key, matched) => {
      const locale = matched[1];
      NumberFormats[locale] = {
        [defaultKey]: {
          style: 'decimal'
        }
      };
      const source = transFiles(key);
      Locales[locale] = source;
    });
    readFiles(codeFiles, (key, matched) => {
      const keyParsed = matched[1];
      const source = codeFiles(key);
      Code[keyParsed] = source;
    });
    Locales = parseCode(Code, CodeKey.codeMap, Locales);
    Locales = parseCode(Code, CodeKey.extra, Locales);
    Vue.use(VueI18n);
    this.i18n = new VueI18n({
      locale:
        localStorage.getItem('lang') ||
        process.env.CUSTOMER_CONFIG.defaultLanguage,
      messages: Locales,
      numberFormats: NumberFormats
    });
    this.intl = intl;
  }

  changeLanguage(lang) {
    if (!Object.keys(this.i18n.messages).includes(lang)) {
      console.log('language not exist!');
    } else {
      localStorage.setItem('lang', lang);
      window.location.reload();
    }
  }

  translate(key, locale) {
    return this.i18n.t(key, locale || this.i18n.locale);
  }

  toLocaleNumber(
    number,
    locale = 'en-US',
    minimumFractionDigits = 1,
    maximumFractionDigits = 1
  ) {
    // 有时候传入是不是数字，是占位符字符串
    if (typeof number === 'number') {
      // 这里是采用浏览器自带的intl对象实现的，某些浏览器会存在兼容性问题，暂时停止使用
      // return i18n.n(number, {
      //   key: defaultKey,
      //   locale,
      //   minimumFractionDigits,
      //   maximumFractionDigits
      // });
      return this.intl.NumberFormat.call(null, locale, {
        minimumFractionDigits,
        maximumFractionDigits
      }).format(number);
    }
    return number;
  }
}

export default BasicI18n;
