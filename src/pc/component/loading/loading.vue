<template>
  <div class="loading-container">
    <div class="inner" v-html="template"></div>
  </div>
</template>
<script>
export default {
  props: {
    template: String
  }
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10001;
  background: rgba(0, 0, 0, 0.5);
  .inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
