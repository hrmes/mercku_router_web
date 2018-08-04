<template>
  <div class="header-container">
    <div class="content">
      <div class="left" v-if="option.left" @click="leftClick">
        <img v-if="option.left.icon" class="icon-back" src="../../assets/images/ic_back@3x.png" alt="">
        <span v-if="!option.left.icon">{{option.left.text}}</span>
      </div>
      <div class="center" v-if="option.center" @click="centerClick">
        <span v-if="!option.center.icon">{{option.center.text}}</span>
      </div>
      <div class="right" v-if="option.right" @click="rightClick">
        <img v-if="option.right.icon" class="icon-forward" src="../../assets/images/ic_back@3x.png" alt="">
        <span v-if="!option.right.icon">{{option.right.text}}</span>
      </div>
    </div>
  </div>

</template>
<script>
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
    }
  }
};
</script>
<style lang="scss" type="text/scss" scoped>
.header-container {
  min-height: 0.44rem;
  left: 0;
  right: 0;
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
      line-height: 0.44rem;
      width: 0.29rem;
      font-size: 0.12rem;
      height: 0.44rem;
      display: inline-block;
      padding-left: 0.15rem;
      padding-right: 0.15rem;
      position: relative;
      .icon-back {
        width: 0.12rem;
        height: 0.19rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .center {
      text-align: center;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.16rem;
      color: #d5b884;
      height: 0.44rem;
      position: absolute;
      left: 0.5rem;
      right: 0.5rem;
      line-height: 0.44rem;
      display: inline-block;
    }

    .right {
      z-index: 1111;
      position: absolute;
      display: inline-block;
      right: 0;
      font-size: 0.14rem;
      color: #d5b884;
      text-align: right;
      height: 0.44rem;
      line-height: 0.44rem;
      width: 0.5rem;
      padding-right: 0.15rem;
      .icon-forward {
        width: 0.12rem;
        height: 0.19rem;
        transform: rotate(180deg);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
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
