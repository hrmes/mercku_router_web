<template>
  <transition name="dialog">
    <div class="dialog-container mask-layer"
         v-show="visible">
      <div class="dialog-content">
        <div v-if="title"
             class="dialog-title">{{title}}</div>
        <div class="dialog-message">
          <p v-for="(m,index) in dialogMessage"
             :key="index">{{m}}</p>
        </div>
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
    }
  },
  methods: {
    close() {
      const { parentNode } = this.$el;
      let transitionendTriggered = false;
      this.$el.addEventListener('transitionend', () => {
        parentNode.removeChild(this.$el);
        transitionendTriggered = true;
      });
      // to fix transitionend not trigger
      this.timer = setTimeout(() => {
        if (!transitionendTriggered) {
          parentNode.removeChild(this.$el);
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
    }
  },
  destroyed() {
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
  background: var(--dialog-shadow-background-color);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog-content {
    text-align: center;
    background: #fff;
    padding: 20px 20px 30px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 var(--dialog-box-shadow-color);
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
      color: var(--dialog-title-color);
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .dialog-message {
      color: var(--dialog-content-color);
      margin-bottom: 45px;
      text-align: center;
      font-size: 14px;
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
