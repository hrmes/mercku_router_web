<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: ['model', 'rules'],
  methods: {
    validate() {
      const keys = Object.keys(this.model);
      for (let i = 0; i < keys.length; i += 1) {
        const value = this.model[keys[i]];
        const validator = this.rules[keys[i]];
        // 检验
        if (validator && validator.length) {
          for (let j = 0; j < validator.length; j += 1) {
            if (!validator[i].rule.test(value)) {
              return false;
            }
          }
        }
      }
      return true;
    }
  }
};
</script>
