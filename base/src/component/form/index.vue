<template>
  <div class="mk-form"
       v-bind="$attrs">
    <slot></slot>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
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
