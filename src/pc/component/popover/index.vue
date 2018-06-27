<template>
  <div class="pop-info" v-if="hidden" v-clickoutside="handleClose">
    <div class="pop">
      <div class="title">{{title}}</div>
      <div class="content"> {{content}} </div>
    </div>
    <div class="pos">
      <i></i>
    </div>
  </div>
</template>

<script>
const clickoutside = {
  // 初始化指令
  bind(el, binding) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
      return false;
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};
export default {
  name: 'Popover',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      hidden: this.value
    };
  },
  directives: { clickoutside },
  watch: {
    value(v) {
      this.hidden = v;
    }
  },
  methods: {
    handleClose() {
      this.hidden = false;
      this.$emit('input', this.hidden);
    }
  }
};
</script>
<style lang="scss" scoped>
.pop-info {
  position: absolute;
  top: -120px;
  left: -24px;
  .pop {
    padding: 0 10px;
    width: 210px;
    min-height: 100px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    // position: absolute;
    font-size: 12px;
    color: #333333;
    overflow: hidden;
    .title {
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f1f1;
    }
    .content {
      padding: 5px 0;
    }
  }
  .pos {
    position: relative;
    height: 14px;
    i {
      position: relative;
      bottom: 0;
      top: 2px;
      &::before {
        content: '';
        position: absolute;
        left: 21px;
        bottom: -8px;
        display: block;
        width: 0;
        height: 0;
        overflow: hidden;
        border-width: 10px 10px 0;
        border-style: solid;
        border-color: #f1f1f1 transparent transparent;
      }
      &::after {
        content: '';
        position: absolute;
        left: 23px;
        bottom: -6px;
        display: block;
        width: 0;
        height: 0;
        overflow: hidden;
        border-width: 8px 8px 0;
        border-style: solid;
        border-color: #ffffff transparent transparent;
      }
    }
  }
}
</style>