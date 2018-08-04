<template>

  <div class="check-network-page">
    <nav-bar :option="option"></nav-bar>
    <div v-if="connMercku">
      <div class="test-container">
        <div class="tester"></div>
      </div>
      <div class="info">
        <p class="p1">{{$t('trans0140')}}</p>
        <p class="p2">{{$t('trans0141')}}</p>
      </div>
    </div>
    <div class="unconnected" v-if="!connMercku">
      <img src="../../assets/images/img_loading_fail@3x.png" alt="">
      <div>{{$t('trans0039')}}</div>
      <button class="btn btn-default retry-button" @click="retry">{{$t('trans0162')}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      option: {
        center: {
          text: this.$t('trans0223')
        }
      },
      connMercku: true
    };
  },
  methods: {
    retry() {
      this.connMercku = true;
      this.check();
    },
    check() {
      this.$http
        .getWanStatus()
        .then(res => {
          const timer = setTimeout(() => {
            clearTimeout(timer);
            const { status } = res.data.result;
            if (status === 'connected') {
              this.$router.replace({ path: '/wan-success' });
            } else {
              this.$router.replace(`/wan-fail/${status}/true`);
            }
          }, 3000);
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            const timer = setTimeout(() => {
              clearTimeout(timer);
              this.connMercku = false;
            }, 3000);
          }
        });
    }
  },
  mounted() {
    this.check();
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
@keyframes speed-tester {
  0% {
    background: url(../../assets/images/animation/img_test_animation_01.png);
    background-size: 100%;
  }
  33% {
    background: url(../../assets/images/animation/img_test_animation_02.png);
    background-size: 100%;
  }
  66% {
    background: url(../../assets/images/animation/img_test_animation_03.png);
    background-size: 100%;
  }
  100% {
    background: url(../../assets/images/animation/img_test_animation_04.png);
    background-size: 100%;
  }
}
.check-network-page {
  padding: 0 0.15rem;
  .test-container {
    .tester {
      width: 3.45rem;
      height: 3.45rem;
      background: url(../../assets/images/animation/img_test_animation_01.png);
      background-size: 100%;
      animation: speed-tester 1s linear infinite;
      margin: 0 auto;
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
      font-size: 0.16rem;
    }
  }
  .unconnected {
    width: 3.45rem;
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    img {
      width: 1.2rem;
      margin-bottom: 0.2rem;
    }
    .retry-button {
      margin-top: 0.3rem;
    }
  }
}
</style>
