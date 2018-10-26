<template>

  <div class="login-page">
    <div class="bg"></div>
    <nav-bar :option="option" />
    <div class="bg-container">
      <img class="logo" src="../../assets/images/logo.png" alt="">
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
      this.$http.post2native('PUT', 'OPEN_LOADING');
      this.$http
        .login(pwd)
        .then(() => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
          const { redirect } = this.$route.params;
          if (redirect) {
            this.$router.replace({ path: redirect });
          } else {
            this.$router.replace({ path: '/check-network' });
          }
          //
        })
        .catch(err => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
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
.bg {
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  bottom: 0;
  z-index: -1;
}
.login-page {
  padding: 0rem 0.2rem;
  .header-container {
    background: transparent;
  }
  .bg-container {
    height: 3rem;
    background-size: 100% 100%;
    position: relative;
    .logo {
      height: 0.3rem;
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
