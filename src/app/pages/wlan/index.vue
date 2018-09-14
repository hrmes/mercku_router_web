<template>
  <div class="wlan-page">
    <nav-bar :option="option" />
    <div class="h1">
      {{$t('trans0167')}}
    </div>
    <div class="wlan-settings">
      <div class="ssid-container">
        <m-input v-model="ssid" :placeholder="$t('trans0168')" />
      </div>
      <div class="pwd-container">
        <m-input type="password" v-model="pwd" :placeholder="$t('trans0172')" />
      </div>
      <div class="check-container">
        <mCheckbox v-model="checked" :text="$t('trans0166')" />
      </div>
      <div v-if="!checked" class="adminpwd-container">
        <m-input type="password" v-model="adminPwd" :placeholder="$t('trans0067')" />
      </div>
    </div>
    <div class="button-info">
      <button class="btn btn-default" @click="complete" :disabled="disabled">{{$t('trans0018')}}</button>
    </div>
  </div>
</template>

<script>
import mCheckbox from '../../component/checkbox/index.vue';
import mInput from '../../component/input/input.vue';
import { getStringByte, passwordRule } from '../../../util/util';

export default {
  components: {
    mCheckbox,
    mInput
  },
  data() {
    const config = this.routerConfig.getConfig();
    const checked = this.isChecked(config.wifi.password, config.admin.password);
    return {
      checked,
      ssid: config.wifi.ssid,
      pwd: config.wifi.password,
      adminPwd: config.admin.password,
      showPwd: false,
      showAdminPwd: false,
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
        },
        center: {
          text: this.$t('trans0222')
        }
      }
    };
  },
  mounted() {
    // 没有设置wifi信息，从服务器拉取
    if (!this.ssid) {
      this.$http.post2native('PUT', 'OPEN_LOADING');
      Promise.all([this.$http.getMeshMeta(), this.$http.getAdmin()])
        .then(results => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
          const wifi = results[0].data.result;
          const admin = results[1].data.result;
          this.ssid = wifi.ssid;
          this.pwd = wifi.password;
          this.adminPwd = admin.password;
          this.checked = this.isChecked(this.pwd, this.adminPwd);
          this.routerConfig.setWIFI(this.ssid, this.pwd);
          this.routerConfig.setAdmin(this.adminPwd);
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
  },
  methods: {
    isChecked(password, adminPwd) {
      return password === adminPwd && password !== '';
    },
    complete() {
      if (/^\s*$/g.test(this.ssid)) {
        this.$toast(this.$t('trans0237'));
        return;
      }
      const length = getStringByte(this.ssid);
      if (length > 20 || length < 1) {
        this.$toast(this.$t('trans0261'));
        return;
      }

      if (!passwordRule.test(this.pwd)) {
        this.$toast(this.$t('trans0169'));
        return;
      }

      if (!this.checked && !passwordRule.test(this.adminPwd)) {
        this.$toast(this.$t('trans0169'));
        return;
      }

      this.routerConfig.setWIFI(this.ssid, this.pwd);
      this.routerConfig.setAdmin(this.checked ? this.pwd : this.adminPwd);
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
  position: relative;
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
    font-size: 0.16rem;
  }

  .wlan-settings {
    padding: 0 0.2rem;
    .ssid-container,
    .pwd-container,
    .adminpwd-container,
    .check-container,
    .timezone-container {
      .right-container {
        position: absolute;
        right: 0;
        top: 0;
        width: 1.7rem;
        height: 0.3rem;
      }
      .timezone-info {
        position: absolute;
        right: 0.2rem;
      }
      .icon-right {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      margin-top: 0.35rem;
      position: relative;
      .ssid-input,
      .pwd-input,
      .adminpwd-input {
        width: 100%;
        padding-right: 0.2rem;
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

      .timezone-left {
        display: inline-block;
        line-height: 0.3rem;
        font-size: 0.14rem;
      }

      .timezone-name,
      .timezone-value {
        text-align: right;
        width: 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.12rem;
      }
    }
  }
}
</style>
