<template>
  <div class="step-container">
    <div class="steps">
      <div v-for="(step,index) in option.steps"
           :key="index"
           class="step"
           :class="{
                    'current':index==option.current,
                    'fail':!step.success && index < option.current,
                    'success':step.success && index < option.current}">
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
      // eslint-disable-next-line no-nested-ternary
      const multiplier = this.option.current === 0
        ? 0 : this.option.current === this.length - 1
          ? 2 : 1;
      return `${(this.option.current * 2 + multiplier) * 0.5 / (this.length) * 100}%`;
    },
    length() {
      return this.option.steps.length;
    },
  },
  data() {
    return {
      preLength: this.option.steps.length
    };
  },
  beforeDestory() {
    window.removeEventListener('resize', this.layout);
  },
  mounted() {
    this.layout();
    window.addEventListener('resize', this.layout);
  },
  watch: {
    option: {
      handler(nv) {
        if (nv.steps.length !== this.preLength) {
          this.layout();
        }
      },
      deep: true
    }
  },
  methods: {
    layout() {
      this.$nextTick(() => {
        const gridContainer = this.$el.querySelector('.steps');
        gridContainer.style.gridTemplateColumns = `repeat(${this.length},1fr)`;
        this.preLength = this.length;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.step-container {
  width: 100%;
  height: 40px;
  position: relative;
  .line {
    height: 8px;
    background: var(--step_line-color);
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 5px;
    z-index: 0;
    border-radius: 20px;
    .steped {
      transition: width 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
      background-image: var(--step_item_steped-bgimg);
      height: 8px;
    }
  }
  .steps {
    width: 100%;
    display: grid;
    grid-template-rows: 100%;
    position: relative;
    z-index: 1;
    .step {
      position: relative;
      display: flex;
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
        display: flex;
        justify-content: center;
        text-align: center;
        position: relative;
      }
      .step-number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 6px solid var(--step_item_border-color);
        background-image: linear-gradient(
          to bottom,
          var(--common_card-bgc),
          var(--common_card-bgc)
        );
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        text-align: center;
        font-size: 21px;
        font-weight: 600;
        color: var(--step_item-color);
      }
      .step-text {
        text-align: center;
        font-size: 12px;
        color: var(--step_item_text-color);
        position: absolute;
        left: 50%;
        top: 46px;
        width: 180px;
        transform: translateX(-50%);
      }
      &.current {
        .step-number {
          color: var(--step_item_current-color);
          border-color: transparent;
          background-image: var(--step_item_current_num-bgimg);
        }
      }
      &.fail {
        .step-number {
          border-color: transparent;
          background-image: var(--step_item_after_num-bgimg);
          color: #fff;
          box-shadow: var(--step_item_after_num-boxshadow);
          &::before {
            content: '×';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -55%);
            color: #fff;
            font-style: normal;
            font-size: 24px;
          }
        }
      }
      &.success {
        .step-number {
          border-color: transparent;
          background-image: var(--step_item_after_num-bgimg);
          color: #fff;
          box-shadow: var(--step_item_after_num-boxshadow);
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
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
