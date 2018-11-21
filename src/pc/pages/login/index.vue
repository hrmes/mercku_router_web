<template>
  <div class="login-container" @keyup.enter="login">
    <div class="center-form">
      <div class="download">
        <img src="../../assets/images/qr.png" alt="">
        <div class="text">
          <div>{{$t('trans0314')}}</div>
          <div>
            {{$t('trans0292')}}</div>
        </div>
      </div>
      <div class="form">
        <span class="welcome-text">{{$t('trans0136')}}</span>
        <div v-if="!loading">
          <button v-if="initial" class="btn" @click="towlan">{{$t('trans0222')}}</button>
          <div class="login-form" v-if="!initial">
            <div class="form-item">
              <m-input :label="$t('trans0067')" :placeholder="$t('trans0321')" type="password" v-model="password" />
            </div>
            <div class="form-item">
              <button class="btn" @click.stop="login()">{{this.$t('trans0001')}}</button>
            </div>
          </div>
        </div>
        <div class="loadding" v-if="loading">
          <m-spinner color="#333" />
        </div>
      </div>
      <div class="small-device-download">
        <div class="logo-container">
          <img class="app-logo" src="../../assets/images/ic_mercku.png" alt="">
        </div>
        <div class="down-text">
          <div>{{$t('trans0314')}}</div>
          <div>
            {{$t('trans0292')}}</div>
        </div>

        <div class="down-button-container">
          <a class="down-button" href="http://onelink.to/mn4tgv">{{$t('trans0262')}}</a>
        </div>
      </div>
    </div>

    <div class="bottom-image">
      <img class="big-device-image" src="../../assets/images/img_main_picture.jpg" alt="">
      <img class="small-device-image" src="../../assets/images/img_bg_mobile.png" alt="">
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
  mounted() {
    this.loading = true;
    // 尝试自动登录，如果自动登录成功，则展示设置按钮，否则展示登录按钮。
    this.$http
      .login('')
      .then(() => {
        this.initial = true;
        this.loading = false;
      })
      .catch(() => {
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
        .login(this.password)
        .then(res => {
          this.$loading.close();
          const access = res.data.result.role;
          this.$store.state.access = access;
          sessionStorage.setItem('access', access);
          this.$router.push({ path: '/dashboard' });
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
    flex: 1;
    .form-item {
      margin-bottom: 30px;
    }
    .download {
      padding: 0 50px;
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
    .big-device-image {
      width: 40%;
      margin: 0 auto;
      display: block;
    }
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
      padding: 20px 10px;
      height: 88px;
      border-radius: 4px;

      margin-top: 15px;
      .logo-container {
        float: left;
        img {
          width: 48px;
          height: 48px;
        }
      }

      .down-text {
        text-align: left;
        float: left;
        font-size: 10px;
        color: #333;
        margin-left: 12px;
        padding: 4px 0;
        > div:first-child {
          padding-top: 5px;
        }
        > div:last-child {
          padding-bottom: 8px;
        }
      }
      .down-button-container {
        float: right;
        padding-top: 5px;
        .down-button {
          text-decoration: none;
          color: rgb(214, 0, 28);
          border: 1px solid rgb(214, 0, 28);
          padding: 10px;
          border-radius: 2px;
          font-size: 14px;
          display: block;
        }
      }
    }
    .center-form {
      width: 80%;
      flex: 1;
      margin: 0 auto;
      min-height: initial;
      .welcome-text {
        font-size: 24px;
        margin-top: 25px;
        margin-bottom: 35px;
      }
    }

    .download {
      display: none;
    }
    .bottom-image {
      width: 80%;
      margin-top: 30px;
      .big-device-image {
        display: none;
      }
      .small-device-image {
        display: block;
        width: 100%;
      }
    }
  }
}
@media screen and (width: 320px) {
  .login-container {
    .bg {
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
    }

    .download {
      display: none;
    }
  }
}
</style>

