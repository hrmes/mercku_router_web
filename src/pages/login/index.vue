<template>
  <div class="login-container">
    <div class="center-form">
      <div class="download">
        <img src="../../assets/images/qr.png"
             alt="">
        <div class="text">
          <div>{{$t('trans0314')}}</div>
          <div>
            {{$t('trans0292')}}</div>
        </div>
      </div>
      <div class="form">
        <span class="welcome-text">{{$t('trans0136')}}</span>
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
          <m-spinner :size="36"
                     color="#333" />
        </div>
      </div>
      <div class="small-device-download">
        <div class="logo-container">
          <img class="app-logo"
               src="../../assets/images/ic_launcher.jpg"
               alt="">
        </div>
        <div class="down-text">
          <div>{{$t('trans0314')}}</div>
          <div>
            {{$t('trans0292')}}</div>
        </div>

        <div class="down-button-container">
          <a class="down-button"
             href="http://onelink.to/mn4tgv">{{$t('trans0262')}}</a>
        </div>
      </div>
    </div>

    <div class="bottom-image">
      <img class="small-device-image"
           src="../../assets/images/img_bg_mobile.png"
           alt="">
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      initial: null,
      loading: null,
      password: ''
    };
  },
  mounted() {
    this.loading = true;
    this.$http.isinitial().then(res => {
      if (res.data.result.status) {
        this.$http.login({ password: '' }).then(() => {
          this.initial = true;
          this.loading = false;
        });
      } else {
        this.initial = false;
        this.loading = false;
      }
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
          sessionStorage.setItem('role', role);
          this.$http.getMeshMode().then(res1 => {
            this.$loading.close();
            const { mode } = res1.data.result;
            this.$store.mode = mode;
            sessionStorage.setItem('mode', mode);
            this.$router.push({ path: '/dashboard' });
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
    // flex: 1;

    .form-item {
      margin-bottom: 30px;
    }
    .btn {
      width: 350px;
    }
    .download {
      width: 200px;
      align-self: flex-end;
      height: 150px;
      img {
        width: 80px;
        height: 80px;
      }
      .text {
        font-size: 14px;
        text-align: center;
      }
    }
    .welcome-text {
      font-size: 36px;
      color: #4c4c4c;
      display: block;
      margin-bottom: 50px;
    }
  }
  .bottom-image {
    width: 100%;
    flex: 1;
    min-height: 250px;
    background: url(../../assets/images/img_main_picture.jpg) no-repeat center;
    background-size: contain;
    .small-device-image {
      display: none;
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
      width: 100%;
      background: #f1f1f1;
      text-align: left;
      padding: 10px;
      border-radius: 4px;
      align-items: center;
      justify-content: space-between;
      .logo-container {
        float: left;
        height: 48px;

        img {
          width: 48px;
          height: 48px;
          border-radius: 5px;
        }
      }

      .down-text {
        text-align: left;
        font-size: 10px;
        color: #333;
      }
      .down-button-container {
        float: right;
        .down-button {
          text-decoration: none;
          color: rgb(214, 0, 28);
          border: 1px solid rgb(214, 0, 28);
          padding: 12px 10px;
          border-radius: 2px;
          font-size: 14px;
          line-height: 1;
          display: block;
        }
      }
    }
    .center-form {
      width: 80%;
      flex: 1;
      margin: 0 auto;
      padding-top: 30px;
      padding-bottom: 0;
      justify-content: center;
      .welcome-text {
        font-size: 18px;
        margin-bottom: 30px;
      }
      .btn {
        width: 100%;
      }
      .download {
        display: none;
      }
    }

    .bottom-image {
      width: 80%;
      margin-top: 30px;
      min-height: auto;
      background: none;
      .small-device-image {
        display: block;
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
