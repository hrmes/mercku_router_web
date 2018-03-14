<template>

  <div class="welcome-page">
    <nav-bar/>
    <div class="banner-container">
      <p>{{$t('trans0136')}}</p>
      <img src="../../../static/1.jpg" alt="">
    </div>
    <div class="policy">
      <p class="p1">{{$t('trans0137')}}</p>
      <div style="clear:both;"></div>
      <a class="policy-link" href="">{{$t('trans0139')}}</a>
    </div>
    <div class="button-container">
      <van-button size="normal" @click="agree">{{$t('trans0138')}}</van-button>
    </div>
  </div>

</template>

<script>
import nav from '../../component/nav-bar.vue';

export default {
  methods: {
    agree() {
      this.$router.replace({ path: '/login' });
    }
  },
  components: {
    'nav-bar': nav
  }
};
</script>

<style lang="scss" scoped>
.welcome-page {
  padding: 0rem 0.15rem;
  margin: 0 auto;
  .banner-container {
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
      width: 3.35rem;
      height: 2.7rem;
      border-radius: 0.16rem;
    }
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
    margin-top: 1.42rem;
  }
}
</style>
