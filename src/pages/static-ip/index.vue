<template>
  <div class="static-ip-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="message">{{$t('trans0150')}}</div>
    <div class="form">
      <van-cell-group>
        <label class="title">{{$t('trans0151')}}</label>
        <van-field placeholder="0.0.0.0" v-model="form.ip"/>
        <label class="title">{{$t('trans0152')}}</label>
        <van-field placeholder="0.0.0.0" v-model="form.mask"/>
        <label class="title">{{$t('trans0153')}}</label>
        <van-field placeholder="0.0.0.0" v-model="form.gateway"/>
        <label class="title">{{$t('trans0236')}}</label>
        <van-field placeholder="0.0.0.0" v-model="form.dns"/>
      </van-cell-group>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="submit()" :disabled="disabled">{{$t('trans0055')}}</van-button>
    </div>
  </div>
</template>
<script>
import { ipRexp } from '../../util/util';

export default {
  data() {
    return {
      option: {
        left: {
          icon: 'arrow-left',
        },
        center: {
          text: 'trans0148'
        },
        right: {
          text: '',
        }
      },
      form: {
        ip: '',
        mask: '',
        gateway: '',
        dns: ''
      }
    };
  },
  methods: {
    onLeftClick() {
      this.$router.replace('/wan-hand');
    },
    submit() {
      if (!ipRexp(this.form.ip)) {
        this.$toast(this.$t('trans0238'));
        return false;
      }
      if (!ipRexp(this.form.mask)) {
        this.$toast(this.$t('trans0239'));
        return false;
      }
      if (!ipRexp(this.form.gateway)) {
        this.$toast(this.$t('trans0240'));
        return false;
      }
      if (!ipRexp(this.form.dns)) {
        this.$toast(this.$t('trans0241'));
        return false;
      }
      this.routerConfig.setWan('pppoe', this.form);
      this.$http.update(this.routerConfig.getConfig()).then((res) => {
        this.$router.replace('/complete');
      })
        .catch((err) => {
          console.error(err);
        });
      return true;
    }
  },
  computed: {
    disabled() {
      return !this.form.ip || !this.form.gateway || !this.form.dns || !this.form.mask;
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.static-ip-container {
  .message {
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.12rem;
    text-align: center;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);
  }

  .form {
    margin-top: 0.3rem;

    label {
      display: block;
      height: 0.3rem;
      line-height: 0.3rem;
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
      margin-top: 0.2rem;
    }
  }

  .van-cell-group {
    background: transparent !important;
  }

  .van-field,
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
