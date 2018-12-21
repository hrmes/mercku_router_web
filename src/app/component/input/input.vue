<template>
  <div class="input-container"
       :class="{'disabled':disabled}">
    <div class="inputarea"
         :class="{'no-margin':!isPwdInput,'has-content':!!inputValue}">
      <input autocomplete="new-password"
             @focus="focus"
             @blur="blur"
             :disabled="disabled"
             v-model="inputValue"
             :placeholder="placeholder"
             @input="onInput"
             class="input"
             :type="inputType"
             :class="{'has-icon':isPwdInput}" />
    </div>
    <div class="icon-container"
         v-if="isPwdInput"
         @click="changePwdStatus()">
      <span class="icon"
            :class="{'show':!showPwd,'hide':showPwd}"></span>
    </div>
  </div>
</template>

<script>
import Bus from '../bus';

export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {},
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
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
      Bus.$emit('change');
    }
  },
  methods: {
    changePwdStatus() {
      if (!this.disabled) {
        this.showPwd = !this.showPwd;
      }
    },
    onInput() {
      this.$emit('input', this.inputValue);
    },
    blur() {
      this.$emit('blur');
      Bus.$emit('blur');
    },
    focus() {
      Bus.$emit('focus');
    }
  },
  computed: {
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
  position: relative;

  &.disabled {
    .icon-container {
      cursor: default;
    }
  }
  .inputarea {
    position: relative;
    padding-right: 0.3rem;
    &.no-margin {
      margin-right: 0;
    }
    &.has-content {
      &::after {
        background: rgb(51, 51, 51);
      }
    }
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: rgb(124, 124, 124);
      transform: scaleY(0.5);
    }
  }
  .input {
    height: 0.34rem;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: none;
    font-size: 0.14rem;
    background: transparent;
    color: #333;
    -webkit-appearance: none;
    box-sizing: border-box;
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 0.34rem;
    padding-left: 0.1rem;
    width: 0.2rem;
    cursor: pointer;

    .icon {
      width: 0.2rem;
      height: 0.2rem;
      margin-top: 0.07rem;
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
</style>
