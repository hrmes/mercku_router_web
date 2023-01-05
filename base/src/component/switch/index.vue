<template>
  <div class="mk-switch">
    <div class="mk-switch__inner"
         :class="{ checked: checked, disabled: disabled }"
         @click="switchValue"></div>
    <label class="mk-switch__label"
           v-if="label">{{ label }}</label>
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
    font-weight: bold;
  }
  .mk-switch__inner {
    cursor: pointer;
    width: 40px;
    height: 25px;
    position: relative;
    background-color: var(--switch-background-color);
    border-radius: 22px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    margin-right: 10px;
    &::before {
      content: '\e667';
      font-family: 'iconfont';
      width: 20px;
      height: 20px;
      line-height: 21px;
      text-align: center;
      position: absolute;
      font-size: 13px;
      font-weight: 600;
      color: #bdbdbd;
      top: 50%;
      left: 2px;
      transform: translate(0, -49%);
      border-radius: 16px;
      background-color: var(--switch-circle-color);
      transition: left 0.3s;
    }
    &.checked {
      border-color: var(--switch-chencked-color);
      background-color: var(--switch-chencked-color);
      transition: border ease 0.4s, box-shadow ease 0.4s,
        background-color ease 1.2s;
      &::before {
        content: '\e65c';
        left: 18px;
        color: #0fc866;
      }
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}
</style>
