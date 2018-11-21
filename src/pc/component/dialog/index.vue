<template>
  <transition name="dialog">
    <div class="dialog-container" v-show="visible">
      <div class="dialog-content">
        <div v-if="title" class="dialog-title">{{title}}</div>
        <div class="dialog-message">{{message}}</div>
        <div class="dialog-buttons">
          <button @click="cancel()" class="btn btn-default">{{cancelText}}</button>
          <button @click="ok()" class="btn">{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      title: '',
      callback: {},
      okText: 'ok',
      cancelText: 'cancel'
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
    },
    close() {
      this.restoryOverflow();
      this.$el.addEventListener('transitionend', () => {
        this.$el.parentNode.removeChild(this.$el);
      });
    },
    ok() {
      this.visible = false;
      this.close();
      this.callback.ok && this.callback.ok();
    },
    cancel() {
      this.visible = false;
      this.close();
      this.callback.cancel && this.callback.cancel();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog-content {
    text-align: center;
    background: #fff;
    padding: 30px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .dialog-buttons {
      white-space: nowrap;
      margin-top: 20px;
      button {
        width: 120px;
        height: 42px;
        display: inline-block;
        margin: 0 20px 0 30px;
        &:first-child {
          margin-left: 0;
          margin-right: 0;
        }
      }
    }
    .dialog-title {
      font-size: 18px;
      line-height: 1;
      color: #303133;
      text-align: left;
    }
    .dialog-message {
      color: #333;
    }
  }
  &.dialog-enter-active {
    transition: all 0.3s ease-in;
  }
  &.dialog-leave-active {
    transition: all 0.3s ease-out;
    opacity: 0;
  }
  &.dialog-enter {
    opacity: 0;
  }
  &.dialog-leave {
    opacity: 0;
  }
}
@media screen and (min-width: 769px) {
  .dialog-container {
    .dialog-content {
      width: 420px;
      .dialog-message {
        text-align: left;
      }
      .dialog-buttons {
        text-align: center;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .dialog-container {
    .dialog-content {
      width: 80%;
      .dialog-buttons {
        white-space: nowrap;
        button {
          width: 100%;
          display: block;
          margin: 0;
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>
