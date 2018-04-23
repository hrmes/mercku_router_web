<template>
  <div class="dhcp-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick" />
    <div class="space">
      <div class="status-info">
        <img src="../../../static/img_bg_dhcp_02.png" alt="">
        <div class="state">{{$t('trans0157')}}</div>
      </div>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="submit()">{{$t('trans0081')}}</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: {
        left: {
          icon: true,
          text: 'arrow-left'
        },
        center: {
          text: this.$t('trans0146')
        }
      }
    };
  },
  methods: {
    onLeftClick() {
      this.$router.replace('/wan-hand');
    },
    submit() {
      this.routerConfig.setWan('dhcp');
      this.$http
        .update(this.routerConfig.getConfig())
        .then(() => {
          this.$router.replace('/complete');
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$toast(this.$t('trans0039'));
          }
        });
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.dhcp-container {
  .space {
    padding: 0 0.15rem;
  }
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
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
  }
}
</style>
