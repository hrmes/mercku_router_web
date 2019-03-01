<template>
  <transition name="checkbox">
    <div class="checkbox-container">
      <label @click.stop="check()">
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
    // 是否绑定
    value: {
      type: Boolean,
      default: false
    },
    // 文本值
    text: { type: String },
    // 勾选框的形状
    rect: {
      type: Boolean,
      default: false
    },
    // 当绑定值变化时触发的事件
    onChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return { checked: this.value };
  },
  methods: {
    // @vuese
    // 勾选
    check() {
      this.checked = !this.checked;
      this.onChange(this.checked);
    // 当输入绑定值触发的事件
    // @arg 输入后的绑定值
      this.$emit('input', this.checked);
    // 当绑定值变化时触发的事件
    // @arg 更新后的值
      this.$emit('change', this.checked);
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
    border-radius: 2px;
    border: 1px solid #999;
    background: #fff;
    &.circle-shape {
      border-radius: 50%;
    }
    &.checked {
      background: url(../../assets/images/ic_selected.png) no-repeat center;
      border: none;
      background-size: 90%;
      background-color: #00d061;
    }
  }
  .text {
    display: inline;
    font-size: 14px;
    line-height: 1;
    color: #333;
    margin-left: 10px;
  }
}
</style>
