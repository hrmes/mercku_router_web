<template>
  <div class="wan-check-container">
    <nav-bar :option="option"/>
    <div class="status-info">
      <van-icon name="checked" class="icon"/>
      <label class="state">{{$t('trans0170')}}</label>
      <label class="code" v-if="config.wifi.ssid">{{$t('trans0171')}}</label>
    </div>
    <div class="wif-info" v-if="config.wifi.ssid">
      <div><span class="icon"></span><span class="title">{{$t('trans0168')}}</span>：<span
        class="value">{{config.wifi.ssid}}</span>
      </div>
      <div><span class="icon"></span><span class="title">{{$t('trans0003')}}</span>：<span
        class="value">{{config.wifi.password}}</span></div>
      <div><span class="icon"></span><span class="title">{{$t('trans0067')}}</span>：<span
        class="value">{{config.admin.password}}</span></div>
    </div>
    <div class="button-info" v-if="isWebView">
      <van-button size="normal" @click="config.wifi.ssid?jump2Sys():closeWeb()">{{ config.wifi.ssid? $t('trans0134'):
        $t('trans0233')}}
      </van-button>
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
          },
        },
        config: this.routerConfig.getConfig(),
      };
    },
    method: {
      closeWeb() {
        this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
      },
      jump2Sys() {
        this.$http.post2native('PUT', 'JUMP_SYSTEM_WIFI_SETTING');
      }
    },
    computed: {
      isWebView() {
        return this.webview;
      }
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

  .value {
    display: inline-block;
    text-align: left;
    width: 1rem;
  }

  }

  }

  .button-info {
    text-align: center;
    position: absolute;
    overflow: hidden;
    bottom: .5rem;
    width: 3.45rem;
    background: rgb(16, 16, 16);
  }
  }

</style>
