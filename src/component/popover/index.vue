<template>

  <div class="popover-container"
       v-clickoutside="handleClose"
       @click="clickTriggler()"
       @mouseenter="enter"
       @mouseleave="handleClose">
    <div ref="trigger"
         class="popover-container__trigger">
      <slot></slot>
    </div>
    <div ref="popover"
         class="popover"
         :class="position"
         v-show="show">
      <div class="title"
           v-if="title">{{title}}</div>
      <div class="content">{{content}}</div>
    </div>

  </div>
</template>

<script>
const Positions = {
  left: 'left',
  right: 'right',
  top: 'top',
  bottom: 'bottom'
};
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
      default: Positions.top
    }
  },
  data() {
    return { show: false };
  },
  methods: {
    initPopoverPosition() {
      const elPopover = this.$refs.popover;

      switch (this.position) {
        case Positions.top:
          elPopover.style.top = `-${elPopover.clientHeight + 10}px`;
          elPopover.style.left = '-21px';
          break;
        case Positions.bottom:
          elPopover.style.bottom = `-${elPopover.clientHeight + 10}px`;
          elPopover.style.left = '-21px';
          break;
        default:
          break;
      }
    },
    enter() {
      this.show = true;
      this.$nextTick(() => {
        this.initPopoverPosition();
      });
    },
    clickTriggler() {
      this.show = !this.show;
      if (this.show) {
        this.$nextTick(() => {
          this.initPopoverPosition();
        });
      }
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
    padding: 0 10px;
    z-index: 999;
    width: 200px;
    background-color: #f1f1f1;
    border-radius: 8px;
    // box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    font-size: 12px;
    color: #333333;
    padding: 10px;
    &::before {
      content: '';
      position: absolute;

      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
    }
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
    }
    &.top {
      &::before {
        left: 18px;
        bottom: -10px;
        border: 10px solid #f1f1f1;
        border-bottom: none;
        border-left-color: transparent;
        border-right-color: transparent;
      }
      &:after {
        left: 20px;
        bottom: -8px;
        border: 8px solid #f1f1f1;
        border-bottom: none;
        border-left-color: transparent;
        border-right-color: transparent;
      }
    }
    &.bottom {
      &::before {
        left: 18px;
        top: -10px;
        border: 10px solid #f1f1f1;
        border-top: none;
        border-left-color: transparent;
        border-right-color: transparent;
      }
      &:after {
        left: 20px;
        top: -8px;
        border: 8px solid #f1f1f1;
        border-top: none;
        border-left-color: transparent;
        border-right-color: transparent;
      }
    }
    .title {
      line-height: 1;
      box-sizing: border-box;
      border-bottom: 1px solid #f1f1f1;
      font-weight: normal;
    }
    .content {
      padding-top: 10px;
      font-weight: normal;
      white-space: normal;
    }
  }
}
</style>
