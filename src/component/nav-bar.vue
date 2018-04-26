<template>
  <div class="header-container">
    <!-- <div v-if="hasBar()" class="status has-topbar" /> -->
    <div class="content">
      <div class="left" v-if="option.left" @click="leftClick">
        <van-icon v-if="option.left.icon" :name="option.left.text" class="active" />
        <span v-if="!option.left.icon">{{option.left.text}}</span>
      </div>
      <div class="center" v-if="option.center" @click="centerClick">
        <van-icon v-if="option.center.icon" :name="option.center.text" class="active" />
        <span v-if="!option.center.icon">{{option.center.text}}</span>
      </div>
      <div class="right" v-if="option.right" @click="rightClick">
        <van-icon v-if="option.right.icon" :name="option.right.text" class="active" />
        <span v-if="!option.right.icon">{{option.right.text}}</span>
      </div>
    </div>
  </div>

</template>
<script>
import { isIphone } from '../util/util';

const noop = () => {};
export default {
  /*
    option:{
      left:{
        icon:bool,  when icon is true ,the text is icon name class
        text:string,
        click:function
      },
      center:{
        icon:bool,
        text:string,
        click:function
      },
      right:{
        icon:bool,
        text:string,
        click:function
      }
    }

  */
  props: {
    option: {
      type: Object,
      default: () => ({
        left: {
          icon: false,
          text: '',
          click: noop
        },
        center: {
          icon: false,
          text: '',
          click: noop
        },
        right: {
          icon: false,
          text: '',
          click: noop
        }
      })
    }
  },
  methods: {
    leftClick() {
      const click = this.option.left.click || noop;
      return click();
    },
    centerClick() {
      const click = this.option.center.click || noop;
      return click();
    },
    rightClick() {
      const click = this.option.right.click || noop;
      return click();
    },
    hasBar() {
      return isIphone();
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
@import '../util/iphonex.scss';

.header-container {
  min-height: 0.44rem;
  width: 100%;
  position: absolute;
  background: rgb(16, 16, 16);
  top: 0;
  box-sizing: border-box;
  z-index: 1000;

  .status {
    height: 0.2rem;
  }

  .content {
    position: relative;
    height: 0.44rem;

    .left {
      z-index: 1111;
      position: absolute;
      line-height: 0.44rem;
      left: 0.15rem;
      width: 0.5rem;
      font-size: 12px;
      height: 0.44rem;

      /*top: .2rem;*/
      i {
        width: 0.12rem;
        height: 0.2rem;
        font-size: 0.16rem;
        position: absolute;
        top: 0.12rem;
        color: #d5b884;
      }

      :active {
        color: #ffdea1;
      }

      :hover {
        color: #ffdda1;
      }
    }

    .center {
      text-align: center;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.16rem;
      color: #d5b884;
      height: 0.44rem;
      position: absolute;
      line-height: 0.44rem;
    }

    .right {
      z-index: 1111;
      position: absolute;
      right: 0;
      font-size: 0.14rem;
      color: #d5b884;
      text-align: right;
      height: 0.44rem;
      /*top: .2rem;*/
      line-height: 0.44rem;

      :active {
        color: #ffdea1;
      }

      :hover {
        color: #ffdda1;
      }
    }
  }
}
</style>
