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
           :class="currentTheme">
        <div class="form">
          <div class="logo">
          </div>
          <div class="loading"
               v-if="loading">
            <m-loading></m-loading>
          </div>
          <div v-else>
            <button v-if="initial === true"
                    class="btn"
                    @click="towlan">{{$t('trans0222')}}</button>
            <div class="login-form"
                 v-if="initial === false">
              <div class="form-item">
                <m-input :label="$t('trans0067')"
                         :placeholder="$t('trans0321')"
                         type="password"
                         v-model="password" />
              </div>
              <div class="form-item">
                <button class="btn"
                        v-defaultbutton
                        @click.stop="login()">{{this.$t('trans0001')}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="download"
             v-if="appDownloadUrl&&!isMobile">
          <div class="stores">
            <div class="store">
              <div>
                <img class="android-img"
                     :src="require('base/assets/images/icon/ic_android.png')" />
              </div>
              <span>Google Play</span>
            </div>
            <div class="store">
              <div>
                <img class="apple-img"
                     :src="require('base/assets/images/icon/ic_apple.png')" />
              </div>
              <span>App Store</span>
            </div>
          </div>
          <div class="qr"></div>
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
import { LoginImg } from '@/assets/images/base64-img/img.js';

export default {
  data() {
    return {
      LoginImg,
      initial: false,
      loading: false,
      password: '',
      isDarkMode: false
    };
  },
  // in m6 router, if router is initial
  // uhttpd will redirect to /wlan page directly
  // mounted() {
  //   this.loading = true;
  //   this.$http
  //     .isinitial()
  //     .then(res => {
  //       if (res.data.result.status) {
  //         this.$http.login({ password: '' }).then(() => {
  //           this.towlan();
  //         });
  //       } else {
  //         this.initial = false;
  //         this.loading = false;
  //       }
  //     })
  //     .catch(() => {
  //       this.initial = false;
  //       this.loading = false;
  //     });
  // },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    website() {
      return process.env.CUSTOMER_CONFIG.website;
    },
    appDownloadUrl() {
      return process.env.CUSTOMER_CONFIG.appDownloadUrl;
    },
    currentTheme() {
      return this.$store.state.theme;
    },
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
  methods: {
    towlan() {
      this.$router.push({ path: '/wlan' });
    },
    login() {
      this.$loading.open();
      this.$http
        .login({ password: this.password })
        .then(res => {
          const { role } = res.data.result;
          this.$store.state.role = role;
          localStorage.setItem('role', role);
          this.$http.getMeshMode().then(res1 => {
            this.$loading.close();
            const { mode } = res1.data.result;
            this.$store.state.mode = mode;
            localStorage.setItem('mode', mode);

            const { sn } = res1.data.result;
            const modelID = sn.charAt(9);

            this.$store.state.modelID = modelID;
            localStorage.setItem('modelID', modelID);

            this.$router.push({ path: '/dashboard' });
            this.$loading.close();
          })
            .finally(() => {
              this.$loading.close();
            });
        })
        .catch(() => {
          this.$loading.close();
        });
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
  }
  .center-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    width: 400px;
    height: 500px;
    padding: 50px 0 30px;
    background-color: var(--login_right_form-bgcolor);
    box-shadow: var();
    border-radius: 15px;
    .logo {
      width: 280px;
      height: 38px;
      margin: 0 auto;
      margin-bottom: 50px;
    }
    .btn {
      width: 340px;
    }
  }
  .download {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    width: 340px;
    height: 130px;
    border-radius: 10px;
    padding: 0 20px;
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
    }
    .text {
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
          color: #ff677b;
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
