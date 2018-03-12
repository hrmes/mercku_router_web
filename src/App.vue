<template>
  <router-view class="container"></router-view>
</template>
<script>
import 'vant/packages/vant-css/src/base.css';

export default {};
</script>

<style lang="scss">
html {
  background: rgb(16, 16, 16);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
html,
body,
.container {
  color: rgb(182, 182, 182);
  font-size: 0.14rem;
}
.van-button {
  border-radius: 1rem;
  background: transparent;
  color: rgb(182, 182, 182);
  width: 2rem;
  height: 0.5rem;
}
</style>

