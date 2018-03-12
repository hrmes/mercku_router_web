<template>
  <div class="container">
    <div class="status"/>
    <div class="content">
      <div class="left active" v-if="option.left.disabled">
        <van-icon :name="option.left.icon" class="active"/>
      </div>
      <div class="center"  v-if="option.center">{{$t(`${option.center.text}`)}}</div>
      <div class="right active"  v-if="option.right">{{$t(`${option.right.text}`)}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['option'],
    data() {
      return {};
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .container {
    height: .64rem;
    box-sizing: border-box;

  .status {
    height: .2rem;
  }

  .content {
    height: .44rem;

  /*.active:hover{*/
  /*color: #f7d699;*/

  /*}*/
  .left {
    position: absolute;
    line-height: .44rem;
    left: .2rem;
    width: .5rem;
    font-size: 12px;
    height: .44rem;
    top: .2rem;
    line-height: .44rem;

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
    padding-left: .8rem;
    padding-right: .8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: .16rem;
    color: #D5B884;
    height: .44rem;
    position: relative;
    line-height: .44rem;

  }

  .right {
    position: absolute;
    right: .2rem;
    font-size: .14rem;
    color: #D5B884;
    text-align: right;
    height: .44rem;
    top: .2rem;
    line-height: .44rem;
  }

  }
  }


</style>
