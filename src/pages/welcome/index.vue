<template>

  <div class="welcome-page">
    <div class="banner-container">
      <img src="" alt="">
    </div>
    <div>
      <p class="p1"></p>
      <p class="p2"></p>
      <a class="policy-link" href=""></a>
    </div>
    <div class="button-container">
      <van-button size="normal">普通按钮</van-button>
    </div>
  </div>

</template>

<script>
export default {
  mounted() {
    this.changeLanguage('en-US');
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
