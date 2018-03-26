<template>

  <div class="wan-success-page">
    <nav-bar :option="option"/>

    <div class="banner-container">
      <p>{{$t('trans0157')}}</p>
      <img src="../../../static/img_bg_dhcp.png" alt="">
    </div>
    <div class="button-container">
      <van-button size="normal" @click="next">{{$t('trans0081')}}</van-button>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      option: {
        center: {
          text: 'trans0142'
        }
      }
    };
  },
  methods: {
    next() {
      this.$http.update(this.routerConfig.getConfig()).then(() => {
        this.$router.replace({ path: '/complete' });
      }).catch((err) => {
        if (err && err.error) {
          this.$toast(this.$t(err.error.code));
        }
      });
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-success-page {
  padding: 0rem 0.15rem;
  .header {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    color: rgb(213, 184, 132);
    text-align: center;
  }
  .banner-container {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    margin-top: 0.25rem;
    margin: 0 auto;
    p {
      position: absolute;
      width: 100%;
      top: 0.25rem;
      font-weight: bold;
      font-size: 0.16rem;
      color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
  }
  .button-container {
    text-align: center;
    margin-top: 2.18rem;
  }
}
</style>
