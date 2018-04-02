<template>
  <div class="wlan-page">
    <nav-bar :option="option" :onLeftClick="onLeftClick" />
    <div class="h1">
      {{$t('trans0167')}}
    </div>
    <div class="wlan-settings">
      <div class="ssid-container">
        <van-field v-model="ssid" :placeholder="$t('trans0168')" />
      </div>
      <div class="pwd-container">
        <div class="pwd-input">
          <van-field :type="showPwd?InputTypes.text:InputTypes.password" v-model="pwd" :placeholder="$t('trans0003')" />
        </div>
        <div class="pwd-preview">
          <i class="i" :class="{'i-open':!showPwd,'i-close':showPwd}" @click="changePwdStatus"></i>
        </div>
      </div>
      <div class="check-container">
        <van-checkbox v-model="checked" shape="square">{{$t('trans0166')}}</van-checkbox>
      </div>
      <div v-if="!checked" class="adminpwd-container">
        <div class="adminpwd-input">
          <van-field :type="showAdminPwd?InputTypes.text:InputTypes.password" v-model="adminPwd" :placeholder="$t('trans0067')" />
        </div>
        <div class="adminpwd-preview">
          <i class="i" :class="{'i-open':!showAdminPwd,'i-close':showAdminPwd}" @click="changeAdminPwdStatus"></i>
        </div>
      </div>
    </div>
    <div class="button-info">
      <van-button @click="complete" :disabled="disabled">{{$t('trans0018')}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
      ssid: '',
      pwd: '',
      adminPwd: '',
      showPwd: false,
      showAdminPwd: false,
      InputTypes: {
        password: 'password',
        text: 'text'
      },
      option: {
        left: {},
        center: {
          text: 'trans0222'
        }
      }
    };
  },
  mounted() {
    if (this.webview) {
      this.option.left = {
        icon: 'arrow-left'
      };
    }
  },
  methods: {
    onLeftClick() {
      this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
    },
    changePwdStatus() {
      this.showPwd = !this.showPwd;
    },
    changeAdminPwdStatus() {
      this.showPwd = !this.showPwd;
    },
    complete() {
      if (/^\s*$/g.test(this.ssid)) {
        this.$toast(this.$t('trans0139'));
        return;
      }
      const { length } = this.ssid.replace(/[\u0391-\uFFE5]/g, 'aa');
      if (length > 20 || length < 1) {
        this.$toast(this.$t('trans0261'));
        return;
      }

      if (!/[\w\d]{8,24}/g.test(this.pwd)) {
        /\s/g.test(this.pwd)
          ? this.$toast(this.$t('trans0237'))
          : this.$toast(this.$t('trans0169'));
        return;
      }

      if (!this.checked && !/[\w\d]{8,24}/g.test(this.adminPwd)) {
        /\s/g.test(this.adminPwd)
          ? this.$toast(this.$t('trans0237'))
          : this.$toast(this.$t('trans0169'));
        return;
      }

      this.routerConfig.setWIFI(this.ssid, this.pwd);
      this.routerConfig.setAdminPwd(this.checked ? this.pwd : this.adminPwd);
      this.$router.replace({ path: '/check-network' });
    }
  },
  computed: {
    disabled() {
      return !this.ssid || !this.pwd || !(this.checked || this.adminPwd);
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.wlan-page {
  .header {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    color: rgb(213, 184, 132);
    text-align: center;
  }
  .h1 {
    background: #000;
    color: rgb(124, 124, 124);
    padding: 0.16rem 0 0.16rem 0.2rem;
  }
  .wlan-settings {
    padding: 0 0.2rem;
    .ssid-container,
    .pwd-container,
    .adminpwd-container,
    .check-container {
      margin-top: 0.35rem;
      position: relative;
      .ssid-input,
      .pwd-input,
      .adminpwd-input {
        width: 100%;
        padding-right: 20px;
        box-sizing: border-box;
      }
      .ssid-preview,
      .pwd-preview,
      .adminpwd-preview {
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
}
</style>
