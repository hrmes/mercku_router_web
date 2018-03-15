<template>

    <div class="check-network-page">
      <nav-bar></nav-bar>
      <div class="banner-container">
        <img src="../../../static/1.jpg" alt="">
      </div>
    <div class="info">
      <p class="p1">{{$t('trans0140')}}</p>
      <p class="p2">{{$t('trans0141')}}</p>
    </div>
  </div>
</template>

<script>
import nav from '../../component/nav-bar.vue';

export default {
  mounted() {
    this.$http.testWan().then((res) => {
      if (res.data.result) {
        this.$router.replace({ path: '/wan-success' });
      } else {
        this.$router.replace('/wan-fail/1');
      }
    }).catch((err) => {
      if (err && err.error) {
        this.$router.replace(`/wan-fail}/${err.error.code}`);
      }
    });
  },
  components: {
    'nav-bar': nav
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.check-network-page {
  padding: 0 0.15rem;
  .banner-container {
    width: 3.35rem;
    height: 2.7rem;
    font-size: 0.2rem;
    text-align: center;
    color: rgb(1, 1, 1);
    margin: 0 auto;
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
  .info {
    margin-top: 0.65rem;
    .p1,
    .p2 {
      text-align: center;
      color: rgb(142, 142, 147);
      margin: 0;
    }
  }
}
</style>
