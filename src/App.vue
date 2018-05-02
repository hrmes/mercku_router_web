<template>
  <transition :name="transitionName">
    <router-view class="app-container"></router-view>
  </transition>
</template>
<script>
import 'vant/lib/vant-css/index.css';
import 'vant/lib/vant-css/icon-local.css';
import './style/style.scss';

export default {
  data() {
    return {
      transitionName: 'slide-left'
    };
  },
  watch: {
    $route(to, from) {
      if (
        to.path === '/wan-hand' &&
        ['/pppoe', '/dhcp', '/static-ip'].includes(from.path)
      ) {
        this.transitionName = 'slide-right';
      } else if (to.path === '/welcome') {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
      }
      // console.log(this.transitionName);
    }
  }
};
</script>
