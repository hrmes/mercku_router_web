<template>
  <transition name="modal">
    <div class="modal-dialog"
         v-if="open">
      <div class="mask"
           @click="close"
           @touchstart="close"></div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeOnClickMask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return { open: false };
  },
  watch: {
    visible(nv) {
      this.open = nv;
      if (this.open) {
        this.position = document.body.style.position;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
    }
  },
  methods: {
    close() {
      if (this.closeOnClickMask) {
        this.open = false;
        document.body.style.position = this.position;
        this.$emit('update:visible', false);
      }
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    this.$el.parentNode.removeChild(this.$el);
  }
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  position: fixed;
  z-index: 1001;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &.modal-enter-active {
    transition: all 0.3s ease-in;
  }
  &.modal-leave-active {
    transition: all 0.3s ease-out;
    opacity: 0;
  }
  &.modal-enter {
    opacity: 0;
  }
  &.modal-leave {
    opacity: 0;
  }
  .mask {
    position: absolute;
    z-index: -1;
    width: 100%;
    left: 0;
    top: 0;
    height: 100%;
    background: var(--modal-mask-background-color);
  }
  .modal-content {
    background: var(--modal-content-background);
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 var(--modal-shadow-color);
  }
}
@media screen and (max-width: 768px) {
  .modal-dialog {
    .modal-content {
      width: 80%;
      padding: 20px;
    }
  }
}
@media screen and (max-width: 320px) {
  .modal-dialog {
    .modal-content {
      padding: 10px 12px;
    }
  }
}
</style>
