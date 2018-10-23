<template>
  <div class="pppoe-container">
    <nav-bar :option="option" />
    <div class="new-type-info" @click="$router.replace('/wan-hand')">
      <span>{{$t('trans0317')}}</span>
      <span>
        {{this.$t(type)}}
        <img class="icon-enter" src="../../assets/images/ic_inter@3x.png" />
      </span>
    </div>
    <div class="split"></div>
    <div class="message">{{$t('trans0154')}}</div>
    <div class="form">
      <m-input class="account" v-model="form.account" :placeholder="$t('trans0155')" />
      <div class="password-info">
        <m-input type="password" class="account" v-model="form.password" :placeholder="$t('trans0156')" />
      </div>
      <div class="button-info">
        <button class="btn btn-default" @click="submit()" :disabled="disabled">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import mInput from '../../component/input/input.vue';

export default {
  components: {
    mInput
  },
  data() {
    const config = this.routerConfig.getWan();

    return {
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
      },
      type: config.type,
      form: {
        account: config.account,
        password: config.password
      }
    };
  },
  methods: {
    submit() {
      this.routerConfig.setWan('pppoe', this.form);
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
  },
  computed: {
    disabled() {
      return !this.form.account || !this.form.password;
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.pppoe-container {
  .new-type-info {
    display: flex;
    color: rgb(51, 51, 51);
    background: #fff;
    border: 1px solid rgb(241, 241, 241);
    font-size: 14px;
    padding: 0.2rem 0.15rem;
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
  .split {
    height: 0.2rem;
    background: rgb(250, 250, 250);
    border-bottom: 1px solid rgb(241, 241, 241);
  }
  .message {
    font-size: 12px;
    text-align: left;
    color: rgb(51, 51, 51);
    padding: 0.2rem 0.15rem;
  }

  .form {
    padding: 0 0.15rem;
  }

  .account {
    margin-top: 0.15rem;
  }
  .password-info {
    position: relative;
    margin-top: 0.3rem;
  }

  .pwd-preview {
    position: absolute;
    right: 0;
    z-index: 1;
    top: 30%;

    width: 0.2rem;
    text-align: center;
  }

  .van-cell-group {
    background: transparent !important;
    padding-right: 0.15rem;
  }

  .van-hairline--bottom::after,
  .van-hairline--left::after,
  .van-hairline--right::after,
  .van-hairline--surround::after,
  .van-hairline--top-bottom::after,
  .van-hairline--top::after,
  .van-hairline::after {
    border: none !important;
  }
}
</style>
