<template>
  <header class="header-container">
    <div class="logo">
      <img src="" alt="">
    </div>
    <div class="right-container">
      <div class="lang-selector">
        <div class="current" @click="showLangPopup()">{{language.text}}</div>
        <ul class="popup" v-show="showPopup">
          <li v-for="lang in Languages" @click="selectLang(lang)">{{lang.text}}</li>
        </ul>
      </div>
      <div v-show="!isLoginPage" class="exit" @click="exit()">
        退出登陆
      </div>
    </div>
  </header>
</template>
<script>
const Languages = [
  {
    text: 'English',
    value: 'en-US'
  },
  {
    text: '简体中文',
    value: 'zh-CN'
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
    // this.language = this.Languages['en-US'];
  },
  methods: {
    showLangPopup() {
      this.showPopup = true;
    },
    selectLang(lang) {
      this.language = lang;
      this.changeLanguage(lang.value);
      this.showPopup = false;
    },
    exit() {
      this.$router.replace({ path: '/login' });
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
  padding: 0 15px;
  height: 80px;
  .logo {
    float: left;
  }
  .right-container {
    float: right;
    .lang-selector {
      display: inline-block;
      cursor: pointer;
      position: relative;
      .popup {
        position: absolute;
        width: 200px;
        top: 30px;
        li {
          list-style: none;
        }
      }
    }
    .exit {
      display: inline-block;
      cursor: pointer;
    }
  }
}
</style>
