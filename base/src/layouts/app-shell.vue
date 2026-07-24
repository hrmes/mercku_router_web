<template>
  <div ref="scrollbar"
       class="scrollbar-wrap">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{'is-login-page':isLoginPage}">
          <m-header ref="header"
                    id="header"
                    :navVisible="navVisible"
                    :isLoginPage="isLoginPage"
                    :isWlanPage="isWlanPage"
                    :navs="menus" />
          <transition :name="!isMobile && $store.state.hasTransition?'fade':''"
                      :css="!isMobile && $store.state.hasTransition"
                      mode="out-in">
            <component :is="layout"
                       :hasBackWrap="hasBackWrap"
                       :asideInfo="asideInfo" />
          </transition>
          <m-footer :isLoginPage="isLoginPage"
                    :isWlanPage="isWlanPage"
                    :navVisible="navVisible" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultLayout from 'base/layouts/default.vue';
import primaryLayout from 'base/layouts/primary.vue';

function normalizePath(path) {
  return String(path || '').replace(/^\/web(?=\/|$)/, '') || '/';
}

function pathMatches(path, url) {
  if (!url) return false;
  const normalized = normalizePath(path);
  return normalized === url || normalized.startsWith(`${url}/`);
}

export default {
  name: 'BaseAppShell',
  components: {
    default: defaultLayout,
    primary: primaryLayout
  },
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listeningForScroll: false,
      removeRouteGuard: null
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    layout() {
      return (this.$route.meta && this.$route.meta.layout) || 'default';
    },
    hasBackWrap() {
      return Boolean(this.$route.meta && this.$route.meta.hasBackWrap);
    },
    asideInfo() {
      const wantsAside = Boolean(this.$route.meta && this.$route.meta.hasAside);
      if (!wantsAside) return { hasAside: false, subMenu: [] };

      const activeGroup = this.menus.find(menu => (
        Array.isArray(menu.children) &&
        menu.children.some(child => pathMatches(this.$route.path, child.url))
      ));

      return activeGroup
        ? { hasAside: true, subMenu: [activeGroup] }
        : { hasAside: false, subMenu: [] };
    },
    isLoginPage() {
      return this.$route.path.includes('login');
    },
    isWlanPage() {
      return this.$route.path.includes('wlan');
    },
    navVisible() {
      const { path } = this.$route;
      return !(
        path.includes('login') ||
        path.includes('wlan') ||
        path.includes('unconnect')
      );
    }
  },
  watch: {
    isMobile() {
      this.syncScrollListener();
    }
  },
  mounted() {
    this.onResize();
    this.setHeight();
    this.syncScrollListener();
    window.addEventListener('resize', this.onResize);
    this.removeRouteGuard = this.$router.beforeEach(this.beforeRouteChange);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    this.removeScrollListener();
    if (typeof this.removeRouteGuard === 'function') this.removeRouteGuard();
  },
  methods: {
    setHeight() {
      if (!this.$refs.flexWrap) return;
      const height = Math.max(document.body.clientHeight, window.innerHeight);
      this.$refs.flexWrap.style.minHeight = `${height}px`;
    },
    onResize() {
      this.setHeight();
      this.$store.state.isMobile = this.windowWidth() <= 768;
    },
    windowWidth() {
      return window.innerWidth || document.documentElement.clientWidth || 0;
    },
    syncScrollListener() {
      if (this.isMobile && !this.listeningForScroll && this.$refs.scrollbar) {
        this.$refs.scrollbar.addEventListener('scroll', this.scrollHandler);
        this.listeningForScroll = true;
      } else if (!this.isMobile) {
        this.removeScrollListener();
      }
    },
    removeScrollListener() {
      if (!this.listeningForScroll || !this.$refs.scrollbar) return;
      this.$refs.scrollbar.removeEventListener('scroll', this.scrollHandler);
      this.listeningForScroll = false;
    },
    scrollHandler() {
      if (this.isLoginPage || this.isWlanPage) return;
      const header = this.$refs.header && this.$refs.header.$el;
      if (header) header.classList.toggle('with-shadow', this.$refs.scrollbar.scrollTop > 0);
    },
    beforeRouteChange(to, from, next) {
      if (this.isMobile && to.path !== from.path && this.$refs.scrollbar) {
        this.$refs.scrollbar.scrollTop = 0;
      }
      this.$store.state.hasTransition = !to.path.includes('/login');
      next();
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
  padding: 5px 15px;
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
  #header.with-shadow {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .scrollbar-wrap {
    min-height: 100dvh;
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
