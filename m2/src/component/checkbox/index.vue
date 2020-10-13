<template>
  <transition name="checkbox">
    <div class="checkbox-container">
      <label @click="check">
        <div class="box"
             :class="{'checked':checked,'circle-shape':!rect}"></div>
        <div class="text"
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
    rect: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    onChange: {
      type: Function,
      default: () => {}
    },
    stopPropagation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { checked: this.value };
  },
  methods: {
    check(e) {
      if (!this.readonly) {
        this.checked = !this.checked;
        this.onChange(this.checked);
        this.$emit('input', this.checked);
        this.$emit('change', this.checked);
        if (this.stopPropagation) {
          e.stopPropagation();
        }
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
  height: 18px;
  display: inline-block;
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
    border-radius: 4px;
    border: 1px solid $checkbox-border-color;
    background: $checkbox-background-color;
    &.circle-shape {
      border-radius: 50%;
    }
    &.checked {
      background: #333;
      position: relative;
      border-color: $checkbox-checked-background-color;
      &::after {
        content: '';
        display: block;
        border: 1px solid $checkbox-checked-color;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 6px;
        position: absolute;
        top: 3px;
        transform: rotate(45deg);
        width: 3px;
      }
    }
  }
  .text {
    display: inline;
    font-size: 14px;
    line-height: 1;
    color: #333;
    margin-left: 10px;
    flex: 1;
  }
}
</style>
