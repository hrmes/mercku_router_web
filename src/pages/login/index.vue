<template>
  <div class="login-page">
     <nav-bar />
    <div class="bg-container">
      <img class="logo" src="../../../static/1.jpg" alt="">
    </div>
    <div class="pwd-container">
      <div class="pwd-input">
        <van-field :type="showPwd?InputTypes.text:InputTypes.password"  v-model="password" :placeholder="$t('trans0067')" />
      </div>
      <div class="pwd-preview">
        <i class="i" :class="{'i-open':showPwd,'i-close':!showPwd}" @click="changePwdStatus"></i>
      </div>
    </div>
    <div class="button-container">
      <van-button @click="login(password)">{{$t('trans0001')}}</van-button>
    </div>
  </div>
</template>
<script>
import nav from '../../component/nav-bar.vue';

export default {
  data() {
    return {
      password: '',
      showPwd: false,
      InputTypes: {
        password: 'password',
        text: 'text'
      }
    };
  },
  mounted() {
    // 进入登录页面后，首先尝试用默认密码登录一次
    this.login('');
  },
  components: {
    'nav-bar': nav
  },
  methods: {
    login(pwd) {
      const loader = this.$toast.loading({
        mask: true,
        message: '',
        duration: 0,
        forbidClick: true
      });
      this.$http.login(pwd).then(() => {
        if (this.$router.returnUrl) {
          window.location.href = this.$router.returnUrl;
        } else {
          this.$router.replace({ path: '/wlan' });
        }
        loader.clear();
      }).catch((err) => {
        if (pwd) {
          // 弹出错误提示
          console.log(err);
        }
        loader.clear();
      });
    },

    changePwdStatus() {
      this.showPwd = !this.showPwd;
    }
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  padding: 0rem 0.2rem;
  .bg-container {
    height: 3rem;
    background: url(../../../static/1.jpg);
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
  .button-container {
    text-align: center;
    position: absolute;
    overflow: hidden;
    bottom: .5rem;
    width: 3.45rem;
    background: rgb(16, 16, 16);
  }
}
</style>
