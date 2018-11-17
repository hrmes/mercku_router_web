<template>
  <div class="spinner">
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
    <div :style="{'background':color}"></div>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#333'
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.spinner {
  position: relative;
}
.spinner div {
  left: 24px;
  top: 12px;
  position: absolute;
  -webkit-animation: spinner linear 1s infinite;
  animation: spinner linear 1s infinite;
  width: 2px;
  height: 4px;
  border-radius: 4%;
  -webkit-transform-origin: 1px 14px;
  transform-origin: 1px 14px;
}
.spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.928571428571429s;
  animation-delay: -0.928571428571429s;
}
.spinner div:nth-child(2) {
  -webkit-transform: rotate(25.714285714285715deg);
  transform: rotate(25.714285714285715deg);
  -webkit-animation-delay: -0.857142857142857s;
  animation-delay: -0.857142857142857s;
}
.spinner div:nth-child(3) {
  -webkit-transform: rotate(51.42857142857143deg);
  transform: rotate(51.42857142857143deg);
  -webkit-animation-delay: -0.785714285714286s;
  animation-delay: -0.785714285714286s;
}
.spinner div:nth-child(4) {
  -webkit-transform: rotate(77.14285714285714deg);
  transform: rotate(77.14285714285714deg);
  -webkit-animation-delay: -0.714285714285714s;
  animation-delay: -0.714285714285714s;
}
.spinner div:nth-child(5) {
  -webkit-transform: rotate(102.85714285714286deg);
  transform: rotate(102.85714285714286deg);
  -webkit-animation-delay: -0.642857142857143s;
  animation-delay: -0.642857142857143s;
}
.spinner div:nth-child(6) {
  -webkit-transform: rotate(128.57142857142858deg);
  transform: rotate(128.57142857142858deg);
  -webkit-animation-delay: -0.571428571428571s;
  animation-delay: -0.571428571428571s;
}
.spinner div:nth-child(7) {
  -webkit-transform: rotate(154.28571428571428deg);
  transform: rotate(154.28571428571428deg);
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.spinner div:nth-child(8) {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-animation-delay: -0.428571428571429s;
  animation-delay: -0.428571428571429s;
}
.spinner div:nth-child(9) {
  -webkit-transform: rotate(205.71428571428572deg);
  transform: rotate(205.71428571428572deg);
  -webkit-animation-delay: -0.357142857142857s;
  animation-delay: -0.357142857142857s;
}
.spinner div:nth-child(10) {
  -webkit-transform: rotate(231.42857142857142deg);
  transform: rotate(231.42857142857142deg);
  -webkit-animation-delay: -0.285714285714286s;
  animation-delay: -0.285714285714286s;
}
.spinner div:nth-child(11) {
  -webkit-transform: rotate(257.14285714285717deg);
  transform: rotate(257.14285714285717deg);
  -webkit-animation-delay: -0.214285714285714s;
  animation-delay: -0.214285714285714s;
}
.spinner div:nth-child(12) {
  -webkit-transform: rotate(282.85714285714283deg);
  transform: rotate(282.85714285714283deg);
  -webkit-animation-delay: -0.142857142857143s;
  animation-delay: -0.142857142857143s;
}
.spinner div:nth-child(13) {
  -webkit-transform: rotate(308.57142857142856deg);
  transform: rotate(308.57142857142856deg);
  -webkit-animation-delay: -0.071428571428571s;
  animation-delay: -0.071428571428571s;
}
.spinner div:nth-child(14) {
  -webkit-transform: rotate(334.2857142857143deg);
  transform: rotate(334.2857142857143deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.spinner {
  width: 50px !important;
  height: 50px !important;
  -webkit-transform: translate(-25px, -25px) scale(1) translate(25px, 25px);
  transform: translate(-25px, -25px) scale(1) translate(25px, 25px);
}
</style>
