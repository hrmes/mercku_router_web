<template>
  <div class="input-container" :class="{'disabled':disabled}">
    <div class="inputarea" :class="{'no-margin':!isPwdInput}">
      <input autocomplete="new-password" @focus="focus" @blur="blur" :disabled="disabled" v-model="inputValue" :placeholder="placeholder" @input="onInput" class="input" :type="inputType" :class="{'has-icon':isPwdInput}" />
    </div>
    <div class="icon-container" v-if="isPwdInput" @click="changePwdStatus()">
      <span class="icon" :class="{'show':!showPwd,'hide':showPwd}"></span>
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
    margin-right: 30px;
    &.no-margin {
      margin-right: 0;
    }
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #d5b884;
      transform: scaleY(0.5);
    }
  }
  .input {
    height: 34px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: none;
    font-size: 14px;
    background: transparent;
    color: #d2d2d2;
    -webkit-appearance: none;
    box-sizing: border-box;

    &.has-icon {
      padding-right: 30px;
    }
  }
  .icon-container {
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    height: 34px;
    width: 20px;
    cursor: pointer;

    .icon {
      width: 20px;
      height: 20px;
      margin-top: 7px;
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
