<template>

  <div class="login-page">
    <nav-bar :option="option" />
    <div class="bg-container">
      <img class="logo" src="../../assets/images/logo.png" alt="">
    </div>
    <div class="pwd-container">
      <m-input type="password" v-model="password" :placeholder="$t('trans0067')" />
    </div>
    <div class="button-container">
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
.login-page {
  padding: 0rem 0.2rem;
  display: flex;
  flex-direction: column;
  .header-container {
    background: transparent;
  }
  .bg-container {
    flex: 1;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    .logo {
      height: 0.3rem;
    }
  }
  .pwd-container {
    margin: 0.7rem 0 0.5rem 0;
  }
  .button-container {
    padding: 0.5rem 0;
    display: flex;
    justify-content: center;
  }
}
</style>
