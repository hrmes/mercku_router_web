<template>
  <div class="select-container">
    <label for="">{{label}}</label>
    <div class="select"
         @click.stop="open()">
      <input @blur="blur"
             @focus="focus"
             ref="input"
             class="select-text"
             :title="selected"
             v-model="selected"
             @input="input"
             :placeholder="placeholder" />
      <div class="icon-container">
        <span class="icon"
              :class="{'open':opened,'close':!opened}"></span>
      </div>
      <transition name="select">
        <ul class="select-popup"
            v-show="this.opened">
          <li :key="option"
              @click.stop="select(option)"
              v-for="option in options"
              :title="option">{{option}}</li>
        </ul>
      </transition>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    // 匹配项
    options: {
      type: Array,
      default: () => []
    },
    // 绑定值
    value: '',
    // 文本标记
    label: {
      type: String,
      default: ''
    },
    // 输入框占位文本
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selected: this.value,
      opened: false
    };
  },
  watch: {
    value(val) {
      this.selected = val;
    }
  },
  mounted() {
    if (window.addEventListener) {
      document.body.addEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.attachEvent('click', this.close);
    }
  },
  methods: {
    addEvent() {},
    // @vuese
    // 当输入绑定值触发的事件
    input() {
      this.$emit('input', this.selected);
    },
    // @vuese
    // 勾选
    // @arg 当前勾选值
    select(option) {
      this.selected = option;
      this.$emit('input', this.selected);
      this.opened = false;
      this.$refs.input.focus();
    },
    // @vuese
    // 打开选择器
    open() {
      this.opened = true;
    },
    // @vuese
    // 关闭选择器
    close() {
      this.opened = false;
    },
    // @vuese
    // 当 input 失去焦点时触发
    blur() {
      this.onBlur && this.onBlur();
      this.$parent.$emit('blur');
    },
    // @vuese
    // 当 input 获取焦点时触发
    focus() {
      this.$parent.$emit('focus');
    }
  },
  //  在销毁前触发
  beforeDestroy() {
    if (window.addEventListener) {
      document.body.removeEventListener('click', this.close);
    } else if (window.attachEvent) {
      document.body.detachEvent('click', this.close);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-container {
  &.small {
    .select {
      width: 100%;
      height: 36px;
      padding: 2px 10px;
      padding-right: 50px;
      .icon-container {
        height: 100%;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        .icon {
          margin: 0;
        }
      }
      .select-popup {
        top: 36px;
        li {
          padding: 6px 10px;
        }
      }
    }
  }
  width: 350px;
  .select {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    padding: 10px;
    line-height: 26px;
    position: relative;
    padding-right: 50px;
    .select-text {
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
    }
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }

  cursor: pointer;
  .select-popup {
    width: 100%;
    position: absolute;
    z-index: 999;
    left: 0;
    top: 48px;
    background: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    max-height: 200px;
    border: 1px solid #e1e1e1;
    overflow: auto;
    li {
      list-style: none;
      padding: 10px;
      cursor: pointer;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      &:active {
        background: #d6001c;
        color: #fff;
      }
      &:hover {
        background: #d6001c;
        color: #fff;
      }
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 48px;
    width: 50px;
    cursor: pointer;
    .icon {
      width: 12px;
      height: 6px;
      margin-top: 21px;
      display: inline-block;
      background: url(../../assets/images/ic_input_box_pull_down.png) no-repeat
        center;
      background-size: 100%;
      transition: transform 0.2s linear;
      &.open {
        transform: rotate(180deg);
      }
      &.close {
        transform: rotate(0);
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .select-container {
    display: block;
    width: 100%;
    margin: 0 auto;
    .select {
      height: 48px;
    }
  }
}
</style>
