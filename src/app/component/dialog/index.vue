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
      this.$el.addEventListener('transitionend', () => {
        this.restoryOverflow();
        this.$el.parentNode.removeChild(this.$el);
      });
    },
    ok() {
      this.visible = false;
      this.callback.ok && this.callback.ok();
      this.close();
    },
    cancel() {
      this.visible = false;
      this.callback.cancel && this.callback.cancel();
      this.close();
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
  .dialog-content {
    text-align: center;
    position: absolute;
    background: #fff;
    top: 50%;
    left: 50%;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .dialog-buttons {
      white-space: nowrap;
      font-size: 0;
      border-radius: 10px;
      button {
        width: 80px;
        height: 60px;
        display: inline-block;
        margin-left: 30px;
        font-size: 16px;
        border-radius: 0;
        border: none;
        background: #fff;
        border-top: 1px solid rgb(225, 225, 225);
        border-left: 1px solid rgb(225, 225, 225);
        color: rgb(51, 51, 51);
        &:first-child {
          margin-left: 0;
          border-left: 0;
          border-right: 1px solid rgb(225, 225, 225);
          border-bottom-left-radius: 10px;
        }
        &:last-child {
          border-bottom-right-radius: 10px;
          border-left: 0;
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
      color: rgb(51, 51, 51);
      padding: 30px 0;
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
        text-align: right;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .dialog-container {
    .dialog-content {
      width: 75%;
      .dialog-buttons {
        white-space: nowrap;
        button {
          width: 50%;
          display: inline-block;
          margin: 0;
          &:first-child {
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>
