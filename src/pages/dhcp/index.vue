<template>
  <div class="dhcp-container">
    <nav-bar :option="option" :onLeftClick="onLeftClick"/>
    <div class="space">
      <div class="status-info">
        <img src="../../../static/1.jpg" alt="">
        <div class="state">{{$t('trans0157')}}</div>
      </div>
    </div>
    <div class="button-info">
      <van-button size="normal" @click="submit()">{{$t('trans0081')}}</van-button>
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
        this.$router.replace('/wan-hand');
      },
      submit() {
        this.routerConfig.setWan('dhcp');
        this.$http.update(this.routerConfig.getConfig()).then((res) => {
          this.$router.replace('/complete');
        })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .dhcp-container {

    .space{
      padding: 0 .15rem;
    }
    .status-info {
      font-size: 0.2rem;
      text-align: center;
      color: rgb(1, 1, 1);
      position: relative;
      .state {
        position: absolute;
        width: 100%;
        top: 0.25rem;
        font-size: 0.2rem;
        text-align: center;
        color: rgb(1, 1, 1);
        /*height: 0.65rem;*/
        /*line-height: 0.65rem;*/
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.16rem;
      }
    }

  }

</style>
