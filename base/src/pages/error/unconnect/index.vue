<template>
  <div class="unconnect">
    <div class="inner">
      <img :src="require('base/assets/images/common/img_no_network_access.png')" />
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
        this.$http.checkLogin().then(res1 => {
          if (res1.data.result.status) {
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
.unconnect {
  padding: 0 30px;
  flex: auto;
  min-height: 500px;
  .inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    border-radius: 10px;
    box-shadow: var(--common_card-boxshadow);
    background: var(--primary-bgc);
  }
  img {
    display: block;
    width: 200px;
    margin: 0 auto;
  }
  .text {
    margin-top: 20px;
  }
  .btn {
    margin: 0 auto;
    margin-top: 40px;
  }
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
@media screen and(max-width: 768px) {
  .unconnect {
    padding: 0;
    .inner {
      border-radius: 0;
      padding: 0 15px;
    }
  }
}
</style>
