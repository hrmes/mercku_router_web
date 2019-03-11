<template>

  <div class="popover-container"
       v-clickoutside="handleClose">
    <div @click="clickTriggler()">
      <slot></slot>
    </div>
    <div class="popover"
         v-show="show"
         :style="{'top':10}">
      <div class="title"
           v-if="title">{{title}}</div>
      <div class="content">{{content}}</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Popover',
  props: {
    value: { type: Boolean },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return { show: false };
  },
  methods: {
    clickTriggler() {
      this.show = !this.show;
    },
    handleClose() {
      this.show = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.popover-container {
  position: relative;
  .popover {
    position: absolute;
    top: -120px;
    left: -24px;
    padding: 0 10px;
    width: 200px;
    height: 100px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    font-size: 12px;
    color: #333333;
    // overflow: hidden;
    .title {
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f1f1;
    }
    .content {
      padding: 10px 0;
    }
    &::before {
      content: '';
      position: absolute;
      left: 21px;
      bottom: -10px;
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
      border-width: 10px 10px 0;
      border-style: solid;
      border-color: #f1f1f1 transparent transparent;
    }
    &::after {
      content: '';
      position: absolute;
      left: 23px;
      bottom: -8px;
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
      border-width: 8px 8px 0;
      border-style: solid;
      border-color: #ffffff transparent transparent;
    }
  }
}
</style>
