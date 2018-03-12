<template>

  <div class="welcome-page">
    <div class="banner-container">
      <img src="" alt="">
    </div>
    <div class="policy">
      <p class="p1">{{$t('trans0137')}}</p>
      <div style="clear:both;"></div>
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
  padding: 0.6rem 0.2rem;
  .banner-container {
    width: 3.35rem;
    height: 2.69rem;
  }
  .policy {
    text-align: right;
    .p1 {
      width: 2rem;
      float: right;
    }
    .policy-link {
      color: rgb(182, 182, 182);
      text-decoration: underline;
    }
  }

  .button-container {
    text-align: center;
    margin-top: 1.2rem;
  }
}
</style>
