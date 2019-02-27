<template>
  <div class="input-container"
       :class="{'disabled':disabled}">
    <label for
           v-if="label">
      <span>{{label}}</span>
    </label>
    <div class="inputarea">
      <div class="input-wrapper">
        <input :style="{width:computedWidth}"
               v-if="addonBefore"
               class="extra"
               type="text"
               readonly
               :value="addonBefore" />
        <!-- <div class="extra"
             v-if="addonBefore">{{addonBefore}}</div> -->
        <input autocomplete="new-password"
               @focus="focus"
               @blur="blur"
               :disabled="disabled"
               v-model="inputValue"
               :placeholder="placeholder"
               @input="onInput"
               :type="inputType"
               :class="{'has-icon':isPwdInput,margin:addonBefore}">
      </div>
      <div class="icon-container"
           v-if="isPwdInput&&!hidePwdIcon"
           @click="changePwdStatus()">
        <span class="icon"
              :class="{'show':!showPwd,'hide':showPwd}"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 类型
    type: {
      type: String,
      default: 'text'
    },
    // 隐藏密码图标
    hidePwdIcon: {
      type: Boolean,
      default: false
    },
    // 绑定值
    value: {},
    // 输入框占位文本
    placeholder: { type: String },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 标签文本
    label: {
      type: String,
      default: ''
    },
    // 在 input 失去焦点触发
    onBlur: { type: Function },
    // 输入框前置内容
    addonBefore: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPwd: false,
      inputValue: this.value || ''
    };
  },
  watch: {
    value() {
      this.inputValue = this.value;
      this.$parent.$emit('change');
    }
  },
  methods: {
    changePwdStatus() {
    // 设置密码状态
      if (!this.disabled) {
        this.showPwd = !this.showPwd;
      }
    },
    onInput() {
    // 选中 input 中的文字
      this.$emit('input', this.inputValue);
    },
    blur() {
    // 使 input 失去焦点
      this.onBlur && this.onBlur();
      this.$parent.$emit('blur');
    },
    focus() {
    // 使 input 获取焦点
      this.$parent.$emit('focus');
    }
  },
  computed: {
    computedWidth() {
      if (!this.addonBefore) {
        return 0;
      }
      const div = document.createElement('div');
      div.innerText = this.addonBefore;
      div.style.fontSize = '14px';
      div.style.paddingLeft = '10px'; // same padding with input
      div.style.display = 'inline-block';
      document.body.appendChild(div);
      const width = `${div.clientWidth}px`;
      document.body.removeChild(div);
      return width;
    },
    inputType() {
      if (this.type === 'password') {
        if (this.showPwd) {
          return 'text';
        }
        return 'password';
      }
      return 'text';
    },
    isPwdInput() {
      return this.type === 'password';
    }
  }
};
</script>
<style lang="scss" scoped>
.input-container {
  &.small {
    .input {
      height: 36px;
    }
  }
  position: relative;
  &.disabled {
    .icon-container {
      cursor: default;
    }
  }
  .inputarea {
    position: relative;
  }
  label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .input-wrapper {
    height: 36px;
    width: 100%;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .extra {
      padding: 10px 10px;
      padding-right: 0;
    }
    input {
      font-size: 14px;
      padding: 10px;
      height: 34px;
      line-height: 1;
      // line-height: 34px;
      width: 100%;
      outline: 0;
      border-radius: 4px;
      border: none;
      box-sizing: border-box;
      -webkit-appearance: none;
      &.margin {
        padding-left: 0px;
      }
      &:disabled {
        background: #e1e1e1;
        opacity: 0.8;
        cursor: not-allowed;
      }
      &.has-icon {
        padding-right: 50px;
      }
    }
    border: 1px solid #e1e1e1;
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 36px;
    width: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 20px;
      height: 20px;
      // margin-top: 14px;
      display: inline-block;
      &.hide {
        background: url(../../assets/images/ic_visible.png) no-repeat center;
        background-size: 100%;
      }
      &.show {
        background: url(../../assets/images/ic_invisible.png) no-repeat center;
        background-size: 100%;
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .input-container {
    &.small {
      width: 100%;
    }
    width: 350px;
    display: inline-block;
  }
}

@media screen and (max-width: 768px) {
  .input-container {
    display: block;
    width: 100%;
    margin: 0 auto;
    &.small {
      .input {
      }
    }

    &.disabled {
      .icon-container {
      }
    }
    .inputarea {
    }
    label {
    }
    .input-wrapper {
      height: 48px;
      .extra {
      }
      input {
        &.margin {
        }
        &:disabled {
        }
        &.has-icon {
        }
      }
    }
    .icon-container {
      height: 48px;
      .icon {
        &.hide {
        }
        &.show {
        }
      }
    }
  }
}
</style>
