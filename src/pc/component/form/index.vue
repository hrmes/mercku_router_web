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
      let result = true;
      this.$children.forEach(child => {
        if (!child.validate()) {
          result = false;
        }
      });
      return result;
    }
  }
};
</script>
