<template>
  <div class="login-page">
    <nav-bar :option="option" />
    <div class="bg-container">
      <img class="logo" src="../../../static/img_login_logo.png" alt="">
    </div>
    <div class="pwd-container">
      <div class="pwd-input">
        <van-field :type="showPwd?InputTypes.text:InputTypes.password" v-model="password" :placeholder="$t('trans0067')" />
      </div>
      <div class="pwd-preview">
        <i class="i" :class="{'i-open':showPwd,'i-close':!showPwd}" @click="changePwdStatus"></i>
      </div>
    </div>
    <div class="button-info">
      <van-button @click="login(password)" :disabled="!password">{{$t('trans0001')}}</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: '',
      showPwd: false,
      InputTypes: {
        password: 'password',
        text: 'text'
      },
      option: {
        left: {}
      }
    };
  },
  mounted() {
    console.log(this.$i18n.locale);
    if (this.webview) {
      this.option.left = {
        icon: 'arrow-left'
      };
    }
    // 进入登录页面后，首先尝试用默认密码登录一次
    this.login('');
  },
  methods: {
    login(pwd) {
      const loader = this.$toast.loading({
        mask: true,
        message: '',
        duration: 0,
        forbidClick: true
      });
      this.$http
        .login(pwd)
        .then(() => {
          loader.clear();
          if (this.$router.returnUrl) {
            window.location.href = this.$router.returnUrl;
          } else {
            this.$router.replace({ path: '/wlan' });
          }
          //
        })
        .catch(err => {
          loader.clear();
          if (pwd) {
            console.log(this.$toast.fail);
            if (err && err.error) {
              // 弹出错误提示
              this.$toast(this.$t(err.error.code));
            } else {
              this.$toast(this.$t('trans0039'));
            }
          }

          //
        });
    },

    changePwdStatus() {
      this.showPwd = !this.showPwd;
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.login-page {
  padding: 0rem 0.2rem;
  background: url(../../../static/img_bg_login.png);
  background-size: 100%;
  .bg-container {
    height: 3rem;
    background-size: 100% 100%;
    position: relative;
    .logo {
      width: 2.2rem;
      height: 0.35rem;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
    }
  }
  .pwd-container {
    margin-top: 0.33rem;
    position: relative;
    .pwd-input {
      width: 100%;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .pwd-preview {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      width: 0.2rem;
      text-align: center;
    }
  }
}
</style>
