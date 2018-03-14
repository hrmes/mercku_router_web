<template>
  <div class="wan-check-container">
    <nav-bar :option="option" :onRightClick="onRightClick"/>
    <div class="status-info">
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
import navBar from '../../component/nav-bar.vue';

export default {
  components: {
    'nav-bar': navBar
  },
  data() {
    return {
      option: {
        left: {
          disabled: false,
          icon: '',
        },
        center: {
          disabled: true,
          text: 'trans0223'
        },
        right: {
          disabled: true,
          text: 'trans0163',
        }
      }
    };
  },
  methods: {
    onRightClick() {
      this.$confirm({
        message: this.$t('trans0164')
      }).then(() => {
        this.$router.replace('/complete');
      }).catch(() => {
        // on cancel
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wan-check-container {
  padding-right: 0.15rem;
  padding-left: 0.15rem;

  .status-info {
    width: 3.35rem;
    height: 2.7rem;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 0.16rem;
    overflow: hidden;
    margin-top: 0.2rem;
    background: url('../../../static/123.png') no-repeat;
    background-size: cover;

    .state {
      font-size: 0.2rem;
      text-align: center;
      color: rgb(1, 1, 1);
      height: 0.65rem;
      line-height: 0.65rem;
    }

    .message {
      text-align: center;
      font-size: 0.12rem;
      color: rgb(0, 0, 0);
    }
  }

  .button-info {
    text-align: center;
    margin-top: 1.42rem;
  }
}
</style>
