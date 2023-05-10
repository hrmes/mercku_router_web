<template>
  <div class="dashboard customized">
    <div class="net-info">
      <div class="net-info__inner">
        <div class="device-container"
             :class="{'selected':$route.path.includes('device')}">
          <div class="icon-container">
            <img @click="forward2page('/dashboard/device/primary')"
                 src="../../../assets/images/icon/ic_device.png"
                 alt="">
            <div class="text-container">
              {{$t('trans0235')}}<span>&nbsp;({{deviceCount}})</span>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="wifi-container"
             :class="{'selected':$route.path.includes('mesh')}">
          <div class="icon-container">
            <img @click="forward2page('/dashboard/mesh')"
                 src="../../../assets/images/icon/ic_router.png"
                 alt="">
            <div class="text-container">
              {{ssid||'-'}}
            </div>
          </div>
        </div>
        <div class="line"
             :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
          <div class="icon-unconnected-container"
               @click.stop="showTips()"
               v-if="isLinked || isUnlinked">
            <img class="icon__question"
                 src="../../../assets/images/icon/ic_wifi_question.png"
                 alt="">
          </div>
        </div>
        <div class="internet-container"
             :class="{'selected':$route.path.includes('internet')}">
          <div class="icon-container">
            <img @click="forward2page('/dashboard/internet')"
                 src="../../../assets/images/icon/ic_internet.png"
                 alt="">
            <div class="text-container">
              {{$t('trans0366')}}
            </div>
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
        </div>
      </m-modal-body>
      <m-modal-footer v-if="isRouter">
        <div class="form-button">
          <button class="btn btn-dialog-confirm"
                  @click="forward2page('/setting/wan')">{{$t('trans0601')}}</button>
        </div>
      </m-modal-footer>
    </m-modal>
    <!-- trans0383 -->
  </div>
</template>
<script>
import marked from 'marked';
import * as CONSTANTS from 'base/util/constant';
import { compareVersion } from 'base/util/util';

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
      this.createIntercvalTask();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('from:', from.path);
      console.log('to:', to.path);
      const fromPath = from.path;
      console.log('from path is:', fromPath);
      if (fromPath.includes('login')) {
        // add a flag
        vm.needCheckUpgradable = true;
      }
    });
  },
  methods: {
    checkFrimwareLatest() {
      this.$http
        .firmwareList(undefined, {
          hideToast: true
        })
        .then(res => {
          let nodes = res.data.result;
          const filter = node => {
            const { current, latest } = node.version;
            return compareVersion(current, latest);
          };
          nodes = nodes.filter(filter);
          if (nodes.length) {
            this.$dialog.confirm({
              okText: this.$t('trans0225'),
              cancelText: this.$t('trans0025'),
              message: this.$t('trans0383'),
              callback: {
                ok: () => {
                  this.$router.push({ path: '/upgrade/online' });
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    showTips() {
      this.tipsModalVisible = true;
    },
    forward2page(url) {
      this.$router.push({ path: url });
    },
    createIntercvalTask() {
      console.log(`createInterval task...mode is:${this.$store.mode}`);
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
            if (this.pageActive && this.needCheckUpgradable) {
              this.checkFrimwareLatest();
            }
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = CONSTANTS.WanNetStatus.unlinked;
          });
      }, 1000);
    }
  },
  beforeDestroy() {
    // clean up
    this.pageActive = false;
    this.clearIntervalTask();
  }
};
</script>
<style lang="scss" scoped>
@keyframes speed-test-line {
  from {
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
  @media screen and (max-width: 768px) {
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
    background-size: cover;
    position: relative;
    height: 280px;
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
        &.disabled {
          img {
            cursor: default;
            background: #e1e1e1;
            &:hover {
              background: #e1e1e1;
              & + .text-container {
                color: #e1e1e1;
                cursor: default;
                text-decoration: none;
              }
            }
          }
        }
        img {
          width: 50px;
          height: 50px;
          display: block;
          margin: 0 auto;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          &:hover {
            background: #e1e1e1;
            & + .text-container {
              color: #999;
              cursor: pointer;
              text-decoration: underline;
            }
          }
        }
      }
      .text-container {
        &.disabled {
          color: #e1e1e1;
        }
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
        color: #fff;
      }
      .line {
        flex: 1;
        height: 2px;
        background: #fff;
        text-align: center;
        position: relative;
        transform: translateY(-15px);
        &.unconnected {
          display: flex;
          background: none;
          &::before {
            content: '';
            height: 0;
            border-top: 2px dashed #fff;
            flex: 1;
          }
          &::after {
            content: '';
            height: 0;
            border-top: 2px dashed #fff;
            flex: 1;
          }
        }
        &.testing {
          position: relative;
          background: none;
          &::after {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(
              to right,
              #fff 0%,
              #fff 50%,
              transparent 50%
            );
            background-size: 10px 2px;
            background-repeat: repeat-x;
            height: 2px;
            width: 300px;

            animation: speed-test-line linear 1s infinite;
            width: 100%;
          }
        }
        .icon-unconnected-container {
          position: relative;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          cursor: pointer;
          .icon__question {
            position: absolute;
            right: 0;
            top: 0;
            width: 14px;
            height: 14px;
          }
          &::before {
            content: '';
            display: block;
            height: 2px;
            border-radius: 2px;
            width: 16px;
            background: #fff;
            transform: translate(-50%, -50%) rotate(45deg);
            position: absolute;
            top: 50%;
            left: 50%;
          }
          &::after {
            content: '';
            display: block;
            height: 2px;
            border-radius: 2px;
            width: 16px;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
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
    margin-top: 30px;
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
      margin-top: 0;
      padding: 0 20px;
    }
    .net-info {
      background: url(../../../assets/images/mobile/dashboard_banner_bg.jpg)
        no-repeat center;
      background-size: cover;
      height: 160px;
      .net-info__inner {
        padding: 0 30px;
        .icon-container {
          margin-top: -20px;
          img {
            width: 40px;
            height: 40px;
            &:hover {
              opacity: 1;
            }
          }
        }
        .text-container {
          font-size: 12px;
          font-weight: bold;
          transform: translate(-50%);
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: 20px;
        }
        .line {
          height: 2px;
          transform: translateY(-10px);
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
