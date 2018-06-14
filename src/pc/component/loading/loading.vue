<template>
  <transition name="loading">
    <div class="loading-container" v-if="visible">
      <div class="inner">
        <img src="../../assets/images/loading.gif" alt="">
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
      template: ''
    };
  },
  mounted() {
    this.setOverflow();
  },
  methods: {
    setOverflow() {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'auto';
    },
    restoryOverflow() {
      document.body.style.overflow = this.bodyOverflow || 'auto';
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
  background: rgba(255, 255, 255, 0.8);
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
    color: #000;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
