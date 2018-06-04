<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: ['model', 'rules'],
  methods: {
    check(value, validators) {
      if (validators && validators.length) {
        for (let i = 0; i < validators.length; i += 1) {
          const validator = validators[i];
          if (!validator.rule(value)) {
            return false;
          }
        }
      }
      return true;
    },
    validate() {
      const keys = Object.keys(this.model);
      for (let i = 0; i < keys.length; i += 1) {
        const value = this.model[keys[i]];
        const validator = this.rules[keys[i]];
        if (!this.check(value, validator)) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>
