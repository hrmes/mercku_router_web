<template>
  <transition name="dialog">
    <div class="dialog-container mask-layer"
         v-show="visible">
      <div class="dialog-content">
        <div v-if="title"
             class="dialog-title">{{title}}</div>
        <div class="dialog-message">{{message}}</div>
        <div class="dialog-buttons">
          <button v-if="Types.info!==type"
                  @click="cancel()"
                  class="btn btn-default">{{cancelText}}</button>
          <button @click="ok()"
                  class="btn">{{okText}}</button>
        </div>
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
  data() {
    return {
      Types,
      visible: false,
      message: '',
      title: '',
      callback: {},
      okText: 'ok',
      cancelText: 'cancel'
    };
  },
  methods: {
    close() {
      const { parentNode } = this.$el;
      this.$el.addEventListener('transitionend', () => {
        parentNode.removeChild(this.$el);
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
    padding: 20px 20px 30px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .dialog-buttons {
      display: flex;
      justify-content: center;
      button {
        width: auto;
        height: 38px;
        margin-left: 30px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .dialog-title {
      font-size: 16px;
      line-height: 1;
      color: #333;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .dialog-message {
      color: #333;
      margin-bottom: 45px;
      text-align: center;
      font-size: 14px;
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
    }
  }
}
@media screen and (max-width: 768px) {
  .dialog-container {
    .dialog-content {
      width: 80%;
      .dialog-buttons {
        flex-direction: column;
        button {
          width: 100%;
          display: block;
          margin: 0;
          margin-top: 20px;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>
