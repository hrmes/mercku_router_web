<template>
  <div class="dhcp-container">
    <nav-bar :option="option" />
    <div class="new-type-info" @click="$router.replace('/wan-hand')">
      <span>{{$t('trans0317')}}</span>
      <span>
        {{format[type]}}
        <van-icon name="arrow" />
      </span>
    </div>
    <div class="message">{{$t('trans0147')}}</div>
    <div class="button-info">
      <van-button size="normal" @click="submit()">{{$t('trans0081')}}</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const config = this.routerConfig.getWan();
    return {
      format: {
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144')
      },
      type: config.type,
      option: {
        left: {
          icon: true,
          text: 'arrow-left',
          click: () => {
            this.$router.back();
          }
        },
        center: {
          text: this.$t('trans0142')
        }
      }
    };
  },
  methods: {
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
  .new-type-info {
    height: 50px;
    line-height: 50px;
    display: flex;
    color: rgb(182, 182, 182);
    background: rgb(14, 14, 14);
    font-size: 14px;
    padding: 0 0.15rem;
    margin-bottom: 0.2rem;
    justify-content: space-between;
    :last-child {
      text-align: right;
      display: flex;
      align-items: center;
      i {
        color: #d5b884;
        font-weight: 400;
        margin-left: 0.1rem;
      }
    }
  }
  .message {
    line-height: 1.8;
    font-size: 0.12rem;
    text-align: left;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);
    padding: 0.1rem 0.15rem;
  }

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
