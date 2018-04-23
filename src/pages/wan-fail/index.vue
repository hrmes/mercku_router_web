<template>
  <div class="wan-check-container">
    <nav-bar :option="option" :onRightClick="onRightClick" />
    <div class="status-info">
      <img src="../../../static/img_bg_dhcp_02.png" alt="">
      <div class="state">{{$t('trans0180')}}</div>
      <div class="message">{{$route.params.state==='1'?$t('trans0161'):$t('trans0182')}}</div>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="$router.replace('/wan-hand')">{{$t('trans0019')}}</van-button>
      <div class="space"></div>
      <van-button size="normal" @click="$router.replace('/check-network')">{{$t('trans0162')}}</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: {
        left: {
          icon: ''
        },
        center: {
          text: 'trans0223'
        },
        right: {
          text: 'trans0163'
        }
      }
    };
  },
  methods: {
    onRightClick() {
      this.$confirm({
        message: this.$t('trans0164')
      })
        .then(() => {
          this.$http.update(this.routerConfig.getConfig()).then(() => {
            this.$router.replace('/complete');
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-check-container {
  padding-right: 0.15rem;
  overflow: hidden;
  padding-left: 0.15rem;
  .status-info {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    .state {
      position: absolute;
      width: 100%;
      top: 0.25rem;
      font-size: 0.2rem;
      text-align: center;
      color: #fff;
      /*height: 0.65rem;*/
      /*line-height: 0.65rem;*/
    }
    .message {
      position: absolute;
      width: 100%;
      top: 0.7rem;
      text-align: center;
      font-size: 0.12rem;
      color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
  }
}
</style>
