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
          <router-view></router-view>
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
import getMenu from './menu';

export default {
  computed: {
    logoVisible() {
      return !this.$route.path.includes('login');
    },
    navVisible() {
      const { path } = this.$route;
      const visible = path.includes('login') || path.includes('wlan') || path.includes('unconnect');
      return !visible;
    },
    menus() {
      return getMenu(this.$store.role, this.$store.mode);
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
  }
};
</script>
<style lang="scss">
.srcollbar-wrap {
  height: 100%;
  overflow: auto;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
  background-color: var(--flex-warp-bgc);
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
