<template>
  <div class="form-item" :class="{'form-item-success':success,'form-item-error':error}">
    <slot></slot>
    <span class="error-message" v-show="error">{{message}}</span>
  </div>
</template>
<script>
export default {
  props: ['prop'],
  created() {
    // bindValiadator
    this.bindVidator();
  },
  data() {
    return {
      validators: [],
      result: null, // null表示没有进行校验，true通过，false未通过
      message: ''
    };
  },
  computed: {
    error() {
      return this.result !== null && this.result === false;
    },
    success() {
      return this.result === true;
    }
  },
  methods: {
    bindVidator() {
      this.validators = this.$parent.rules[this.prop] || [];
    },
    validate() {
      const value = this.$parent.model[this.prop];
      let result = true;
      // 检验
      if (this.validators && this.validators.length) {
        for (let j = 0; j < this.validators.length; j += 1) {
          const validator = this.validators[j];
          if (!validator.rule(value)) {
            this.result = false;
            result = false;
            this.message = validator.message;
            break;
          }
        }
      }
      return result;
    }
  },
  mounted() {
    this.$on('blur', () => {
      this.validate();
    });
    this.$on('focus', () => {
      this.result = null;
    });
  }
};
</script>
<style lang="scss">
.form-item {
  min-height: 105px;
  .error-message {
    color: red;
    font-size: 12px;
    display: block;
    padding: 5px 0;
  }
  &.form-item-error {
    input {
      border-color: red !important;
      transition: border 0.3 linear;
    }
  }
  &.form-item-success {
    input {
      //border-color: red !important;
    }
  }
}
</style>
