<template>
  <transition name="checkbox">
    <div @click="check()" class="checkbox-container">
      <div class="box" :class="{'checked':checked}"></div>
      <div class="text">{{text}}</div>
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
    text: {
      type: String
    }
  },
  data() {
    return {
      checked: this.value
    };
  },
  methods: {
    check() {
      this.checked = !this.checked;
      this.$emit('input', this.checked);
    }
  }
};
</script>
<style lang="scss">
.checkbox-container {
  text-align: left;
  cursor: pointer;
  height: 18px;
  display: block;
  .box {
    float: left;
    width: 18px;
    height: 18px;
    border-radius: 2px;
    border: 1px solid #f1f1f1;
    &.checked {
      background: url(../../assets/images/ic_selected.png) no-repeat center;
      border: none;
      background-size: 90%;
      background-color: #00d061;
    }
  }
  .text {
    display: inline;
    font-size: 12px;
    color: #333;
    margin-left: 5px;
  }
}
</style>
