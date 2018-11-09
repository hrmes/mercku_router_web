<template>
  <div class="radio-group-container">
    <div class="option" @click="check(option)" :class="{'selected':selected===option}" v-for="option in options" :key="option.value">
      <div class="radio"></div>
      <div class="text">{{option.text}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    options: Array
  },
  data() {
    return {
      selected: this.options.filter(o => o.value === this.value)[0]
    };
  },
  watch: {
    value(val) {
      this.selected = this.options.filter(o => o.value === val)[0];
    }
  },
  methods: {
    check(option) {
      this.selected = option;
      this.$emit('input', this.selected.value);
    }
  }
};
</script>
<style lang="scss">
.radio-group-container {
  display: flex;
  .option {
    flex: 1;
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
</style>
