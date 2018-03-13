<template>
  <!--<transition>-->
  <router-view></router-view>
  <!--</transition>-->
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
    -moz-user-select:none;-webkit-user-select:none
  }

  html,
  body,
  .container {
    color: rgb(182, 182, 182);
    font-size: 0.14rem;
    -moz-user-select:none;
    -webkit-user-select:none;
    background: rgb(16, 16, 16);
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
  .van-checkbox .van-icon-success {
    border: 1px solid rgb(213, 184, 132);
    border-radius: 0.02rem;
    color: #000;
  }

  .van-checkbox__control:checked + .van-icon-success {
    border-color: rgb(213, 184, 132);
    background-color: rgb(213, 184, 132);
    color: rgb(14, 14, 14);
  }

  .space {
    height: .2rem;
  }
</style>

