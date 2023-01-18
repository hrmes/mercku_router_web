<template>
  <div class="srcollbar-wrap">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{ 'has-menu': navVisible }">
          <m-header :navVisible="navVisible"
                    :isLoginPage="!logoVisible"
                    :logoVisible="logoVisible"
                    :navs="menus"
                    class="header"></m-header>
          <component :is="layout"
                     :hasBackWrap='hasBackWrap'
                     :asideInfo='asideInfo'></component>
          <m-policy :locale="$i18n.locale"
                    :isLoginPage="!logoVisible"
                    :class="{ 'fix-bottom': !navVisible }"
                    class="policy" />
          <img v-if="$route.path.includes('login')"
               class="login-logo__left__top"
               src="@/assets/images/customer/mercku/login_logo.png"
               alt="">
          <img v-if="$route.path.includes('login')"
               class="login-logo__right__bottom"
               src="@/assets/images/customer/mercku/login_logo.png"
               alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './style/common.scss';
import defaultLayout from './layouts/default.vue';
import primaryLayout from './layouts/primary.vue';
import getMenu from './menu';

export default {
  components: {
    default: defaultLayout,
    primary: primaryLayout,
  },
  computed: {
    layout() {
      const { layout } = this.$route.meta;
      return layout || 'default';
    },
    hasBackWrap() {
      const { hasBackWrap } = this.$route.meta;
      return hasBackWrap;
    },
    asideInfo() {
      const { hasAside } = this.$route.meta;
      let subMenu = [];
      if (hasAside) {
        const { 2: mainMenuName } = this.$route.path.split('/');
        switch (mainMenuName) {
          case 'setting':
            subMenu = this.menus.filter(item => item.name === 'setting');
            break;
          case 'advance':
            subMenu = this.menus.filter(item => item.name === 'advance');
            break;
          case 'upgrade':
            subMenu = this.menus.filter(item => item.name === 'upgrade');
            break;
          default:
            break;
        }
      }
      const asideInfo = { hasAside, subMenu };
      return asideInfo;
    },
    logoVisible() {
      return !this.$route.path.includes('login');
    },
    navVisible() {
      const { path } = this.$route;
      const visible = path.includes('login') || path.includes('wlan') || path.includes('unconnect');
      return !visible;
    },
    menus() {
      return getMenu(this.$store.state.role, this.$store.state.mode);
    }
  },
  methods: {
    setHeight() {
      // fix safari
      const contentMinHeight = 600; // 定义内容区域最小高度
      let height = 0;
      if (document.body.clientHeight > contentMinHeight) {
        height = document.body.clientHeight;
      } else {
        height = contentMinHeight;
      }
      this.$refs.flexWrap.style.minHeight = `${height}px`;
    },
  },
  mounted() {
    this.setHeight();
    window.addEventListener('resize', () => {
      this.setHeight();
    });
  }
};
</script>

<style lang="scss">
* {
  font-family: 'NotoSansCJKsc', 'PingFang SC ';
}
.srcollbar-wrap {
  height: 100%;
  overflow: auto;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
  color: var(--text-default-color);
  background-color: var(--primaryBackgroundColor);
  > img {
    position: fixed;
    width: 26.875rem;
    height: 26.875rem;
  }
  .login-logo__left__top {
    top: 0;
    left: 0;
  }
  .login-logo__right__bottom {
    bottom: 0;
    right: 0;
    transform: rotate(180deg);
  }
  &.has-menu {
    background-color: var(--flex-warp-has-menu-bgc);
  }
}
.container {
  position: relative;
  display: flex;
  .app-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  }
  .header {
    z-index: 1000;
  }
  .layout-wrap {
    flex: 1;
  }
  .policy {
    width: 100%;
    text-align: center;
    color: var(--text-default-color);
    &.fix-bottom {
      background: var(--primaryBackgroundColor);
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
    .login-logo__left__top,
    .login-logo__right__bottom {
      display: none;
    }
  }
}
</style>
