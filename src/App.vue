<template>
  <m-scrollbar class="srcollbar-wrap">
    <div class="container">
      <m-menu class="menu"
              :menus="menus"
              v-if="!menuVisible"></m-menu>
      <div class="app-container router-view">
        <div class="flex-wrap"
             :class="{'has-menu':!menuVisible}">
          <m-header :hasExit="!menuVisible"
                    class="header"
                    :class="{'no-menu':menuVisible}"></m-header>
          <router-view></router-view>
          <m-policy :locale="$i18n.locale"
                    :class="{'fix-bottom':menuVisible}"
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
    menuVisible() {
      const { path } = this.$route;
      return (
        path.includes('login') ||
        path.includes('wlan') ||
        path.includes('unconnect')
      );
    }
  },
  watch: {
    '$store.role': function watcher() {
      this.role = this.$store.role;
    },
    '$store.mode': function watcher() {
      this.menus = getMenu(this.role, this.$store.mode);
    },
    role() {
      this.menus = getMenu(this.role, this.$store.mode);
    }
  },
  mounted() {
    this.$http.getMeshMode().then(res => {
      this.$store.mode = res.data.result;
    });
  },
  data() {
    return {
      role: this.$store.role,
      menus: getMenu(this.role, this.$store.mode)
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
