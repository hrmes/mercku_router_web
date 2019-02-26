<template>

  <div class="popover-container">
    <div class="trigger"
         @click.stop="clickTriggler()">
      <slot></slot>
    </div>

    <div class="pop-info"
         :class="{'bottom-pop-info':position==='bottom'}"
         v-show="show"
         :style="{'top':10}"
         v-clickoutside="handleClose">
      <div class="pop">
        <div class="title"
             v-if="title">{{title}}</div>
        <div class="content"> {{content}} </div>
      </div>
      <div class="triangle">
        <i></i>
      </div>
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
.pop-info {
  position: absolute;
  top: -120px;
  left: -24px;
  .pop {
    padding: 0 10px;
    width: 230px;
    min-height: 100px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    // position: absolute;
    font-size: 12px;
    color: #333333;
    overflow: hidden;
    .title {
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f1f1;
    }
    .content {
      padding: 5px 0;
    }
  }
  .triangle {
    position: relative;
    height: 14px;
    i {
      position: relative;
      bottom: 0;
      top: 2px;
      &::before {
        content: '';
        position: absolute;
        left: 21px;
        bottom: -8px;
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
        bottom: -6px;
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
  &.bottom-pop-info {
    position: absolute;
    top: 20px;
    left: -130px;
    .triangle {
      position: relative;
      height: 14px;
      i {
        position: relative;
        bottom: 0;
        top: -108px;
        &::before {
          content: '';
          position: absolute;
          left: 128px;
          bottom: -8px;
          display: block;
          width: 0;
          height: 0;
          overflow: hidden;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent #f1f1f1;
        }
        &::after {
          content: '';
          position: absolute;
          left: 130px;
          bottom: -8px;
          display: block;
          width: 0;
          height: 0;
          overflow: hidden;
          border-width: 0 8px 8px;
          border-style: solid;
          border-color: transparent transparent #ffffff;
        }
      }
    }
  }
}
</style>
