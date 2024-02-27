<template>
  <div class="scrollbar-wrap">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{'is-login-page':isLoginPage}">
          <m-header :navVisible="navVisible"
                    :isLoginPage="isLoginPage"
                    :isWlanPage="isWlanPage"
                    :navs="menus"
                    id="header" />
          <transition :name="!isMobile && $store.state.hasTransition?'fade':''"
                      :css="!isMobile && $store.state.hasTransition"
                      mode="out-in">
            <component :is="layout"
                       :hasBackWrap='hasBackWrap'
                       :asideInfo='asideInfo'></component>
          </transition>
          <m-footer :isLoginPage="isLoginPage "
                    :isWlanPage="isWlanPage"
                    :navVisible="navVisible" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'base/style/common.scss';
import '@/style/router-model.scss';
import defaultLayout from 'base/layouts/default.vue';
import primaryLayout from 'base/layouts/primary.vue';
import getMenu from './menu';

export default {
  components: {
    default: defaultLayout,
    primary: primaryLayout
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
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
    isLoginPage() {
      return this.$route.path.includes('login');
    },
    isWlanPage() {
      return this.$route.path.includes('wlan');
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
    header() {
      return document.querySelector('#header');
    },
    scrollbar() {
      return document.querySelector('.scrollbar-wrap');
    }
  },
  mounted() {
    this.updateIsMobile(); // 初始检查
    this.initializePage();

    window.addEventListener('resize', () => {
      this.setHeight();
      this.updateIsMobile();
    });

    this.$router.beforeEach(this.beforeRouteChange);
  },
  beforeDestroy() {
    this.removeEventListeners();
  },
  methods: {
    initializePage() {
      this.setHeight();
      // 手机下，滚动添加删除header的box-shadow
      if (this.isMobile) {
        this.scrollbar.addEventListener('scroll', this.scrollHandler);
      }
    },
    setHeight() {
      const flexWrap = document.querySelector('.flex-wrap');
      // fix safari
      const contentMinHeight = window.innerHeight; // 定义内容区域最小高度
      const height = Math.max(document.body.clientHeight, contentMinHeight);
      flexWrap.style.minHeight = `${height}px`;
    },
    scrollHandler() {
      if (this.isLoginPage || this.isWlanPage) return;
      const scrollY = this.scrollbar.scrollTop;
      this.header.classList.toggle('with-shadow', scrollY > 0);
    },
    removeEventListeners() {
      window.removeEventListener('resize', () => {
        this.setHeight();
        this.updateIsMobile();
      });
      this.scrollbar.removeEventListener('scroll', this.scrollHandler);
    },
    beforeRouteChange(to, from, next) {
      this.handleMobileScroll(to, from);
      this.updateTransitionState(to);
      next();
    },
    handleMobileScroll(to, from) {
      if (this.isMobile && to.path !== from.path) {
        this.scrollbar.scrollTop = 0;
      }
    },
    updateTransitionState(to) {
      this.$store.state.hasTransition = !to.path.includes('/login');
    },
    updateIsMobile() {
      this.$store.state.isMobile = this.windowWidth() <= 768;
    },
    windowWidth() {
      return window.innerWidth || document.documentElement.clientWidth || 0;
    }
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
  bottom: -95%;
  right: 0;
  width: fit-content;
  height: fit-content;
  font-size: 14px;
  padding: 5px 15px 5px;
  color: #ffffff;
  background: var(--table_action_popover-bgc);
  border-radius: 5px;
  white-space: pre;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  cursor: default;
  opacity: 0;
  z-index: 999;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
}
[data-title] {
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.scrollbar-wrap {
  height: 100%;
  overflow: auto;
  @media screen and (min-width: 768px) {
    &::-webkit-scrollbar,
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track,
    ::-webkit-scrollbar-track {
      background-color: var(--scrollbar_wrap_track-color);
      border-radius: 100px;
    }
    &::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap_thumb-color);
      border-radius: 100px;
      &:hover {
        opacity: 0.5;
      }
    }
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
  .layout-wrap {
    flex: 1;
  }
}
.flex-wrap {
  display: flex;
  flex-direction: column;
  color: var(--text_default-color);
  background: var(--scrollbar_wrap-bgc__isNotLogin);
  &.is-login-page {
    background: var(--scrollbar_wrap-bgc__isLogin);
  }
}

@media screen and (max-width: 768px) {
  #header {
    &.with-shadow {
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .scrollbar-wrap {
    min-height: 100dvh;
    // height: 100%;
  }
  .flex-wrap {
    padding-top: 65px;
  }
  .container {
    flex-direction: column;
    .login-logo__left__top,
    .login-logo__right__bottom {
      display: none;
    }
  }
}
</style>
