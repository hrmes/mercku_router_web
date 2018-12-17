<template>
  <header class="header-container">
    <div class="logo-container">
    </div>
    <div class="right-container">
      <div class="lang-selector">
        <div class="current" @click.stop="showLangPopup()">
          <span class="current-text">{{language.text}}</span>
          <span class="drop-trangle" :class="{'down':!showPopup,'up':showPopup}"></span>
        </div>
        <transition name="popup">
          <ul class="popup" v-show="showPopup">
            <li :key="lang.value" :class="{'current-lang':lang===language}" v-for="lang in Languages" @click="selectLang(lang)">{{lang.text}}</li>
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
      document.body.addEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.attachEvent('click', this.close);
    }
  },
  computed: {
    language() {
      return this.getDefaultLanguage();
    }
  },
  methods: {
    close() {
      this.showPopup = false;
    },
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
            this.$http.loginout().then(() => {
              this.$router.replace({ path: '/login' });
            });
          }
        }
      });
    }
  },
  beforeDestroy() {
    if (window.addEventListener) {
      document.body.removeEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.detachEvent('click', this.close);
    }
  }
};
</script>
<style lang="scss" scoped>
.header-container {
  height: 92px;
  align-items: center;
  justify-content: flex-end;
  padding: 0 50px;
  display: flex;
  .logo-container {
    display: none;
    width: 209px;
    height: 32px;
  }
  .right-container {
    .small-device {
      display: none;
    }
    .lang-selector {
      display: inline-block;
      cursor: pointer;
      position: relative;
      .current-text {
        display: inline-block;
        width: 70px;
        text-align: center;
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
        background: #fff;
        right: 0;
        margin-top: 10px;
        padding: 0 10px;
        border-radius: 2px;
        z-index: 999;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
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
            color: #d6001c;
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
    height: 65px;
    position: relative;
    display: none;
    .logo-container {
      display: block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 131px;
      height: 20px;
    }
    .right-container {
      .lang-selector {
        display: none;
      }
      .small-device {
        display: block;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        .menu-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
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
