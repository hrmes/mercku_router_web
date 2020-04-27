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
    error() {
      return this.result !== null && this.result === false;
    },
    success() {
      return this.result === true;
    }
  },
  methods: {
    getValueByPath(obj, path) {
      let tempObj = obj;
      // remove start dot in path
      path = path.replace(/^\./, '');
      // replace .=>[]
      path = path.replace(/\.(\w+)((?:\.)|\[|$)/g, '[$1]$2');
      // replace start key
      path = path.replace(/^(\w+)/, '[$1]');

      // sometime path is empty when init, so match will get null
      let keyArr = path.match(/(?:\[)(.*?)(?:\])/g) || [];
      // remove [|]|"|' in key
      keyArr = keyArr.map(k => k.replace(/(\[|\]|"|')/g, ''));
      let i = 0;
      for (let len = keyArr.length; i < len - 1; i += 1) {
        if (!tempObj) break;
        const key = keyArr[i];
        if (key in tempObj) {
          tempObj = tempObj[key];
        }
      }
      return tempObj ? tempObj[keyArr[i]] : null;
    },
    validate() {
      if (this.prop) {
        this.validators = this.$parent.rules[this.prop] || [];
        const value = this.getValueByPath(this.$parent.model, this.prop);
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
      }
      return true;
    },
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
    this.$on('blur', () => {
      this.validate();
    });
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
    color: #ff0000;
    font-size: 12px;
    display: block;
    padding-top: 4px;
    line-height: 1;
    position: absolute;
    top: 100%;
    left: 0;
  }
  &.form-item-error {
    .input-wrapper {
      border-color: #ff0000 !important;
      transition: border 0.3 linear;
    }
  }
}
</style>
