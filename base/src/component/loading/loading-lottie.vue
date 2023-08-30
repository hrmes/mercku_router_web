// loading.vue
<template>
  <div id="loading-wrap">
    <div :id="id"></div>
  </div>
</template>
<script>
import lottie from 'lottie-web';

const Type = {
  loading: 'loading',
  speedTest: 'speedTest',
  addNode: 'addNode'
};

export default {
  name: 'loading-lottie',
  props: {
    loadingType: { type: String, default: 'loading' },
    id: { type: String, default: 'lottie' },
    size: { type: Number, default: 36 }
  },
  mounted() {
    // 解决json动画找不到dom不渲染问题
    window.requestAnimationFrame(this.loadImg);

    const myDiv = document.getElementById('loading-wrap');
    myDiv.style.width = `${this.size}px`;
    myDiv.style.height = `${this.size}px`;
  },
  computed: {
    animJson() {
      let result;
      switch (this.loadingType) {
        case Type.loading:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.title.toLowerCase()}/loading.json`);
          break;
        case Type.speedTest:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.title.toLowerCase()}/speed-test.json`);
          break;
        case Type.addNode:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.title.toLowerCase()}/add-node.json`);
          break;
        default:
          break;
      }
      return result;
    }
  },
  methods: {
    loadImg() {
      const { id } = this;
      lottie.loadAnimation({
        container: document.getElementById(id),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: this.animJson
      });
    }
  }
};
</script>
