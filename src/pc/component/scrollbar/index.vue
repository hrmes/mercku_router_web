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
        freeScroll: {
          type: Boolean,
          default: true
        },
        disableMouse: {
          type: Boolean,
          default: true
        },
        stopPropagation: {
          type: Boolean,
          default: true
        },
        mouseWheel: {
          type: Object,
          default: () => ({
            speed: 20,
            invert: false,
            easeTime: 300
          })
        },
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
      this.$refs.wrapper.style.overflow = 'hidden';
      this.scroll = new BScroll(this.$refs.wrapper, this.option);
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  beforeDestroy() {
    this.scroll && this.scroll.destroy();
  },
  watch: {
    data() {
      this.$nextTick(() => {});
      setTimeout(() => {
        this.refresh();
      }, 2000);
    }
  }
};
</script>
