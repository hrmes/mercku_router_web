// loading.vue
<template>
  <transition name="loading">
    <div v-if="visible" class="loading-container" id="loading-wrap">
      <div class="loading-wrap">
        <div id="loadingImg"></div>
      </div>
      <div v-if="title" class="title">{{ title }}</div>
      <div v-if="template" class="template" v-html="template"></div>
    </div>
  </transition>
</template>
<script>
import { loadAnimation } from 'lottie-web-light';
import colorGradientMixin from 'base/mixins/color-gradient';

export default {
  mixins: [colorGradientMixin],
  data() {
    return {
      visible: false,
      template: '',
      title: ''
    };
  },
  mounted() {
    // 解决json动画找不到dom不渲染问题
    window.requestAnimationFrame(this.loadImg);
  },
  computed: {
    animJson() {
      return require('../../assets/lottie/loading/loading.json');
    }
  },
  methods: {
    loadImg() {
      loadAnimation({
        container: document.getElementById('loadingImg'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: this.animJson
      });
      this.pathElements.forEach((p, index) => {
        p.style.fill = this.colorArr[index];
        p.style.stroke = this.colorArr[index];
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.loading-enter {
    opacity: 0;
  }
  &.loading-enter-active {
    transition: all 0.3s ease-in;
  }
  &.loading-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }
  .loading-wrap {
    width: 240px;
    height: 240px;
  }
  .title {
    font-size: 24px;
    color: #fff;
  }
  .template {
    color: #fff;
  }
}
</style>
