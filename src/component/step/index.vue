<template>
  <div class="step-container">
    <div class="steps">
      <div class="step"
           :key="index"
           :class="{'fail':!step.success && index <= option.current,
           'success':step.success && index <= option.current}"
           v-for="(step,index) in option.steps">
        <div class="step-content">
          <div class="step-number">
            <span v-show="(index === option.current && step.success)
            || (index !== option.current)">
              {{index+1}}
            </span>
          </div>
          <div class="step-text">{{step.text}}</div>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="steped"
           :style="{width:width}"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    option: {
      type: Object
    }
  },
  computed: {
    width() {
      return `${((this.option.current + 1) * 100) / this.option.steps.length}%`;
    }
  }
};
</script>
<style lang="scss" scoped>
.step-container {
  height: 60px;

  position: relative;
  .line {
    height: 3px;
    background: #bdbdbd;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    .steped {
      background: #00d061;
      height: 3px;
    }
  }
  .steps {
    width: 100%;
    display: flex;
    position: relative;
    z-index: 1;
    .step {
      flex: 1;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
        .step-text {
          text-align: center;
        }
      }
      &:last-child {
        justify-content: flex-end;
        .step-text {
          text-align: center;
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
        background: #fff;
      }
      .step-text {
        text-align: center;
        font-size: 16px;
        color: #333;
        position: absolute;
        transform: translateX(-70px);
        width: 200px;
        margin-top: 8px;
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
      }
      &.success {
        .step-number {
          background: #00d061;
          border-color: #00d061;
          color: #fff;
        }
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .step-container {
    height: 40px;
    padding: 0 20px;
    .line {
      width: auto;
      left: 20px;
      right: 20px;
    }
    .steps {
      .step {
        .step-number {
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
        .step-text {
          font-size: 12px;
          width: 80px;
          transform: translateX(-20px);
        }
      }
    }
  }
}
</style>
