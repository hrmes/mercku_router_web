<template>
  <div class="form-item"
       :class="{'form-item-success':success,'form-item-error':error}">
    <slot></slot>
    <span class="error-message"
          v-show="error">{{message}}</span>
  </div>
</template>
<script>
export default {
  props: ['prop'],
  data() {
    return {
      validators: [],
      result: null, // null表示没有进行校验，true通过，false未通过
      message: ''
    };
  },
  computed: {
    // 验证不通过
    error() {
      return this.result !== null && this.result === false;
    },
    // 验证通过
    success() {
      return this.result === true;
    }
  },
  methods: {
    // @vuese
    // 验证器
    validate() {
      this.validators = this.$parent.rules[this.prop] || [];
      const value = this.$parent.model[this.prop];
      let result = true;
      // 检验
      if (this.validators && this.validators.length) {
        for (let j = 0; j < this.validators.length; j += 1) {
          const validator = this.validators[j];
          if (!validator.rule(value)) {
            result = false;
            this.message = validator.message;
            break;
          }
        }
      }
      this.result = result;
      return result;
    },
    // @vuese
    // 扩展验证
    extraValidate(validator, msg, ...arg) {
      let result = true;
      if (!validator(...arg)) {
        result = false;
        this.message = msg;
      }
      this.result = result;
      return result;
    }
  },
  mounted() {
    // @vuese
    // 失焦时验证
    this.$on('blur', () => {
      this.validate();
    });
    // 获取焦点不验证
    this.$on('focus', () => {
      this.result = null;
    });
    this.$on('change', () => {
      this.result = null;
    });
  }
};
</script>
<style lang="scss">
.form-item {
  margin-bottom: 30px;
  position: relative;
  .error-message {
    color: red;
    font-size: 12px;
    display: block;
    padding-top: 4px;
    line-height: 1;
    position: absolute;
    top: 100%;
  }
  &.form-item-error {
    .input-wrapper {
      border-color: red !important;
      transition: border 0.3 linear;
    }
  }
}
</style>
