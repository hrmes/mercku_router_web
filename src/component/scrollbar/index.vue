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
    option: {
      type: Object,
      default: () => ({
        probeType: {
          default: 1,
          type: Number
        },
        eventPassthrough: 'horizontal',
        scrollY: true,
        scrollX: false,
        disableMouse: {
          type: Boolean,
          default: true
        },
        preventDefault: {
          type: Boolean,
          default: false
        },
        disableTouch: {
          type: Boolean,
          default: false
        },
        stopPropagation: {
          type: Boolean,
          default: true
        },
        mouseWheel: true,
        scrollbar: {
          type: Object,
          default: () => ({ fade: true })
        }
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
