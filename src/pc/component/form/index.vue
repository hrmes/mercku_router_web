<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
export default {
  props: ['model', 'rules'],
  mounted() {
    // 具体校验规则
  }
};
</script>
