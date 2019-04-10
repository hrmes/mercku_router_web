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
  props: { option: { type: Object } },
  computed: {
    width() {
      return `${((this.option.current + 1) * 100) / this.option.steps.length}%`;
    }
  }
};
</script>
<style lang="scss" scoped>
.step-container {
  height: 36px;
  position: relative;
  .line {
    height: 2px;
    background: #bdbdbd;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    .steped {
      background: #d6001c;
      height: 2px;
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
        width: 56px;
        height: 64px;
        background: #fff;
        display: flex;
        justify-content: center;
        text-align: center;
        position: relative;
      }
      .step-number {
        border-radius: 50%;
        border: 1px solid #bdbdbd;
        text-align: center;
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-weight: bold;
        font-size: 24px;
        color: #bdbdbd;
        background: #fff;
      }
      .step-text {
        text-align: center;
        font-size: 12px;
        color: #333;
        position: absolute;
        left: 50%;
        top: 46px;
        width: 180px;
        transform: translateX(-50%);
      }
      &.fail {
        .step-number {
          background: #ffe6e9;
          border-color: #ffe6e9;
          color: #fff;
          position: relative;
          &::before {
            content: '×';
            display: block;
            color: #d6001c;
            font-style: normal;
            font-size: 24px;
          }
        }
      }
      &.success {
        .step-number {
          background: #ffe6e9;
          border-color: #ffe6e9;
          color: #d6001c;
        }
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .step-container {
    padding: 0 20px;
    .line {
      width: auto;
      left: 20px;
      right: 20px;
    }
    .steps {
      .step {
        .step-text {
          font-size: 12px;
          width: 80px;
        }
      }
    }
  }
}
</style>
