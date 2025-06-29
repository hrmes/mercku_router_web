<template>

  <div class="popover-container"
       v-clickoutside="handleClose"
       ref="container"
       @click="clickTriggler()">
    <div ref="trigger"
         class="popover-container__trigger">
      <slot></slot>
    </div>
    <div ref="popover"
         class="popover"
         :class="position"
         v-show="show">
      <div ref="triangle"
           class="triangle"></div>
      <div class="title"
           v-if="title">{{title}}</div>
      <div class="content">{{content}}</div>
    </div>

  </div>
</template>

<script>
const Positions = {
  left: 'left',
  center: 'center',
  right: 'right',
  top: 'top',
  middle: 'middle',
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
    return { show: false, hasListener: false };
  },
  mounted() {
    this.attachEvent();
  },
  beforeDestroy() {
    if (this.hasListener) {
      this.deattachEvent();
    }
  },
  methods: {
    initPopoverPosition() {
      const elPopover = this.$refs.popover;

      if (this.position.includes(Positions.top)) {
        elPopover.style.top = `-${elPopover.clientHeight + 10}px`;
      }
      if (this.position.includes(Positions.bottom)) {
        elPopover.style.bottom = `-${elPopover.clientHeight + 10}px`;
      }
      if (this.position.includes(Positions.center)) {
        elPopover.style.bottom = `-${elPopover.clientHeight + 10}px`;
        elPopover.style.transform = 'translateX(-50%)';
        elPopover.firstChild.style.left = '50%';
      }
    },
    attachEvent() {
      if (document.body.clientWidth > 768) {
        this.$refs.container.addEventListener('mouseenter', this.enter);
        this.$refs.container.addEventListener('mouseleave', this.handleClose);
        this.hasListener = true;
      }
    },
    deattachEvent() {
      this.$refs.container.removeEventListener('mouseenter', this.enter);
      this.$refs.container.removeEventListener('mouseleave', this.handleClose);
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
    z-index: var(--z-index_pageElement);
    width: 200px;
    background-color: var(--popover-background-color);
    border-radius: 8px;
    // box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    font-size: 12px;
    color: var(--popover-color);
    padding: 10px;

    &.bottom {
      .triangle {
        top: -8px;
        bottom: initial;
        transform: rotate(-180deg);
      }
    }
    &.left {
      left: -16px;
      .triangle {
        left: 16px;
      }
    }
    &.top {
      .triangle {
        bottom: -8px;
        top: initial;
      }
    }
    &.center {
      .triangle {
        bottom: -8px;
        left: 50%;
      }
    }
    .triangle {
      width: 16px;
      height: 8px;
      position: absolute;
      left: 0;
      &::before {
        content: '';
        // position: absolute;
        display: block;
        width: 0;
        height: 0;
        overflow: hidden;
        border: 8px solid var(--popover-background-color);
        border-bottom: none;
        border-left-color: transparent;
        border-right-color: transparent;
      }
    }

    // &::before {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   width: 0;
    //   height: 0;
    //   overflow: hidden;
    // }
    // &::after {
    //   content: '';
    //   position: absolute;
    //   display: block;
    //   width: 0;
    //   height: 0;
    //   overflow: hidden;
    // }
    // &.top {
    //   &::before {
    //     left: 18px;
    //     bottom: -10px;
    //     border: 10px solid #333;
    //     border-bottom: none;
    //     border-left-color: transparent;
    //     border-right-color: transparent;
    //   }
    //   &:after {
    //     left: 20px;
    //     bottom: -8px;
    //     border: 8px solid #333;
    //     border-bottom: none;
    //     border-left-color: transparent;
    //     border-right-color: transparent;
    //   }
    // }
    // &.bottom {
    //   &::before {
    //     left: 18px;
    //     top: -10px;
    //     border: 10px solid #333;
    //     border-top: none;
    //     border-left-color: transparent;
    //     border-right-color: transparent;
    //   }
    //   &:after {
    //     left: 20px;
    //     top: -8px;
    //     border: 8px solid #333;
    //     border-top: none;
    //     border-left-color: transparent;
    //     border-right-color: transparent;
    //   }
    // }
    .title {
      line-height: 1;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: bold;
    }
    .content {
      padding-top: 10px;
      font-weight: normal;
      white-space: normal;
    }
  }
}
</style>
