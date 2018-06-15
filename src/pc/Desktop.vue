<template>
  <div class="container">
    <mercku-menu class="menu" :menus="menus" v-if="!hasMenu"></mercku-menu>
    <router-view class="router-view"></router-view>
  </div>

</template>
<script>
import MerckuMenu from './component/menu/index.vue';
import './style/common.scss';

export default {
  components: {
    'mercku-menu': MerckuMenu
  },
  computed: {
    hasMenu() {
      return (
        this.$route.path.includes('login') ||
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('disappear')
      );
    },
    hasExit() {
      return !this.hasMenu;
    }
  },
  data() {
    return {
      menus: [
        {
          icon: 'wifi',
          text: 'trans0173',
          url: '/home',
          expand: this.$route.path.includes('/home')
        },
        {
          icon: 'setting',
          text: 'trans0019',
          expand:
            this.$route.path.includes('/setting/wifi') ||
            this.$route.path.includes('/setting/network') ||
            this.$route.path.includes('/setting/safe') ||
            this.$route.path.includes('/setting/reboot'),
          children: [
            {
              text: 'trans0103',
              url: '/setting/wifi'
            },
            {
              text: 'trans0142',
              url: '/setting/network'
            },
            {
              text: 'trans0297',
              url: '/setting/safe'
            },
            {
              text: 'trans0122',
              url: '/setting/reboot'
            }
          ]
        }
      ]
    };
  }
};
</script>
<style lang="scss">
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
.container {
  min-height: 100vh;
  position: relative;
  display: flex;
  &.no-menu {
    height: 100%;
  }
  .header {
    width: 100%;
    flex: 0 0 auto;
    &.has-menu {
      background: #fff;
      display: block;
      // top: 0;
      // z-index: 1000;
      .logo-container {
        display: inline-block;
      }
    }
  }
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .policy {
    width: 100%;
    text-align: center;
    color: #333;
    &.fix-bottom {
      background: #fff;
    }
  }
}
@media screen and (min-width: 769px) {
  .container {
    .header {
      &.has-menu {
        // position: fixed;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .container {
    .app-container {
      &.has-menu {
        padding-left: 0;
        height: calc(100% - 65px);
      }
    }
    .header {
      display: none;
    }
    .policy {
      font-size: 12px;
      &.fix-bottom {
        position: static;
      }
    }
  }
}
</style>
