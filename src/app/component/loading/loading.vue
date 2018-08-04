<template>
  <transition name="loading">
    <div class="loading-container" v-if="visible">
      <div class="inner">
        <div class="animation-container"></div>
        <div v-if="title" class="title">{{title}}</div>
        <div v-html="template"></div>
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
      title: ''
    };
  }
};
</script>
<style lang="scss" scoped>
@keyframes loading {
  0% {
    background: url(../../assets/images/img_loading_01@3x.png) no-repeat;
    background-size: 100%;
  }
  100% {
    background: url(../../assets/images/img_loading_02@3x.png) no-repeat;
    background-size: 100%;
  }
}

.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0);
  .animation-container {
    animation: loading 1s linear infinite;
    background-size: 100%;
    background-repeat: no-repeat;
    width: 88px;
    height: 30px;
    margin: 0;
  }
  &.loading-enter {
    opacity: 0;
  }
  &.loading-enter-active {
    transition: all 0.3s ease-in;
  }
  &.loading-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  .inner {
    border-radius: 3px;
    background: rgba(51, 51, 51, 1);
    padding: 45px 16px;
    text-align: center;
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      margin-top: 10px;
      color: #fff;
    }
  }
}
</style>
