<template>
  <layout>
    <div class="dashboard-container">
      <div class="net-info">
        <div class="device-container">
          <div class="icon-container">
            <img src="../../../assets/images/ic_device.png" alt="">
          </div>
          <div class="text-container">
            {{'终端设备'}}({{deviceCount}})
          </div>
        </div>
        <div class="line"></div>
        <div class="wifi-container">
          <div class="icon-container">
            <img src="../../../assets/images/ic_router.png" alt="">
          </div>
          <div class="text-container">
            {{ssid||'-'}}
          </div>
        </div>
        <div class="line" :class="{'testing':isTesting,'unconnected':(!testing && !isConnected)}">
          <span class='testing' v-if="isTesting"> {{$t('trans0298')}}</span>
          <div class="icon-unconnected-container" v-if="isLinked || isUnlinked">
            <img src="../../../assets/images/ic_unconnected.png" alt="">
          </div>
        </div>
        <div class="internet-container">
          <div class="icon-container">
            <img src="../../../assets/images/ic_internet.png" alt="">
          </div>
          <div class="text-container">
            Internet
          </div>
        </div>
      </div>
      <router-view class="router-view"></router-view>
    </div>

  </layout>
</template>
<script>
import layout from '../../../layout.vue';
import * as CONSTANTS from '../../../../util/constant';

export default {
  components: {
    layout
  },
  data() {
    return {
      CONSTANTS,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      pageActive: true,
      ssid: '',
      deviceCount: 0,
      deviceCountTimer: null
    };
  },
  computed: {
    isTesting() {
      return this.netStatus === CONSTANTS.WanNetStatus.testing;
    },
    isConnected() {
      return this.netStatus === CONSTANTS.WanNetStatus.connected;
    },
    isLinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.linked;
    },
    isUnlinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.unlinked;
    }
  },
  mounted() {
    this.getWanStatus();
    this.getSsid();
    this.createIntercvalTask();
  },
  methods: {
    createIntercvalTask() {
      this.getDeviceCount();
    },
    clearIntervalTask() {
      clearTimeout(this.deviceCountTimer);
      this.deviceCountTimer = null;
    },
    getSsid() {
      this.$http.getMeshMeta().then(res => {
        this.ssid = res.data.result.ssid;
      });
    },
    getDeviceCount() {
      clearTimeout(this.deviceCountTimer);
      this.deviceCountTimer = null;
      this.$http
        .getDeviceCount()
        .then(res => {
          this.deviceCount = res.data.result.count;
          if (this.pageActive) {
            this.deviceCountTimer = setTimeout(() => {
              this.getDeviceCount();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.pageActive) {
            this.timer2 = setTimeout(() => {
              this.getDeviceCount();
            }, 10000);
          }
        });
    },
    getWanStatus() {
      this.netStatus = CONSTANTS.WanNetStatus.testing;
      const timer = setTimeout(() => {
        this.$http
          .getWanStatus()
          .then(res => {
            clearTimeout(timer);
            this.netStatus = res.data.result.status;
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = CONSTANTS.WanNetStatus.unlinked;
          });
      }, 1000);
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
  }
};
</script>
<style lang="scss" scoped>
@keyframes speed-test-line {
  form {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.dashboard-container {
  flex: auto;
  padding: 0 2%;
  margin-top: 80px;
  .net-info {
    display: flex;
    padding: 0 10%;
    .icon-container {
      img {
        width: 50px;
        height: 50px;
        display: block;
        margin: 0 auto;
      }
    }
    .text-container {
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .line {
      flex: 1;
      height: 50px;
      background: url('../../../assets/images/ic_test_line.png') repeat-x;
      background-position-y: 24px;
      background-size: auto 2px;
      text-align: center;
      position: relative;
      &.unconnected {
        background: url(../../../assets/images/ic_test_line_fail.png) repeat-x;
        background-position-y: 24px;
        background-size: auto 2px;
      }
      &.testing {
        background: none;
        &::after {
          content: '';
          width: 10%;
          display: block;
          height: 2px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: url('../../../assets/images/ic_test_line.png') repeat-x;
          background-size: auto 2px;
          animation: speed-test-line linear 1s infinite;
        }
      }
      .icon-unconnected-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        background: #f1f1f1;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .device-container,
    .wifi-container,
    .internet-container {
      width: 200px;
    }
    .device-container {
      .text-container {
        font-size: 14px;
      }
    }
    .wifi-container {
    }
    .internet-container {
    }
  }
  .router-view {
    margin-top: 50px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1680px) {
  .dashboard-container {
  }
}
@media screen and (min-width: 769px) and (max-width: 1366px) {
  .dashboard-container {
  }
}
@media screen and (min-width: 769px) and (max-width: 1100px) {
  .dashboard-container {
  }
}
@media screen and (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
    padding-top: 30px;
  }
}
</style>
