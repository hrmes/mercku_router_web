<template>
  <div class="scrollbar-wrap">
    <div class="container">
      <div class="app-container router-view">
        <div ref="flexWrap"
             class="flex-wrap"
             :class="{'nav-visiable':!navVisible}">
          <m-header :navVisible="!navVisible"
                    :isLoginPage="isLoginPage"
                    :logoVisible="!isLoginPage"
                    :navs="menus"
                    class="header"></m-header>
          <router-view></router-view>
          <m-policy :locale="$i18n.locale"
                    :class="{'fix-bottom':navVisible}"
                    class="policy" />
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
    isLoginPage() {
      return this.$route.path.includes('login');
    },
    navVisible() {
      const { path } = this.$route;
      const visible =
        path.includes('login') ||
        path.includes('wlan') ||
        path.includes('unconnect');
      return visible;
    },
    menus() {
      console.log("from base/src/App.vue");
      console.log("this.$store.role, this.$store.mode", this.$store.role, this.$store.mode);
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
.scrollbar-wrap {
  height: 100%;
  overflow: auto;
}
.flex-wrap {
  display: flex;
  flex-direction: column;
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
