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
  padding: 0.1rem;
  border-radius: 0.2rem;
  z-index: 1001;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  line-height: 1.34;
  padding: 0.15rem 0.3rem;
  &.error {
    background: rgb(0, 0, 0);
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
    opacity: 0;
  }
  &.toast-enter {
    opacity: 0;
  }
}
</style>
