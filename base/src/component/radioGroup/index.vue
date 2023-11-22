<template>
  <div class="radio-group-container"
       :class="`${direction}`">
    <div class="option"
         @click="check(option)"
         :class="{'selected':selected===option.value}"
         v-for="option in options"
         :key="option.value">
      <div class="radio"></div>
      <div class="text"
           :class="{bold}">{{option.text}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    direction: {
      type: String,
      default: 'horizontal'
    },
    bold: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  data() {
    return { selected: this.value };
  },
  watch: {
    value(val) {
      this.selected = val;
    }
  },
  methods: {
    check(option) {
      this.selected = option.value;
      this.$emit('input', this.selected);
    }
  }
};
</script>
<style lang="scss">
.radio-group-container {
  display: flex;
  &.vertical {
    flex-direction: column;
    .option {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  &.horizontal {
    .option {
      margin-left: 30px;
      &:first-child {
        margin: 0;
      }
    }
  }
  .option {
    display: flex;
    align-items: center;
    cursor: pointer;
    &.selected {
      .radio {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 86%;
          height: 86%;
          border-radius: 50%;
          background: var(--primary-color);
        }
      }
    }
    .radio {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1.5px solid var(--checkbox_border-color);
    }
    .text {
      margin-left: 12px;
      font-size: 14px;
      &.bold {
        font-weight: 600;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .radio-group-container {
    display: flex;
    flex-direction: column;
    &.horizontal {
      .option {
        margin-top: 20px;
        margin-left: 0;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
