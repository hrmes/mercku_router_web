<template>
  <div class="wlan-page">
    <nav-bar :option="option" />
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
          <i class="i" :class="{'i-open':showPwd,'i-close':!showPwd}" @click="changePwdStatus"></i>
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
          <i class="i" :class="{'i-open':showAdminPwd,'i-close':!showAdminPwd}" @click="changeAdminPwdStatus"></i>
        </div>
      </div>
      <!-- <div class="timezone-container" @click="selectTimezone">
        <label class="timezone-left">{{$t('trans0272')}}</label>
        <div class="right-container">
          <div class="timezone-info">
            <div class="timezone-value">{{timezone.timename}}</div>
            <div class="timezone-name">{{timezone.name}}</div>
          </div>
          <div class="icon-right">
            <van-icon name="arrow" class="active" />
          </div>
        </div>
      </div> -->
    </div>
    <div class="button-info">
      <van-button @click="complete" :disabled="disabled">{{$t('trans0018')}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const config = this.routerConfig.getConfig();
    return {
      checked:
        config.wifi.password === config.admin.password && config.wifi.password,
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
        left: {},
        center: {
          text: this.$t('trans0222')
        }
      }
      // timezone: this.routerConfig.getTimezone(),
      // timezones: require(`../../timezones/${this.$i18n.locale}.json`)
    };
  },
  mounted() {
    if (this.webview) {
      this.option.left = {
        icon: true,
        text: 'arrow-left',
        click: () => {
          this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
        }
      };
    }
    // 没有设置wifi信息，从服务器拉取
    if (!this.ssid) {
      this.$http
        .getWIFI()
        .then(res => {
          const { result } = res.data;
          this.ssid = result.ssid;
          this.pwd = result.password;
          this.adminPwd = result.admin_password;
          this.checked =
            result.password === result.admin_password && result.password;
          this.routerConfig.setWIFI(result.ssid, result.password);
          this.routerConfig.setAdminPwd(this.adminPwd);
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

    // // 如果没有时区，从服务器获取
    // if (!this.timezone.timezone) {
    //   this.$http
    //     .getTimezone()
    //     .then(res => {
    //       const { result } = res.data;
    //       const timezone = this.timezones.filter(t => {
    //         if (
    //           t.timezone === result.timezone &&
    //           t.position - '0' === result.position - '0'
    //         ) {
    //           return true;
    //         }
    //         return false;
    //       })[0];
    //       this.routerConfig.setTimezone(
    //         timezone.timename,
    //         timezone.name,
    //         timezone.timezone,
    //         timezone.position
    //       );
    //       this.timezone.timename = timezone.timename;
    //       this.timezone.name = timezone.name;
    //       this.timezone.position = timezone.position;
    //       this.timezone.timezone = timezone.timezone;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       if (err && err.error) {
    //         // 弹出错误提示
    //         this.$toast(this.$t(err.error.code));
    //       } else {
    //         this.$toast(this.$t('trans0039'));
    //       }
    //     });
    // }
  },
  methods: {
    // selectTimezone() {
    //   this.routerConfig.setWIFI(this.ssid, this.pwd);
    //   this.routerConfig.setAdminPwd(this.checked ? this.pwd : this.adminPwd);
    //   this.$router.replace({ path: '/timezone' });
    // },
    changePwdStatus() {
      this.showPwd = !this.showPwd;
    },
    changeAdminPwdStatus() {
      this.showAdminPwd = !this.showAdminPwd;
    },
    complete() {
      if (/^\s*$/g.test(this.ssid)) {
        this.$toast(this.$t('trans0237'));
        return;
      }
      // 用aa替换中文字符，便于计算长度
      const { length } = this.ssid.replace(/[\u0391-\uFFE5]/g, 'aa');
      if (length > 20 || length < 1) {
        this.$toast(this.$t('trans0261'));
        return;
      }

      if (!/^[a-zA-Z0-9\W_]{8,24}$/g.test(this.pwd)) {
        this.$toast(this.$t('trans0169'));
        return;
      }
      if (/\s/g.test(this.pwd)) {
        this.$toast(this.$t('trans0228'));
        return;
      }

      if (!this.checked && !/^[a-zA-Z0-9\W_]{8,24}$/g.test(this.adminPwd)) {
        this.$toast(this.$t('trans0169'));
        return;
      }
      if (!this.checked && /\s/g.test(this.adminPwd)) {
        this.$toast(this.$t('trans0228'));
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
    // .timezone-container {
    //   &:active {
    //     background: #000;
    //     opacity: 0.9;
    //   }
    // }
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
      .van-icon {
        &.active {
          color: #ffdea1;
        }

        &:hover {
          color: #ffdda1;
        }
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
