<template>
  <div class="dhcp-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="status-info">
      <div class="state">{{$t('trans0157')}}</div>

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
          disabled: true,
          icon: 'arrow-left',
        },
        center: {
          disabled: true,
          text: 'trans0146'
        },
        right: {
          disabled: false,
          text: '',
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
      this.$http.update(this.routerConfig.getConfig()).then((res) => {
        this.$router.replace('/complete');
      })
        .catch((err) => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.dhcp-container {
  .status-info {
    width: 3.35rem;
    height: 2.7rem;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 0.16rem;
    margin-top: 0.2rem;
    overflow: hidden;
    background: url('../../../static/123.png') no-repeat;
    background-size: cover;

    .state {
      font-size: 0.2rem;
      text-align: center;
      color: rgb(1, 1, 1);
      margin-top: 0.6rem;
    }
  }
}
</style>
