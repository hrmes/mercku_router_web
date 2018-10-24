<template>
  <div class="dhcp-container">
    <nav-bar :option="option" />
    <div class="new-type-info" @click="$router.replace('/wan-hand')">
      <span>{{$t('trans0317')}}</span>
      <span>
        {{this.$t(type)}}
        <img class="icon-enter" src="../../assets/images/ic_enter.png" />
      </span>
    </div>
    <div class="message">{{$t('trans0147')}}</div>
    <div class="button-info">
      <button class="btn btn-default" @click="submit()">{{$t('trans0081')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const config = this.routerConfig.getWan();
    return {
      type: config.type,
      option: {
        left: {
          icon: true,
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
      this.$http.post2native('PUT', 'OPEN_LOADING');
      this.$http
        .updateMeshConfig(this.routerConfig.getConfig())
        .then(() => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
          this.$router.replace('/complete');
        })
        .catch(err => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
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
    height: 0.5rem;
    line-height: 0.5rem;
    display: flex;
    color: rgb(51, 51, 51);
    background: #fff;
    font-size: 0.14rem;
    padding: 0 0.15rem;
    justify-content: space-between;
    .icon-enter {
      width: 0.074rem;
      margin-left: 0.1rem;
      height: 0.12rem;
    }
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
    color: rgb(153, 153, 153);
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
