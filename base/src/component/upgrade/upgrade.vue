<template>
  <transition name="upgrade">
    <div class="upgrade-container"
         v-if="visible">
      <div class="inner">
        <div class="loading-wrap">
          <div id="upgradeLoadingImg" />
        </div>
        <div v-if="title"
             class="title">{{title}}</div>
        <div v-html="tip"></div>
        <!-- 升级进度条 -->
        <div class='progress-wrapper'
             v-if="progressVisible">
          <div class="progress">
            <div class="progress-bar"
                 :style='styles'>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>
<script>
import lottie from 'lottie-web';

export default {
  data() {
    return {
      visible: false,
      template: '',
      title: '',
      tip: '',
      styles: { width: 0 },
      percent: 0,
      timeout: 0,
      countdown: 0,
      timer: null,
      progressVisible: false
    };
  },
  mounted() {
    // 解决json动画找不到dom不渲染问题
    this.createTimer();
    window.requestAnimationFrame(this.loadImg);
  },
  computed: {
    animJson() {
      const name = process.env.CUSTOMER_CONFIG.assetFolderName;
      return require(`../../assets/lottie/${name}/loading.json`);
    }
  },
  methods: {
    createTimer() {
      this.countdown = this.timeout;
      const average = 100 / this.timeout;
      this.timer = setInterval(() => {
        if (!this.countdown) {
          this.cleanup();
          return;
        }
        this.countdown -= 1;
        this.percent += average;
        this.styles.width = `${this.percent}%`;
      }, 1000);
    },
    cleanup() {
      clearTimeout(this.timer);
    },
    loadImg() {
      lottie.loadAnimation({
        container: document.getElementById('upgradeLoadingImg'),
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
.upgrade-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: var(--upgrade-background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 120px;
  }
  &.upgrade-enter {
    opacity: 0;
  }
  &.upgrade-enter-active {
    transition: all 0.3s ease-in;
  }
  &.upgrade-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  .inner {
    text-align: center;
    color: var(--upgrade-text-color);
    position: absolute;
    width: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    @media screen and (max-width: 768px) {
      width: 85%;
    }
    .loading-wrap {
      width: 240px;
      height: 240px;
      margin: 0 auto;
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
      // margin-top: 10px;
      color: var(--upgrade-text-color);
    }
  }
  .tip {
    color: var(--upgrade-text-color);
    display: block;
    margin-top: 10px;
  }
  .progress-wrapper {
    margin-top: 20px;
    width: 300px;
    display: inline-block;
    .progress {
      height: 10px;
      background: var(--progress-background-color);
      border-radius: 50px;
    }
    .progress-bar {
      float: left;
      width: 0;
      height: 100%;
      border-radius: 50px;
      font-size: 12px;
      max-width: 100%;
      line-height: 20px;
      overflow: hidden;
      color: var(--progress-bar-color);
      text-align: center;
      background-color: var(--progress-bar-background-color);
      transition: width 1s ease;
    }
  }
}
</style>
