<template>
  <div class="policy-container"
       :class="{
        'is-login-nav':isLoginPage,
        'is-not-login-nav':!isLoginPage,}">
    <span class="copy">{{ copyright }}</span>
    <span class="policy-text"
          @click.stop="showPolicy()">
      {{$t('trans0139')}}
    </span>
    <img v-if="isShowPowerBy"
         class="power-by"
         src="../../assets/images/img-power-by.webp" />
    <m-modal :visible.sync="show">
      <m-modal-header>
        <div class="dialog-title">{{ $t('trans0139') }}</div>
      </m-modal-header>
      <m-modal-body>
        <div class="dialog-content">
          <div style="height:100%;padding:20px 0;font-size:0;"
               v-html="policy"></div>
        </div>
      </m-modal-body>
      <m-modal-footer>
        <div class="button-container">
          <button class="btn btn-dialog-confirm"
                  @click="close()">
            {{ $t('trans0024') }}
          </button>
        </div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
const MerckuCustomerId = '0001';
export default {
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    },
    isLoginPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { show: false };
  },
  methods: {
    showPolicy() {
      if (process.env.CUSTOMER_CONFIG.policy) {
        window.open(process.env.CUSTOMER_CONFIG.policy);
      } else {
        this.show = true;
      }
    },
    close() {
      this.show = false;
    }
  },
  computed: {
    policy() {
      return require('./policy-en.html');
    },
    copyright() {
      const copyright = this.$t('trans0276');
      const now = new Date();
      /*
        兼容以前的翻译中的固定年份写法
        如果没有%d，则不产生替换，也是正确的
        缺点是本地时间不准，这里得到的年份也是错的
      */
      return copyright
        .replace('%d', now.getFullYear())
        .replace('%s', process.env.CUSTOMER_CONFIG.title);
    },
    isShowPowerBy() {
      return process.env.CUSTOMER_CONFIG.id !== MerckuCustomerId;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  width: 600px;
  max-height: 400px;
  overflow: auto;
  padding-right: 10px;
}
.policy-container {
  text-align: center;
  padding: 8px 15px 10px;
  font-size: 12px;
  > span {
    user-select: none;
  }
  .policy-text {
    text-decoration: underline;
    margin-left: 5px;
    cursor: pointer;
    &:hover {
      color: var(--text-default-color);
    }
  }
  .power-by {
    width: 150px;
    height: 15px;
    vertical-align: sub;
    margin-left: 10px;
  }
}
@media screen and (max-width: 768px) {
  .dialog-content {
    width: 100%;
  }
  .policy-container {
    padding: 10px;
    &.is-login-nav {
      background: var(--primaryBackgroundColor);
    }
    &.is-not-login-nav {
      background: transparent;
    }
    .copy,
    .policy-text {
      margin-left: 0;
    }
    .power-by {
      margin-left: 5px;
    }
  }
}
</style>
