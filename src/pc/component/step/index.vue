<template>
  <div class="step-container">
    <div class="step" :key="index" :class="{'fail':!step.success && index <= option.current,'success':step.success && index <= option.current}" v-for="(step,index) in option.steps">
      <div class="left-line"></div>
      <div class="step-content">
        <div class="step-number">
          <span v-show="(index === option.current && step.success) || (index !== option.current)">{{index+1}}</span>
        </div>
        <div class="step-text">{{step.text}}</div>
      </div>
      <div class="right-line"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    option: {
      type: Object
    }
  }
};
</script>
<style lang="scss" scoped>
.step-container {
  height: 100px;
  display: flex;
  .step {
    flex: 1;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    .left-line,
    .right-line {
      flex: 1;
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
      border-radius: 50%;
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
      padding: 0 10px;
    }
    &.fail {
      .step-number {
        background: red;
        border-color: red;
        color: #fff;
        position: relative;
        &::before {
          content: '×';
          display: block;
          color: #fff;
          font-style: normal;
          font-size: 34px;
        }
      }
      .left-line,
      .right-line {
        background: red;
      }
    }
    &.success {
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
        width: 100px;
      }
      .right-line {
        width: 100px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .step-container {
    height: 100px;
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
      flex: 1;
      height: 3px;
      background: #bdbdbd;
      display: inline-block;
      position: relative;
    }
  }
}
</style>
