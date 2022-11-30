<template>
  <router-view>
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
        that.$store.isMobile = true;
      } else {
        that.$store.isMobile = false;
      }
    });
  },
  methods: {
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
