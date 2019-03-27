<template>
  <div class="dashboard">
    <div class="net-info">
      <div class="net-info__inner">
        <div class="device-container"
             :class="{'selected':$route.path.includes('device')}">
          <div class="icon-container"
               @click="isRouter && forward2page('/dashboard/device/primary')">
            <img src="../../../assets/images/icon/ic_device.png"
                 alt="">
          </div>
          <div class="text-container"
               @click="isRouter && forward2page('/dashboard/device/primary')">
            {{$t('trans0235')}}<span v-if="isRouter">&nbsp;({{deviceCount}})</span>
          </div>
        </div>
        <div class="line"></div>
        <div class="wifi-container"
             :class="{'selected':$route.path.includes('mesh')}">
          <div class="icon-container"
               @click="forward2page('/dashboard/mesh')">
            <img src="../../../assets/images/icon/ic_router.png"
                 alt="">
          </div>
          <div class="text-container"
               @click="forward2page('/dashboard/mesh')">
            {{ssid||'-'}}
          </div>
        </div>
        <div class="line"
             :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
          <div class="icon-unconnected-container"
               @click.stop="showTips()"
               v-if="isLinked || isUnlinked">
            <img src="../../../assets/images/icon/ic_unconnected.png"
                 alt="">

            <img class="icon__question"
                 src="../../../assets/images/icon/ic_wifi_question.png"
                 alt="">
          </div>
        </div>
        <div class="internet-container"
             :class="{'selected':$route.path.includes('internet')}">
          <div class="icon-container"
               @click="forward2page('/dashboard/internet')">
            <img src="../../../assets/images/icon/ic_internet.png"
                 alt="">
          </div>
          <div class="text-container"
               @click="forward2page('/dashboard/internet')">
            {{$t('trans0366')}}
          </div>
        </div>
      </div>
    </div>
    <router-view class="router-view"></router-view>
    <m-modal :visible.sync="tipsModalVisible">
      <m-modal-body>
        <div class="tip-modal">
          <div class="tip-modal__text markdown-body"
               v-html="tips"></div>
          <div class="form-button">
            <button class="btn btn-middle"
                    @click="forward2page('/setting/wan')">{{$t('trans0601')}}</button>
            <!-- <button class="btn btn-middle btn-default"
                    @click="tipsModalVisible=false">{{$t('trans0025')}}</button> -->

          </div>
        </div>
      </m-modal-body>
    </m-modal>
  </div>
</template>
<script>
import * as CONSTANTS from 'util/constant';
import marked from 'marked';

export default {
  data() {
    return {
      CONSTANTS,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      pageActive: true,
      ssid: '',
      deviceCount: 0,
      deviceCountTimer: null,
      tipsModalVisible: false
    };
  },
  computed: {
    ...(() => {
      const result = {};
      Object.keys(CONSTANTS.WanNetStatus).forEach(key => {
        const value = CONSTANTS.WanNetStatus[key];
        const prop = value.slice(0, 1).toUpperCase() + value.slice(1);
        result[`is${prop}`] = function temp() {
          return this.netStatus === value;
        };
      });
      return result;
    })(),
    isRouter() {
      return CONSTANTS.RouterMode.router === this.$store.mode;
    },
    tips() {
      return marked(this.$t('trans0574'), { sanitize: true });
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
    showTips() {
      this.tipsModalVisible = true;
    },
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
.tip-modal {
  width: 500px;
  text-align: center;
  .form-button {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
  .tip-modal__text {
    text-align: left;
    width: 100%;
  }
  @media screen and (max-width: 769px) {
    width: auto;
  }
}
.dashboard {
  display: flex;
  flex-direction: column;
  flex: auto;
  .net-info {
    background: url(../../../assets/images/dashboard_banner_bg.jpg) no-repeat
      center;
    background-size: 100%;
    position: relative;
    &::before {
      content: '';
      display: block;
      padding-top: 14.5%;
    }
    .net-info__inner {
      display: flex;
      padding: 0 15%;
      width: 100%;
      height: 100%;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      @media screen and (max-width: 1440px) {
        padding: 0 50px;
      }

      .icon-container {
        cursor: pointer;
        img {
          width: 50px;
          height: 50px;
          display: block;
          margin: 0 auto;
          border-radius: 50%;
          background: #fff;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .text-container {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
        color: #fff;
        &:hover {
          color: #999;
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .line {
        flex: 1;
        height: 0;
        border-top: 2px solid #fff;
        text-align: center;
        position: relative;
        transform: translateY(-15px);
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
          background: #050505;
          cursor: pointer;
          .icon__question {
            position: absolute;
            right: 0;
            top: 0;
            width: 15px;
            height: 15px;
          }
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
      .device-container,
      .wifi-container,
      .internet-container {
        width: 200px;
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        &.selected {
          &::after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border: 12px solid #fff;
            border-top: none;
            border-left-color: transparent;
            border-right-color: transparent;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
  .router-view {
    width: 100%;
    padding: 0 10%;
    @media screen and (max-width: 1440px) {
      padding: 0 50px;
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1440px) {
  .dashboard {
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
  .dashboard {
    .router-view {
      padding: 0 20px;
    }
    .net-info {
      background: url(../../../assets/images/mobile/dashboard_banner_bg.jpg)
        no-repeat center;
      background-size: 100%;
      &::before {
        content: '';
        display: block;
        padding-top: 42.6%;
      }
      .net-info__inner {
        padding: 0 30px;
        .icon-container {
          img {
            width: 40px;
            height: 40px;
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
              animation: speed-test-line ease 0.5s infinite;
              top: 0;
            }
          }
          &.unconnected {
            .icon-unconnected-container {
              height: 20px;
              width: 20px;
              img {
                width: 10px;
                height: 10px;
              }
              .icon__question {
                width: 10px;
                height: 10px;
                top: -5px;
                right: -5px;
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
}
</style>
