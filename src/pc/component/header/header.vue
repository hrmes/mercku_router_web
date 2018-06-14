<template>
  <header class="header-container">
    <div class="logo-container">
      <img src="../../assets/images/MERCKU_LOGO_web_top.png" alt="">
    </div>
    <div class="right-container">
      <div class="lang-selector">
        <div class="current" @click.stop="showLangPopup()">
          <span class="current-text">{{language.text}}</span>
          <span class="drop-trangle" :class="{'down':!showPopup,'up':showPopup}"></span>
        </div>
        <transition name="popup">
          <ul class="popup" v-show="showPopup">
            <li :class="{'current-lang':lang===language}" v-for="lang in Languages" @click="selectLang(lang)">{{lang.text}}</li>
          </ul>
        </transition>
      </div>
      <div class="small-device">
        <span @click="changeLang()" class="menu-icon language" :class="[$i18n.locale]"></span>
      </div>
      <div v-show="hasExit" class="exit" @click="exit()">
        {{$t('trans0021')}}
      </div>
    </div>
  </header>
</template>
<script>
const Languages = [
  {
    text: '简体中文',
    value: 'zh-CN'
  },
  {
    text: 'English',
    value: 'en-US'
  }
];
export default {
  props: {
    hasExit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPopup: false,
      Languages
    };
  },
  mounted() {
    this.$i18n.locale = this.language.value;
    // this.changeLanguage();
    if (window.addEventListener) {
      document.body.addEventListener('click', () => {
        this.showPopup = false;
      });
    } else if (window.attachEvent) {
      document.body.attachEvent('click', () => {
        this.showPopup = false;
      });
    }
  },
  computed: {
    language() {
      return this.getDefaultLanguage();
    }
  },
  methods: {
    getDefaultLanguage() {
      return Languages.filter(l => l.value === this.$i18n.locale)[0];
    },
    showLangPopup() {
      this.showPopup = !this.showPopup;
    },
    selectLang(lang) {
      this.changeLanguage(lang.value);
      this.showPopup = false;
    },
    changeLang() {
      const zh = 'zh-CN';
      const en = 'en-US';
      this.changeLanguage(this.$i18n.locale === en ? zh : en);
    },
    exit() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0323'),
        callback: {
          ok: () => {
            this.$router.replace({ path: '/login' });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.header-container {
  padding: 20px 50px;
  height: 65px;
  .logo-container {
    display: none;
  }
  .logo {
    float: left;
  }
  .right-container {
    float: right;
    .small-device {
      display: none;
    }
    .lang-selector {
      display: inline-block;
      cursor: pointer;
      position: relative;
      .current-text {
        display: inline-block;
        width: 80px;
        height: 21px;
      }
      .drop-trangle {
        display: inline-block;
        width: 10px;
        height: 6px;
        position: relative;
        top: -3px;
        background: url(../../assets/images/ic_pull_down.png) no-repeat center;
        background-size: 100%;
        transition: transform 0.3s linear;
        &.up {
          transform: rotate(180deg);
        }
        &.down {
          transform: rotate(0);
        }
      }
      .popup {
        position: absolute;
        width: 150px;
        border: 1px solid #b6b6b6;
        background: #fff;
        right: 0;
        margin-top: 10px;
        padding: 0 10px;
        border-radius: 2px;
        z-index: 999;
        opacity: 1;
        &.popup-enter-active {
          transition: opacity 0.2s ease-in;
        }
        &.popup-enter {
          opacity: 0;
        }
        &.popup-leave-active {
          transition: opacity 0.2s ease-out;
          opacity: 0;
        }
        li {
          list-style: none;
          line-height: 49px;
          &:last-child {
            margin-bottom: 0;
          }
          &.current-lang {
            color: #4237dd;
          }
        }
      }
    }
    .exit {
      display: inline-block;
      cursor: pointer;
      margin-left: 50px;
    }
  }
}
@media screen and (max-width: 768px) {
  .header-container {
    padding: 20px;
    .logo-container {
      display: block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .right-container {
      .lang-selector {
        display: none;
      }
      .small-device {
        display: inline-block;
        .menu-icon {
          display: inline-block;
          width: 21px;
          height: 21px;
          &.language {
            &.zh-CN {
              background: url(../../assets/images/ic_language_exchange_02.png)
                no-repeat center;
              background-size: 100%;
            }
            &.en-US {
              background: url(../../assets/images/ic_language_exchange_01.png)
                no-repeat center;
              background-size: 100%;
            }
          }
          &.menu {
            width: 24px;
            margin-left: 40px;
            background: url(../../assets/images/ic_top_bar_pull_down.png)
              no-repeat center;
            background-size: 100%;
          }
        }
      }
    }
  }
}
</style>
