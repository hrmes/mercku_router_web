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
  import navBar from '../../component/nav-bar.vue';
  import { ipRexp } from '../../util/util';

  export default {
    components: {
      'nav-bar': navBar
    },
    data() {
      return {
        option: {
          left: {
            disabled: true,
            icon: 'arrow-left',
          },
          center: {
            disabled: true,
            text: 'trans0148'
          },
          right: {
            disabled: false,
            text: '',
          }
        },
        disabled: true,
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
        this.$router.back();
      },
      submit() {
        if (!ipRexp(this.form.ip)) {
          this.$toast('ip格式错误');
          return false;
        }
        if (!ipRexp(this.form.mask)) {
          this.$toast('mask格式错误');
          return false;
        }
        if (!ipRexp(this.form.gateway)) {
          this.$toast('gateway格式错误');
          return false;
        }
        if (!ipRexp(this.form.dns)) {
          this.$toast('dns格式错误');
          return false;
        }
        this.routerConfig.setWan('pppoe', this.form);
        this.$router.replace('/complete');
        return true;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .static-ip-container {

  .message {
    height: .5rem;
    line-height: .5rem;
    font-size: .12rem;
    text-align: center;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);

  }

  .form {
    margin-top: .3rem;

  label {
    display: block;
    height: .3rem;
    line-height: .3rem;
    font-size: .14rem;
    color: rgb(182, 182, 182);
    margin-top: .2rem;

  }

  }
  .button-info {
    text-align: center;
    margin-top: .6rem;
  }

  .van-cell-group {
    background: transparent !important;
  }

  .van-field, .van-hairline--bottom::after, .van-hairline--left::after, .van-hairline--right::after, .van-hairline--surround::after, .van-hairline--top-bottom::after, .van-hairline--top::after, .van-hairline::after {
    border: none !important;
  }

  }


</style>
