<template>
  <transition name="loading">
    <div class="loading-container" v-if="visible">
      <div class="inner">
        <img src="../../assets/images/ic_loading.gif" alt="" width="40">
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
  },
  mounted() {
    this.setOverflow();
  },
  methods: {
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.8);
  svg {
    width: 32px;
    height: 32px;
    path {
      fill: #fff;
    }
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
