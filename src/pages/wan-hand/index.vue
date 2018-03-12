<template>
  <div class="wan-hand-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="message">{{$t('trans0143')}}</div>
    <div class="list">
      <div class="item" @click="$router.push('/pppoe')">
        <div class="text">
          <label class="title">{{$t('trans0144')}}</label>
          <label class="des">{{$t('trans0145')}}</label>
        </div>
        <div class="icon">
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="item" @click="$router.push('/dhcp')">
        <div class="text">
          <label class="title">{{$t('trans0146')}}</label>
          <label class="des">{{$t('trans0147')}}</label>
        </div>
        <div class="icon">
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="item" @click="$router.push('/static-ip')">
        <div class="text">
          <label class="title">{{$t('trans0148')}}</label>
          <label class="des">{{$t('trans0149')}}</label>
        </div>
        <div class="icon">
          <van-icon name="arrow"/>
        </div>
      </div>
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
            text: 'trans0142'
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
  .wan-hand-container {

  .message {
    height: .5rem;
    line-height: .5rem;
    font-size: .12rem;
    text-align: center;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);

  }
  .list{
    margin-top: .2rem;


  }
  .item{
    height: .8rem;
    /*border: 1px solid red;*/
    width: 100%;
    display: table;
    .text{
      display: table-cell;
      overflow: hidden;
      vertical-align: middle;
      padding-left: .15rem;
      label{
        display: block;
      }
      :first-child{
        font-size: .14rem;
        color: rgb(182,182,182);
      }
      :last-child{
        font-size: .12rem;
        color: rgb(124,124,124);
        padding-top: .05rem;
      }
    }
    .icon{
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      padding-right: .15rem;
      i{
        color: #D5B884;
      }

    }
  }

  }


</style>
