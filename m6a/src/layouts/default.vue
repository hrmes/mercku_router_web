<template>
  <router-view transition-style="out:circle:center">
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

<style >
@keyframes circle-out-center {
  from {
    clip-path: circle(0%);
  }
  to {
    clip-path: circle(125%);
  }
}

[transition-style='out:circle:center'] {
  animation: 2.5s cubic-bezier(0.25, 1, 0.3, 1) circle-out-center both;
}
</style>
