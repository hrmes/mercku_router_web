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
  props: {
    prop: {
      type: String
    },
    rules: {
      type: Array,
      default: () => []
    }
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
    getValueByPath(obj, path) {
      let tempObj = obj;
      // remove start dot in path
      path = path.replace(/^\./, '');
      // replace .=>[]
      path = path.replace(/\.(\w+)(?=\.|\[|$)/g, '[$1]');
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
        const rules = this.$parent.rules || {};
        const prop = this.prop || '';
        const validators = rules[prop] || [];
        this.validators = validators.concat(this.rules);

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
@keyframes errorshake {
  25% {
    transform: translateX(6px);
  }
  50% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}
.form-item {
  margin-bottom: 30px;
  position: relative;
  &.last {
    margin-bottom: 0;
  }
  .error-message {
    color: var(--input-error-text-color);
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
      input {
        border: 2px solid var(--input-error-text-color);
      }
      animation: errorshake 0.3s forwards;
    }
    .select-container {
      .select {
        border: 2px solid var(--input-error-text-color);
        animation: errorshake 0.3s forwards;
      }
    }
  }
}
</style>
