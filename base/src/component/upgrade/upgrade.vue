<template>
  <transition name="upgrade">
    <div class="upgrade-container"
         v-if="visible">
      <div class="inner">
        <img :src="url"
             alt="">
        <div v-if="title"
             class="title">{{title}}</div>
        <div v-html="tip"></div>
      </div>
    </div>
  </transition>

</template>
<script>
export default {
  data() {
    const { name } = process.env.CUSTOMER_CONFIG.loading;
    const url = require(`base/assets/images/loading/${name}`);
    return {
      url,
      visible: false,
      template: '',
      title: '',
      tip: ''
    };
  }
};
</script>
<style lang="scss" scoped>
.upgrade-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: $upgrade-background-color;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 120px;
  }
  &.upgrade-enter {
    opacity: 0;
  }
  &.upgrade-enter-active {
    transition: all 0.3s ease-in;
  }
  &.upgrade-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  .inner {
    text-align: center;
    color: $upgrade-text-color;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      // margin-top: 10px;
      color: $upgrade-text-color;
    }
  }
  .tip {
    color: $upgrade-text-color;
    display: block;
    margin-top: 10px;
  }
}
</style>
