<template>
    <div class="check-network-page">
      <div class="banner-container">
        <img src="../../../static/1.jpg" alt="">
      </div>
    <div class="info">
      <p class="p1">{{$t('trans0140')}}</p>
      <p class="p2">{{$t('trans0141')}}</p>
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
.check-network-page {
  padding: 0.6rem 0.2rem 0;
  .banner-container {
    width: 3.35rem;
    height: 2.7rem;
    font-size: 0.2rem;
    text-align: center;
    color: rgb(1, 1, 1);
    position: relative;
    p {
      position: absolute;
      width: 100%;
      top: 0.25rem;
      font-weight: bold;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.16rem;
    }
  }
  .info {
    margin-top: 0.65rem;
    .p1,
    .p2 {
      text-align: center;
      color: rgb(142, 142, 147);
      margin: 0;
    }
  }
}
</style>
