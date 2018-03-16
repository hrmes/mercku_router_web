<template>
  <transition :name="transitionName">
    <router-view class="app-container"></router-view>
  </transition>
</template>
<script>
import 'vant/packages/vant-css/src/base.css';
import './style/style.scss';

export default {
  data() {
    return {
      transitionName: 'slide-left'
    };
  },
  mounted() {
    this.$http.checkLogin().then(res => res).catch(() => {
      // 用户未登录
      this.$router.returnUrl = window.location.href;
      this.$router.replace({ path: '/login' });
    });
  },
  watch: {
    $route(to, from) {
      console.log(to.path);
      if (to.path === '/wan-hand') {
        if (['/pppoe', '/dhcp', '/static-ip'].includes(from.path)) {
          this.transitionName = 'slide-right';
        }
      } else if (to.path === '/welcome') {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
      }
      console.log(this.transitionName);
    }
  }
};
</script>
