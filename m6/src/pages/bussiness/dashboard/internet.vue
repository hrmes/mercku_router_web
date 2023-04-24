<template>
  <div class="router-info">
    <div class="layout-left-wrap">
      <div class="speed__wrap section">
        <div class="section__inner">
          <div v-if="isRouter"
               class="section__body section__body--row">
            <div class="realtime__speed speed">
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--down"></i>
                      {{realtimeSpeedDown.value}}
                    </span>
                    <span class="speed__unit">
                      {{realtimeSpeedDown.unit}}/s
                    </span>
                  </span>
                  <label class="speed__title">{{$t('trans0305')}}</label>
                </div>
              </div>
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--up"></i>
                      {{realtimeSpeedUp.value}}
                    </span>
                    <span class="speed__unit">{{realtimeSpeedUp.unit}}/s</span>
                  </span>
                  <label class="speed__title">{{$t('trans0304')}}</label>
                </div>
              </div>
            </div>
            <!-- <div class="peak__speed speed">
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--peekdown"></i>
                      {{peekDown.value}}
                    </span>
                    <span class="speed__unit">{{peekDown.unit}}/s</span>
                  </span>
                  <label class="speed__title">{{$t('trans0307')}}</label>
                </div>
              </div>
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--peekup"></i>
                      {{peekUp.value}}
                    </span>
                    <span class="speed__unit">{{peekUp.unit}}/s</span>
                  </span>
                  <label class="speed__title">{{$t('trans0306')}}</label>
                </div>
              </div>
            </div> -->
            <div class="traffic speed">
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--trafficdown"></i>
                      {{trafficDl.value}}
                    </span>
                    <span class="speed__unit">{{trafficDl.unit}}</span>
                  </span>
                  <label class="speed__title">{{$t('trans0309')}}</label>
                </div>
              </div>
              <div class="speed__item">
                <div class="speed__item__wrap">
                  <span>
                    <span class="speed__value">
                      <i class="speed__icon speed__icon--trafficup"></i>
                      {{trafficUl.value}}
                    </span>
                    <span class="speed__unit">{{trafficUl.unit}}</span>
                  </span>
                  <label class="speed__title">{{$t('trans0310')}}</label>
                </div>
              </div>
            </div>
            <div class="speedtest-btn-wrap">
              <button class="btn"
                      @click="startSpeedTest()"
                      :class="{'disabled':!isConnected}"
                      :disabled="!isConnected">
                <i class="iconfont icon-ic_speedtest"></i>
                {{$t('trans0008')}}
              </button>
            </div>
          </div>
          <div v-else
               class="section__body section__body--bridge">
            <img src="@/assets/images/img-bridge.webp"
                 alt="">
            <p>{{$t('trans0984')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="layout-right-wrap">
      <div class="section">
        <div class="section__inner">
          <div class="section__title">{{$t('trans0537')}}</div>
          <div class="section__body section__body--row releative">
            <div class="uptime">
              <div class="uptime__top"
                   v-if="uptimeArr[1]&&uptimeArr[1].length>0">
                <span v-for="(bm,index) in uptimeArr[1]"
                      :key="index">
                  <span class="uptime__value">{{bm.num}}</span>
                  <span class="uptime__unit">{{bm.unit}}</span>
                  <span v-if="index!==uptimeArr[1].length-1">，</span>
                </span>
              </div>
              <div class="uptime__bottom"
                   :class="{'padding-top':uptimeArr[1]&&uptimeArr[1].length>0}">
                {{uptimeArr[0]}}
              </div>
              <img class="uptime__bg"
                   src="@/assets/images/img_router_time.png">
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class=" ipv4 section__inner"
             :class="{'stretch':isRouter&&!this.ipv6NetInfo.enabled}">
          <div class="section__title">{{$t('trans0301')}}</div>
          <div class="section__body">
            <div class="item">
              <label class="item__label">{{$t('trans0317')}}</label>
              <span class="item__value">{{networkArr[localNetInfo.type]}}</span>
            </div>
            <div class="item">
              <label class="item__label">{{$t('trans0152')}}</label>
              <span class="item__value">{{localNetInfo.netinfo.mask }}</span>
            </div>
            <div class="item">
              <label class="item__label">{{$t('trans0153')}}</label>
              <span class="item__value">{{localNetInfo.netinfo.gateway}}</span>
            </div>
            <div class="item">
              <label class="item__label">{{$t('trans0151')}}</label>
              <span class="item__value">{{localNetInfo.netinfo.ip}}</span>
            </div>
            <div class="item">
              <label class="item__label">{{$t('trans0236')}}</label>
              <span class="item__value">
                {{dnsText}}
              </span>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div v-if="isRouter&&this.ipv6NetInfo.enabled"
               class=" ipv6 section__inner"
               :class="{'stretch':isRouter&&!this.ipv6NetInfo.enabled}">
            <div class="section__title">{{$t('trans0700')}}</div>
            <div class="section__body">
              <div class="item">
                <label class="item__label">{{$t('trans0317')}}</label>
                <span class="item__value">{{networkArr[ipv6NetInfo.type]}}</span>
              </div>
              <div class="item">
                <label class="item__label">{{$t('trans0701')}}</label>
                <span class="item__value">{{ipv6NetInfo.ip }}</span>
              </div>
              <div class="item">
                <label class="item__label">{{$t('trans0236')}}</label>
                <span class="item__value">{{ipv6NetInfo.dns}}</span>
              </div>
              <div class="item">
                <label class="item__label">{{$t('trans0153')}}</label>
                <span class="item__value">{{ipv6NetInfo.gateway}}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class='speed-model-info'
         v-if='speedModelOpen'>
      <div class="shadow"></div>
      <div class="speed-content">
        <div v-if="isSpeedTesting">
          <div class="test-info">
            <m-lottieLoading :loadingType="'speedTest'"></m-lottieLoading>
          </div>
          <p>{{$t('trans0045')}}...{{testSpeedNumber}}s</p>
        </div>
        <div v-if="isSpeedDone || isSpeedFailed"
             class="speed-completed">
          <div class="speed-result-info">
            <div class="title">{{$t('trans0027')}}</div>
            <div class="content">
              <div class="extra">
                <i class="p-dwon-icon"></i>
                <div>
                  <p class="note">{{$t('trans0007')}}</p>
                  <p>
                    <span class="speed">{{speedDown.value}}</span>
                    <span class="unit">{{speedDown.unit}}</span>
                  </p>
                </div>
              </div>
              <div class="extra">
                <i class="p-up-icon"></i>
                <div>
                  <p class="note">{{$t('trans0006')}}</p>
                  <p>
                    <span class="speed">{{speedUp.value}}</span>
                    <span class="unit">{{speedUp.unit}}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button class="btn btn-default"
                      @click="startSpeedTest(true)">{{$t('trans0279')}}</button>
              <button class="btn"
                      @click="closeSpeedModal">{{$t('trans0018')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as CONSTANTS from 'base/util/constant';

export default {
  data() {
    return {
      routerMeta: {},
      meshMode: null,
      uptime: 0,
      CONSTANTS,
      networkArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144'),
        auto: this.$t('trans0696'),
        failObtain: this.$t('trans1058')
      },
      testTimeout: 60,
      testSpeedNumber: 60,
      speedStatus: CONSTANTS.SpeedTestStatus.testing,
      speedModelOpen: false,
      TextBandwidth: '-',
      pageActive: true,
      speedInfo: {},
      netInfo: {},
      traffic: {},
      wanNetStatsTimer: null,
      speedTestTimer: null,
      wanInfoTimer: null,
      uptimeTimer: null,
      getIsConnnected: false,
      ipv6NetInfo: {
        enabled: null,
        type: '-',
        ip: '-',
        gateway: '-',
        dns: '-'
      }
    };
  },
  mounted() {
    this.getWanNetInfo();
    this.getIpv6NetInfo();
    this.createIntervalTask();
    this.getRouteMeta();
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    isRouter() {
      return CONSTANTS.RouterMode.router === this.$store.state.mode;
    },
    uptimeArr() {
      const arr = [60, 60, 24, 30, 12];
      const unit = [this.$t('trans0533'), this.$t('trans0532'), this.$t('trans0531')];
      const temp = ['00', '00', '00'];
      let index = 0;
      let a = this.uptime;
      let b = 0;
      const topArr = [];
      const bmArr = [];
      while (index <= arr.length && a > 0) {
        if (index === arr.length) {
          b = a;
        } else {
          b = a % arr[index];
        }
        a = parseInt(a / arr[index], 10);
        if (index <= 2) {
          if (b < 10) {
            b = `0${b}`;
          }
          topArr.push(b);
        } else {
          bmArr.push(b);
        }
        index += 1;
      }
      const bmStr = bmArr
        .map((v, k) => ({
          num: v,
          unit: unit[k]
        }))
        .reverse();
      const topStr = temp
        .map((n, j) => {
          if (topArr[j]) {
            return topArr[j];
          }
          return n;
        })
        .reverse()
        .join(' : ');
      return [topStr, bmStr];
    },
    isConnected() {
      return this.$store.state.isConnected || (this.getWanStatus() && this.getIsConnnected);
    },
    bandwidth() {
      return this.formatBandWidth(this.localTraffic.bandwidth);
    },
    isSpeedDone() {
      return this.speedStatus === CONSTANTS.SpeedTestStatus.done;
    },
    isSpeedTesting() {
      return this.speedStatus === CONSTANTS.SpeedTestStatus.testing;
    },
    isSpeedFailed() {
      return this.speedStatus === CONSTANTS.SpeedTestStatus.failed;
    },
    localTraffic() {
      const local = {
        speed: {
          peak: {
            up: '-',
            down: '-'
          },
          realtime: {
            up: '-',
            down: '-'
          },
          average: {
            up: '-',
            down: '-'
          }
        },
        traffic: {
          ul: '-',
          dl: '-'
        },
        bandwidth: '-'
      };
      if (this.traffic && this.traffic.speed) {
        return { ...local, ...this.traffic };
      }
      return { ...local };
    },
    localNetInfo() {
      const local = {
        type: '-',
        netinfo: {
          ip: '-',
          mask: '-',
          gateway: '-', // 可选
          dns: []
        }
      };
      if (this.netInfo && this.netInfo.netinfo) {
        local.type = this.netInfo.type ? this.netInfo.type : '-';
        local.netinfo.ip = this.netInfo.netinfo.ip ? this.netInfo.netinfo.ip : '-';
        local.netinfo.mask = this.netInfo.netinfo.mask ? this.netInfo.netinfo.mask : '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway ? this.netInfo.netinfo.gateway : '-';
        local.netinfo.dns = this.netInfo.netinfo.dns;
        return local;
      }
      return local;
    },
    dnsText() {
      return this.localNetInfo.netinfo.dns.length > 0
        ? this.localNetInfo.netinfo.dns.join('/')
        : '-';
    },
    localSpeedInfo() {
      const local = {
        speed: {
          up: '-',
          down: '-'
        }
      };
      if (this.speedInfo && this.speedInfo.speed) {
        return { ...local, ...this.speedInfo };
      }
      return local;
    },
    realtimeSpeedDown() {
      return this.formatSpeed(this.localTraffic.speed.realtime.down);
    },
    realtimeSpeedUp() {
      return this.formatSpeed(this.localTraffic.speed.realtime.up);
    },
    peekUp() {
      return this.formatSpeed(this.localTraffic.speed.peak.up);
    },
    peekDown() {
      return this.formatSpeed(this.localTraffic.speed.peak.down);
    },
    trafficUl() {
      return this.formatNetworkData(this.localTraffic.traffic.ul);
    },
    trafficDl() {
      return this.formatNetworkData(this.localTraffic.traffic.dl);
    },
    speedDown() {
      return this.formatBandWidth(this.localSpeedInfo.speed.down);
    },
    speedUp() {
      return this.formatBandWidth(this.localSpeedInfo.speed.up);
    }
  },
  watch: {
    '$store.state.mode': function watcher() {
      this.clearIntervalTask();
      if (this.isRouter) {
        this.createIntervalTask();
      }
    }
  },
  methods: {
    getRouteMeta() {
      this.$http.getRouter().then(res => {
        this.routerMeta = res.data.result;
        this.uptime = this.routerMeta.uptime || 0;
        this.uptimeTimer = setInterval(() => {
          this.uptime += 1;
        }, 1000);
      });
    },
    closeSpeedModal() {
      this.createIntervalTask();
      this.speedModelOpen = false;
    },
    createIntervalTask() {
      if (this.isRouter) {
        this.getWanNetStats();
      }
    },
    clearIntervalTask() {
      clearTimeout(this.wanNetStatsTimer);
      this.wanNetStatsTimer = null;
    },
    speedTest(force) {
      if (force === undefined) {
        force = false;
      }
      this.$http
        .testSpeed({ force })
        .then(res => {
          this.speedStatus = res.data.result.status;
          this.speedInfo = res.data.result;
          if (res.data.result.status !== CONSTANTS.SpeedTestStatus.testing) {
            clearInterval(this.speedTestTimer);
            this.testSpeedNumber = this.testTimeout;
          }
        })
        .catch(() => {
          this.speedStatus = CONSTANTS.SpeedTestStatus.done;
          clearInterval(this.speedTestTimer);
          this.testSpeedNumber = this.testTimeout;
        });
    },
    startSpeedTest(force) {
      force = !!force;
      this.speedModelOpen = true;
      this.speedStatus = CONSTANTS.SpeedTestStatus.testing;
      this.clearIntervalTask();
      this.speedTest(force);
      this.speedTestTimer = setInterval(() => {
        if (this.testSpeedNumber <= 0) {
          clearInterval(this.speedTestTimer);
          this.speedStatus = CONSTANTS.SpeedTestStatus.done;
          this.testSpeedNumber = this.testTimeout;
          return;
        }
        if (this.testSpeedNumber % 5 === 0 && this.testSpeedNumber !== this.testTimeout) {
          this.speedTest();
        }
        this.testSpeedNumber -= 1;
      }, 1000);
    },
    getWanNetStats() {
      clearTimeout(this.wanNetStatsTimer);
      this.wanNetStatsTimer = null;
      this.$http
        .getWanNetStats()
        .then(res => {
          if (this.pageActive) {
            this.traffic = res.data.result;
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
    getWanNetInfo() {
      this.$http
        .getWanNetInfo()
        .then(res => {
          this.wanInfoTimer = null;
          clearTimeout(this.wanInfoTimer);
          this.netInfo = res.data.result;
        })
        .catch(() => {
          this.wanInfoTimer = setTimeout(() => {
            this.getWanNetInfo();
          }, 1000 * 3);
        });
    },
    getIpv6NetInfo() {
      this.$http
        .getMeshInfoWanNetIpv6()
        .then(res => {
          const { result } = res.data;
          console.log('ipv6', result);
          if (result.enabled === true) {
            this.ipv6NetInfo.type = result.type ?? '-';
            const { netinfo } = result;
            this.ipv6NetInfo.ip = netinfo.address?.[0]?.ip ?? '-';
            this.ipv6NetInfo.gateway = netinfo.gateway?.ip ?? '-';
            if (netinfo.dns && netinfo.dns[0] && netinfo.dns[0].ip) {
              this.ipv6NetInfo.dns = netinfo.dns[0].ip;
            } else {
              this.ipv6NetInfo.dns = '-';
            }
          }
          this.ipv6NetInfo.enabled = result.enabled;
        })
        .catch(() => {
          this.ipv6NetInfo.enabled = true;
          this.ipv6NetInfo.type = 'failObtain';
          this.ipv6NetInfo.ip = this.$t('trans1058');
          this.ipv6NetInfo.gateway = this.$t('trans1058');
          this.ipv6NetInfo.dns = this.$t('trans1058');
        });
    },
    getWanStatus() {
      this.$http
        .getWanStatus()
        .then(res => {
          const {
            data: {
              result: { status: wanStatus }
            }
          } = res;
          switch (wanStatus) {
            case CONSTANTS.WanNetStatus.connected:
              this.getIsConnnected = true;
              break;
            default:
              this.getIsConnnected = false;
              break;
          }
        })
        .catch(() => {
          this.getIsConnnected = false;
        });
      return true;
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
    clearInterval(this.uptimeTimer);
    this.uptimeTimer = null;
  }
};
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.router-info {
  background: var(--internet-background-color) !important;
  display: flex;
  justify-content: center;
  .layout-left-wrap {
    flex: 1;
    margin-right: 10px;
    transition: all 0.3s ease-in-out;
    .section {
      position: relative;
      height: 100%;
      .section__inner {
        height: 100%;
      }
    }
  }
  .layout-right-wrap {
    display: flex;
    flex-direction: column;
    width: 30%;
    transition: all 0.3s ease-in-out;
    .section {
      height: auto;
      background: var(--internet-section-background-color);
      &:first-child {
        margin-bottom: 10px;
      }
      &:last-child {
        flex: 1;
        justify-content: s;
      }
    }
  }
  .section {
    border-radius: 8px;
    overflow: hidden;
    .section__inner {
      height: auto;
      background: var(--internet-section-background-color);
      display: flex;
      flex-direction: column;
      &.stretch {
        height: 100%;
      }
      &.ipv6 {
        .section__title {
          padding-top: 25px;
          border-top: 1px solid var(--internet-section-hr-color);
          &::before {
            top: 57%;
          }
        }
      }
    }
    .section__title {
      position: relative;
      margin: 0 20px 0 30px;
      padding: 15px 0;
      font-size: 16px;
      font-weight: 600;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -5px;
        transform: translate(-100%, -50%);
        display: inline-block;
        width: 5px;
        height: 22px;
        background: #808080;
      }
    }
    .section__body {
      padding: 10px 20px 20px;
      flex: 1;
      &.section__body--row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.section__body--bridge {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > img {
          width: 200px;
          height: 200px;
        }
      }
    }
  }
  .item {
    display: flex;
    flex-direction: column;
    + .item {
      margin-top: 12px;
    }
    .item__label {
      font-size: 14px;
      color: var(--table-header-text-color);
    }
    .item__value {
      width: inherit;
      font-size: 16px;
      color: var(--text-default-color);
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .speed {
    display: flex;
    flex-direction: column;
    & + .speed {
      margin-left: 60px;
    }
    &.speed--traffic {
      flex-direction: row;
      .speed__item {
        + .speed__item {
          margin-top: 0px;
          margin-left: 60px;
        }
      }
    }
    .speed__item {
      display: flex;
      + .speed__item {
        margin-top: 100px;
      }
    }
    .speed__icon {
      width: 40px;
      height: 40px;
      display: block;
      position: relative;
      &.speed__icon--up {
        background: url('../../../assets/images/icon/ic_upload.webp') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--down {
        background: url('../../../assets/images/icon/ic_download.webp')
          no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficup {
        width: 30px;
        height: 30px;
        background: url('../../../assets/images/icon/ic_trafficup.webp')
          no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficdown {
        width: 30px;
        height: 30px;
        background: url('../../../assets/images/icon/ic_trafficdown.webp')
          no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekdown {
        width: 30px;
        height: 32px;
        background: url('../../../assets/images/icon/ic_peak_download.webp')
          no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekup {
        width: 30px;
        height: 32px;
        background: url('../../../assets/images/icon/ic_peak_upload.webp')
          no-repeat;
        background-size: 100% 100%;
      }
    }
    .speed__item__wrap {
      display: flex;
      flex-direction: column;
    }
    .speed__title {
      font-size: 14px;
      color: var(--dashboard-gery-color);
    }
    .speed__value {
      position: relative;
      font-size: 24px;
      font-weight: bold;
      color: var(--text-default-color);
      > .speed__icon {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-110%, -55%);
      }
    }
    .speed__unit {
      font-size: 24px;
    }
    &.realtime__speed {
      margin-right: 100px;
      .speed__value {
        font-size: 48px;
      }
      .speed__item {
        &:last-child {
          transform: translateY(-35%);
        }
      }
    }
    &.peak__speed {
      margin-right: 100px;
    }
  }
  .speedtest-btn-wrap {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    .iconfont {
      margin-right: 5px;
    }
  }
  .releative {
    position: relative;
  }
  .uptime {
    margin-bottom: 20px;
    .uptime__bg {
      position: absolute;
      width: 60px;
      right: 0;
      bottom: 0;
    }
    .uptime__top {
      font-size: 24px;
      font-weight: bold;
    }
    .uptime__unit {
      margin-left: 5px;
      font-size: 14px;
      font-weight: normal;
    }
    .uptime__bottom {
      font-size: 24px;
      font-weight: bold;
      &.padding-top {
        padding-top: 10px;
      }
    }
  }
  .speed-model-info {
    .shadow {
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.7;
      position: fixed;
      z-index: -1;
      left: 0;
      top: 0;
    }
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    .speed-content {
      text-align: center;
      .test-info {
        position: relative;
        width: 150px;
        height: 150px;
      }
      p {
        color: #ffffff;
        font-size: 14px;
      }
      .speed-completed {
        width: 450px;
        background: var(--grey-background-color);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .speed-result-info {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 30px;
          .title {
            padding: 10px 0;
            width: 100%;
            line-height: 1;
            color: var(--text-default-color);
            position: relative;
            &:before {
              content: '';
              display: block;
              width: 60px;
              height: 1px;
              background: var(--modal-content-hr-color);
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-215%, -50%);
            }
            &:after {
              content: '';
              height: 1px;
              background: var(--modal-content-hr-color);
              display: block;
              width: 60px;
              height: 1px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(115%, -50%);
            }
          }
          .content {
            display: flex;
            margin-top: 30px;
            .extra {
              flex: 1;
              p {
                margin: 0;
                padding: 0;
              }
              text-align: left;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .p-dwon-icon {
                width: 30px;
                height: 32px;
                display: inline-block;
                background: url('../../../assets/images/icon/ic_peak_download.webp')
                  no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
              }
              .p-up-icon {
                width: 30px;
                height: 32px;
                display: inline-block;
                background: url('../../../assets/images/icon/ic_peak_upload.webp')
                  no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
              }
              .speed {
                font-size: 22px;
                font-weight: bold;
                color: var(--text-default-color);
              }
              .unit {
                padding-left: 5px;
                font-size: 12px;
                font-weight: normal;
                letter-spacing: -0.2px;
                color: var(--text-default-color);
              }
              .note {
                font-size: 12px;
                letter-spacing: -0.1px;
                margin: 10px 0;
                color: var(--text-gery-color);
              }
            }
          }
        }
        .btn-wrap {
          margin-top: 50px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .btn {
            &:last-child {
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1280px) {
  .router-info {
    .layout-left-wrap {
      .section {
        .section__body {
          padding: 50px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .router-info {
    display: flex;
    flex-direction: column;
    .layout-left-wrap,
    .layout-right-wrap {
      width: 100%;
      .section {
        width: 100%;
        padding: 0;
        .section__body--row {
          flex-direction: column;
          align-items: flex-start;
          .speed {
            width: 100%;
            flex-direction: row;
            justify-content: flex-start;
            margin: 0 0 20px;
            .speed__item {
              flex: 1;
              margin: 0;
              transform: none;
              .speed__icon {
                position: static;
                transform: none;
                width: 30px;
                height: 30px;
              }
              .speed__value {
                font-size: 16px;
              }
              .speed__unit {
                font-size: 12px;
              }
              .speed__title {
                font-size: 12px;
              }
            }
            &.realtime__speed {
              .speed__value {
                font-size: 24px;
              }
            }
          }
          .speedtest-btn-wrap {
            width: 100%;
            position: static;
            transform: none;
            margin-top: 20px;
          }
        }
        .section__title {
          margin: 0 30px;
          padding: 20px 0;
        }
      }
    }
    .layout-left-wrap {
      margin-bottom: 10px;
      .speed__wrap {
        .section__body {
          padding: 30px;
        }
      }
    }
    .speed-model-info {
      .speed-content {
        width: 100%;
        .test-info {
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }
        .speed-completed {
          height: auto;
          .speed-result-info {
            padding: 25px;
            justify-content: center;
            align-items: center;
            .content {
              width: 100%;
              justify-content: space-evenly;
            }
            .btn-wrap {
              flex-direction: column;
              margin-top: 40px;
              .btn {
                margin: 0;
                &:first-child {
                  margin-bottom: 20px;
                }
              }
            }
          }
          width: 90%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
