<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
export default {
  props: ['prop'],
  mounted() {
    console.log(this.prop);
    console.log(this.$parent.model);
    console.log(this.$parent.rules);
    // 通过prop判断是否校验表单
  }
};
</script>
