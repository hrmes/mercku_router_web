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
      duration: 2000,
      text: '',
      type: 'success',
      timer: null
    };
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    startTimer() {
      this.timer = setTimeout(() => {
        this.visible = false;
      }, this.duration);
    },
    updateContent({ text = '', duration = 2000, type = 'success' }) {
      this.text = text;
      this.duration = duration;
      this.type = type;
      this.visible = true;
      clearTimeout(this.timer);
      this.startTimer();
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and(max-width: 768px) {
  .toast-container {
    width: fit-content;
    max-width: 70%;
    min-width: 215px;
    white-space: normal !important;
    padding: 10px !important;
  }
}
.toast-container {
  position: fixed;
  top: 65px;
  left: 50%;
  z-index: 1005;
  transform: translate(-50%, 10%);
  color: var(--text-deafult-color);
  padding: 10px 16px;
  border-radius: 4px;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  &.error {
    background: var(--toast_error-bgc);
    box-shadow: var(--toast_error-shadow);
    // &::before {
    //   content: '';
    //   margin-right: 8px;
    //   flex-shrink: 0;
    //   display: block;
    //   width: 14px;
    //   height: 14px;
    //   background: url(../../assets/images/v3/icon/ic_default_error.svg) center
    //     no-repeat;
    //   background-size: 100%;
    // }
  }
  &.success {
    background: var(--toast_success-bgc);
    box-shadow: var(--toast_success-shadow);
    // &::before {
    //   content: '';
    //   margin-right: 8px;
    //   flex-shrink: 0;
    //   display: block;
    //   width: 15px;
    //   height: 15px;
    //   background: url(../../assets/images/v3/icon/ic_default_success.svg) center
    //     no-repeat;
    //   background-size: contain;
    // }
  }
  /* 淡入淡出效果 */
  &.toast-enter-active {
    transition: opacity 0.3s ease-in, transform 0.3s ease-in;
  }

  &.toast-leave-active {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }

  /* 进场动画 - 从上到下淡入 */
  &.toast-enter {
    opacity: 0;
    transform: translate(-50%, -100%);
  }

  /* 离场动画 - 从下到上淡出 */
  &.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}
</style>
