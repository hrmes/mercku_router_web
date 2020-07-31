<template>
  <div class="mk-form">
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
        if (child.validate) {
          if (!child.validate()) {
            result = false;
          }
        }
        return true;
      });
      return result;
    }
  }
};
</script>
