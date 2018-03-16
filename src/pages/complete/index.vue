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
export default {
  data() {
    return {
      option: {
        left: {
          icon: '',
        },
        center: {
          text: 'trans0222'
        },
        right: {
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
      this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
    }
  },
  computed: {
    isWebView() {
      return this.webview;
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-check-container {
  padding-right: 0.15rem;
  padding-left: 0.15rem;

  .status-info {
    margin-top: 0.6rem;
    text-align: center;

    .icon {
      font-size: 0.6rem;
      color: rgb(213, 184, 132);
    }

    label {
      display: block;
    }

    .state {
      font-size: 0.18rem;
      color: rgb(182, 182, 182);
      margin-top: 0.2rem;
    }

    .code {
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
      margin-top: 0.1rem;
      font-weight: 100;
    }
  }
  .wif-info {
    margin-top: 0.4rem;
    text-align: center;
    width: 100%;

    div {
      color: rgb(182, 182, 182);
      font-weight: 100;
      line-height: 0.3rem;
      font-size: 0.16rem;

      .icon {
        border: 0.03rem solid rgb(213, 184, 132);
        display: inline-block;
        border-radius: 0.03rem;
        margin-bottom: 0.02rem;
      }

      .title {
        display: inline-block;
        width: 0.8rem;
        text-align: right;
      }

      .value {
        display: inline-block;
        text-align: left;
        width: 1rem;
      }
    }
  }
}
</style>
