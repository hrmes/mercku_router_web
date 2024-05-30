// loading.vue
<template>
  <div id="loading-wrap">
    <div :id="id"></div>
  </div>
</template>
<script>
import { loadAnimation } from 'lottie-web-light';
import colorGradientMixin from 'base/mixins/color-gradient';

const Type = {
  loading: 'loading',
  speedTest: 'speedTest',
  addNode: 'addNode'
};

export default {
  name: 'loading-lottie',
  mixins: [colorGradientMixin],
  props: {
    loadingType: { type: String, default: 'loading' },
    id: { type: String, default: 'lottie' },
    size: { type: Number, default: 36 }
  },
  mounted() {
    const myDiv = document.getElementById('loading-wrap');
    myDiv.style.width = `${this.size}px`;
    myDiv.style.height = `${this.size}px`;
    // 解决json动画找不到dom不渲染问题
    window.requestAnimationFrame(this.loadImg);
  },
  computed: {
    color() {
      return process.env.CUSTOMER_CONFIG.loading.color;
    },
    animJson() {
      let result;
      switch (this.loadingType) {
        case Type.speedTest:
          result = require('../../assets/lottie/loading/speed-test.json');
          break;
        case Type.addNode:
          result = require('../../assets/lottie/loading/add-node.json');
          break;
        default:
          result = require('../../assets/lottie/loading/loading.json');
          break;
      }
      return result;
    },
  },
  methods: {
    loadImg() {
      loadAnimation({
        container: document.getElementById(this.id),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: this.animJson
      });
      this.pathElements.forEach((p, index) => {
        p.style.fill = this.colorArr[index];
        p.style.stroke = this.colorArr[index];
      });
    },
  }
};
</script>
