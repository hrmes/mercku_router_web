<template>
  <transition name="dialog">
    <div class="dialog-container mask-layer"
         v-show="visible">
      <div class="dialog-content"
           v-clickoutside="checkType">
        <div v-if="title"
             class="dialog-title">{{title}}</div>
        <div class="dialog-message">
          <p v-for="(m,index) in dialogMessage"
             :key="index">{{m}}</p>
        </div>
        <div class="dialog-buttons">
          <button v-if="!isInfoDialog"
                  @click.stop="cancel()"
                  class="btn btn-default">{{cancelText}}</button>
          <button @click.stop="ok()"
                  class="btn"
                  :class="{'btn-info':isInfoDialog}">{{okText}}</button>
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
      // message定义可传递字符串和数组类型数据
      message: {
        type: [String, Array],
        default: ''
      },
      title: '',
      callback: {},
      okText: 'ok',
      cancelText: 'cancel'
    };
  },
  computed: {
    dialogMessage() {
      const result = [];
      if (Array.isArray(this.message)) {
        return this.message;
      }
      result.push(this.message);
      return result;
    },
    isInfoDialog() {
      return this.type === Types.info;
    }
  },
  methods: {
    close() {
      const { parentNode } = this.$el;
      let transitionendTriggered = false;
      this.$el.addEventListener('transitionend', () => {
        parentNode?.removeChild(this.$el);
        transitionendTriggered = true;
      });
      // to fix transitionend not trigger
      this.timer = setTimeout(() => {
        if (!transitionendTriggered) {
          parentNode?.removeChild(this.$el);
        }
      }, 500);
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
    },
    checkType() {
      if (this.isInfoDialog) {
        this.cancel();
      }
    }
  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
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
  background: var(--dialog_shadow-bgc);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog-content {
    text-align: center;
    background: var(--dialog_content-bgc);
    padding: 20px 20px 30px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 var(--dialog_shadow-color);
    .dialog-buttons {
      display: flex;
      justify-content: center;
      .btn-info {
        min-width: 240px;
      }
      button {
        width: auto;
        height: 38px;
        margin-left: 30px;
        &:first-child {
          margin-left: 0;
        }
      }
      .btn-default {
        background-image: linear-gradient(
            to right,
            var(--dialog_content-bgc),
            var(--dialog_content-bgc)
          ),
          var(--common_btn_default-bgimg) !important;
      }
    }
    .dialog-title {
      font-size: 16px;
      line-height: 1;
      color: var(--dialog_title-color);
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .dialog-message {
      color: var(--dialog_content-color);
      margin-bottom: 45px;
      text-align: center;
      font-size: 14px;
      white-space: pre-line;
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
      width: 430px;
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
