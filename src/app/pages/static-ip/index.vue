<template>
  <div class="static-ip-container">
    <nav-bar :option="option" />
    <div class="new-type-info" @click="$router.replace('/wan-hand')">
      <span>{{$t('trans0317')}}</span>
      <span>
        {{this.$t(type)}}
        <img class="icon-enter" src="../../assets/images/ic_inter@3x.png" />
      </span>
    </div>
    <div class="split"></div>
    <div class="message">{{$t('trans0150')}}</div>
    <div class="form">
      <label class="title">{{$t('trans0151')}}
        <span v-if="blurItems.includes('ip')">{{$t('trans0231')}}</span>
      </label>
      <m-input v-model="form.ip" placeholder="0.0.0.0" @blur="onBlur('ip',form.ip)" />
      <label class="title">{{$t('trans0152')}}
        <span v-if="blurItems.includes('mask')">{{$t('trans0231')}}</span>
      </label>
      <m-input v-model="form.mask" placeholder="0.0.0.0" @blur="onBlur('mask',form.mask)" />
      <label class="title">{{$t('trans0153')}}
        <span v-if="blurItems.includes('gateway')">{{$t('trans0231')}}</span>
      </label>
      <m-input v-model="form.gateway" placeholder="0.0.0.0" @blur="onBlur('gateway',form.gateway)" />
      <label class="title">{{$t('trans0236')}}
        <span v-if="blurItems.includes('dns')">{{$t('trans0231')}}</span>
      </label>
      <m-input v-model="form.dns" placeholder="0.0.0.0" @blur="onBlur('dns',form.dns)" />
    </div>
    <div class="button-info">
      <button class="btn btn-default" @click="submit()" :disabled="disabled">{{$t('trans0081')}}</button>
    </div>
  </div>
</template>
<script>
import mInput from '../../component/input/input.vue';
import {
  ipRexp,
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask
} from '../../../util/util';

export default {
  components: {
    mInput
  },
  data() {
    const config = this.routerConfig.getWan();
    return {
      blurItems: [],
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
      },
      form: {
        ip: config.ip,
        mask: config.mask,
        gateway: config.gateway,
        dns: config.dns && config.dns[0]
      }
    };
  },
  mounted() {},
  methods: {
    onBlur(item, v) {
      if (!ipRexp(v) || isMulticast(v) || isLoopback(v)) {
        this.blurItems.push(item);
      } else if (this.blurItems.includes(item)) {
        this.blurItems = this.blurItems.filter(i => i !== item);
      }
      if (item === 'ip' && v && this.form.mask) {
        if (!ipRule(v, this.form.mask)) {
          this.blurItems.push(item);
        } else {
          this.blurItems = this.blurItems.filter(i => i !== item);
        }
      }
      if (item === 'mask' && v) {
        if (!isValidMask(v)) {
          this.blurItems.push(item);
          return;
        }
        if (this.form.ip) {
          if (!ipRule(this.form.ip, v)) {
            this.blurItems.push('ip');
          } else {
            this.blurItems = this.blurItems.filter(i => i !== 'ip');
          }
        }
      }
    },
    submit() {
      if (this.blurItems.includes('ip')) {
        this.$toast(this.$t('trans0238'));
        return false;
      }
      if (this.blurItems.includes('mask')) {
        this.$toast(this.$t('trans0239'));
        return false;
      }
      if (this.blurItems.includes('gateway')) {
        this.$toast(this.$t('trans0240'));
        return false;
      }
      if (this.blurItems.includes('dns')) {
        this.$toast(this.$t('trans0241'));
        return false;
      }
      // dns为数组
      const form = {
        ...this.form,
        dns: [this.form.dns]
      };
      this.routerConfig.setWan('static', form);
      const config = this.routerConfig.getConfig();
      config.wan = {
        ...config.wan,
        static: {
          netinfo: config.wan.netinfo
        }
      };
      this.$http.post2native('PUT', 'OPEN_LOADING');
      this.$http
        .updateMeshConfig(config)
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
  .new-type-info {
    display: flex;
    color: rgb(51, 51, 51);
    background: #fff;
    border: 1px solid rgb(241, 241, 241);
    font-size: 0.14rem;
    padding: 0.2rem 0.15rem;
    justify-content: space-between;
    .icon-enter {
      width: 0.074rem;
      height: 0.12rem;
      margin-left: 0.1rem;
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
    font-size: 0.12rem;
    text-align: left;
    color: rgb(51, 51, 51);
    padding: 0.2rem 0.15rem;
  }

  .form {
    padding: 0 0.15rem;
    label {
      display: block;
      height: 0.3rem;
      line-height: 0.3rem;
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
      margin-top: 0.2rem;
      &:first-child {
        margin-top: 0;
      }
      span {
        color: #ff1e0d;
        font-size: 0.12rem;
        padding-left: 0.1rem;
      }
    }
  }
}
</style>
