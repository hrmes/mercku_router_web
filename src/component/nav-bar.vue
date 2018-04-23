<template>
  <div class="header-container">
    <div v-if="hasBar()" class="status has-topbar" />
    <div class="content">
      <div class="left" v-if="option.left" @click="leftClick()">
        <van-icon :name="option.left.icon" class="active" />
      </div>
      <div class="center" v-if="option.center">{{$t(`${option.center.text}`)}}</div>
      <div class="right" v-if="option.right" @click="rightClick()">{{$t(`${option.right.text}`)}}
      </div>
    </div>
  </div>

</template>
<script>
import { isIphone } from '../util/util';
export default {
  props: {
    onLeftClick: {
      type: Function
    },
    onRightClick: {
      type: Function
    },
    option: {
      default: function defaultValue() {
        return {};
      }
    }
  },
  methods: {
    leftClick() {
      this.onLeftClick();
    },
    rightClick() {
      this.onRightClick();
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
  position: relative;
  background: rgb(16, 16, 16);
  top: 0;
  box-sizing: border-box;

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
