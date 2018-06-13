<template>
  <div class="input-container" :class="{'disabled':disabled}">
    <label for="">
      <span>{{label}}</span>
    </label>
    <div class="inputarea">
      <input autocomplete="new-password" @focus="focus" @blur="blur" :disabled="disabled" v-model="inputValue" :placeholder="placeholder" @input="onInput" class="input" :type="inputType" :class="{'has-icon':isPwdInput}" />
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
    margin-bottom: 10px;
    font-size: 14px;
  }
  .input {
    height: 48px;
    width: 100%;
    border-radius: 4px;
    outline: 0;
    border: 1px solid #e1e1e1;
    font-size: 14px;
    padding: 10px;
    -webkit-appearance: none;
    &.has-icon {
      padding-right: 30px;
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
      width: 20px;
      height: 20px;
      margin-top: 14px;
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
    width: 350px;
    display: inline-block;
  }
}

@media screen and (max-width: 768px) {
  .input-container {
    display: block;
    width: 100%;
    margin: 0 auto;
    .input {
      height: 44px;
    }
  }
}
</style>
