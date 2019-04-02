<template>
  <m-scrollbar ref="wrap"
               class="srcollbar-wrap"
               :option="scrollbarOpt">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
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
  mounted() {
    debugger;
    const minHeight = `${document.body.clientHeight}px`;
    this.$refs.flexWrap.style.minHeight = minHeight;
  },
  data() {
    return {
      scrollbarOpt: {
        // scrollbar: false
      }
    };
  }
};
</script>
<style lang="scss">
.srcollbar-wrap {
  height: 100%;
  position: static !important;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
}
.container {
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
  .container {
    flex-direction: column;
    .policy {
      font-size: 12px;
      &.fix-bottom {
        position: static;
      }
    }
  }
}
</style>
