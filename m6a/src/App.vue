<template>
  <div class="scrollbar-wrap"
       :class="{'is-login-page':isLoginPage}">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap">
          <m-header :navVisible="navVisible"
                    :isLoginPage="isLoginPage"
                    :isWlanPage="isWlanPage"
                    :navs="menus"
                    id="header" />
          <component v-if="isMobile"
                     :is="layout"
                     :hasBackWrap='hasBackWrap'
                     :asideInfo='asideInfo'></component>
          <transition v-else
                      :name="transitionName"
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
    isMobile() {
      return this.$store.state.isMobile;
    },
    layout() {
      const { layout } = this.$route.meta;
      return layout || 'default';
    },
    transitionName() {
      const { transition } = this.$route.meta;
      return transition;
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
    }
  },

  methods: {
    setHeight() {
      const flexWrap = document.querySelector('.flex-wrap');
      // fix safari
      const contentMinHeight = 600; // 定义内容区域最小高度
      const height = Math.max(document.body.clientHeight, contentMinHeight);
      flexWrap.style.minHeight = `${height}px`;
    },
    // 滚动添加删除header的box-shadow
    listenScroll() {
      const header = document.querySelector('#header');
      const scrollbar = document.querySelector('.scrollbar-wrap');
      const handleScroll = () => {
        if (this.isLoginPage || this.isWlanPage) return;
        const scrollY = scrollbar.scrollTop;
        header.classList.toggle('with-shadow', scrollY > 0);
      };
      scrollbar.addEventListener('scroll', handleScroll);
    },
    removeEventListeners() {
      window.removeEventListener('resize', () => {
        this.setHeight();
      });
      const scrollbar = document.querySelector('.scrollbar-wrap');
      scrollbar.removeEventListener('scroll', this.handleScroll);
    }
  },
  mounted() {
    this.setHeight();
    this.listenScroll();
    window.addEventListener('resize', () => {
      this.setHeight();
    });
    this.$router.beforeEach((to, from, next) => {
      // 判断是否是手机端
      // eslint-disable-next-line max-len
      const scrollPage = document.querySelector('.scrollbar-wrap');
      // 判断是否是跳转到新页面
      if (this.isMobile && to.path !== from.path) {
        scrollPage.scrollTop = 0;
      }
      next();
    });
  },
  beforeDestroy() {
    this.removeEventListeners();
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
  background: var(--table-action-popover-bgc);
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
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.scrollbar-wrap {
  height: 100%;
  overflow: auto;
  font-family: 'PingFang', sans-serif;
  background: var(--scrollbar_wrap-bgc__isNotLogin);
  &.is-login-page {
    background: var(--scrollbar_wrap-bgc__isLogin);
  }
  @media screen and (min-width: 768px) {
    &::-webkit-scrollbar,
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track,
    ::-webkit-scrollbar-track {
      background-color: var(--scrollbar_wrap-track-color);
      // border-radius: 100px;
    }
    &::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap-thumb-color);
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
  color: var(--text-default-color);
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
