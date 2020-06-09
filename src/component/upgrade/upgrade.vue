<template>
  <transition name="upgrade">
    <div class="upgrade-container"
         v-if="visible">
      <div class="inner">
        <img src="../../assets/images/loading-3.gif"
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
    return {
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100px;
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
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      // margin-top: 10px;
      color: #fff;
    }
  }
  .tip {
    color: #fff;
    display: block;
    margin-top: 10px;
  }
}
</style>
