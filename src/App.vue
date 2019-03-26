<template>
  <m-scrollbar ref="wrap"
               class="srcollbar-wrap"
               :option="scrollbarOpt">
    <div class="container">
      <div class="app-container router-view">
        <div class="flex-wrap"
             :class="{'has-menu':!navVisible}">
          <m-header :navVisible="!navVisible"
                    :navs="menus"
                    class="header"></m-header>
          <router-view></router-view>
          <m-policy :locale="$i18n.locale"
                    :class="{'fix-bottom':navVisible}"
                    class="policy" />
        </div>
      </div>
    </div>
  </m-scrollbar>
</template>
<script>
import './style/common.scss';
import getMenu from './menu';

export default {
  computed: {
    navVisible() {
      const { path } = this.$route;
      const visible =
        path.includes('login') ||
        path.includes('wlan') ||
        path.includes('unconnect');
      return visible;
    },
    menus() {
      return getMenu(this.$store.role, this.$store.mode);
    }
  },
  data() {
    return {
      scrollbarOpt: {
        scrollbar: false
      }
    };
  }
};
</script>
<style lang="scss">
.srcollbar-wrap {
  height: 100%;
}
.flex-wrap {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
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
    &.no-menu {
      background: #fff;
      display: flex;
      justify-content: space-between;
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
  .flex-wrap {
    &.has-menu {
      min-height: calc(100vh - 65px);
    }
  }
  .container {
    flex-direction: column;
    .app-container {
      &.has-menu {
        padding-left: 0;
        height: calc(100% - 65px);
      }
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
