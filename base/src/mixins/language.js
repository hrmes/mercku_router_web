const Languages = [
  {
    text: 'English',
    value: 'en-US',
    show: false
  },
  {
    text: '简体中文',
    value: 'zh-CN',
    show: false
  },
  {
    text: 'Deutsch',
    value: 'de-DE',
    show: false
  },
  {
    text: 'Nederlands',
    value: 'nl-NL',
    show: false
  },
  {
    text: 'Srpski',
    value: 'sr-RS',
    show: false
  },
  {
    text: 'Norsk bokmål',
    value: 'nb-NO',
    show: false
  },
  {
    text: 'Français',
    value: 'fr-FR',
    show: false
  },
  {
    text: 'Español',
    value: 'es-ES',
    show: false
  },
  {
    text: 'Svenska',
    value: 'sv-SE',
    show: false
  },
  {
    text: 'Suomi',
    value: 'fi-FI',
    show: false
  },
  {
    text: 'български',
    value: 'bg-BG',
    show: false
  }
];
const supportLanguage = process.env.CUSTOMER_CONFIG.languages;
if (!supportLanguage) {
  // 早期没有在customer config中定义language，兼容处理
  Languages.forEach(l => {
    l.show = true;
  });
} else {
  supportLanguage.forEach(sl => {
    const language = Languages.filter(l => l.value === sl)[0];
    if (language) {
      language.show = true;
    }
  });
}

export default {
  data() {
    return {
      Languages: Languages.filter(l => l.show),
      showPopup: false,
      qrVisiable: false
    };
  },
  computed: {
    language() {
      return this.getDefaultLanguage();
    }
  },
  methods: {
    getDefaultLanguage() {
      const language = this.Languages.filter(
        l => l.value === this.$i18n.locale
      )[0];
      if (!language) {
        return this.Languages[0];
      }
      return language;
    },
    setLangPopupVisible(visible) {
      this.showPopup = visible;
    },
    setMobileLangVisible() {
      this.mobileI18nVisible = !this.mobileI18nVisible;
      this.mobileNavVisible = false;
    },
    selectLang(lang) {
      this.changeLanguage(lang.value);
      this.showPopup = false;
    },
    selectMobileLang(lang) {
      this.changeLanguage(lang.value);
      this.mobileI18nVisible = false;
    },
    changeLang() {
      const zh = 'zh-CN';
      const en = 'en-US';
      this.changeLanguage(this.$i18n.locale === en ? zh : en);
    }
  }
};
