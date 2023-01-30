<template>
  <div class="dashboard customized">
    <div v-if="isMobile"
         class="mobile-net-info">
      <div class="mobile-net-info__inner">
        <div class="device-container">
          <div class="icon-container">
            <img src="../../../assets/images/icon/ic_device.png"
                 alt="" />
          </div>
        </div>
        <div class="line-container">
          <div class="line"></div>
        </div>
        <div class="wifi-container">
          <div class="icon-container">
            <img :src="getWifiIcon( MODEL)"
                 alt="" />
          </div>
        </div>
        <div class="line-container">
          <div class="line"
               :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
            <div class="icon-unconnected-container"
                 @click.stop="showTips()">
            </div>
          </div>
        </div>
        <div class="internet-container">
          <div class="icon-container">
            <img src="../../../assets/images/icon/ic_internet.png"
                 alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="laptop-net-info">
      <ul class="laptop-net-info__inner">
        <li @click="forward2page('/dashboard/device/primary')"
            class="functional-module device-container">
          <div class="icon-container">
            <img src="../../../assets/images/icon/ic_device.png"
                 alt="">
          </div>
          <div class="text-container">
            <h3 class="main-text">{{$t('trans0174')}}</h3>
          </div>
          <div class="devices-num">
            <span>{{deviceCount}}</span>
          </div>
          <div class="current-device-info-container"
               :class="{'empty':!localDeviceInfo.online_info.band}">
            <div v-if="deviceLoading"
                 class="loading-container">
              <m-loading :id="'deviceLoading'"
                         :color="'#29b96c'"
                         :size='20'></m-loading>
            </div>
            <div v-else
                 class="info-wrap">
              <div class="name"
                   :title="localDeviceInfo.name">
                <div class="current-icon">
                  <img src="../../../assets/images/icon/ic_local-device.svg"
                       alt="">
                </div>
                <span>{{localDeviceInfo.name}}
                </span>
              </div>
              <div class="info">
                <div class="band">{{bandMap[`${localDeviceInfo.online_info.band}`] }}</div>
                <div v-if="!isWired"
                     class="uptime">{{transformDate(localDeviceInfo.online_info.online_duration)}}
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="line-container">
          <div class="line"></div>
        </li>
        <li @click="forward2page('/dashboard/mesh/topo')"
            class="functional-module mesh-container">
          <div class="icon-container">
            <img :src="getWifiIcon(MODEL)"
                 alt="">
          </div>
          <div class="text-container">
            <h3 class="main-text">{{$t('trans0153')}}</h3>
            <h6 class="sub-text router-type">{{meshInfo.gatewayName?meshInfo.gatewayName:'-'}}</h6>
          </div>
          <div class="wifi-container">
            <div class="wifi-list">
              <div v-if="meshLoading"
                   class="loading-container">
                <m-loading :id="'meshLoading'"
                           :color="'#29b96c'"
                           :size="20"></m-loading>
              </div>
              <ul v-else>
                <li class="wifi">
                  <span class="wifi__dot"></span>
                  <span class="wifi__band">{{meshInfo.smartConnect?'Wi-Fi':$t('trans0677')}}:</span>
                  <span class="wifi__name"
                        @click.stop="stopPropagation"
                        :title="meshInfo.b24gWifi.ssid">{{meshInfo.b24gWifi.ssid}}</span>
                </li>
                <li v-if="!meshInfo.smartConnect"
                    class="wifi">
                  <span class="wifi__dot"></span>
                  <span class="wifi__band">{{$t('trans0679')}}:</span>
                  <span class="wifi__name"
                        :title="meshInfo.b5gWifi.ssid">{{meshInfo.b5gWifi.ssid}}</span>
                </li>
              </ul>

            </div>
          </div>
          <div class="add-node-container">
            <button class="btn btn-default add-btn"
                    @click.stop="$router.push('/mesh/add')">
              <span>{{$t('trans1117')}}</span>
            </button>
          </div>
        </li>
        <li class="line-container">
          <div class="line"
               :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
            <div class="icon-unconnected-container"
                 @click.stop="showTips()">
            </div>
          </div>
        </li>
        <li @click="forward2page('/dashboard/internet')"
            class="functional-module internet-container">
          <div class="icon-container">
            <img src="../../../assets/images/icon/ic_internet.png"
                 alt="">
          </div>
          <div class="text-container">
            <h3 class="main-text">{{$t('trans0366')}}</h3>
            <h6 class="sub-text internet-type">{{networkTypeArr[netInfo.type]}}</h6>
          </div>
          <div v-if="isRouter"
               class="speed-container">
            <div class="speed-info upload-wrap">
              <div class="speed-icon-wrap">
                <img src="../../../assets/images/icon/ic_upload.webp"
                     alt="">
              </div>
              <div class="speed-wrap">
                <div class="speed-text-wrap">{{$t('trans0006')}}</div>
                <div class="speed-num">{{realtimeSpeedUp.value}}</div>
                <div class="speed-unit">{{realtimeSpeedUp.unit}}/s</div>
              </div>
            </div>
            <div class="line-wrap">
              <div class="line"></div>
            </div>
            <div class="speed-info download-wrap">
              <div class="speed-icon-wrap">
                <img src="../../../assets/images/icon/ic_download.webp"
                     alt="">
              </div>
              <div class="speed-wrap">
                <div class="speed-text-wrap">{{$t('trans0007')}}</div>
                <div class="speed-num">{{realtimeSpeedDown.value}}</div>
                <div class="speed-unit">{{realtimeSpeedDown.unit}}/s</div>
              </div>
            </div>
          </div>
          <div v-else
               class="bridge-mode-tip">
            {{$t('trans0984')}}
          </div>
        </li>
      </ul>
    </div>
    <div class="jump-app-info"
         @click="jumpApp">
      <div class="icon mercku">
        <img src="../../../assets/images/customer/mercku/ic_launcher.png"
             alt="">
      </div>
      <div class="text-container">{{$t('trans1118')}}</div>
      <div class="icon qr">
        <img src="../../../assets/images/customer/mercku/qr.png"
             alt="">
      </div>
    </div>
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
  </div>
