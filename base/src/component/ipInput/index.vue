<!-- IpInput
  @description IP地址输入框
    * props:
        - value: IP地址, 格式为xx.xx.xx.xx, default: ''
        - disabled: 是否禁用, default: false
-->
<template>
  <div class="format-input">
    <label for
           v-if="label">
      <span>{{label}}</span>
    </label>
    <div class="format-input__wrap">
      <!-- 每一段一个输入框 -->
      <template v-for="(item, index) in ipArr">
        <input :key="index"
               ref="input"
               v-model="ipArr[index]"
               type="text"
               class="format-input__item"
               :disabled="disabled"
               @input="handleInput(index)"
               @focus="handleFocus(index)"
               @blur="handleBlur(index)"
               @keydown.space.exact="blockSpace"
               @keydown.backspace.exact="handleBackspace(index)">
        <span :key="index+5"
              v-if="index !== ipArr.length - 1"
              class="format-input__dot">.</span>
      </template>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FormatInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      ipArr: ['', '', '', ''],
      oldIpInput: ['', '', '', ''],
      activeIndex: -1,
      clipboardText: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('change', newVal, oldVal);
          this.ipArr = ['', '', '', ''];
          const tempArr = newVal.split('.');
          for (let i = 0; i < tempArr.length; i++) {
            if (!this.isValid(tempArr[i])) {
              break;
            }
            this.ipArr[i] = tempArr[i];
          }
        }
      }
    }
  },
  created() {
    this.pasteListener = (event) => {
      if (this.activeIndex === -1) { return; }
      const clipboardData = event.clipboardData || window.clipboardData;
      this.clipboardText = clipboardData.getData('text');
      this.handlePaste(this.activeIndex);
    };
    this.copyListener = (event) => {
      if (this.activeIndex === -1) { return; }
      const clipboardData = event.clipboardData || window.clipboardData;
      clipboardData.setData('text', this.ipArr.join('.'));
      event.preventDefault();
    };
    window.addEventListener('paste', this.pasteListener);
    window.addEventListener('copy', this.copyListener);
  },
  beforeDestroy() {
    window.removeEventListener('paste', this.pasteListener);
    window.removeEventListener('copy', this.copyListener);
  },
  methods: {
    blockSpace(event) {
      // 阻止输入空格
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    },
    isValid(value) {
      return /^\d*$/.test(value) && value <= 255 && !/\s/.test(value);
    },
    handleInput(index) {
      const newValue = this.ipArr[index];
      // 如果输入的是非数字，或者输入不在0-255之间，则阻止输入
      if (!this.isValid(newValue)) {
        this.ipArr[index] = this.oldIpInput[index];
        return false;
      }
      const isEmptyArray = this.ipArr.every(item => item === '');
      if (isEmptyArray) {
        this.$emit('input', '');
      } else {
        this.$emit('input', this.ipArr.join('.'));
      }
      this.oldIpInput[index] = newValue;
      if (newValue.length === 3 || (newValue.length === 2 && newValue > 25)) {
        if (index === this.ipArr.length - 1) { return true; }
        // 将焦点移动到下一个输入框
        this.handleFocus(index + 1);
      }
      return true;
    },
    handleFocus(index) {
      if (index < 0 || index > this.ipArr.length - 1) { return; }
      if (this.activeIndex !== index) {
        this.$refs.input[index].focus();
      }
      this.activeIndex = index;
      this.$parent.$emit('focus');
    },
    handleBlur(index) {
      this.activeIndex = -1;
    },
    handlePaste(startIndex) {
      const { clipboardText } = this;
      const tempArr = clipboardText.split('.');
      let i = 0;
      for (i; i < tempArr.length && i < this.ipArr.length; i++) {
        this.ipArr[i] = tempArr[i];
        if (!this.handleInput(i)) { break; }
      }
      this.handleFocus(i);
    },
    handleBackspace(index) {
      this.$nextTick(() => {
        if (!this.ipArr[index]) {
          this.handleFocus(index - 1);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.format-input {
  width: 100%;
  max-width: 340px;
}
label {
  display: block;
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--input_label-color);
  font-size: 14px;
}
.format-input__wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.format-input__item {
  width: 70px;
  height: 40px;
  color: var(--text_default-color);
  border: 1.5px solid var(--input_border-color);
  line-height: 1;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  outline: 0;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  -webkit-appearance: none;
  &:disabled {
    border: none;
    background: var(--input_disabled-bgc);
    opacity: var(--input_disabled-opacity);
    cursor: not-allowed;
  }
  &:focus {
    border-color: var(--input_focus_border-color);
  }
}
.format-input__dot {
  width: 10px;
  text-align: center;
  font-size: 24px;
  color: var(--text_default-color);
}
</style>
