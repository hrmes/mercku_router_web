<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  // 表单数据对象
  // 表单验证规则
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
