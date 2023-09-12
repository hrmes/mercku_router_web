import lottie from 'lottie-web';

const LottiePaths = {
  light: require('@/assets/lottie/speedtest-light.json'),
  dark: require('@/assets/lottie/speedtest-dark.json')
};
export default {
  computed: {
    speedtestJson() {
      console.log(456);
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
    // '$store.state.theme': {
    //   handler(nv) {
    //     console.log(321);
    //     console.log(nv);
    //     let animation = LottiePaths.light; // 默认为浅色模式
    //     if (
    //       nv === 'dark' ||
    //       (nv === 'auto' &&
    //         window.matchMedia &&
    //         window.matchMedia('(prefers-color-scheme: dark)').matches)
    //     ) {
    //       animation = LottiePaths.dark; // 如果是深色模式或系统处于深色模式，则使用深色动画
    //     }
    //     if (this.speedLottie) {
    //       this.speedLottie.destroy(); // 销毁先前的动画实例
    //     }
    //     this.speedLottie = lottie.loadAnimation({
    //       container: document.getElementById('animation-container'),
    //       renderer: 'svg',
    //       loop: false,
    //       autoplay: false,
    //       animationData: animation
    //     });
    //   }
    // }
  },
  methods: {
    loadSpeedTestAnimation() {
      console.log(123);
      this.speedLottie = lottie.loadAnimation({
        container: document.getElementById('animation-container'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: this.speedtestJson
      });
    }
  }
};
