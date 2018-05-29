<template>
  <div class="policy-container">
    <span class="copy">© 2018 mercku路由器</span>
    <span class="policy" @click="showPolicy()">用户使用协议</span>
    <div class="policy-dialog" v-show="show">
      <div class="dialog-body">
        <div v-html="policy"></div>
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
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    .dialog-body {
      width: 600px;
      height: 300px;
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
    }
  }
}
</style>
