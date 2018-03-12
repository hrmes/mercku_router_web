<template>

  <div class="welcome-page">
    <div class="banner-container">
      <img src="" alt="">
    </div>
    <div>
      <p class="p1"></p>
      <p class="p2"></p>
      <a class="policy-link" href="">{{$t('trans0139')}}</a>
    </div>
    <div class="button-container">
      <van-button size="normal">{{$t('trans0138')}}</van-button>
    </div>
  </div>

</template>

<script>
export default {
  mounted() {

  }
};
</script>

<style lang="scss" scoped>
.welcome-page {
  .baber-container {
  }
  .button-container {
    text-align: center;
  }
}
</style>
