<template>

  <div class="welcome-page">
    <div class="banner-container">
      <p>{{$t('trans0136')}}</p>
      <img src="../../../static/1.jpg" alt="">
    </div>
    <div class="policy">
      <p class="p1">{{$t('trans0137')}}</p>
      <div style="clear:both;"></div>
      <a class="policy-link" href="">{{$t('trans0139')}}</a>
    </div>
    <div class="button-container">
      <van-button size="normal" @click="agree">{{$t('trans0138')}}</van-button>
    </div>
  </div>

</template>

<script>
export default {
  methods: {
    agree() {
      this.isInitial();
    },
    isInitial() {
      this.$http.isinitial().then((res) => {
        if (res.result) {
          this.$router.replace({ path: '/wlan' });
        } else {
          this.$router.replace({ path: '/login' });
        }
      }).catch(err => err);
    }
  }
};
</script>

<style lang="scss" scoped>
.welcome-page {
  padding: 0.6rem 0.2rem 0;
  .banner-container {
    width: 3.35rem;
    height: 2.7rem;
    font-size: 0.2rem;
    text-align: center;
    color: rgb(1, 1, 1);
    position: relative;
    p {
      position: absolute;
      width: 100%;
      top: 0.25rem;
      font-weight: bold;
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
    }
    .policy-link {
      color: rgb(182, 182, 182);
      text-decoration: underline;
    }
  }

  .button-container {
    text-align: center;
    margin-top: 1.42rem;
  }
}
</style>
