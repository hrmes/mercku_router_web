<template>
  <svg id="load"
       x="0px"
       y="0px"
       :style="{width:width}"
       viewBox="0 0 100 100"
       :width="size"
       :height="size">
    <circle id="loading-inner"
            cx="50"
            cy="50"
            r="45"
            :stroke="color" />
  </svg>
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
    }
  },
  computed: {
    width() {
      return `${this.size}px`;
    }
  }
};
</script>
<style lang="scss" scoped>
#load {
  width: 150px;
  animation: loading 3s linear infinite;
  #loading-inner {
    stroke: {
      dashoffset: 0;
      dasharray: 300;
      width: 8;
      miterlimit: 10;
      linecap: round;
    }
    animation: loading-circle 2s linear infinite;
    // stroke: #d6001c;
    fill: transparent;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-circle {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -600;
  }
}
</style>
