import lottie from 'lottie-web-light';

const LottiePaths = {
  light: require('base/assets/lottie/speedtest/light.json'),
  dark: require('base/assets/lottie/speedtest/dark.json')
};
export default {
  data() {
    return {
      speedLottie: null,
      animationLoaded: false // 添加一个标志变量
    };
  },
  computed: {
    speedtestJson() {
      const { theme } = this.$store.state;
      let animation = LottiePaths.light; // 默认为浅色模式
      if (
        theme === 'dark' ||
        (theme === 'auto' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        animation = LottiePaths.dark; // 如果是深色模式或系统处于深色模式，则使用深色动画
      }
      return animation;
    }
  },
  watch: {
    '$store.state.theme': {
      handler(nv) {
        let animation = LottiePaths.light; // 默认为浅色模式
        if (
          nv === 'dark' ||
          (nv === 'auto' &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
          animation = LottiePaths.dark; // 如果是深色模式或系统处于深色模式，则使用深色动画
        }
        if (this.speedLottie) {
          this.speedLottie.destroy(); // 销毁先前的动画实例
        }
        this.speedLottie = lottie.loadAnimation({
          container: document.getElementById('animation-container'),
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: animation
        });
        this.speedInfo = {}; // 让速度值归零，等待后续重跑
      }
    }
  },
  methods: {
    loadSpeedTestAnimation() {
      if (this.speedLottie) {
        this.speedLottie.destroy();
        this.speedLottie = null;
      }
      this.speedLottie = lottie.loadAnimation({
        container: document.getElementById('animation-container'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: this.speedtestJson
      });
    },
    calculateSpeedPeakValue(downSpeed) {
      let speedPeakValue = 500000000;
      if (downSpeed > speedPeakValue) {
        speedPeakValue = (downSpeed / 0.9).toFixed(0);
      }
      return speedPeakValue;
    },
    calculateSpeedPercent(downSpeed, speedPeakValue) {
      return ((downSpeed / speedPeakValue) * 40).toFixed(0);
    },
    updateSpeedLottie(percent) {
      this.speedLottie.setSpeed(0.6);
      this.speedLottie.playSegments([0, percent], true);
    }
  }
};
