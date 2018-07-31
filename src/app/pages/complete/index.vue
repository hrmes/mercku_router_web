<template>
  <div class="wan-check-container">
    <nav-bar :option="option" />
    <div class="status-info">
      <img src="../../assets/images/ic_succeed.png" alt="">
      <label class="state">{{$t('trans0170')}}</label>
      <label class="code" v-if="config.wifi.ssid">{{$t('trans0171')}}</label>
    </div>
    <div class="net-info-container" v-if="config.wifi.ssid">
      <div class="net-info">
        <div>
          <span class="icon"></span>
          <span class="title">{{$t('trans0168')}}</span>:
          <span class="value">{{config.wifi.ssid}}</span>
        </div>
        <div>
          <span class="icon"></span>
          <span class="title">{{$t('trans0003')}}</span>:
          <span class="value">{{config.wifi.password}}</span>
        </div>
        <div>
          <span class="icon"></span>
          <span class="title">{{$t('trans0067')}}</span>:
          <span class="value">{{config.admin.password}}</span>
        </div>
      </div>
    </div>
    <div class="note" v-if="showProgress">

      <div class="progress-bar">
        <div class="progress-bar-inner"></div>
      </div>
      <span>{{$t('trans0294')}}{{deadline}}s</span>
    </div>
    <div class="button-info" v-if="!showProgress">
      <van-button size="normal" @click="config.wifi.ssid?jump2Sys():closeWeb()">{{ config.wifi.ssid? $t('trans0134'): $t('trans0233')}}
      </van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: {
        center: {
          text: this.$t('trans0222')
        }
      },
      config: this.routerConfig.getConfig(),
      timer: null,
      deadline: 40
    };
  },
  computed: {
    showProgress() {
      return this.deadline > 0;
    }
  },
  methods: {
    closeWeb() {
      this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
    },
    jump2Sys() {
      this.$http.post2native('PUT', 'JUMP_SYSTEM_WIFI_SETTING');
      this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
    }
  },
  mounted() {
    if (
      (this.config.wifi && this.config.wifi.ssid) ||
      (this.config.wan && this.config.wan.type)
    ) {
      this.timer = setInterval(() => {
        if (this.deadline <= 0) {
          clearInterval(this.timer);
          return;
        }
        this.deadline -= 1;
      }, 1000);
    } else {
      this.deadline = 0;
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
@keyframes progress {
  0% {
    width: 10px;
  }
  100% {
    width: 200px;
  }
}
.wan-check-container {
  padding-right: 0.15rem;
  padding-left: 0.15rem;

  .note {
    text-align: center;
    position: absolute;
    bottom: 0.5rem;
    transform: translateX(-50%);
    left: 50%;
    width: 100%;
    .progress-bar {
      width: 200px;
      margin: 0 auto;
      margin-bottom: 0.3rem;
      background: rgb(72, 72, 72);
      .progress-bar-inner {
        height: 3px;
        border-radius: 1.5px;
        background: rgb(213, 184, 132);
        animation: progress 40s linear;
      }
    }
  }
  .net-info-container {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    .net-info {
      text-align: left;
      display: inline-block;
      margin: 0 auto;

      div {
        color: rgb(182, 182, 182);
        margin-bottom: 0.1rem;
        font-size: 0.16rem;

        .icon {
          display: inline-block;
          width: 0.05rem;
          height: 0.05rem;
          border-radius: 50%;
          margin-bottom: 0.02rem;
          margin-right: 0.08rem;
        }

        .title {
          display: inline-block;
          text-align: right;
        }

        .value {
          display: inline-block;
          text-align: left;
          margin-left: 0.05rem;
        }
      }
    }
  }
  .status-info {
    margin-top: 0.9rem;
    text-align: center;

    img {
      width: 0.6rem;
      height: 0.6rem;
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
    }
  }
}
</style>
