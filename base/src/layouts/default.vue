<template>
  <router-view class="default">
  </router-view>
</template>

<script>
export default {
  mounted() {
    const that = this;
    this.getIsMobile(that);
    window.addEventListener('resize', () => {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.state.isMobile = true;
      } else {
        that.$store.state.isMobile = false;
      }
    });
  },
  methods: {
    getIsMobile(that) {
      const w = that.windowWidth();
      if (w <= 768) {
        that.$store.state.isMobile = true;
      } else {
        that.$store.state.isMobile = false;
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
<style lang="scss">
.default {
  min-width: 1280px;
}
@media screen and (max-width: 768px) {
  .default {
    min-width: auto;
  }
}
</style>
