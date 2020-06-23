<template>
  <div class="switch-container">
    <label v-if="label">
      {{label}}
    </label>
    <div class="switch switch-animation"
         :class="{'checked':value,'disabled':disabled}"
         @click='!disabled && change()'></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: this.value
    };
  },
  props: {
    onChange: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: { type: Boolean },
    label: { type: String }
  },
  watch: {
    value(v) {
      this.checked = v;
    }
  },
  methods: {
    change(...args) {
      this.checked = !this.checked;
      this.$emit('input', this.checked);
      this.onChange(this.checked, args);
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.switch-container {
  display: flex;
  align-items: center;
  label {
    margin-right: 20px;
    font-weight: bold;
  }
  .switch {
    cursor: pointer;
    width: 46px;
    height: 22px;
    position: relative;
    background-color: $switch-background-color;
    border-radius: 22px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    &::before {
      content: '';
      width: 16px;
      height: 16px;
      position: absolute;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: $switch-circle-color;
    }
    &.checked {
      border-color: $switch-chencked-color;
      background-color: $switch-chencked-color;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .switch.checked:before {
    left: 26px;
  }
  .switch.switch-animation {
    transition: border cubic-bezier(0, 0, 0, 1) 0.4s;
  }
  .switch.switch-animation:before {
    transition: left 0.3s;
  }

  .switch.switch-animation.checked {
    background-color: $switch-chencked-color;
    transition: border ease 0.4s, box-shadow ease 0.4s,
      background-color ease 1.2s;
  }
  .switch.switch-animation.checked:before {
    transition: left 0.3s;
  }
}
</style>
