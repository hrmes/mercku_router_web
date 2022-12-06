<template>
  <div class="layout-wrap  primary">
    <div v-if="hasBackWrap"
         class="back-wrap">
      <div class="btn-container"
           @click="onBack($route.meta.parentPath)">
        <i class="iconfont icon-ic_back"></i>
      </div>
      <div class="text-container">{{pageName}}</div>
    </div>
    <div class="content-wrap">
      <div v-if="hasAside"
           class="left-aside"></div>
      <router-view class="router-view">
      </router-view>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hasBackWrap: {
      type: Boolean,
      default: false
    },
    hasAside: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const that = this;
    this.getIsMobile(that);
    window.addEventListener('resize', () => {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.isMobile = true;
      } else {
        that.$store.isMobile = false;
      }
    });
  },
  computed: {
    pageName() {
      return this.$route.meta.text;
    },
  },
  methods: {
    onBack(target) {
      console.log(target);
      this.$router.replace({ path: target });
    },
    getIsMobile(that) {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.isMobile = true;
      } else {
        that.$store.isMobile = false;
      }
    },
    windowWidth() {
      if (window.innerWidth) return window.innerWidth;
      if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      return 0;
    },
  }
};
</script>

<style lang="scss" scoped>
.primary {
  padding: 0 5%;
  display: flex;
  flex-direction: column;
  .back-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 60px;
    color: var(--text-default-color);
    .text-container {
      font-size: 18px;
      font-weight: 500;
    }
    .btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
      background: var(--dashboard-unconnect-icon-background-color);
      box-shadow: 0 5px 10px -5px rgba(51, 51, 51, 0.3);
    }
  }
  .content-wrap {
    flex: 1;
    display: flex;
    .left-aside {
      width: 17vw;
      margin-right: 10px;
      background-color: lightblue;
      border-radius: 10px;
    }
    .router-view {
      flex: 1;
      background: var(--dashboard-icon-background-color);
      border-radius: 10px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .primary {
    padding: 0 45px;
  }
}
@media screen and (max-width: 768px) {
  .primary {
    padding: 0 !important;
    .back-wrap {
      height: 55px;
      padding: 0 15px;
      .text-container {
        font-size: 16px;
      }
      .btn-container {
        width: 30px;
        height: 30px;
      }
    }
    .content-wrap {
      .left-aside {
        display: none;
      }
    }
  }
}
</style>
