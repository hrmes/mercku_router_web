<template>
  <transition name="modal">
    <div class="modal-dialog"
         v-bind="$attrs"
         v-if="open">
      <div class="mask"></div>
      <div v-clickoutside="close"
           class="modal-content">
        <slot></slot>
      </div>
    </div>

  </transition>
</template>
<script>
const Types = {
  info: 'info',
  confirm: 'confirm'
};

export default {
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: Types.info
    },

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
      } else {
        this.restoreBody();
      }
    }
  },
  methods: {
    // 恢复 body 定位。此前有三个泄漏路径导致弹窗关闭后 body 残留
    // position:fixed（页面无法滚动、布局错乱）：
    //   1. confirm 类型弹窗关闭不走 close()（close 仅处理 info 类型）
    //   2. 父组件直接改 visible.sync 为 false（不经过 clickoutside）
    //   3. 弹窗开着时组件被路由切换销毁（如断网弹窗点"去设置"跳转）
    restoreBody() {
      if (this.position === undefined) {
        return; // 未保存过打开前状态（未打开过/已恢复），避免写脏值
      }
      document.body.style.position = this.position;
      document.body.style.width = '';
      this.position = undefined;
    },
    close() {
      if (this.type === Types.info) {
        this.open = false;
        this.restoreBody();
        this.$emit('update:visible', false);
      }
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    this.$el?.parentNode?.removeChild(this.$el);
    this.restoreBody();
  }
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  position: fixed;
  z-index: var(--z-index_dialog);
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
    background: var(--modal_mask-bgc);
  }
  .modal-content {
    min-width: 380px;
    background: var(--modal_content-bgc);
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 var(--modal_shadow-color);
  }
}
@media screen and (max-width: 768px) {
  .modal-dialog {
    .modal-content {
      width: 80%;
      min-width: auto;
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
