<template>
  <div class="login customized">
    <div class="login__left"
         v-if="!isMobile">
      <div class="left-rotate_bg"></div>
      <img :src="LoginImg"
           class="left-img"
           alt="">
    </div>
    <div class="login__right">
      <div class="center-form"
           :class="{'light':isLightClass,'dark':isDrakClass}">
        <div class="form">
          <div class="welcome-text">
            <h4>欢迎使用奇游联机宝路由器</h4>
            <h3>Q1</h3>
          </div>
          <div class="loading"
               v-if="loading">
            <m-loading :color="loadingColor"></m-loading>
          </div>
          <div v-else>
            <div v-if="isInitial"
                 class="form-item">
              <button class="btn"
                      :disabled="!agreementChecked"
                      @click="towlan">{{$t('trans0222')}}</button>
            </div>
            <div v-else
                 class="login-form">
              <div class="form-item">
                <m-input :label="$t('trans0067')"
                         :placeholder="$t('trans0321')"
                         type="password"
                         v-model="password" />
              </div>
              <div class="form-item">
                <button class="btn"
                        v-defaultbutton
                        :disabled="!agreementChecked"
                        @click.stop="login()">{{this.$t('trans0001')}}</button>
              </div>
            </div>
          </div>
          <div class="agreement-wrap">
            <m-checkbox v-model="agreementChecked"></m-checkbox>
            <div class="agreement-text">
              已阅读并同意
              <a :href="agreement"
                 target="blank">《用户协议》</a>
              和
              <a :href="policy"
                 target="blank">《隐私政策》</a>
            </div>
          </div>
        </div>
        <div class="download"
             v-if="appDownloadUrl&&!isMobile">
          <div class="qr"></div>
          <div class="text">扫码下载奇游联机宝App即刻领取免费加速时长</div>
        </div>
        <div class="small-device-download"
             v-if="appDownloadUrl && isMobile">
          <div class="top-wrap">
            <div class="logo-container">
              <div class="app-logo">
              </div>
            </div>
            <div class="down-text">
              <div>{{$t('trans0314')}}</div>
              <div>
                {{$t('trans0292')}}</div>
            </div>
          </div>
          <div class="down-button-container">
            <a class="down-button"
               :href="appDownloadUrl">{{$t('trans0262')}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LoginImg } from '@/assets/images/v3/base64-img/img.js';
import { setCookie, getCookie, clearCookie } from '../../util/cookie';

