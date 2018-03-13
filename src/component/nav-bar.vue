<template>
  <div class="container">
    <div v-if="hasBar()" class="status has-topbar" />
    <div class="content">
      <div class="left active" v-if="option.left.disabled" @click="leftClick()">
        <van-icon :name="option.left.icon" class="active"/>
      </div>
      <div class="center" v-if="option.center">{{$t(`${option.center.text}`)}}</div>
      <div class="right active" v-if="option.right" @click="rightClick()">{{$t(`${option.right.text}`)}}
      </div>
    </div>
  </div>
</template>
<script>
  import { isIphone } from '../util/util';

  export default {
    props: ['option', 'onLeftClick', 'onRightClick'],
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
<style lang="scss" rel="stylesheet/scss">
  @import "../util/iphonex.scss";

  .container {
    min-height: .44rem;
    box-sizing: border-box;

  .status {
    height: .2rem;
  }

  .content {
    position: relative;
    height: .44rem;

  .left {
    z-index: 1111;
    position: absolute;
    line-height: .44rem;
    left: .15rem;
    width: .5rem;
    font-size: 12px;
    height: .44rem;
    /*top: .2rem;*/

  i {
    width: .12rem;
    height: .2rem;
    font-size: .16rem;
    position: absolute;
    top: .12rem;
    color: #D5B884;

  }

  }

  .center {
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: .16rem;
    color: #D5B884;
    height: .44rem;
    position: absolute;
    line-height: .44rem;

  }
  .right {
    z-index: 1111;
    position: absolute;
    right: 0;
    font-size: .14rem;
    color: #D5B884;
    text-align: right;
    height: .44rem;
    /*top: .2rem;*/
    line-height: .44rem;
  }

  }
  }


</style>
