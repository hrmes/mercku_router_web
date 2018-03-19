<template>

    <div class="check-network-page">
      <nav-bar></nav-bar>
      <div class="test-container">
        <div class="tester"></div>
      </div>
    <div class="info">
      <p class="p1">{{$t('trans0140')}}</p>
      <p class="p2">{{$t('trans0141')}}</p>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // this.$http.testWan().then((res) => {
    //   if (res.data.result) {
    //     this.$router.replace({ path: '/wan-success' });
    //   } else {
    //     this.$router.replace('/wan-fail/1');
    //   }
    // }).catch((err) => {
    //   if (err && err.error) {
    //     this.$router.replace(`/wan-fail}/${err.error.code}`);
    //   }
    // });
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
@keyframes speed-tester {
  0% {
    background: url(../../../static/animation/img_test_animation_01.png);
    background-size: 100%;
  }
  33% {
    background: url(../../../static/animation/img_test_animation_02.png);
    background-size: 100%;
  }
  66% {
    background: url(../../../static/animation/img_test_animation_03.png);
    background-size: 100%;
  }
  100% {
    background: url(../../../static/animation/img_test_animation_04.png);
    background-size: 100%;
  }
}
.check-network-page {
  padding: 0 0.15rem;
  .test-container {
    .tester {
      width: 3.45rem;
      height: 3.45rem;
      background: url(../../../static/animation/img_test_animation_01.png);
      background-size: 100%;
      animation: speed-tester 0.8s linear infinite;
      /*alternate*/
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
