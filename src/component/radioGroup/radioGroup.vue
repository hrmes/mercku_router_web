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
    // 绑定值
    value: {},
    // 单选框的方向
    direction: {
      type: String,
      default: 'horizontal'
    },
    // 文本标签
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
        border-color: #d6001c;
        position: relative;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          background: #d6001c;
          border-radius: 50%;
        }
      }
    }
    .radio {
      width: 14px;
      height: 14px;
      border-radius: 9px;
      border: 1px solid #b6b6b6;
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
