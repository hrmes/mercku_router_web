<template>
  <div class="disappear-container">
    <img src="../../../assets/images/img_no_network_access.png" alt="">
    <div class="text">{{$t('trans0039')}}</div>
    <button @click="tohome" class="btn">{{$t('trans0063')}}</button>
  </div>
</template>
<script>
export default {
  methods: {
    tohome() {
      this.$http
        .getRouter()
        .then(() => {
          this.$router.push({ path: '/login' });
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$toast(this.$t('trans0039'));
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.disappear-container {
  background: #fff;
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
    width: 80%;
    margin: 0 auto;
    .btn {
      margin-bottom: 40px;
    }
  }
}
</style>
