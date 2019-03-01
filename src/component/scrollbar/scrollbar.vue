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

export default {
  props: {
    // 设置滚动条的基本属性
    option: {
      type: Object,
      default: () => ({
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
      })
    },
    data: {
      type: Array,
      default: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  methods: {
    // 初始化滚动条
    initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }

      if (this.option.scrollY) {
        this.$refs.wrapper.style.overflowY = 'hidden';
      }
      if (this.option.scrollX) {
        this.$refs.wrapper.style.overflowX = 'hidden';
      }

      this.scroll = new BScroll(this.$refs.wrapper, this.option);
    },
    // 刷新滚动条
    refresh() {
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
