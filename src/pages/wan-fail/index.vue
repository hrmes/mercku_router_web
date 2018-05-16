<template>
  <div class="wan-check-container">
    <nav-bar :option="option" />
    <div class="status-info">
      <img src="../../../static/img_bg_dhcp_02.png" alt="">
      <div class="state">{{$t('trans0180')}}</div>
      <div class="message">{{$route.params.state==='unlinked'?$t('trans0161'):$t('trans0182')}}</div>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="$router.push('/wan-hand')">{{$t('trans0019')}}</van-button>
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
        center: {
          text: this.$t('trans0223')
        },
        right: {
          text: this.$t('trans0163'),
          click: () => {
            this.$confirm({
              message: this.$t('trans0164'),
              confirmButtonText: this.$t('trans0024'),
              cancelButtonText: this.$t('trans0025')
            })
              .then(() => {
                this.$http
                  .update(this.routerConfig.getConfig())
                  .then(() => {
                    this.$router.replace('/complete');
                  })
                  .catch(err => {
                    if (err && err.error) {
                      this.$router.replace({ path: '/login' });
                    } else {
                      this.$toast(this.$t('trans0039'));
                    }
                  });
              })
              .catch(() => {
                // on cancel
              });
          }
        }
      }
    };
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-check-container {
  padding-right: 0.15rem;
  overflow: hidden;
  padding-left: 0.15rem;
  position: relative;
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
