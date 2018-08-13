<template>
  <transition name="loading">
    <div class="loading-container" v-if="visible">
      <div class="inner">
        <div class="mercku_loading">
          <div class="left">
            <div class="out-wrapper">
              <div class="outer-m"></div>
              <div class="outer-mock-m"></div>
            </div>
            <div class="inner-wrapper">
              <div class="inner-m"></div>
              <div class="inner-mock-m"></div>
            </div>
          </div>
          <div class="right">
            <div class="out-wrapper">
              <div class="outer-m"></div>
              <div class="outer-mock-m"></div>
            </div>
            <div class="inner-wrapper">
              <div class="inner-m"></div>
              <div class="inner-mock-m"></div>
            </div>
          </div>

        </div>
        <div v-if="title" class="title">{{title}}</div>
        <div v-html="template"></div>
      </div>
    </div>
  </transition>

</template>
<script>
export default {
  data() {
    return {
      visible: false,
      template: '',
      title: ''
    };
  },
  mounted() {
    this.setOverflow();
  },
  methods: {
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    }
  }
};
</script>
<style lang="scss" scoped>
.mercku_loading {
  position: relative;
  width: 100.5px;
  height: 33.5px;
  margin: 0 auto;
  transform: scale(1);
  .left {
    position: absolute;
    left: 0;
  }

  .right {
    position: absolute;
    left: 32.5px;
  }
}

.out-wrapper {
  width: 67px;
  height: 33.5px;
  opacity: 0.5;
}

.outer-m,
.outer-mock-m {
  width: 51px;
  height: 51px;
  border-radius: 50%;
  border-top: 8px solid rgba(216, 12, 24, 1);
  border-left: 8px solid rgba(216, 12, 24, 1);
  border-right: 8px solid transparent;
  border-bottom: 8px solid transparent;
  position: absolute;
  left: 0;
  transform: rotate(45deg);
  animation: circle 1.5s linear infinite;
}

.outer-mock-m {
  animation: circle-mock 1.5s linear infinite;
}

.inner-m,
.inner-mock-m {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border-top: 8px solid rgba(216, 12, 24, 1);
  border-left: 8px solid rgba(216, 12, 24, 1);
  border-right: 8px solid transparent;
  border-bottom: 8px solid transparent;
  position: absolute;
  left: 13.5px;
  top: 13.5px;
  transform: rotate(45deg);
  animation: circle 1.5s linear infinite;
}

.inner-mock-m {
  animation: circle-mock 1.5s linear infinite;
}

@keyframes circle {
  0% {
    transform: rotate(45deg);
  }
  10% {
    transform: rotate(45deg);
  }
  20% {
    transform: rotate(45deg);
  }
  30% {
    transform: rotate(45deg);
  }
  40% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}

@keyframes circle-mock {
  0% {
    transform: rotate(45deg);
  }
  10% {
    transform: rotate(45deg);
  }
  20% {
    transform: rotate(45deg);
  }
  30% {
    transform: rotate(45deg);
  }
  40% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(117deg);
  }
  100% {
    transform: rotate(405deg);
  }
}

.loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.8);
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

  .inner {
    text-align: center;
    color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title {
      font-size: 24px;
      margin-top: 10px;
      color: #fff;
    }
  }
}
</style>
