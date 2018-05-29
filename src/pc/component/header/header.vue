<template>
  <header class="header-container">
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
      <div v-show="!isLoginPage" class="exit" @click="exit()">
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
  data() {
    return {
      language: Languages[0],
      showPopup: false,
      Languages
    };
  },
  mounted() {
    this.changeLanguage(this.language.value);
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
  methods: {
    showLangPopup() {
      this.showPopup = !this.showPopup;
    },
    selectLang(lang) {
      this.language = lang;
      this.changeLanguage(lang.value);
      this.showPopup = false;
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
  },
  computed: {
    isLoginPage() {
      return this.$route.path.includes('login');
    }
  }
};
</script>
<style lang="scss" scoped>
.header-container {
  padding: 20px 50px;
  height: 60px;
  .logo {
    float: left;
  }
  .right-container {
    float: right;
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
        &.up {
          background: url(../../assets/images/ic_pack_up.png) no-repeat center;
        }
        &.down {
          background: url(../../assets/images/ic_pull_down.png) no-repeat center;
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
</style>
