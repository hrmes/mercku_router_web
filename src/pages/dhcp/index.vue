<template>
  <div class="wan-check-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="status-info">
      <div class="state">{{$t('trans0157')}}</div>

    </div>
    <div class="button-info">
      <van-button size="normal" @click="$router.replace('/complete')">{{$t('trans0081')}}</van-button>
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
            disabled: true,
            icon: 'arrow-left',
          },
          center: {
            disabled: true,
            text: 'trans0146'
          },
          right: {
            disabled: false,
            text: '',
          }
        }
      };
    },
    methods: {
      onLeftClick() {
        this.$router.back();
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wan-check-container {
    padding-right: .15rem;
    padding-left: .15rem;

  .status-info {
    width: 3.35rem;
    height: 2.7rem;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: .16rem;
    margin-top: .2rem;
    overflow: hidden;
    background: url("../../../static/123.png") no-repeat;
    background-size: cover;



  .state {
    font-size: .2rem;
    text-align: center;
    color: rgb(1, 1, 1);
    margin-top: .6rem;
  }


  }

  .button-info {
    text-align: center;
    margin-top: 1.42rem;
  }

  }

</style>
