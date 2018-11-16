<template>
  <div class="spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
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
  width: 100%;
  height: 100%;
}
.spinner div {
  left: 99px;
  top: 80px;
  position: absolute;
  -webkit-animation: spinner linear 1s infinite;
  animation: spinner linear 1s infinite;
  background: #00d061;
  width: 2px;
  height: 8px;
  border-radius: 4%;
  -webkit-transform-origin: 1px 20px;
  transform-origin: 1px 20px;
}
.spinner div:nth-child(1) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-animation-delay: -0.933333333333333s;
  animation-delay: -0.933333333333333s;
}
.spinner div:nth-child(2) {
  -webkit-transform: rotate(24deg);
  transform: rotate(24deg);
  -webkit-animation-delay: -0.866666666666667s;
  animation-delay: -0.866666666666667s;
}
.spinner div:nth-child(3) {
  -webkit-transform: rotate(48deg);
  transform: rotate(48deg);
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.spinner div:nth-child(4) {
  -webkit-transform: rotate(72deg);
  transform: rotate(72deg);
  -webkit-animation-delay: -0.733333333333333s;
  animation-delay: -0.733333333333333s;
}
.spinner div:nth-child(5) {
  -webkit-transform: rotate(96deg);
  transform: rotate(96deg);
  -webkit-animation-delay: -0.666666666666667s;
  animation-delay: -0.666666666666667s;
}
.spinner div:nth-child(6) {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.spinner div:nth-child(7) {
  -webkit-transform: rotate(144deg);
  transform: rotate(144deg);
  -webkit-animation-delay: -0.533333333333333s;
  animation-delay: -0.533333333333333s;
}
.spinner div:nth-child(8) {
  -webkit-transform: rotate(168deg);
  transform: rotate(168deg);
  -webkit-animation-delay: -0.466666666666667s;
  animation-delay: -0.466666666666667s;
}
.spinner div:nth-child(9) {
  -webkit-transform: rotate(192deg);
  transform: rotate(192deg);
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.spinner div:nth-child(10) {
  -webkit-transform: rotate(216deg);
  transform: rotate(216deg);
  -webkit-animation-delay: -0.333333333333333s;
  animation-delay: -0.333333333333333s;
}
.spinner div:nth-child(11) {
  -webkit-transform: rotate(240deg);
  transform: rotate(240deg);
  -webkit-animation-delay: -0.266666666666667s;
  animation-delay: -0.266666666666667s;
}
.spinner div:nth-child(12) {
  -webkit-transform: rotate(264deg);
  transform: rotate(264deg);
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.spinner div:nth-child(13) {
  -webkit-transform: rotate(288deg);
  transform: rotate(288deg);
  -webkit-animation-delay: -0.133333333333333s;
  animation-delay: -0.133333333333333s;
}
.spinner div:nth-child(14) {
  -webkit-transform: rotate(312deg);
  transform: rotate(312deg);
  -webkit-animation-delay: -0.066666666666667s;
  animation-delay: -0.066666666666667s;
}
.spinner div:nth-child(15) {
  -webkit-transform: rotate(336deg);
  transform: rotate(336deg);
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.spinner {
  width: 200px !important;
  height: 200px !important;
  -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
  transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
}
</style>
