<template>
  <div class="login-container customized">
    <div class="center-form">
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
        <div class="loadding"
             v-if="loading === true">
          <m-loading :color="loadingColor"
                     :size="36"></m-loading>
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
      password: ''
    };
  },
  // in m6 router, if router is initial
  // uhttpd will redirect to /wlan page directly
  mounted() {
    this.loading = true;
    this.$http
      .isinitial()
      .then(res => {
        console.log('isInitial?', res);
        if (res.data.result.status) {
          this.$http.login({ password: '' }).then(() => {
            this.towlan();
          });
        } else {
          this.initial = false;
          this.loading = false;
        }
      })
      .catch(() => {
        this.initial = false;
        this.loading = false;
      });
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
          this.$store.role = role;
          localStorage.setItem('role', role);
          this.$http.getMeshMode()
            .then(res1 => {
              const { data: { result: { mode } } } = res1;
              this.$store.mode = mode;
              localStorage.setItem('mode', mode);
              this.$http.getRouter()
                .then(res2 => {
                  console.log(res2);
                  const { data: { result: { sn } } } = res2;
                  this.currentModelVersion = sn.slice(9, 10);
                  this.$store.modelVersion = this.currentModelVersion;
                  localStorage.setItem('modelVersion', this.currentModelVersion);
                  this.$router.push({ path: '/dashboard' });
                  this.$loading.close();
                });
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
  flex: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  // background: $primaryColor;

  .loadding {
    display: flex;
    justify-content: center;
  }
  .small-device-download {
    display: none;
  }

  .center-form {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    position: relative;
    width: 100%;
    transform: translateY(calc(-50% + 56px));
    // flex: 1;
    .logo {
      width: 280px;
      height: 92px;
      margin: 0 auto;
      &::before {
        content: '';
        display: block;
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
    position: fixed;
    right: 50px;
    bottom: 50px;
    display: flex;
    .stores {
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .store {
        border: 1px solid #dbdbdb;
        padding: 6px 10px;
        border-radius: 4px;
        align-items: center;
        display: flex;
        margin-bottom: 14px;
        &:last-child {
          margin: 0;
        }
        > div {
          line-height: 1;
        }
        img {
          width: 14px;
          // height: 18px;
        }
        span {
          margin-left: 10px;
          &::before {
            content: '';
            display: inline-block;
            width: 0;
            height: 10px;
            margin-right: 10px;
            border-left: 1px solid #d8d8d8;
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
      width: 100%;
      background: #f1f1f1;
      text-align: left;
      padding: 10px;
      border-radius: 4px;
      margin-top: 30px;
      align-items: center;
      justify-content: space-between;
      .left-wrap {
        flex: 1;
        display: flex;
        align-items: center;
        .logo-container {
          height: 48px;
          .app-logo {
            width: 48px;
            height: 48px;
            border-radius: 5px;
          }
        }

        .down-text {
          margin-left: 12px;
          margin-right: 12px;
          text-align: left;
          font-size: 10px;
          color: #333;
        }
      }

      .down-button-container {
        .down-button {
          text-decoration: none;
          color: $primaryColor;
          border: 1px solid $primaryColor;
          padding: 12px 10px;
          border-radius: 2px;
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
@media screen and (width: 320px) {
  .login-container {
    .small-device-download {
      .down-text {
        width: 80px;
        margin-top: 5px;

        > div:last-child {
          display: none;
        }
      }
      .down-button-container {
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
