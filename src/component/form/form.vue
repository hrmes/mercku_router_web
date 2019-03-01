<template>
  <div>
    <!-- from formitem -->
    <slot></slot>
  </div>
</template>
<script>
export default {
  // 表单数据对象
  // 表单验证规则
  props: ['model', 'rules'],
  methods: {
    // @vuese
    // 验证每一个表单元件
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
