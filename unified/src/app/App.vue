<template>
  <div class="unified-app">
    <router-view />
  </div>
</template>

<script>
export default { name: 'App' };
</script>

<style lang="scss">
.unified-app {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
