<template>
  <div class="policy-container">
    <span class="copy">{{$t('trans0276')}}</span>
    <span class="policy" @click="showPolicy()">{{$t('trans0139')}}</span>
    <div class="policy-dialog" v-show="show">
      <div class="dialog-body">
        <div class="dialog-title">{{$t('trans0139')}}</div>
        <div class="dialog-content" v-html="policy"></div>
        <div class="button-container">
          <button class="btn" @click="close()">{{$t('trans0024')}}</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    showPolicy() {
      this.show = true;
    },
    close() {
      this.show = false;
    }
  },
  computed: {
    policy() {
      if (this.$i18n.locale === 'zh-CN') {
        return require('./policy-cn.html');
      }
      return require('./policy-en.html');
    }
  }
};
</script>
<style lang="scss" scoped>
.policy-container {
  text-align: center;
  .policy {
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
    z-index: 999;

    .dialog-body {
      .dialog-title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        border-bottom: 1px solid #f1f1f1;
        text-align: left;
        padding: 20px;
      }
      .dialog-content {
        max-height: 250px;
        min-height: 100px;
        overflow: auto;
        text-align: left;
        padding: 20px;
      }
      width: 600px;
      padding: 0 0 20px 0;
      background: #fff;
      position: absolute;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      .button-container {
        padding: 20px;
        .btn {
          width: 120px;
          height: 42px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .policy-container {
    height: 60px;
    .copy,
    .policy {
      display: block;
      padding: 5px;
    }
    .policy-dialog {
      .dialog-body {
        width: 80%;
      }
    }
  }
}
</style>
