<template>
  <div class="srcollbar-wrap"
       :class="{ 'nav-visiable': navVisible }"
       v-loading="$loading">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap">
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
               :src="imgSrc"
               alt="">
          <img v-if="$route.path.includes('login')"
               class="login-logo__right__bottom"
               :src="imgSrc"
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
    primary: primaryLayout
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
      const visible =
        path.includes('login') ||
        path.includes('wlan') ||
        path.includes('unconnect');
      return !visible;
    },
    menus() {
      return getMenu(this.$store.state.role, this.$store.state.mode);
    },
    imgSrc() {
      console.log(process.env.CUSTOMER_CONFIG);
      return require(`./assets/images/customer/${process.env.CUSTOMER_CONFIG.title.toLowerCase()}/login_logo.png`);
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
    }
  },
  mounted() {
    this.setHeight();
    window.addEventListener('resize', () => {
      this.setHeight();
    });
    this.$router.beforeEach((to, from, next) => {
      // 判断是否是手机端
      // eslint-disable-next-line max-len
      const { isMobile } = this.$store.state;
      const scrollPage = document.querySelector('.srcollbar-wrap');
      // 判断是否是跳转到新页面
      if (isMobile && to.path !== from.path) {
        scrollPage.scrollTop = 0;
      }
      next();
    });
  }
};
</script>

<style lang="scss">
[data-title]:hover:after {
  opacity: 1;
  visibility: visible;
}
[data-title]:after {
  content: attr(data-title);
  position: absolute;
  bottom: -90%;
  left: 70%;
  width: fit-content;
  height: fit-content;
  padding: 5px 15px 5px;
  color: #ffffff;
  background: var(--table_action_popover-bgc);
  border-radius: 5px;
  white-space: pre;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  cursor: default;
  opacity: 0;
  z-index: 99999;
  visibility: hidden;
}
[data-title] {
  position: relative;
}
.srcollbar-wrap {
  height: 100%;
  overflow: auto;
  background-color: var(--primary-bgc);
  &.nav-visiable {
    background-color: var(--flexwarp_hasmenu-bgc);
  }
}
.flex-wrap {
  display: flex;
  flex-direction: column;
  color: var(--text_default-color);
  > img {
    position: fixed;
    width: 26.875rem;
    height: 26.875rem;
    z-index: 999;
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
    color: var(--text_gery-color);
    &.fix-bottom {
      background: var(--primary-bgc);
    }
  }
}
@media screen and (max-width: 768px) {
  .flex-wrap {
    padding-top: 65px;
  }
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
