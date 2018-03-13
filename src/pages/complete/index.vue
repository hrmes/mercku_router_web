<template>
  <div class="wan-check-container">
    <nav-bar :option="option"/>
    <div class="status-info">
      <van-icon name="checked" class="icon"/>
      <label class="state">{{$t('trans0170')}}</label>
      <label class="code">{{$t('trans0171')}}</label>
    </div>
    <div class="wif-info">
        <div><span class="icon"></span><span class="title">{{$t('trans0168')}}</span>：<span class="value">3123</span></div>
        <div><span class="icon"></span><span class="title">{{$t('trans0003')}}</span>：<span class="value">1231231231</span></div>
        <div><span class="icon"></span><span class="title">{{$t('trans0067')}}</span>：<span class="value">123123123123123</span></div>
    </div>
    <div class="button-info">
      <van-button size="normal">{{$t('trans0134')}}</van-button>
    </div>
  </div>
</template>
<script>
  import navBar from '../../component/nav-bar.vue';

  export default {
    components: {
      'nav-bar': navBar
    },
    data() {
      return {
        option: {
          left: {
            disabled: false,
            icon: '',
          },
          center: {
            disabled: true,
            text: 'trans0222'
          },
          right: {
            disabled: false,
            text: '',
          }
        }
      };
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wan-check-container {
    padding-right: .15rem;
    padding-left: .15rem;

  .status-info {
    margin-top: .6rem;
    text-align: center;

  .icon {
    font-size: .6rem;
    color: rgb(213, 184, 132);
  }

  label {
    display: block;
  }

  .state {
    font-size: .18rem;
    color: rgb(182, 182, 182);
    margin-top: .2rem;
  }

  .code {
    font-size: .14rem;
    color: rgb(182, 182, 182);
    margin-top: .1rem;
    font-weight: 100;
  }

  }
  .wif-info {
    margin-top: .4rem;
    text-align: center;
    width: 100%;
  div {
    color: rgb(182, 182, 182);
    font-weight: 100;
    line-height: .3rem;
    font-size: .16rem;

  .icon {
    border: .03rem solid rgb(213, 184, 132);
    display: inline-block;
    border-radius: .03rem;
    margin-bottom: .02rem;
  }

  .title {
    display: inline-block;
    width: .8rem;
    text-align: right;
  }
  .value{
    display: inline-block;
    text-align: left;
    width: 1rem;
  }

  }

  }

  .button-info {
    text-align: center;
    margin-top: 1.42rem;
  }

  }

</style>
