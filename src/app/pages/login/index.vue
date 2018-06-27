<template>
  <div class="login-page">
    <nav-bar :option="option" />
    <div class="bg-container">
      <img class="logo" src="../../assets/images/img_login_logo.png" alt="">
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
        left: {
          icon: true,
          text: 'arrow-left',
          click: () => {
            this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
          }
        }
      }
    };
  },
  methods: {
    login(pwd) {
      this.$http
        .login(pwd)
        .then(() => {
          const { redirect } = this.$route.params;
          console.log('redirect is:', redirect);
          if (redirect) {
            this.$router.replace({ path: redirect });
          } else {
            this.$router.replace({ path: '/check-network' });
          }
          //
        })
        .catch(err => {
          if (err && err.error) {
            // 弹出错误提示
            this.$toast(this.$t(err.error.code));
          } else {
            this.$toast(this.$t('trans0039'));
          }
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
  background: url(../../assets/images/img_bg_login.png);
  background-size: 100%;
  background-repeat: no-repeat;
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
      padding-right: 0.2rem;
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
