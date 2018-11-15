<template>
  <div class="input-container" :class="{'disabled':disabled}">
    <label for="" v-if="label">
      <span>{{label}}</span>
    </label>
    <div class="inputarea">
      <div class="input-wrapper">
        <div class="extra" v-if="addOnBefore">{{addOnBefore}}</div>
        <input autocomplete="new-password" @focus="focus" @blur="blur" :disabled="disabled" v-model="inputValue" :placeholder="placeholder" @input="onInput" :type="inputType" :class="{'has-icon':isPwdInput}" />
      </div>
      <div class="icon-container" v-if="isPwdInput" @click="changePwdStatus()">
        <span class="icon" :class="{'show':!showPwd,'hide':showPwd}"></span>
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
    },
    onBlur: {
      type: Function
    },
    addOnBefore: {
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
    height: 48px;
    width: 100%;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .extra {
      padding: 0 10px;
    }
    input {
      flex: 1;
      height: 46px;
      width: 100%;
      outline: 0;
      border-radius: 4px;
      border: none;
      box-sizing: border-box;
      -webkit-appearance: none;
      &:disabled {
        background: #e1e1e1;
        opacity: 0.8;
        cursor: not-allowed;
      }
      &.has-icon {
        padding-right: 30px;
      }
      font-size: 14px;
      padding: 10px;
    }
    border: 1px solid #e1e1e1;
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
    .input-wrapper {
      height: 44px;
      input {
        height: 42px;
      }
    }
    .icon-container {
      height: 44px;
    }
  }
}
</style>
