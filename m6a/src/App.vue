<template>
  <div class="srcollbar-wrap"
       :class="{'is-login-page':isLoginPage}">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{ 'has-menu': navVisible }">
          <m-header :navVisible="navVisible"
                    :isLoginPage="isLoginPage"
                    :isWlanPage="isWlanPage"
                    :navs="menus" />
          <component :is="layout"
                     :hasBackWrap='hasBackWrap'
                     :asideInfo='asideInfo'></component>
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
    isLoginPage() {
      return this.$route.path.includes('login');
    },
    isWlanPage() {
      return this.$route.path.includes('wlan');
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
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.srcollbar-wrap {
  height: 100%;
  overflow: auto;
  &.is-login-page {
    background: var(--scrollbar_wrap-bgc__isLogin);
  }
  background: var(--scrollbar_wrap-bgc__isNotLogin);
  @media screen and (min-width: 768px) {
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: var(--scrollbar_wrap-track-color);
      // border-radius: 100px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar_wrap-thumb-color);
      border-radius: 100px;
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
