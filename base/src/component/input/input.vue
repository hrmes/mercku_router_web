<template>
  <div class="input-container"
       :class="{'disabled':disabled}">
    <label for
           v-if="label">
      <span>{{label}}</span>
    </label>
    <div class="inputarea">
      <div class="input-wrapper"
           :class="{'has-prefix':addonBefore}">
        <input :style="{width:computedWidth}"
               v-if="addonBefore"
               class="extra"
               type="text"
               readonly
               :value="addonBefore" />
        <!-- <div class="extra"
             v-if="addonBefore">{{addonBefore}}</div> -->
        <input v-if="inputType==='number'"
               @focus="focus"
               @blur="blur"
               @input="onInput"
               onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
               ref="input"
               :disabled="disabled"
               v-model="inputValue"
               :placeholder="placeholder"
               :type="inputType"
               pattern="[0-9]*">
        <input v-else
               autocomplete="new-password"
               @focus="focus"
               @blur="blur"
               @input="onInput"
               ref="input"
               :disabled="disabled"
               v-model="inputValue"
               :placeholder="placeholder"
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
    type: {
      type: String,
      default: 'text'
    },
    hidePwdIcon: {
      type: Boolean,
      default: false
    },
    value: {},
    placeholder: { type: String },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    onBlur: { type: Function },
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
    getCursorPosition() {
      return this.$refs.input.selectionEnd;
    },
    setCursorPosition(position) {
      this.$refs.input.setSelectionRange(position, position);
    },
    changePwdStatus() {
      if (!this.disabled) {
        this.showPwd = !this.showPwd;
      }
    },
    onInput() {
      this.$emit('input', this.inputValue);
    },
    blur() {
      this.onBlur && this.onBlur();
      this.$parent.$emit('blur');
    },
    focus() {
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
      return this.type;
    },
    isPwdInput() {
      return this.type === 'password';
    }
  }
};
</script>
<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.input-container {
  max-width: 340px;
  &.small {
    .input {
      height: 36px;
    }
  }
  position: relative;
  &.disabled {
    .icon-container {
      opacity: 0.2;
      cursor: not-allowed;
    }
  }
  .inputarea {
    position: relative;
  }
  label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--input-label-color);
    font-size: 14px;
  }
  .input-wrapper {
    height: 50px;
    width: 100%;
    border-radius: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .extra {
      padding: 10px 10px;
      padding-right: 0;
    }
    &.has-prefix {
      input {
        width: auto;
      }
    }
    input {
      font-size: 14px;
      padding: 10px;
      height: 48px;
      line-height: 1;
      width: 100%;
      outline: 0;
      border-radius: 10px;
      box-sizing: border-box;
      -webkit-appearance: none;
      background: var(--input-content-background);
      border: 1.5px solid var(--input-border-color);
      color: var(--text-default-color);
      transition: all 0.2s ease-in-out;
      &::-webkit-input-placeholder {
        color: var(--input-placeholder-color);
      }
      &.margin {
        padding-left: 0px;
      }
      &:focus {
        border-color: var(--input-focus-border-color);
      }
      &:disabled {
        border: none;
        background: var(--input-disabled-background-color);
        opacity: var(--input-disabled-opacity);
        cursor: not-allowed;
      }
      &:invalid {
        animation: errorshake 0.3s forwards;
        border: 2px solid var(--input-error-border-color);
      }
      &.has-icon {
        padding-right: 50px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      width: 20px;
      height: 20px;
      // margin-top: 14px;
      display: inline-block;
      filter: var(--img-brightness);
      &.hide {
        background: url(../../assets/images/icon/ic_visible.png) no-repeat
          center;
        background-size: 100%;
      }
      &.show {
        background: url(../../assets/images/icon/ic_invisible.png) no-repeat
          center;
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
    display: inline-block;
    max-width: 340px;
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .input-container {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    .input-wrapper {
      height: 50px;
    }
    .icon-container {
      height: 48px;
    }
  }
}
</style>
