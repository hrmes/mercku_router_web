import { resolveSupportedLanguages } from 'base/runtime/ui-context';

const Languages = Object.freeze([
  {
    text: 'English',
    value: 'en-US'
  },
  {
    text: '简体中文',
    value: 'zh-CN'
  },
  {
    text: 'Deutsch',
    value: 'de-DE'
  },
  {
    text: 'Nederlands',
    value: 'nl-NL'
  },
  {
    text: 'Srpski',
    value: 'sr-RS'
  },
  {
    text: 'Norsk bokmål',
    value: 'nb-NO'
  },
  {
    text: 'Français',
    value: 'fr-FR'
  },
  {
    text: 'Español',
    value: 'es-ES'
  },
  {
    text: 'Svenska',
    value: 'sv-SE'
  },
  {
    text: 'Suomi',
    value: 'fi-FI'
  },
  {
    text: 'български',
    value: 'bg-BG'
  }
].map(language => Object.freeze(language)));

export default {
  data() {
    return {
      showPopup: false,
      qrVisiable: false
    };
  },
  computed: {
    Languages() {
      return resolveSupportedLanguages(this.$store, Languages);
    },
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
