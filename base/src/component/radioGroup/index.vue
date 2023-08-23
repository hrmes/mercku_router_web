<template>
  <div class="radio-group-container"
       :class="`${direction}`">
    <div class="option"
         @click="check(option)"
         :class="{'selected':selected===option.value}"
         v-for="option in options"
         :key="option.value">
      <div class="radio"></div>
      <div class="text">{{option.text}}</div>
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
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &::after {
          content: '';
          width: 11px;
          height: auto;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--checkbox-checked-background-color);
        }
      }
    }
    .radio {
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      border-radius: 50%;
      outline: 1.5px solid var(--checkbox-border-color);
    }
    .text {
      margin-left: 12px;
      font-size: 14px;
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
