<template>
  <div class="mk-switch">
    <div class="mk-switch__inner"
         :class="{ checked: checked, disabled: disabled }"
         @click="switchValue">
      <div class="mk-switch__circle"
           :class="{ checked: checked, disabled: disabled }"></div>
    </div>
    <div class="mk-switch__label"
         :class="{'bold':bold}"
         v-if="label">{{ label }}</div>
  </div>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: { type: String },
    bold: { type: Boolean, default: true },
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  computed: {
    checked() {
      return this.value === this.activeValue;
    }
  },
  methods: {
    handleChange() {
      const val = this.checked ? this.inactiveValue : this.activeValue;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    switchValue() {
      !this.disabled && this.handleChange();
    }
  }
};
</script>
<style lang="scss">
.mk-switch {
  display: flex;
  align-items: center;
  .mk-switch__label {
    display: flex;
    justify-content: center;
    align-items: center;
    &.bold {
      font-weight: 700;
    }
  }
  .mk-switch__inner {
    cursor: pointer;
    width: 48px;
    height: 28px;
    position: relative;
    background-color: var(--switch-background-color);
    border-radius: 22px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    margin-right: 10px;
    .mk-switch__circle {
      position: absolute;
      top: 50%;
      left: 3px;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 22px;
      height: 22px;
      background-color: #fff;
      border-radius: 50%;
      transition: left 0.3s;
      &::before {
        content: '\e6b5';
        font-family: 'iconfont';
        font-size: 12px;
        font-weight: 600;
        color: var(--switch-off-icon-color);
      }
    }
    &.checked {
      border-color: var(--switch-chencked-color);
      background-image: var(--switch-chencked-color);
      transition: border ease 0.4s, box-shadow ease 0.4s,
        background-image ease 1.2s;
      & .mk-switch__circle {
        left: 23px;
        &::before {
          content: '\e6be';
          color: var(--switch-on-icon-color);
        }
      }
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}
</style>
