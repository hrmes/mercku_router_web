<template>
  <div class="wan-check-container">
    <nav-bar :option="option" />
    <div class="status-info">
      <img src="../../assets/images/ic_success.png" alt="">
      <label class="state">{{$t('trans0170')}}</label>
      <label class="code" v-if="config.wifi.ssid">{{$t('trans0171')}}</label>
    </div>
    <div class="net-info-container" v-if="config.wifi.ssid">
      <div class="net-info">
        <div>
          <span class="title">{{$t('trans0168')}}</span>
          <span class="value">{{config.wifi.ssid}}</span>
        </div>
        <div>
          <span class="title">{{$t('trans0172')}}</span>
          <span class="value">{{config.wifi.password}}</span>
        </div>
        <div>
          <span class="title">{{$t('trans0067')}}</span>
          <span class="value">{{config.admin.password}}</span>
        </div>
      </div>
    </div>
    <div class="note" v-if="showProgress">

      <div class="progress-bar">
        <div class="progress-bar-inner"></div>
      </div>
      <span>{{$t('trans0322')}}{{deadline}}s</span>
    </div>
    <div class="button-info" v-if="!showProgress">
      <button class="btn btn-default" @click="config.wifi.ssid?jump2Sys():closeWeb()">{{ config.wifi.ssid? $t('trans0134'): $t('trans0233')}}</button>
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
      deadline: 60
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
    width: 5%;
  }
  100% {
    width: 100%;
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
      width: 2rem;
      margin: 0 auto;
      margin-bottom: 0.3rem;
      background: rgb(230, 230, 230);
      border-radius: 1.5px;
      .progress-bar-inner {
        height: 3px;
        border-radius: 1.5px;
        background: rgb(214, 0, 28);
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
      flex: 1;
      margin: 0 0.35rem;

      div {
        color: rgb(182, 182, 182);
        font-size: 0.16rem;
        border-bottom: 1px solid rgb(189, 189, 189);
        padding: 0.1rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:last-child {
          border: 0;
        }
        .title {
          color: rgb(108, 108, 108);
          font-weight: bold;
        }

        .value {
          white-space: pre;
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
      color: rgb(51, 51, 51);
      margin-top: 0.2rem;
    }

    .code {
      font-size: 0.14rem;
      color: rgb(51, 51, 51);
      margin-top: 0.1rem;
    }
  }
}
</style>
