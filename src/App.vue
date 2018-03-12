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
  color: rgb(213, 184, 132);
  border-color: rgb(213, 184, 132);
  width: 2rem;
  height: 0.5rem;
}
.van-field {
  background: transparent;
  border-bottom: 0.5px solid rgb(213, 184, 132);
  padding: 5px 10px 5px 0;
  .van-field__control {
    color: rgb(124, 124, 124);
    background: transparent;
  }
}
</style>

