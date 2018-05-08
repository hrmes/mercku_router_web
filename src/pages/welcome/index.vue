<template>

  <div class="welcome-page">
    <nav-bar :option="option" />
    <div class="banner-container">
      <p>{{$t('trans0136')}}</p>
      <img src="../../../static/img_bg_welcome_page.png" alt="">
    </div>
    <div class="policy">
      <p class="p1">{{$t('trans0137')}}</p>
      <div style="clear:both;"></div>
      <a class="policy-link" href="#/policy">{{$t('trans0139')}}</a>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="agree">{{$t('trans0138')}}</van-button>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      option: {
        center: {
          text: this.$t('trans0001')
        }
      }
    };
  },
  methods: {
    agree() {
      this.$http
        .login('')
        .then(() => {
          this.$router.replace({ path: '/wlan' });
        })
        .catch(() => {
          this.$router.replace({ path: '/login' });
        });
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.welcome-page {
  padding: 0rem 0.15rem;
  margin: 0 auto;
  .banner-container {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    p {
      position: absolute;
      width: 100%;
      top: 0.25rem;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
  }
  .policy {
    text-align: right;
    .p1 {
      width: 2rem;
      float: right;
      font-size: 0.14rem;
    }
    .policy-link {
      color: rgb(213, 184, 132);
      text-decoration: underline;
      font-size: 0.12rem;
    }
  }
}
</style>
