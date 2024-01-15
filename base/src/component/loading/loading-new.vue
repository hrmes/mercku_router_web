<template>
  <canvas :id="id"></canvas>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#d6001c'
    },
    size: {
      type: Number,
      default: 36
    },
    id: {
      type: String,
      default: 'canvas'
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const canvas = document.getElementById(this.id);
      const ctx = canvas.getContext('2d');

      const radio = this.getPixelRatio(ctx);

      canvas.style.width = `${this.size}px`;
      canvas.style.height = `${this.size}px`;

      canvas.width = this.size * radio;
      canvas.height = this.size * radio;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const pi2 = Math.PI * 2;
      let start = null;
      const duration = 2;
      const speed = pi2 / (duration / 2); // 2s跑一圈

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3 * radio;
      ctx.lineCap = 'round';
      ctx.fillStyle = 'transparent';

      const radius = (this.size * radio) / 2 - ctx.lineWidth;

      function animate(timestamp) {
        window.requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (start === null) {
          start = timestamp;
        }

        const diff = (timestamp - start) / 1000;

        if (diff > duration) {
          start = timestamp;
          return;
        }

        let endAngle = diff * speed;
        endAngle = endAngle > pi2 ? pi2 : endAngle;
        let startAngle = 0;

        if (endAngle === pi2) {
          startAngle = speed * (diff - duration / 2);
        }
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
        ctx.fill();
      }

      animate(0);
    },
    getPixelRatio(context) {
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

      return (window.devicePixelRatio || 1) / backingStore;
    }
  }
};
</script>
<style lang="scss" scoped>
canvas {
  animation: loading 3s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
