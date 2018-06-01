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
      validator: {},
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
      const v = this.$parent.rules[this.prop];
      if (v) {
        this.validator = v;
      }
    },
    validate() {
      const value = this.$parent.model[this.prop];
      // 检验
      if (this.validator && this.validator.length) {
        for (let j = 0; j < this.validator.length; j += 1) {
          if (!this.validator[j].rule.test(value)) {
            this.result = false;
            this.message = this.validator[j].message;
            break;
          }
        }
      }
    }
  },
  mounted() {
    this.$on('blur', () => {
      this.validate();
    });
    this.$on('focus', () => {
      this.result = null;
    });

    // console.log(this.prop);
    // console.log(this.$parent.model);
    // console.log(this.$parent.rules);
    // 通过prop判断是否校验表单
  }
};
</script>
<style lang="scss">
.form-item {
  height: 100px;
  .error-message {
    color: red;
    font-size: 12px;
    display: block;
    padding: 5px 0;
    height: 26px;
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
