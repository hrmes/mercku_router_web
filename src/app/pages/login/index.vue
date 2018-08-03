<template>
  <div class="login-page">
    <nav-bar :option="option" />
    <div class="bg-container">
      <img class="logo" src="../../assets/images/img_login_logo.png" alt="">
    </div>
    <div class="pwd-container">
      <m-input type="password" v-model="password" :placeholder="$t('trans0067')" />
    </div>
    <div class="button-info">
      <button class="btn btn-default" @click="login(password)" :disabled="!password">{{$t('trans0001')}}</button>
    </div>
  </div>
</template>
<script>
import mInput from '../../component/input/input.vue';

export default {
  components: {
    mInput
  },
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
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.login-page {
  padding: 0rem 0.2rem;
  background: url(../../assets/images/img_bg_login.jpg);
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
  }
}
</style>
