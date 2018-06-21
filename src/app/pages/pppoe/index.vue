<template>
  <div class="pppoe-container">
    <nav-bar :option="option" />
    <div class="message">{{$t('trans0154')}}</div>
    <div class="form">
      <van-cell-group>
        <van-field type="text" :placeholder="$t('trans0155')" v-model="form.account" />
        <div class="password-info">
          <van-field :type="!pwdShow?'password':'text'" :placeholder="$t('trans0156')" v-model="form.password" />
          <div class="pwd-preview">
            <i class="i" :class="!pwdShow?'i-close':'i-open'" @click="isShowPwd()"></i>
          </div>
        </div>
      </van-cell-group>
      <div class="button-info">
        <van-button size="normal" @click="submit()" :disabled="disabled">{{$t('trans0081')}}</van-button>
      </div>
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
          text: 'arrow-left',
          click: () => {
            this.$router.replace('/wan-hand');
          }
        },
        center: {
          text: this.$t('trans0142')
        }
      },
      form: {
        account: '',
        password: ''
      },
      pwdShow: false
    };
  },
  methods: {
    isShowPwd() {
      this.pwdShow = !this.pwdShow;
    },
    submit() {
      this.routerConfig.setWan('pppoe', this.form);
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
  .message {
    line-height: 1.8;
    font-size: 0.12rem;
    text-align: left;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);
    padding: 0.1rem 0.15rem;
  }

  .form {
    padding: 0.15rem;
  }

  .password-info {
    padding-right: 0.3rem;
    position: relative;
  }

  .van-field {
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
