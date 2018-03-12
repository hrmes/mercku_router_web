<template>
  <div class="login-page">
    <div class="bg-container">
      <img class="logo" src="../../../static/1.jpg" alt="">
    </div>
    <div class="pwd-container">
      <div class="pwd-input">
        <van-field v-model="value" :placeholder="$t('trans0067')" />
      </div>
      <div class="pwd-preview">
        <van-icon name="password-view" />
      </div>
    </div>
    <div class="button-container">
      <van-button>{{$t('trans0001')}}</van-button>
    </div>
  </div>
</template>
<script>
export default {

};
</script>
<style lang="scss" scoped>
.login-page {
  padding: 0.6rem 0.2rem 0;
  .bg-container {
    height: 3rem;
    background: url(../../../static/1.jpg);
    background-size: 100% 100%;
    position: relative;
    .logo {
      width: 2.2rem;
      height: 0.35rem;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
    }
  }
  .pwd-container {
    margin-top: 0.35rem;
    position: relative;
    .pwd-input {
      width: 100%;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .pwd-preview {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      width: 0.2rem;
      text-align: center;
    }
  }
  .button-container {
    text-align: center;
    margin-top: 1.4rem;
  }
}
</style>
