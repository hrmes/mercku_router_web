export default {
  computed: {
    color() {
      // Legacy builds still get their compile-time customer color. Unified
      // builds have no CUSTOMER_CONFIG and receive branding as CSS variables.
      const customerConfig = process.env.CUSTOMER_CONFIG;
      if (customerConfig && customerConfig.loading && customerConfig.loading.color) {
        return customerConfig.loading.color;
      }
      if (typeof document !== 'undefined' && document.documentElement) {
        const runtimeColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--brand-loading')
          .trim();
        if (runtimeColor) return runtimeColor;
      }
      return '#00a7e1';
    },
    pathElements() {
      return document.getElementById('loading-wrap').querySelectorAll('path');
    },
    colorArr() {
      return this.lightenColor(this.color, this.pathElements.length);
    }
  },
  methods: {
    hexToRgb(hex) {
      const bigint = parseInt(hex.substring(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    },
    // 将RGB颜色转换为十六进制
    rgbToHex(r, g, b) {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },
    // 让颜色变浅的函数
    lightenColor(color, num) {
      let [r, g, b] = this.hexToRgb(color);
      const colors = [color]; // 包含原始颜色

      // 计算需要生成的渐变颜色数量
      const steps = num - 1;

      // 每次渐变的步长，值可以调整，根据需要让颜色变化更显著或更平滑
      const step = 5;

      for (let i = 0; i < steps; i++) {
        r = Math.min(255, r + step);
        g = Math.min(255, g + step);
        b = Math.min(255, b + step);
        colors.push(this.rgbToHex(r, g, b));
      }

      return colors;
    }
  }
};
