<template>
  <div class="login-container" @keyup.enter="login">
    <div class="bg">
      <div class="center-form">
        <div class="download">
          <img src="../../assets/images/qr.png" alt="">
          <div class="text">
            <div>{{$t('trans0314')}}</div>
            <div>
              {{$t('trans0292')}}</div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <span class="welcome-text">{{$t('trans0136')}}</span>
        <div v-if="!loading">
          <button v-if="initial" class="btn" @click="towlan">{{$t('trans0222')}}</button>
          <div class="login-form" v-if="!initial">
            <div class="password-container">
              <m-input :label="$t('trans0067')" :placeholder="$t('trans0321')" type="password" v-model="password" />
            </div>
            <button class="btn" @click.stop="login()">{{this.$t('trans0001')}}</button>
          </div>
        </div>
        <div class="loadding" v-if="loading">
          <img src="../../assets/images/loading.gif" alt="">
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
      <div class="small-device-image">
        <img src="../../assets/images/img_bg_mobile.png" alt="">
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
        .then(() => {
          this.$loading.close();
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

  .bg {
    width: 100%;
    height: 100%;

    .loadding {
      img {
        width: 32px;
        height: 32px;
      }
    }
    .small-device-download {
      display: none;
    }
    .small-device-image {
      display: none;
    }
    .center-form {
      text-align: center;
      min-height: 800px;

      .password-container {
        margin-bottom: 30px;
      }
      .download {
        padding: 0 50px;
        width: 200px;
        float: right;
        height: 150px;
        margin-top: 40px;

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
  }
  // background-color: -webkit-linear-gradient(
  //   left bottom,
  //   #fafafa,
  //   #fff
  // ); /* Safari 5.1 - 6.0 */
  // background-color: -o-linear-gradient(
  //   top right,
  //   #fafafa,
  //   #fff
  // ); /* Opera 11.1 - 12.0 */
  // background-color: -moz-linear-gradient(
  //   top right,
  //   #fafafa,
  //   #fff
  // ); /* Firefox 3.6 - 15 */
  // background-color: linear-gradient(
  //   to top right,
  //   #fafafa,
  //   #fff
  // ); /* 标准的语法 */
  background: url(../../assets/images/img_main_picture.jpg) #fff no-repeat
    center;
  background-position-y: bottom;
  background-size: auto 40%;
}
@media screen and(max-width: 768px) {
  .login-container {
    position: static;
    background: #fff;

    .bg {
      background: none;
      height: auto;
      overflow: hidden;
      .small-device-image {
        display: block;
        img {
          width: 100%;
        }
      }
      .small-device-download {
        width: 80%;
        display: block;
        margin: 0 auto;
        margin-top: 45px;
        background: #f1f1f1;
        text-align: left;
        padding: 20px 10px;
        height: 88px;
        border-radius: 4px;
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
        margin: 0 auto;
        min-height: initial;
        .welcome-text {
          font-size: 24px;
          margin-top: 25px;
          margin-bottom: 35px;
        }
      }
    }

    .download {
      display: none;
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

