<template>
  <div class="scroll-wrap"
       ref="wrapper">
    <div class="scroll-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

const defaultOpt = {
  probeType: 1,
  eventPassthrough: 'horizontal',
  scrollY: true,
  scrollX: false,
  disableMouse: true,
  preventDefault: true,
  disableTouch: false,
  stopPropagation: false,
  mouseWheel: true,
  bounce: false,
  scrollbar: { fade: true }
};
export default {
  props: {
    option: {
      type: Object,
      default: () => defaultOpt
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    this.opt = Object.assign({}, defaultOpt, this.option);
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }

      if (this.opt.scrollY) {
        this.$refs.wrapper.style.overflowY = 'hidden';
      }
      if (this.opt.scrollX) {
        this.$refs.wrapper.style.overflowX = 'hidden';
      }

      this.scroll = new BScroll(this.$refs.wrapper, this.opt);
    },
    refresh() {
      console.log('refresh');
      this.scroll && this.scroll.refresh();
    },
    scrollBy(x, y) {
      this.scroll && this.scroll.scrollBy(x, y);
    },
    scrollTo(x, y) {
      this.scroll && this.scroll.scrollTo(x, y);
    },
    scrollToElement(el) {
      this.scroll && this.scroll.scrollToElement(el);
    }
  },
  beforeDestroy() {
    this.scroll && this.scroll.destroy();
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-wrap {
  position: relative;
}
</style>
