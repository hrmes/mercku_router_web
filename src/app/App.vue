<template>
  <transition :name="transitionName">
    <router-view class="app-container animation"></router-view>
  </transition>
</template>
<script>
/*
  Button,
  Field,
  Icon,
  Checkbox,
  Dialog,
  Cell,
  CellGroup,
  Toast

*/
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
    }
  }
};
</script>
