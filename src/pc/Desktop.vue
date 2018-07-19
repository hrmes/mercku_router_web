<template>
  <div class="container">
    <mercku-menu class="menu" :menus="menus" v-if="!menu_hidden"></mercku-menu>
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
    menu_hidden() {
      return (
        this.$route.path.includes('login') ||
        this.$route.path.includes('wlan') ||
        this.$route.path.includes('unconnect')
      );
    }
  },
  data() {
    return {
      menus: [
        {
          icon: 'wifi',
          text: 'trans0173',
          url: '/home',
          key: 1
        },
        {
          icon: 'setting',
          text: 'trans0019',
          key: 2,
          children: [
            {
              key: 21,
              text: 'trans0103',
              url: '/setting/wifi'
            },
            {
              key: 22,
              text: 'trans0142',
              url: '/setting/network'
            },
            {
              key: 23,
              text: 'trans0297',
              url: '/setting/safe'
            },
            {
              key: 24,
              text: 'trans0122',
              url: '/setting/reboot'
            }
          ]
        },
        {
          key: 3,
          icon: 'upgrade',
          text: 'trans0197',
          children: [
            {
              url: '/upgrade/online',
              key: 31,
              text: 'trans0202'
            },
            {
              url: '/upgrade/offline',
              key: 32,
              text: 'trans0204'
            }
          ]
        }
      ]
    };
  }
};
</script>
<style lang="scss">
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
      .logo-container {
        display: inline-block;
      }
    }
  }
  .app-container {
    display: flex;
    flex: 1;
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
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
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
