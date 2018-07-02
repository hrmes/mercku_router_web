<template>
  <div class="static-ip-container">
    <nav-bar :option="option" />
    <div class="message">{{$t('trans0150')}}</div>
    <div class="form">
      <van-cell-group>
        <label class="title">{{$t('trans0151')}}
          <span v-if="blurItems.includes('ip')">{{$t('trans0231')}}</span>
        </label>
        <van-field autocomplete="new-password" placeholder="0.0.0.0" v-model="form.ip" @blur="onBlur('ip',form.ip)" />
        <label class="title">{{$t('trans0152')}}
          <span v-if="blurItems.includes('mask')">{{$t('trans0231')}}</span>
        </label>
        <van-field autocomplete="new-password" placeholder="0.0.0.0" v-model="form.mask" @blur="onBlur('mask',form.mask)" />
        <label class="title">{{$t('trans0153')}}
          <span v-if="blurItems.includes('gateway')">{{$t('trans0231')}}</span>
        </label>
        <van-field autocomplete="new-password" placeholder="0.0.0.0" v-model="form.gateway" @blur="onBlur('gateway',form.gateway)" />
        <label class="title">{{$t('trans0236')}}
          <span v-if="blurItems.includes('dns')">{{$t('trans0231')}}</span>
        </label>
        <van-field autocomplete="new-password" placeholder="0.0.0.0" v-model="form.dns" @blur="onBlur('dns',form.dns)" />
      </van-cell-group>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="submit()" :disabled="disabled">{{$t('trans0081')}}</van-button>
    </div>
  </div>
</template>
<script>
import { ipRexp, ipRule } from '../../util/util';

export default {
  data() {
    return {
      blurItems: [],
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
        ip: '',
        mask: '',
        gateway: '',
        dns: ''
      }
    };
  },
  methods: {
    onBlur(item, v) {
      if (!ipRexp(v)) {
        const items = this.blurItems;
        items.push(item);
        this.blurItems = [...this.blurItems, ...items];
      } else if (this.blurItems.includes(item)) {
        this.blurItems = this.blurItems.filter(i => i !== item);
      }
      if ((item === 'ip' || item === 'gateway') && v && this.form.mask) {
        if (!ipRule(v, this.form.mask)) {
          const items = this.blurItems;
          items.push(item);
          this.blurItems = [...this.blurItems, ...items];
        } else {
          this.blurItems = this.blurItems.filter(i => i !== item);
        }
      }
      if (item === 'mask' && v) {
        if (this.form.ip) {
          if (!ipRule(this.form.ip, v)) {
            const items = this.blurItems;
            items.push('ip');
            this.blurItems = [...this.blurItems, ...items];
          } else {
            this.blurItems = this.blurItems.filter(i => i !== 'ip');
          }
        }
        if (this.form.gateway) {
          if (!ipRule(this.form.gateway, v)) {
            const items = this.blurItems;
            items.push('gateway');
            this.blurItems = [...this.blurItems, ...items];
          } else {
            this.blurItems = this.blurItems.filter(i => i !== 'gateway');
          }
        }
      }
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
      // dns为数组
      const form = {
        ...this.form,
        dns: [this.form.dns]
      };
      this.routerConfig.setWan('static', form);
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
      return true;
    }
  },
  computed: {
    disabled() {
      return (
        !this.form.ip || !this.form.gateway || !this.form.dns || !this.form.mask
      );
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.static-ip-container {
  .message {
    line-height: 1.8;
    font-size: 0.12rem;
    text-align: left;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);
    padding: 0.1rem 0.15rem;
  }

  .form {
    margin-top: 0.3rem;
    padding-left: 0.15rem;
    padding-right: 0.15rem;
    label {
      display: block;
      height: 0.3rem;
      line-height: 0.3rem;
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
      margin-top: 0.2rem;
      span {
        color: #ff1e0d;
        font-size: 0.12rem;
        padding-left: 0.1rem;
      }
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
