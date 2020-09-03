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
      return `${(this.option.current * 100) / (this.length - 1)}%`;
    },
    length() {
      return this.option.steps.length;
    }
  },
  data() {
    return {
      preLength: this.option.steps.length
    };
  },
  beforeDestory() {
    window.removeEventListener('resize', this.init);
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.init);
  },
  watch: {
    option: {
      handler(nv) {
        if (nv.steps.length !== this.preLength) {
          this.init();
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      const width = this.$el.clientWidth;
      const stepItems = this.$el.querySelectorAll('.step');
      const stepItemArr = Array.from(stepItems);
      const stepItemWidth = stepItemArr.reduce((sum, current) => {
        sum += current.clientWidth;
        return sum;
      }, 0);
      console.log(stepItemWidth);
      const perOffset = ((width - stepItemWidth) / (this.length - 1) / width) * 100;
      stepItemArr.forEach((step, index) => {
        step.style.left = `${perOffset * index}%`;
      });
      this.preLength = this.length;
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
    background: $step-line-color;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    .steped {
      background: $step-item-steped-background-color;
      height: 2px;
    }
  }
  .steps {
    width: 100%;
    display: flex;
    position: relative;
    z-index: 1;
    .step {
      position: absolute;
      display: flex;
      top: 0;
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
        background: $step-item-background-color;
        display: flex;
        justify-content: center;
        text-align: center;
        position: relative;
      }
      .step-number {
        border-radius: 50%;
        border: 1px solid $step-item-border-color;
        text-align: center;
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-weight: bold;
        font-size: 24px;
        color: $step-item-color;
        background: $step-background-color;
      }
      .step-text {
        text-align: center;
        font-size: 12px;
        color: $step-item-text-color;
        position: absolute;
        left: 50%;
        top: 46px;
        width: 180px;
        transform: translateX(-50%);
      }
      &.fail {
        .step-number {
          background: $step-item-failed-background-color;
          border-color: $step-item-failed-border-color;
          color: $step-item-failed-color;
          position: relative;
          &::before {
            content: '×';
            display: block;
            color: $step-item-failed-icon-color;
            font-style: normal;
            font-size: 24px;
          }
        }
      }
      &.success {
        .step-number {
          background: $step-item-success-background-color;
          border-color: $step-item-success-border-color;
          color: $step-item-success-color;
        }
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .step-container {
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
