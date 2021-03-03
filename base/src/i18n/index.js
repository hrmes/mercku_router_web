import Vue from 'vue';
import VueI18n from 'vue-i18n';

import intl from 'intl';

class BasicI18n {
  constructor(context) {
    this.context = context;
    this.locales = {};
    this.numberFormats = {};
    this._buildLocales();
    Vue.use(VueI18n);
    this.i18n = new VueI18n({
      locale:
        localStorage.getItem('lang') ||
        process.env.CUSTOMER_CONFIG.defaultLanguage,
      messages: this.locales,
      numberFormats: this.numberFormats
    });
    this.intl = intl;
  }

  _buildLocales() {
    // 自定义文件列表
    const customFileNames = ['code-map', 'extra'];

    this.context.keys().forEach(key => {
      // 特定客户语言包
      if (key.startsWith(`./${process.env.CUSTOMER_CONFIG.id}`)) {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
          const locale = matched[1];
          this.numberFormats[locale] = {
            decimal: {
              style: 'decimal'
            }
          };
          this.locales[locale] = this.context(key);
        }
      }
    });
    // 自定义文件处理
    customFileNames.forEach(cfn => {
      const fileKey = this.context.keys().find(key => key.includes(cfn));
      if (fileKey) {
        const file = this.context(fileKey);
        Object.keys(file).forEach(code => {
          Object.keys(this.locales).forEach(locale => {
            this.locales[locale][code] = this.locales[locale][file[code]];
          });
        });
      }
    });

    console.log(this.locales);
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
