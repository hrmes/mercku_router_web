<template>
  <transition :name="transitionName">
    <router-view class="app-container animation"></router-view>
  </transition>
</template>
<script>
import 'vant/lib/vant-css/base.css';
import 'vant/lib/vant-css/dialog.css';
import './style/style.scss';

export default {
  data() {
    return {
      transitionName: 'slide-left'
    };
  },
  watch: {
    $route(to) {
      if (to.path === '/wan-fail') {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
      }
    }
  }
};
</script>