</template>
<script>
import marked from 'marked';
import * as CONSTANTS from 'base/util/constant';
import { compareVersion, formatDate } from 'base/util/util';

export default {
  data() {
    return {
      CONSTANTS,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      pageActive: true,
      deviceLoading: true,
      meshLoading: true,
      ssid: '',
      deviceCount: '-',
      deviceCountTimer: null,
      wanInfoTimer: null,
      wanNetStatsTimer: null,
      tipsModalVisible: false,
      localDeviceInfo: {
        name: this.$t('trans0278'),
        online_info: {
          band: '',
          online_duration: ''
        }
      },
      meshInfo: {
        smartConnect: true,
        gatewayName: '',
        b24gWifi: { ssid: '' },
        b5gWifi: { ssid: '' }
      },
      netInfo: {
        type: '-',
        realUp: 0,
        realDown: 0,
      },
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      },
      networkTypeArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144'),
        auto: this.$t('trans0696'),
      }
    };
  },
  computed: {
    MODEL() {
      return process.env.MODEL_CONFIG.id;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
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
      return CONSTANTS.RouterMode.router === this.$store.state.mode;
    },
    tips() {
      return marked(this.$t('trans0574'), { sanitize: true });
    },
    isConnected() {
      return this.netStatus === CONSTANTS.WanNetStatus.connected;
    },
    isWired() {
      return this.localDeviceInfo.online_info.band === 'wired';
    },
    realtimeSpeedUp() {
      return this.formatSpeed(this.netInfo.realUp);
    },
    realtimeSpeedDown() {
      return this.formatSpeed(this.netInfo.realDown);
    },
  },
  mounted() {
    this.getMeshInfo();
    this.getWanNetInfo();
    this.createIntercvalTask();
    this.getWanStatus();
    this.getLocalDeviceInfo();
  },
  watch: {
    '$store.mode': function watcher() {
      console.log(`watch task...mode is:${this.$store.mode}`);
      this.clearIntervalTask();
      this.createIntercvalTask();
    },
    netStatus: {
      handler(val) {
        console.log(val);
        if (val === CONSTANTS.WanNetStatus.connected) {
          this.$store.state.isConnected = true;
        } else {
          this.$store.state.isConnected = false;
        }
      }
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
        .catch(() => { });
    },
    showTips() {
      this.tipsModalVisible = true;
    },
    forward2page(url) {
      this.$router.push({ path: url });
    },
    createIntercvalTask() {
      console.log(`createInterval task...mode is:${this.$store.state.mode}`);
      this.getDeviceCount();
      if (this.isRouter) {
        this.getWanNetStats();
      }
    },
    clearIntervalTask() {
      clearTimeout(this.deviceCountTimer);
      this.deviceCountTimer = null;
      clearTimeout(this.wanNetStatsTimer);
      this.wanNetStatsTimer = null;
    },
    getMeshInfo() {
      this.meshLoading = true;
      this.$http.getMeshNode()
        .then(res1 => {
          const { data: { result: meshNodeList } } = res1;
          const { 0: gatewayInfo } = meshNodeList.filter(item => item.is_gw);
          console.log(gatewayInfo.name);
          this.meshInfo.gatewayName = gatewayInfo.name;
        });
      this.$http.getMeshMeta()
        .then(res2 => {
          const { data: { result: { smart_connect: smartConnect } } } = res2;
          this.meshInfo.smartConnect = smartConnect;
          this.meshInfo.b24gWifi = res2.data.result.bands[CONSTANTS.Bands.b24g];
          if (!smartConnect) {
            this.meshInfo.b5gWifi = res2.data.result.bands[CONSTANTS.Bands.b5g];
          }
        })
        .finally(() => {
          this.meshLoading = false;
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
            if (this.isConnected && this.pageActive && this.needCheckUpgradable) {
              this.checkFrimwareLatest();
            }
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = CONSTANTS.WanNetStatus.unlinked;
          });
      }, 1000);
    },
    getLocalDeviceInfo() {
      this.deviceLoading = true;
      this.$http.getLocalDevice()
        .then(res1 => {
          const { data: { result: selfInfo } } = res1;
          console.log('selfInfo', selfInfo);
          this.localDeviceIP = selfInfo.ip;
          const params = { filters: [{ type: 'primary', status: ['online'] }] };
          this.$http.getDeviceList(params)
            .then(res2 => {
              const { data: { result: deviceList } } = res2;
              console.log(deviceList);
              const localDeviceInfoArr = deviceList.filter(item => item.ip === selfInfo.ip);
              console.log(localDeviceInfoArr);
              if (localDeviceInfoArr.length) {
                // eslint-disable-next-line prefer-destructuring
                this.localDeviceInfo = localDeviceInfoArr[0];
              }
            })
            .finally(() => {
              this.deviceLoading = false;
            });
        });
    },
    getWanNetInfo() {
      this.$http
        .getWanNetInfo()
        .then(res => {
          this.wanInfoTimer = null;
          clearTimeout(this.wanInfoTimer);
          this.netInfo.type = res.data.result.type ? res.data.result.type : '-';
        })
        .catch(() => {
          this.wanInfoTimer = setTimeout(() => {
            this.getWanNetInfo();
          }, 1000 * 3);
        });
    },
    getWanNetStats() {
      clearTimeout(this.wanNetStatsTimer);
      this.wanNetStatsTimer = null;
      this.$http
        .getWanNetStats()
        .then(res => {
          if (this.pageActive) {
            this.netInfo.realUp = res.data.result.speed.realtime.up;
            this.netInfo.realDown = res.data.result.speed.realtime.down;
            this.wanNetStatsTimer = setTimeout(() => {
              this.getWanNetStats();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.pageActive) {
            this.wanNetStatsTimer = setTimeout(() => {
              this.getWanNetStats();
            }, 10000);
          }
        });
    },
    getWifiIcon(model) {
      let image = '';
      switch (model) {
        case CONSTANTS.Models.m6a:
          image = require('../../../assets/images/icon/ic_homepage_m6a.png');
          break;
        case CONSTANTS.Models.m6aPlus:
          image = require('../../../assets/images/model/m6a_plus/ic_homepage_m6a-plus.png');
          break;
        default:
          break;
      }
      return image;
    },
    transformDate(date) {
      if (!date) {
        return '';
      }
      if (date < 0) {
        return '-';
      }
      const split = [3600 * 24, 3600, 60, 5];
      // 大于1天
      if (date > split[0]) {
        const now = new Date().getTime();
        return formatDate(now - date * 1000);
      }
      // 小于1天大于1小时
      if (date <= split[0] && date > split[1]) {
        return `${this.$t('trans0013').replace('%d', parseInt(date / split[1], 10))}`;
      }
      // 小于1小时大于1分钟
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace('%d', parseInt(date / split[2], 10))}`;
      }
      // 小于1分钟大于5秒
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(date, 10))}`;
      }
      return `${this.$t('trans0010')}`;
    },
    jumpApp() {
      if (!this.$store.state.isMobile) return;
      window.open(process.env.CUSTOMER_CONFIG.appDownloadUrl);
    },
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
h3,
h6,
ul {
  margin: 0;
  padding: 0;
}
.dashboard {
  display: flex;
  flex-direction: column;
  flex: auto;
  position: relative;
  .mobile-net-info {
    display: none;
  }
  .laptop-net-info {
    display: block;
    margin-top: calc(8%);
    .laptop-net-info__inner {
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      > .functional-module {
        display: flex;
        flex-direction: column;
        width: 26%;
        height: 45vh;
        max-height: 430px;
        min-height: 325px;
        background-color: var(--dashboard-icon-background-color);
        border-radius: 20px;
        box-shadow: 0 20px 20px -5px rgba(0, 0, 0, 0.1);
        position: relative;
        text-align: center;
        overflow: hidden;
        cursor: pointer;
        .icon-container {
          position: relative;
          height: 30%;
          > img {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 70px;
            height: 70px;
            filter: var(--img-brightness);
          }
        }
        .text-container {
          height: 20%;
          padding: 20px 0;
          .sub-text {
            color: var(--dashboard-gery-color);
          }
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          text-align: center;
          padding: 10px;
          border-radius: 5px;
        }
        &.device-container {
          .devices-num {
            height: 25%;
            font-size: 40px;
            font-weight: 600;
            color: var(--text-default-color);
          }
          .current-device-info-container {
            border-radius: 5px;
            .info-wrap {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: var(--text-default-color);
              padding: 0 20px;
            }
            .name {
              display: flex;
              font-size: 16px;
              font-weight: 500;
              > span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .info {
              display: flex;
              align-items: center;
              font-size: 12px;
              min-width: 30px;
              margin-top: 5px;
              .band {
                padding: 0 6px;
                margin-right: 5px;
                border-radius: 3px;
                color: #fff;
                background-color: var(--dashboard-band-background-color);
              }
              .uptime {
                color: var(--dashboard-gery-color);
              }
            }
            .current-icon {
              width: 15px;
              height: 15px;
              margin-right: 5px;
              margin-top: 1px;
              > img {
                width: 100%;
                height: 100%;
              }
            }
            &.empty {
              .info-wrap {
                .name {
                  color: var(--dashboard-gery-color);
                }
              }
            }
          }
        }
        &.mesh-container {
          .wifi-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30%;
            .wifi-list {
              padding: 10px;
              border-radius: 5px;
              background-color: var(--dashboard-wifi-background-color);
              .wifi {
                display: flex;
                align-items: center;
                color: var(--dashboard-gery-text-color);
                .wifi__dot {
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: #29b96c;
                  margin-right: 5px;
                }
                .wifi__band {
                  width: fit-content;
                  margin-right: 5px;
                  font-weight: 550;
                }
                .wifi__name {
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: pre;
                  text-align: left;
                }
              }
            }
          }
          .add-node-container {
            .add-btn {
              > span {
                position: relative;
                &::before {
                  content: '';
                  display: block;
                  height: 2px;
                  border-radius: 2px;
                  width: 15px;
                  background: var(--button-default-text-color);
                  position: absolute;
                  top: 50%;
                  left: -10px;
                  transform: translate(-100%, -50%) rotate(0deg);
                }
                &::after {
                  content: '';
                  display: block;
                  height: 2px;
                  border-radius: 2px;
                  width: 15px;
                  background: var(--button-default-text-color);
                  position: absolute;
                  top: 50%;
                  left: -10px;
                  transform: translate(-100%, -50%) rotate(90deg);
                }
              }
              &:hover {
                > span {
                  &::before {
                    background: var(--button-default-hover-text-color);
                  }
                  &::after {
                    background: var(--button-default-hover-text-color);
                  }
                }
              }
            }
          }
        }
        &.internet-container {
          .speed-container {
            display: flex;
            height: 50%;
            .line-wrap {
              display: flex;
              align-items: center;
              width: 2px;
              .line {
                width: 100%;
                height: 35px;
                background-color: var(--dashboard-dividing-line-color);
              }
            }
            .speed-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .speed-icon-wrap {
                width: 30px;
                height: 30px;
                margin-bottom: 5px;
                > img {
                  width: 30px;
                  height: 30px;
                }
              }
              .speed-wrap {
                font-weight: 600;
                color: var(--text-default-color);
                .speed-text-wrap {
                  font-size: 12px;
                  font-weight: 500;
                  color: var(--dashboard-gery-color);
                  margin-bottom: 10px;
                }
                .speed-num {
                  font-size: 24px;
                }
                .speed-unit {
                  font-size: 12px;
                  margin-top: -5px;
                }
              }
            }
          }
          .bridge-mode-tip {
            width: 90%;
            font-size: 18px;
            padding: 30px;
            margin: 45px auto 0;
            color: var(--bridge-tips-color);
            background: var(--dashboard-wifi-background-color);
            border-radius: 10px;
          }
        }
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 15px;
          right: 15px;
          width: 3px;
          height: 3px;
          border-top: 2px solid #808080;
          border-right: 2px solid #808080;
          border-bottom: 2px solid transparent;
          border-left: 2px solid transparent;
          border-radius: 2px;
          transform: rotate(45deg);
          transition: border 0.3s;
          z-index: inherit;
        }
        &:hover {
          &::before {
            border-top-color: var(--primaryColor);
            border-right-color: var(--primaryColor);
          }
        }
        ul {
          list-style: none;
        }
      }
      > .line-container {
        flex: 1;
        .line {
          width: 55%;
          height: 2px;
          background-color: #29b96c;
          margin: 0 auto;
          &.testing {
            position: relative;
            background: none;
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 2px;
              width: 100%;
              background: linear-gradient(
                to right,
                #29b96c 0%,
                #29b96c 50%,
                transparent 50%
              );
              background-size: 10px 2px;
              background-repeat: repeat-x;
              animation: speed-test-line linear 0.5s infinite;
            }
          }
          &.unconnected {
            display: flex;
            position: relative;
            background: none;
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 2px;
              width: 100%;
              background: var(--dashboard-unlinked-color);
              background-size: 10px 2px;
              background-repeat: repeat-x;
            }
            .icon-unconnected-container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 20px;
              height: 20px;
              background: var(--dashboard-unconnect-icon-background-color);
              z-index: 999;
              border-radius: 50%;
              cursor: pointer;
              &::before {
                content: '';
                display: block;
                height: 2px;
                border-radius: 2px;
                width: 10px;
                background: var(--text-default-color);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
              }
              &::after {
                content: '';
                display: block;
                height: 2px;
                border-radius: 2px;
                width: 10px;
                background: var(--text-default-color);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
              }
            }
          }
        }
      }
    }
  }
  .jump-app-info {
    // position: absolute;
    // bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: flex-end;
    margin-top: calc(7%);
    margin-right: calc(2%);
    width: 200px;
    padding: 10px 10px 10px 20px;
    border-radius: 10px;
    background: var(--dashboard-icon-background-color);
    .text-container {
      color: var(--text-default-color);
      width: 85px;
      height: 40px;
    }
    .icon {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        height: 100%;
      }
      &.mercku {
        display: none;
      }
      &.qr {
        display: block;
      }
    }
  }
}
// 匹配1440px到无穷大
@media screen and(min-width:1440px) {
  .dashboard {
    .laptop-net-info {
      .laptop-net-info__inner {
        padding: 0 220px;
        > .functional-module {
          &.device-container {
            .current-device-info-container {
              .name {
                > span {
                  max-width: 280px;
                }
              }
            }
          }
          &.mesh-container {
            .wifi-list {
              width: 87%;
            }
            .add-btn {
              width: 87%;
            }
          }
        }
      }
    }
    // .jump-app-info {
    //   right: 35px;
    // }
  }
}
// 匹配小于1440px
@media screen and(max-width:1440px) {
  .dashboard {
    .laptop-net-info {
      .laptop-net-info__inner {
        padding: 0 110px;
        > .functional-module {
          > .icon-container {
            height: 25%;
            img {
              width: 50px;
              height: 50px;
              bottom: 0;
            }
          }
          &.device-container {
            .current-device-info-container {
              .name {
                > span {
                  max-width: 250px;
                }
              }
            }
          }
          &.mesh-container {
            .wifi-list {
              width: 87%;
            }
            .add-btn {
              width: 87%;
            }
          }
        }
      }
    }
    // .jump-app-info {
    //   right: 20px;
    // }
  }
}
@media screen and(max-width:960px) {
  .dashboard {
    font-size: 12px;
    .laptop-net-info {
      .laptop-net-info__inner {
        > .functional-module {
          height: 50vh;
          > .icon-container {
            > img {
              width: 40px;
              height: 40px;
            }
          }
          > .text-container {
            padding: 10px 0;
          }
          &.device-container {
            .devices-num {
              font-size: 30px;
            }
            .current-device-info-container {
              .name {
                width: 90%;
                font-size: 12px;
              }
              &.empty {
                .name {
                  width: 100%;
                }
              }
            }
          }
          &.mesh-container {
            .text-container {
              height: fit-content;
              padding-bottom: 10px;
            }
            .wifi-container {
              height: 20%;
            }
            .add-node-container {
              margin-top: 10px;
            }
          }
          &.internet-container {
            .speed-container {
              .speed-info {
                padding: 0;
                .speed-wrap {
                  .speed-num {
                    font-size: 20px;
                  }
                }
              }
            }
            .bridge-mode-tip {
              font-size: 16px;
              padding: 15px;
              margin: 25px auto 0;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .dashboard {
    .mobile-net-info {
      display: block;
      height: 150px;
      position: relative;
      .mobile-net-info__inner {
        display: flex;
        padding: 0 20px;
        width: 100%;
        height: 150px;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 75px;
          height: 75px;
          margin: -20px auto 0;
          border-radius: 50%;
          background: var(--dashboard-icon-background-color);
          overflow: hidden;
          img {
            width: 60%;
            height: 60%;
            display: block;
            filter: var(--img-brightness);
          }
        }
        .line-container {
          flex: 1;
          .line {
            width: 73%;
            height: 2px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            transform: translateY(-10px);
            background: #29b96c;
            &.testing {
              position: relative;
              background: none;
              &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 2px;
                width: 100%;
                background: linear-gradient(
                  to right,
                  #29b96c 0%,
                  #29b96c 50%,
                  transparent 50%
                );
                background-size: 10px 2px;
                background-repeat: repeat-x;
                animation: speed-test-line linear 0.5s infinite;
              }
            }
            &.unconnected {
              display: flex;
              position: relative;
              background: none;
              &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 2px;
                width: 100%;
                background: var(--dashboard-unlinked-color);
                background-size: 10px 2px;
                background-repeat: repeat-x;
              }
              .icon-unconnected-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 15px;
                height: 15px;
                background: var(--primaryBackgroundColor);
                z-index: 999;
                border-radius: 50%;
                &::before {
                  content: '';
                  display: block;
                  height: 2px;
                  border-radius: 2px;
                  width: 10px;
                  background: var(--text-default-color);
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(45deg);
                }
                &::after {
                  content: '';
                  display: block;
                  height: 2px;
                  border-radius: 2px;
                  width: 10px;
                  background: var(--text-default-color);
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                }
              }
            }
          }
        }

        .device-container,
        .wifi-container,
        .internet-container {
          position: relative;
          width: 75px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
    .laptop-net-info {
      margin: 0;
      .laptop-net-info__inner {
        padding: 0 20px;
        flex-direction: column;
        > .functional-module {
          width: 100%;
          height: auto;
          max-height: auto;
          min-height: auto;
          display: block;
          margin-bottom: 20px;
          padding: 15px 20px;
          text-align: left;
          .icon-container {
            display: none;
          }
          .text-container {
            display: inline;
            padding: 10px 0;
            height: auto;
            .main-text {
              display: inline;
              font-size: 16px;
              font-weight: 600;
              &::after {
                content: ':';
                display: inline-block;
                width: 10px;
                height: 5px;
              }
            }
            .sub-text {
              color: var(--text-default-color);
              display: inline;
              font-size: 16px;
              font-weight: 600;
            }
          }
          .loading-container {
            background: var(--dashboard-wifi-background-color);
          }
          &.device-container {
            .devices-num {
              display: inline;
              font-size: 16px;
            }
            .current-device-info-container {
              height: 70px;
              background: var(--dashboard-wifi-background-color);
              margin-top: 15px;
              padding: 10px;
              .info-wrap {
                display: block;
                .name {
                  > span {
                    max-width: 90%;
                  }
                }
                .info {
                  justify-content: flex-start;
                  margin-left: 20px;
                }
              }
              &.empty {
                height: 60px;
                text-align: center;
              }
            }
          }
          &.mesh-container {
            .wifi-list {
              width: 100%;
              margin: 15px 0;
            }
            .add-btn {
              width: 100%;
              height: 48px;
            }
          }
          &.internet-container {
            .speed-container {
              .speed-info {
                padding: 0;
                flex-direction: row;
                justify-content: flex-start;
                margin: 15px 0;
                .speed-icon-wrap {
                  padding-top: 5px;
                }
                .speed-wrap {
                  position: relative;
                  display: flex;
                  align-items: baseline;
                  .speed-text-wrap {
                    position: absolute;
                    bottom: -15px;
                    left: 10px;
                    margin: 0;
                  }
                  .speed-num {
                    font-size: 20px;
                    margin: 0 2px 0 10px;
                  }
                }
              }
              .line-wrap {
                display: none;
              }
            }
            .bridge-mode-tip {
              width: 100%;
              margin-top: 15px;
              text-align: center;
            }
          }
          &::before {
            top: 20px;
          }
          &:hover {
            &::before {
              border-top-color: #808080;
              border-right-color: #808080;
            }
          }
        }
        > .line-container {
          display: none;
        }
      }
    }
    .jump-app-info {
      position: relative;
      width: 90%;
      height: 60px;
      right: 0;
      margin: 20px auto;
      background-color: var(--dashboard-app-background-color);
      .text-container {
        flex: 1;
        line-height: 40px;
      }
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        &.mercku {
          display: block;
        }
        &.qr {
          display: none;
        }
      }
    }
  }
}
@media screen and (max-width: 374px) {
  .dashboard {
    .bridge-mode-tip {
      padding: 20px;
      font-size: 14px;
    }
    .mobile-net-info {
      .mobile-net-info__inner {
        .icon-container {
          width: 60px;
          height: 60px;
        }
        .line-container {
          .line {
            width: 20px;
            &.unconnected {
              .icon-unconnected-container {
                width: 5px;
                height: 5px;
              }
            }
          }
        }
      }
    }
    .laptop-net-info {
      .laptop-net-info__inner {
        > .functional-module {
          .text-container {
            .main-text {
              font-size: 12px;
            }
            .sub-text {
              font-size: 12px;
            }
          }
          &.device-container {
            .devices-num {
              font-size: 12px;
            }
          }
          &.mesh-container {
            .wifi-list {
              .wifi {
                .wifi__band {
                  font-size: 12px;
                }
              }
            }
          }
          &.internet-container {
            .speed-container {
              .speed-info {
                .speed-icon-wrap {
                  width: 20px;
                  height: 20px;
                  img {
                    width: 20px;
                    height: 20px;
                  }
                }
                .speed-wrap {
                  .speed-num {
                    margin-left: 0;
                    font-size: 18px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
