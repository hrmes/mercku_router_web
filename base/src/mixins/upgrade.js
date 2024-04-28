const mobileWidth = 768;

export default {
  data() {
    return {
      isRetitleFixed: false,
      nodesInfoMarginTop: 0
    };
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler, true);
    window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    resizeHandler() {
      if (document.body.clientWidth > mobileWidth) {
        this.isRetitleFixed = false;
      } else {
        this.scrollHandler();
      }
    },
    scrollHandler() {
      let flag = false;
      if (this.$refs.renodes && document.body.clientWidth <= mobileWidth) {
        const { top } = this.$refs.renodes.getBoundingClientRect();
        flag = top <= 65;
        const { height } = this.$refs.retitle.getBoundingClientRect();
        this.nodesInfoMarginTop = height;
      }
      this.$nextTick(() => {
        this.isRetitleFixed = flag;
      });
    }
  }
};
