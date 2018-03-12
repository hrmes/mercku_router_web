<template>
  <div class="container">
    <nav-bar :option="option"/>
    <div class="status-info">
      <div class="state">{{$t('trans0180')}}</div>
      <div class="message">{{$t('trans0161')}}</div>
      <div></div>
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
            icon: ''
          },
          center: {
            disabled: true,
            text: 'trans0223'
          },
          right: {
            disabled: true,
            text: 'trans0163'
          }
        }
      };
    },
    methods: {
      onClickLeft() {

      },
      onClickRight() {

      }
    }

  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .container {
    padding-right: .2rem;
    padding-left: .2rem;

  .status-info {
    width: 3.35rem;
    height: 2.7rem;
    box-sizing: border-box;
    border-radius: .16rem;
    background: url("../../../static/123.png") no-repeat;
    background-size: cover;

  .state {
    font-size: .2rem;
    text-align: center;
    color: rgb(1,1,1);
    height: .65rem;
    line-height: .65rem;
  }
  .message{

    text-align: center;
    font-size: .12rem;
    color: rgb(0,0,0);


  }

  }

  }

</style>
