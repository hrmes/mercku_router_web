<template>
  <transition name="toast">
    <div class="toast-container" :class="type" v-show="visible">
      <span>{{text}}</span>
    </div>
  </transition>
</template>

<script>
// this.$toast({
//   type:'success',
//   text：''
// })
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
.toast-container {
  color: #fff;
  position: fixed;
  top: 0;
  padding: 10px 50px;
  border-radius: 5px;
  z-index: 1001;
  left: 50%;
  transform: translate(-50%, 50%);
  white-space: nowrap;
  &.error {
    background: #f73035;
  }
  &.success {
    background: #19d191;
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
  // &.toast-leave {
  //   transform: translate(-50%, -100%);
  // }
}
</style>
