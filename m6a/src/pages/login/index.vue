<template>
  <div class="login-container customized">
    <div class="center-form"
         :class="{'light':currentTheme!=='auto'
                  &&!isDarkMode,'dark':currentTheme!=='auto'
                  &&isDarkMode}">
      <div class="form">
        <div class="logo">
        </div>
        <div v-if="loading === false">
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
        <div class="loading"
             v-if="loading === true">
          <m-loading :color="loadingColor"
                     :size="36"></m-loading>
        </div>
      </div>
      <div class="download"
           v-if="appDownloadUrl">
        <div class="stores">
          <div class="store">
            <div>
              <img class="android-img"
                   src="@/assets/images/icon/ic_android.png"
                   alt="">
            </div>
            <span>Google Play</span>
          </div>
          <div class="store">
            <div><img src="@/assets/images/icon/ic_apple.png"
                   class="apple-img"
                   alt=""></div>
            <span>App Store</span>
          </div>
        </div>
        <div class="qr"></div>
      </div>
      <div class="small-device-download"
           v-if="appDownloadUrl">
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

</template>

<script>
export default {
  data() {
    return {
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
    appDownloadUrl() {
      return process.env.CUSTOMER_CONFIG.appDownloadUrl;
    },
    currentTheme() {
      return this.$store.state.theme;
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
          Promise.all([
            this.$http.getMeshMode(),
            // this.$http.getFirewall()
          ])
            .then(resArr => {
              this.$loading.close();

              const [res1] = resArr;
              const { mode, sn } = res1.data.result;
              this.$store.state.mode = mode;
              localStorage.setItem('mode', mode);

              const modelID = sn.charAt(9);
              // const modelID = '0';
              this.$store.state.modelID = modelID;
              localStorage.setItem('modelID', modelID);

              // const { nat } = res2.data.result;
              // const nat = false;
              // this.$store.state.natEnabled = nat;
              // localStorage.setItem('natEnabled', nat);

              this.$router.push({ path: '/dashboard' });
              this.$loading.close();
            });
        })
        .catch(err => {
          this.$loading.close();
          this.$toast(this.$t(err.error.code));
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and(min-width: 769px) {
  .login-container {
    .form {
      height: 262px;
    }
  }
}
.login-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .loading {
    display: flex;
    justify-content: center;
  }
  .small-device-download {
    display: none;
  }
  .center-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    width: inherit;
    height: inherit;
    transform: translateY(calc(48px - 80px));
    .logo {
      width: 340px;
      margin: 0 auto;
      &::before {
        content: '';
        display: block;
        padding-top: 15%;
      }
      margin-bottom: 60px;
    }
    .form-item {
      margin-bottom: 30px;
    }
    .btn {
      width: 340px;
    }
    .welcome-text {
      font-size: 26px;
      color: #4c4c4c;
      display: block;
      margin-bottom: 50px;
    }
  }
  .download {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 50px;
    width: 340px;
    height: 130px;
    border-radius: 10px;
    padding: 0 20px;
    background-color: var(--grey-background-color);
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
        background-color: var(--download-tag-background-color);
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
            filter: var(--download-android-img-brightness);
          }
          &.apple-img {
            filter: var(--download-ios-img-brightness);
          }
        }
        span {
          position: relative;
          display: inline-block;
          width: 150px;
          margin-left: 10px;
          color: var(--text-default-color);
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
            border-left: 1px solid var(--download-tag-before-color);
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
}
@media screen and(max-width: 768px) {
  .login-container {
    height: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .small-device-image {
      display: block;
      img {
        width: 100%;
      }
    }
    .small-device-download {
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: left;
      padding: 20px;
      border-radius: 4px;
      margin-top: 30px;
      align-items: center;
      justify-content: space-between;
      background: var(--grey-background-color);
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
          color: var(--text-default-color);
        }
      }

      .down-button-container {
        margin-top: 15px;
        width: 100%;
        .down-button {
          text-decoration: none;
          text-align: center;
          color: var(--primaryColor);
          border: 1.5px solid var(--primaryColor);
          border-radius: 5px;
          padding: 12px 10px;
          font-size: 14px;
          line-height: 1;
          display: block;
        }
      }
    }
    .download {
      display: none;
    }
    .center-form {
      // width: 80%;
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
      .welcome-text {
        font-size: 18px;
        margin-bottom: 30px;
      }
      .btn {
        width: 100%;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .login-container {
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
