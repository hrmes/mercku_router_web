<template>
  <transition :name="transitionName">
    <router-view class="app-container" :class="{'animation':isWebview}"></router-view>
  </transition>
</template>
<script>
import 'vant/lib/vant-css/base.css';
import 'vant/lib/vant-css/button.css';
import 'vant/lib/vant-css/field.css';
import 'vant/lib/vant-css/icon.css';
import 'vant/lib/vant-css/checkbox.css';
import 'vant/lib/vant-css/dialog.css';
import 'vant/lib/vant-css/cell.css';
import 'vant/lib/vant-css/toast.css';
import 'vant/lib/vant-css/icon-local.css';
import './style/style.scss';

export default {
  data() {
    return {
      transitionName: 'slide-left'
    };
  },
  computed: {
    isWebview() {
      return this.webview;
    }
  },
  watch: {
    $route(to, from) {
      if (this.webview) {
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
      } else {
        this.transitionName = '';
      }
    }
  }
};
</script>
