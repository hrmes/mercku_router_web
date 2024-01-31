<template>
  <transition name="checkbox">
    <div class="checkbox-container">
      <label @click="check">
        <div class="box"
             :class="classObject"></div>
        <div class="text"
             :class="{'bold':bold}"
             v-if="text">{{text}}</div>
      </label>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: { type: String },
    bold: {
      type: Boolean,
      default: false
    },
    rect: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { checked: this.value };
  },
  computed: {
    classObject() {
      return {
        checked: this.checked,
        'circle-shape': !this.rect,
        disabled: this.disabled
      };
    }
  },
  methods: {
    check(e) {
      if (this.readonly || this.disabled) {
        return;
      }
      this.checked = !this.checked;
      this.$emit('input', this.checked);
      this.$emit('change', this.checked);
      if (this.stopPropagation) {
        e.stopPropagation();
      }
    }
  },
  watch: {
    value(v) {
      this.checked = v;
    }
  }
};
</script>
<style lang="scss">
.checkbox-container {
  text-align: left;
  height: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .box {
    float: left;
    width: 18px;
    height: 18px;
    line-height: 17px;
    border-radius: 3px;
    border: 1.5px solid var(--checkbox_border-color);
    background: var(--checkbox-bgc);
    &.circle-shape {
      border-radius: 50%;
    }
    &.checked {
      border: none;
      background-image: var(--checkbox_checked-bgc);
      padding-left: 2.5px;
      position: relative;
      &::after {
        content: '\e6be';
        width: 10px;
        height: 10px;
        font-size: 12px;
        font-family: 'iconfont';
        color: #fff;
      }
    }
    &.disabled {
      background: var(--checkbox_disabled-bgc);
      cursor: not-allowed;
    }
  }
  .text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline;
    font-size: 14px;
    line-height: 18px;
    color: var(--text_default-color);
    margin-left: 12px;
    user-select: none;
    &.bold {
      font-weight: 600;
    }
  }
}
</style>
