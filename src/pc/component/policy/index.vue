<template>
  <div class="policy-container">
    <span class="copy">{{$t('trans0276')}}</span>
    <span class="policy-text" @click="showPolicy()">{{$t('trans0139')}}</span>
    <div class="policy-dialog" v-show="show">
      <div class="dialog-body">
        <div class="dialog-title">{{$t('trans0139')}}</div>
        <div class="dialog-content">
          <div style="height:100%;padding:20px 0;font-size:0;" v-html="policy"></div>
        </div>
        <div class="button-container">

          <button class="btn" @click="close()">{{$t('trans0024')}}</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {},
  methods: {
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    },
    showPolicy() {
      this.setOverflow();
      this.show = true;
    },
    close() {
      this.restoryOverflow();
      this.show = false;
    }
  },
  computed: {
    policy() {
      return require('./policy-en.html');
    }
  }
};
</script>
<style lang="scss" scoped>
.policy-container {
  text-align: center;
  padding: 15px;
  font-size: 12px;
  .policy-text {
    text-decoration: underline;
    cursor: pointer;
    margin-left: 5px;
  }
  .policy-dialog {
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1001;

    .dialog-body {
      background: #fff;
      .dialog-title {
        font-size: 16px;
        color: #333;
        font-weight: bold;

        border-bottom: 1px solid #f1f1f1;
        text-align: left;
        padding: 20px;
      }
      .dialog-content {
        overflow: auto;
        text-align: left;
        padding: 0 20px;
        position: absolute;
        bottom: 118px;
        top: 62px;
        * {
          font-family: Helvetica, Arial, 'Microsoft Yahei', 'Hiragino Sans GB',
            'Heiti SC', 'WenQuanYi Micro Hei', sans-serif;
        }
      }
      width: 80%;
      height: 80%;
      position: absolute;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      .button-container {
        padding: 30px;
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .policy-container {
    padding: 10px;
    background: #fff;
    .copy,
    .policy-text {
      display: block;
      padding: 5px;
      margin-left: 0;
    }
    .policy-dialog {
      .dialog-body {
        width: 80%;
      }
    }
  }
}
</style>
