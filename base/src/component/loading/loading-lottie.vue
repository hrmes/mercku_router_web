// loading.vue
<template>
  <div class="loading-wrap">
    <div id="loadingImg"></div>
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
    loadingType: { type: String, default: 'loading' }
  },
  mounted() {
    // 解决json动画找不到dom不渲染问题
    window.requestAnimationFrame(this.loadImg);
  },
  computed: {
    animJson() {
      let result;
      switch (this.loadingType) {
        case Type.loading:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.assetFolderName}/loading.json`);
          break;
        case Type.speedTest:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.assetFolderName}/speed-test.json`);
          break;
        case Type.addNode:
          result = require(`../../assets/lottie/${process.env.CUSTOMER_CONFIG.assetFolderName}/add-node.json`);
          break;
        default:
          break;
      }
      return result;
    }
  },
  methods: {
    loadImg() {
      lottie.loadAnimation({
        container: document.getElementById('loadingImg'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: this.animJson
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
