<template>
  <div class="step-container">
    <div class="step" :class="{'steped':index<=current}" v-for="(step,index) in steps">
      <div class="left-line"></div>
      <div class="step-content">
        <div class="step-number">{{index+1}}</div>
        <div class="step-text">{{step}}</div>
      </div>
      <div class="right-line"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    steps: {
      type: Array,
      default: []
    },
    current: {
      type: Number,
      default: 0
    }
  }
};
</script>
<style lang="scss" scoped>
.step-container {
  height: 80px;
  display: inline-block;
  .step {
    display: inline-block;
    position: relative;

    .left-line,
    .right-line {
      height: 3px;
      background: #bdbdbd;
      display: inline-block;
      position: relative;
    }
    &:first-child {
      .left-line {
        visibility: hidden;
      }
    }
    &:last-child {
      .right-line {
        visibility: hidden;
      }
    }
    .step-content {
      display: inline-block;
    }
    .step-number {
      border-radius: 50%;
      border: 1px solid #bdbdbd;
      text-align: center;
      width: 60px;
      height: 60px;
      line-height: 60px;
      font-style: italic;
      font-weight: bold;
      font-size: 24px;
      color: #bdbdbd;
    }
    .step-text {
      text-align: center;
      font-size: 16px;
      color: #333;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      margin-top: 8px;
    }
    &.steped {
      .step-number {
        background: #00d061;
        border-color: #00d061;
        color: #fff;
      }
      .left-line,
      .right-line {
        background: #00d061;
      }
    }
  }
}
@media screen and(min-width: 769px) {
  .step-container {
    .step {
      .left-line {
        width: 80px;
      }
      .right-line {
        width: 100px;
      }
      .left-line,
      .right-line {
        top: -10px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .step-container {
    height: 60px;
    .step {
      .step-number {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
      .step-text {
        font-size: 12px;
      }
    }
    .left-line {
      width: 30px;
    }
    .right-line {
      width: 30px;
    }
    .left-line,
    .right-line {
      height: 3px;
      background: #bdbdbd;
      display: inline-block;
      position: relative;
      top: -5px;
    }
  }
}
</style>
