<template>
  <div class="page">
    <div class="page-content">
      <div class="net-info">
        <div class="device-container"
             @click="isRouter && forward2page('/dashboard/device/primary')">
          <div class="icon-container">
            <img src="../../../assets/images/ic_device.png"
                 alt="">
          </div>
          <div class="text-container">
            {{$t('trans0235')}}<span v-if="isRouter">&nbsp;({{deviceCount}})</span>
          </div>
        </div>
        <div class="line"></div>
        <div class="wifi-container"
             @click="forward2page('/dashboard/mesh')">
          <div class="icon-container">
            <img src="../../../assets/images/ic_router.png"
                 alt="">
          </div>
          <div class="text-container">
            {{ssid||'-'}}
          </div>
        </div>
        <div class="line"
             :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
          <div class="icon-unconnected-container"
               v-if="isLinked || isUnlinked">
            <img src="../../../assets/images/ic_unconnected.png"
                 alt="">
          </div>
        </div>
        <div class="internet-container"
             @click="forward2page('/dashboard/internet')">
          <div class="icon-container">
            <img src="../../../assets/images/ic_internet.png"
                 alt="">
          </div>
          <div class="text-container">
            {{$t('trans0366')}}
          </div>
        </div>
      </div>
      <router-view class="router-view"></router-view>
    </div>
  </div>
</template>
<script>
import * as CONSTANTS from 'util/constant';

export default {
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
    },
    isRouter() {
      return CONSTANTS.RouterMode.router === this.$store.mode;
    }
  },
  mounted() {
    this.getWanStatus();
    this.getSsid();
    this.createIntercvalTask();
  },
  watch: {
    '$store.mode': function watcher() {
      console.log(`watch task...mode is:${this.$store.mode}`);
      this.clearIntervalTask();
      if (this.isRouter) {
        this.createIntercvalTask();
      }
    }
  },
  methods: {
    forward2page(url) {
      this.$router.push({ path: url });
    },
    createIntercvalTask() {
      console.log(`createInterval task...mode is:${this.$store.mode}`);
      if (this.isRouter) {
        this.getDeviceCount();
      }
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
        .getDeviceCount({
          filters: [
            { type: 'primary', status: ['online'] },
            { type: 'guest', status: ['online'] }
          ]
        })
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
            this.deviceCountTimer = setTimeout(() => {
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

.page-content {
  // display: flex;
  // flex-direction: column;
  // flex: auto;
  // padding: 0 2%;
  // margin-top: 30px;
  .net-info {
    display: flex;
    padding: 0 10%;
    height: 100px;
    width: 100%;
    align-items: center;
    background: #fff;
    .icon-container {
      img {
        width: 50px;
        height: 50px;
        display: block;
        margin: 0 auto;
        border-radius: 50%;
      }
    }
    .text-container {
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .line {
      flex: 1;
      height: 0;
      border-top: 2px solid #fff;
      text-align: center;
      position: relative;
      &.unconnected {
        border-top: 2px dashed #999;
      }
      &.testing {
        border: 0;
        &::after {
          content: '';
          display: block;
          border-top: 2px dashed #fff;
          animation: speed-test-line linear 2s infinite;
          width: 10%;
          position: absolute;
          top: -1px;
        }
      }
      .icon-unconnected-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        background: #fff;
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
      position: relative;
      cursor: pointer;
    }
  }
  .router-view {
    width: 100%;
    margin-top: 70px;
  }
}
@media screen and (min-width: 769px) and (max-width: 1440px) {
  .page-content {
    .net-info {
      .device-container,
      .wifi-container,
      .internet-container {
        width: 100px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .page-content {
    padding: 0 20px;
    .net-info {
      padding: 0;
      height: 50px;
      .icon-container {
        img {
          width: 30px;
          height: 30px;
        }
      }
      .text-container {
        font-size: 12px;
        font-weight: bold;
      }
      .line {
        height: 2px;
        &.testing {
          &::after {
            animation: speed-test-line linear 0.5s infinite;
            top: 0;
          }
        }
        &.unconnected {
          .icon-unconnected-container {
            height: 20px;
            width: 20px;
            img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
      .device-container,
      .wifi-container,
      .internet-container {
        width: 60px;
      }
    }
  }
}
</style>
