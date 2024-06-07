// loading.vue
<template>
  <transition name="loading">
    <div v-if="visible"
         class="loading-container">
      <div class="loading-wrap">
        <div id="loadingImg" />
      </div>
      <div v-if="title"
           class="title">{{title}}</div>
      <div v-if="template"
           class="template"
           v-html="template"></div>
    </div>
  </transition>
</template>
<script>
import lottie from 'lottie-web-light';

export default {
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
      const name = process.env.CUSTOMER_CONFIG.title.toLowerCase();
      return require(`../../assets/lottie/${name}/loading.json`);
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
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // z-index: 9999;
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
