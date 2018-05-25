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
  .step {
    display: inline-block;
    position: relative;
    .left-line {
      width: 150px;
    }
    .right-line {
      width: 100px;
    }
    .left-line,
    .right-line {
      height: 3px;
      background: #bdbdbd;
      display: inline-block;
      position: relative;
      top: -45px;
    }
    &:first-child {
      .left-line {
        display: none;
      }
    }
    &:last-child {
      .right-line {
        display: none;
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
</style>
