<template>
  <transition name="toast">
    <div class="toast-container"
         :class="type"
         v-show="visible">
      <span>{{text}}</span>
    </div>
  </transition>
</template>

<script>

export default {
  data() {
    return {
      visible: false,
      duration: 3000,
      text: '',
      type: 'success',
      timer: null
    };
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    startTimer() {
      this.timer = setTimeout(() => {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.close);
      }, this.duration);
    },
    close() {
      this.timer = null;
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and(max-width: 768px) {
  .toast-container {
    width: 80%;
    white-space: normal !important;
    padding: 10px !important;
  }
}
.toast-container {
  color: var(--toast-color);
  // position: fixed;
  top: 0;
  padding: 10px 16px;
  border-radius: 4px;
  z-index: 10000;
  left: 50%;
  position: fixed;
  transform: translate(-50%, 50%);
  white-space: nowrap;
  text-align: center;
  display: flex;
  align-items: center;
  &.error {
    background: var(--toast-error-background-color);
    border: 0.5px solid var(--toast-error-border-color);
    &::before {
      content: '';
      margin-right: 8px;
      flex-shrink: 0;
      display: block;
      width: 14px;
      height: 14px;
      background: url(../../assets/images/icon/ic_default_error.png) center
        no-repeat;
      background-size: 100%;
    }
  }
  &.success {
    background: var(--toast-success-background-color);
    border: 0.5px solid var(--toast-success-border-color);
    &::before {
      content: '';
      margin-right: 8px;
      flex-shrink: 0;
      display: block;
      width: 14px;
      height: 14px;
      background: url(../../assets/images/icon/ic_default_success.png) center
        no-repeat;
      background-size: 100%;
    }
  }
  &.toast-enter-active {
    transition: all 0.3s ease-in;
  }
  &.toast-leave-active {
    transition: all 0.3s ease-out;
    // leave不知道为什么不生效
    transform: translate(-50%, -100%);
  }
  &.toast-enter {
    transform: translate(-50%, -100%);
  }
}
</style>
