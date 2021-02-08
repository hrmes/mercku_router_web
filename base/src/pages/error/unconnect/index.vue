<template>
  <div class="disappear-container">
    <div class="inner">
      <img src="~base/assets/images/img_no_network_access.png"
           alt="">
      <div class="text">{{$t('trans0132')}}</div>
      <button @click="tohome"
              class="btn">{{$t('trans0063')}}</button>
    </div>
  </div>
</template>
<script>
import upgradeHelper from 'base/util/upgrade';

export default {
  methods: {
    tohome() {
      this.$http.getHomePage().then(result => {
        upgradeHelper(result.data);
        this.$http.getRouter().then(() => {
          this.$http.checkLogin().then(res => {
            if (res.data.result.status) {
              this.$router.push({ path: '/dashboard' });
            } else {
              this.$router.push({ path: '/login' });
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.disappear-container {
  background: #fff;
  padding: 50px;
  flex: auto;
  min-height: 500px;
  img {
    display: block;
    width: 200px;
    margin: 0 auto;
  }
  .text {
    margin-top: 40px;
  }
  .btn {
    display: block;
    margin: 0 auto;
    margin-top: 60px;
  }
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
@media screen and(max-width: 678px) {
  .disappear-container {
    .inner {
      width: 80%;
      margin: 0 auto;
      .btn {
        margin-bottom: 40px;
      }
    }
  }
}
</style>
