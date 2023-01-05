<template>
  <div class="disappear-container">
    <div class="inner">
      <img src="../../../assets/images/img_no_network_access.webp"
           alt="">
      <div class="text">{{tips}}</div>
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
        this.$http.getRouter().then(res1 => {
          const { data: { result: { sn } } } = res1;
          this.currentModelVersion = sn.slice(9, 10);
          this.$store.state.modelVersion = this.currentModelVersion;
          localStorage.setItem('modelVersion', this.currentModelVersion);
          this.$http.checkLogin().then(res2 => {
            if (res2.data.result.status) {
              // m6 session不会过期，修改模式后不会重新登录，不重新设置模式可能导致菜单不刷新
              this.$http.getMeshMode().then(res3 => {
                this.$store.state.mode = res3.data.result.mode;
                this.$router.push({ path: '/dashboard' });
              });
            } else {
              this.$router.push({ path: '/login' });
            }
          });
        });
      });
    }
  },
  computed: {
    tips() {
      return this.$t('trans0132').replaceAll('%s', process.env.CUSTOMER_CONFIG.wifi);
    }
  }
};
</script>

<style lang="scss" scoped>
.disappear-container {
  background: var(--primaryBackgroundColor);
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