export default {
  data() {
    return {
      LoginImg,
      isInitial: false,
      loading: true,
      password: '',
      isDarkMode: false,

      lockCount: 5,
      lockTime: 60,

      isLocked: false,
      lockTimer: null,

      lockCountLeft: 5,
      lockEndTime: 0,

      agreementChecked: true
    };
  },
  // in m6 router, if router is initial
  // uhttpd will redirect to /wlan page directly
  mounted() {
    this.loading = true;
    this.$http
      .isinitial()
      .then(res => {
        this.isInitial = res.data.result.status;
        this.loading = false;
      })
      .catch(() => {
        this.isInitial = false;
        this.loading = false;
      });
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    website() {
      return process.env.CUSTOMER_CONFIG.website;
    },
    agreement() {
      return process.env.CUSTOMER_CONFIG.agreement;
    },
    policy() {
      return process.env.CUSTOMER_CONFIG.policy;
    },
    appDownloadUrl() {
      return process.env.CUSTOMER_CONFIG.appDownloadUrl;
    },
    currentTheme() {
      return this.$store.state.theme;
    },
    isLightClass() {
      return this.currentTheme !== 'auto' && !this.isDarkMode;
    },
    isDrakClass() {
      return this.currentTheme !== 'auto' && this.isDarkMode;
    }
  },
  watch: {
    currentTheme: {
      handler(nv) {
        if (nv === 'dark') {
          this.isDarkMode = true;
        } else {
          this.isDarkMode = false;
        }
      },
      immediate: true
    }
  },
  created() {
    clearCookie('session');
    this.checkLockStatus();
  },
  methods: {
    towlan() {
      this.$http.login({ password: '' }).then(() => {
        this.$router.push({ path: '/wlan' });
      });
    },
    login() {
      if (!this.password) {
        this.$toast(this.$t('trans0799'));
        return;
      }
      if (this.isLocked) {
        this.$toast(this.$t('trans0665'));
        return;
      }
      this.$loading.open();
      this.$http
        .login({ password: this.password })
        .then(res => {
          const { role, session } = res.data.result;

          setCookie('session', session, 0);
          setCookie('lockEndTime', 0, 1);
          setCookie('lockCountLeft', this.lockCount, 1);

          this.$store.state.role = role;
          localStorage.setItem('role', role);
          this.$http.getMeshMode()
            .then(res1 => {
              const { mode } = res1.data.result;
              this.$store.state.mode = mode;
              localStorage.setItem('mode', mode);

              this.$router.push({ path: '/dashboard' });
            })
            .finally(() => {
              this.$loading.close();
            });
        })
        .catch(error => {
          this.$loading.close();
          this.curLockCount(error);
        });
    },
    curLockCount(err) {
      this.lockCountLeft -= 1;
      setCookie('lockCountLeft', this.lockCountLeft, 1);

      if (this.lockCountLeft === 0) {
        this.lockEndTime = new Date().getTime() + 1000 * this.lockTime;
        setCookie('lockEndTime', this.lockEndTime, 1);
        this.$toast(this.$t('trans0665'));
        this.doLockTimer();
      } else {
        this.$toast(this.$t(err.error.code));
      }
    },
    checkLockStatus() {
      const lockEndTime = getCookie('lockEndTime');
      const lockCountLeft = getCookie('lockCountLeft');
      if (
        lockEndTime == null ||
        Number.isNaN(lockEndTime) === true ||
        lockEndTime < 0
      ) {
        setCookie('lockEndTime', 0, 1);
        this.lockEndTime = 0;
      } else {
        this.lockEndTime = lockEndTime;
      }
      if (
        lockCountLeft == null ||
        Number.isNaN(lockCountLeft) === true ||
        parseInt(lockCountLeft, 10) < 0
      ) {
        setCookie('lockCountLeft', this.lockCount, 1);
        this.lockCountLeft = this.lockCount;
      } else {
        this.lockCountLeft = parseInt(lockCountLeft, 10);
      }

      const curTime = new Date().getTime();
      if (this.lockCountLeft === 0 && curTime < this.lockEndTime) {
        this.doLockTimer();
      } else if (this.lockCountLeft === 0 && curTime > this.lockEndTime) {
        this.lockCountLeft = this.lockCount;
        this.lockEndTime = 0;
        setCookie('lockCountLeft', this.lockCount, 1);
        setCookie('lockEndTime', 0, 1);
      }
    },
    doLockTimer() {
      this.isLocked = true;
      let curTime = new Date().getTime();
      this.lockTimer = setInterval(() => {
        curTime += 1000;
        if (curTime > this.lockEndTime) {
          this.isLocked = false;
          this.password = '';
          this.lockCountLeft = this.lockCount;
          this.lockEndTime = 0;
          clearInterval(this.lockTimer);
          this.lockTimer = null;
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 1fr 1.05fr;
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 720px;
  flex: 1;
  overflow: hidden;
  .login__left {
    position: relative;
    .left-rotate_bg {
      width: 100%;
      height: 120%;
      border-radius: 35px;
      transform-origin: bottom left;
      transform: translate(20%, 12%) rotate(-40deg);
      background-color: var(--login_left_rotate-bgcolor);
    }
    .left-img {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 78%;
      height: auto;
    }
  }
  .login__right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .center-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    width: 400px;
    padding: 30px 0;
    background-color: var(--login_right_form-bgcolor);
    border-radius: 15px;
    .welcome-text {
      h4,
      h3 {
        margin: 0;
        padding: 0;
      }
      h4 {
        font-size: 16px;
      }
      h3 {
        font-size: 36px;
        font-weight: 600;
      }
      margin: 0 auto;
      margin-bottom: 30px;
    }
    .btn {
      width: 340px;
    }
  }
  .agreement-wrap {
    width: 340px;
    display: flex;
    align-items: center;
    .checkbox-container {
      margin-right: 10px;
    }
    .agreement-text {
      flex: 1;
      text-align: left;
    }
    a {
      text-decoration: none;
      color: var(--primary-color);
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .download {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    width: 340px;
    border-radius: 10px;
    padding: 13px 20px;
    background-color: var(--login_right_form_download-bgcolor);
    .stores {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .store {
        padding: 6px 10px;
        border-radius: 4px;
        align-items: center;
        display: flex;
        margin-bottom: 14px;
        border-radius: 4px;
        background-color: var(--download_tag-bgc);
        &:last-child {
          margin: 0;
        }
        > div {
          line-height: 1;
        }
        img {
          width: 14px;
          // height: 18px;
          &.android-img {
            filter: var(--download_android_img-brightness);
          }
          &.apple-img {
            filter: var(--download_ios_img-brightness);
          }
        }
        span {
          position: relative;
          display: inline-block;
          width: 150px;
          margin-left: 10px;
          color: var(--text_default-color);
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            display: inline-block;
            width: 1px;
            height: 15px;
            margin-right: 10px;
            border-left: 1px solid var(--download_tag_before-color);
          }
        }
      }
    }
    .qr {
      width: 86px;
      height: 86px;
      margin-right: 12px;
    }
    .text {
      flex: 1;
      font-size: 14px;
      text-align: center;
    }
  }
  .login-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    background: #dfe7f0;
    transform-origin: center;
    transform: translate(-50%, 0) rotate(-30deg);
  }
}
@media screen and(max-width: 768px) {
  .login {
    width: 100%;
    height: 100%;
    min-width: auto;
    min-height: auto;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .login__right {
      flex: 1;
    }
    .small-device-image {
      display: block;
      img {
        width: 100%;
      }
    }
    .small-device-download {
      display: flex;
      flex-direction: column;
      max-width: 340px;
      width: 100%;
      text-align: left;
      padding: 20px;
      border-radius: 4px;
      margin-top: 30px;
      align-items: center;
      justify-content: space-between;
      background: var(--grey-bgc);
      .top-wrap {
        display: flex;
        align-items: center;
        width: 100%;
        .logo-container {
          height: 48px;
          .app-logo {
            width: 48px;
            height: 48px;
            border-radius: 5px;
          }
        }

        .down-text {
          flex: 1;
          text-align: center;
          font-size: 12px;
          margin-left: 15px;
          color: var(--text_default-color);
        }
      }

      .down-button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        width: 100%;
        height: 48px;
        border: 2px solid transparent;
        border-radius: 30px;
        overflow: hidden;
        transition: all 0.1s ease-in-out;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(
            to right,
            var(--grey-bgc),
            var(--grey-bgc)
          ),
          var(--common_btn_default-bgimg);
        .down-button {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 42px;
          text-align: center;
          border-radius: 30px;
          user-select: none;
          text-decoration: none;
          color: var(--primary-color);
        }
      }
    }
    .center-form {
      // width: 80%;
      background-color: transparent;
      padding: 0 20px;
      flex: 1;
      margin: 0 auto;
      padding-bottom: 0;
      justify-content: center;
      transform: translateY(0);
      .logo {
        width: 220px;
        margin-bottom: 30px;
      }
      .btn {
        max-width: 340px;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .login {
    .small-device-download {
      .down-text {
        width: 80px;
        font-size: 10px;
        margin-top: 5px;
        > div:last-child {
          display: none;
        }
      }
      .down-button-container {
        margin-top: 10px;
        padding-top: 5px;
      }
    }
    .center-form {
      .download {
        display: none;
      }
    }
  }
}
</style>
