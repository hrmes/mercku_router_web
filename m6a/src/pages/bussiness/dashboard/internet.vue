<template>
  <div class="router-info">
    <div class="internet-wrapper">
      <div class="back-wrap">
        <div class="btn-container"
             @click="onBack($route.meta.parentPath)">
          <i class="iconfont ic_back_large"></i>
        </div>
        <div class="text-container">{{pageName}}</div>
      </div>
      <div class="main-wrap">
        <div class="layout-left-wrap">
          <div class="speed__wrap">
            <div v-if="isRouter"
                 class="section__body ">
              <div class="waninfo__wrapper">
                <div class="realtime__speed speed">
                  <div class="speed__item">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--down"></i>
                      <div>
                        <span class="speed__value">
                          {{realtimeSpeedDown.value}}
                        </span>
                        <span class="speed__unit">{{realtimeSpeedDown.unit}}</span>
                      </div>
                      <label class="speed__title">{{$t('trans0305')}}</label>
                    </div>
                  </div>
                  <div class="speed__item">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--up"></i>
                      <div>
                        <span class="speed__value">
                          {{realtimeSpeedUp.value}}
                        </span>
                        <span class="speed__unit">{{realtimeSpeedUp.unit}}</span>
                      </div>
                      <label class="speed__title">{{$t('trans0304')}}</label>
                    </div>
                  </div>
                </div>
                <div class="traffic speed">
                  <div class="speed__item">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--trafficdown"></i>
                      <div>
                        <span class="speed__value">
                          {{trafficDl.value}}
                        </span>
                        <span class="speed__unit">{{trafficDl.unit}}</span>
                      </div>
                      <label class="speed__title">{{$t('trans0309')}}</label>
                    </div>
                  </div>
                  <div class="speed__item last">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--trafficup"></i>
                      <div>
                        <span class="speed__value">
                          {{trafficUl.value}}
                        </span>
                        <span class="speed__unit">{{trafficUl.unit}}</span>
                      </div>
                      <label class="speed__title">{{$t('trans0310')}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="speedtest__wrap">
                <div class="speedtest-dashboard"
                     id="animation-container">
                </div>
                <span class="speedtest-label">{{$t('trans0027')}}</span>
                <div class="speedtest-result__wrapper speed">
                  <div class="speed__item">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--peakdown"></i>
                      <label class="speed__title">{{$t('trans0307')}}</label>
                      <span class="speed__value">
                        <m-count-to :startVal='0'
                                    :endVal='Number(speedDown.value)'
                                    :duration=3000
                                    :decimals='1'></m-count-to>
                      </span>
                      <span class="speed__unit">{{speedDown.unit}}</span>
                    </div>
                  </div>
                  <div class="speed__item">
                    <div class="speed__item__wrap">
                      <i class="speed__icon speed__icon--peakup"></i>
                      <label class="speed__title">{{$t('trans0306')}}</label>
                      <span class="speed__value">
                        <m-count-to :startVal='0'
                                    :endVal='Number(speedUp.value)'
                                    :duration=3000
                                    :decimals='1'></m-count-to>
                      </span>
                      <span class="speed__unit">{{speedUp.unit}}</span>
                    </div>
                  </div>
                </div>
                <button class="btn"
                        :class="{'disabled':!isConnected}"
                        :disabled="!isConnected"
                        @click="startSpeedTest()">
                  {{$t('trans0008')}}
                </button>
              </div>
            </div>
            <div v-else
                 class="section__body section__body--bridge">
              <img src="@/assets/images/img-bridge.png"
                   alt="">
              <p>{{$t('trans0984')}}</p>
            </div>
          </div>
        </div>
        <div class="layout-right-wrap">
          <div class="section uptime">
            <div class="section__inner">
              <div class="section__title">{{$t('trans0537')}}</div>
              <div class="section__body">
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

                </div>
              </div>
            </div>
            <img class="uptime__bg"
                 src="@/assets/images/img_router_time.png">
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
      </div>
    </div>
    <div class="speedtest"
         v-if="isSpeedTesting">
      <div class="test-info">
        <m-lottie-loading :loadingType="'speedTest'"
                          :size="160"></m-lottie-loading>
      </div>
      <p>{{$t('trans0045')}}...{{testSpeedNumber}}s</p>
    </div>
  </div>
</template>
<script>
import { SpeedTestStatus, RouterMode, WanNetStatus } from 'base/util/constant';
import { formatBandWidth } from 'base/util/util';
import speedTestMixin from '@/mixins/speed-test';

export default {
  mixins: [speedTestMixin],
  data() {
    return {
      routerMeta: {},
      meshMode: null,
      uptime: 0,
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
      speedStatus: SpeedTestStatus.done,
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
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.loadSpeedTestAnimation();
    });
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
    pageName() {
      return this.$t(this.$route.meta.text);
    },
    isRouter() {
      return RouterMode.router === this.$store.state.mode;
    },
    uptimeArr() {
      const arr = [60, 60, 24, 30, 12];
      const unit = [
        this.$t('trans0533'),
        this.$t('trans0532'),
        this.$t('trans0531')
      ];
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
      return (
        this.$store.state.isConnected ||
        (this.getWanStatus() && this.getIsConnnected)
      );
    },
    bandwidth() {
      return this.formatBandWidth(this.localTraffic.bandwidth);
    },
    isSpeedDone() {
      return this.speedStatus === SpeedTestStatus.done;
    },
    isSpeedTesting() {
      return this.speedStatus === SpeedTestStatus.testing;
    },
    isSpeedFailed() {
      return this.speedStatus === SpeedTestStatus.failed;
    },
    localTraffic() {
      const local = {
        speed: {
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
        local.netinfo.ip = this.netInfo.netinfo.ip
          ? this.netInfo.netinfo.ip
          : '-';
        local.netinfo.mask = this.netInfo.netinfo.mask
          ? this.netInfo.netinfo.mask
          : '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway
          ? this.netInfo.netinfo.gateway
          : '-';
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
          up: 0,
          down: 0
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
    trafficUl() {
      return this.formatNetworkData(this.localTraffic.traffic.ul);
    },
    trafficDl() {
      return this.formatNetworkData(this.localTraffic.traffic.dl);
    },
    speedDown() {
      return formatBandWidth(this.localSpeedInfo.speed.down);
    },
    speedUp() {
      return formatBandWidth(this.localSpeedInfo.speed.up);
    },
  },
  watch: {
    '$store.state.mode': function watcher() {
      this.clearIntervalTask();
      if (this.isRouter) {
        this.createIntervalTask();
      }
    },
  },
  methods: {
    onBack(target) {
      if (target) {
        this.$router.replace({ path: target });
      } else {
        this.$router.go(-1);
      }
    },
    getRouteMeta() {
      this.$http.getRouter().then(res => {
        this.routerMeta = res.data.result;
        this.uptime = this.routerMeta.uptime || 0;
        this.uptimeTimer = setInterval(() => {
          this.uptime += 1;
        }, 1000);
      });
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
    speedTest(force = false) {
      this.$http
        .testSpeed({ force })
        .then(res => {
          this.speedStatus = res.data.result.status;

          if (res.data.result.status !== SpeedTestStatus.testing) {
            console.log('clear');
            clearInterval(this.speedTestTimer);
            this.testSpeedNumber = this.testTimeout;
          }


          if (res.data.result.status === SpeedTestStatus.done) {
            this.speedInfo = res.data.result;
            const speedPeakValue = this.calculateSpeedPeakValue(this.speedInfo.speed.down);
            const percent = this.calculateSpeedPercent(this.speedInfo.speed.down, speedPeakValue);
            this.updateSpeedLottie(percent);
          }
        })
        .catch(() => {
          this.speedStatus = SpeedTestStatus.done;
          clearInterval(this.speedTestTimer);
          this.testSpeedNumber = this.testTimeout;
        });
    },
    startSpeedTest(force) {
      force = !!force;
      this.speedStatus = SpeedTestStatus.testing;
      this.speedInfo = {};// 让速度值归零，等待后续重跑


      this.clearIntervalTask();
      this.speedTest(force);
      this.speedTestTimer = setInterval(() => {
        if (this.testSpeedNumber <= 0) {
          console.log('clear');
          clearInterval(this.speedTestTimer);
          this.testSpeedNumber = this.testTimeout;
          this.speedStatus = SpeedTestStatus.done;
          return;
        }
        if (
          this.testSpeedNumber % 5 === 0 &&
          this.testSpeedNumber !== this.testTimeout
        ) {
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
          }, 3000);
        });
    },
    getIpv6NetInfo() {
      this.$http
        .getMeshInfoWanNetIpv6()
        .then(res => {
          const { result } = res.data;
          console.log('ipv6', result);
          if (result.enabled === true) {
            const { netinfo } = result;

            this.ipv6NetInfo.type = result.type || '-';
            this.ipv6NetInfo.ip = netinfo.address?.[0]?.ip || '-';
            this.ipv6NetInfo.gateway = netinfo.gateway?.ip || '-';
            this.ipv6NetInfo.dns =
              netinfo.dns && netinfo.dns[0] && netinfo.dns[0].ip
                ? netinfo.dns[0].ip
                : '-';

            this.ipv6NetInfo.enabled = true;
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
            case WanNetStatus.connected:
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
    },
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
.router-info {
  position: relative;
  display: flex;
  flex-direction: column;
  .internet-wrapper {
    min-height: 100%;
  }
  .back-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
  }
  .main-wrap {
    display: flex;
    height: 100%;
    padding-top: 10px;
  }
  .layout-left-wrap {
    flex: 1;
    margin-right: 10px;
    transition: all 0.3s ease-in-out;
    .speed__wrap {
      width: 100%;
      height: 100%;
    }
    .section__body {
      display: flex;
      flex-direction: column;
      &.section__body--bridge {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 18px;
        font-weight: 500;
        > img {
          width: 25%;
          aspect-ratio: 1;
        }
      }
    }
  }
  .layout-right-wrap {
    display: flex;
    flex-direction: column;
    width: 30%;
    max-width: 460px;
    transition: all 0.3s ease-in-out;
    .section {
      height: auto;
      background: var(--internet_section-bgc);
      box-shadow: var(--internet_section-boxshadow);
      .section__inner {
        height: auto;
        // background: var(--internet_section-bgc);
        display: flex;
        flex-direction: column;
        &.stretch {
          height: 100%;
        }
        &.ipv6 {
          .section__title {
            padding-top: 25px;
            border-top: 1px solid var(--internet_section_hr-color);
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
        padding: 0px 20px 15px;
      }
      &:first-child {
        height: 160px;
        margin-bottom: 20px;
        .section__inner {
          height: 100%;
        }
      }
      &:last-child {
        flex: 1;
      }
    }
  }
  .section {
    border-radius: 10px;
    overflow: hidden;
  }
  .item {
    display: flex;
    flex-direction: column;
    + .item {
      margin-top: 12px;
    }
    .item__label {
      font-size: 14px;
      color: var(--table_header_text-color);
    }
    .item__value {
      width: inherit;
      font-size: 16px;
      color: var(--text_default-color);
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .waninfo__wrapper {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: repeat(2, 1fr);
    width: 70%;
    margin: 0 auto;
    margin-top: 50px;
  }
  .speed {
    display: flex;
    width: 100%;
    .speed__item {
      position: relative;
      flex: 1;
      display: flex;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4px;
        height: 50px;
        background: var(--internet_hr-color);
        border-radius: 2px;
      }
      &.last {
        &::after {
          display: none;
        }
      }
    }
    &.speedtest-result__wrapper {
      width: 500px;
      margin-bottom: 40px;
      .speed__item {
        .speed__unit {
          font-family: 'DINAlternate';
          font-size: 24px;
          line-height: 1.2;
        }
        .speed__value {
          font-family: 'DINAlternate';
          line-height: 1.2;
          font-size: 60px;
        }
        &::after {
          display: none;
        }
      }
    }
    .speed__icon {
      width: 30px;
      height: 30px;
      display: block;
      position: relative;
      margin-bottom: 13px;
      &.speed__icon--up {
        background: url('../../../assets/images/icon/ic_upload.png') no-repeat
          center;
        background-size: contain;
      }
      &.speed__icon--down {
        background: url('../../../assets/images/icon/ic_download.png') no-repeat
          center;
        background-size: contain;
      }
      &.speed__icon--trafficup {
        background: url('../../../assets/images/icon/ic_trafficup.png')
          no-repeat center;
        background-size: contain;
      }
      &.speed__icon--trafficdown {
        background: url('../../../assets/images/icon/ic_trafficdown.png')
          no-repeat center;
        background-size: contain;
      }
      &.speed__icon--peakup {
        background: url('../../../assets/images/icon/ic_peak_upload.png')
          no-repeat center;
        background-size: contain;
      }
      &.speed__icon--peakdown {
        background: url('../../../assets/images/icon/ic_peak_download.png')
          no-repeat center;
        background-size: contain;
      }
    }
    .speed__item__wrap {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
    }
    .speed__title {
      font-size: 14px;
      color: var(--dashboard_gery-color);
    }
    .speed__value {
      position: relative;
      font-size: 24px;
      font-weight: bold;
      font-family: 'DINAlternate', sans-serif;
      color: var(--text_default-color);
    }
    .speed__unit {
      font-size: 16px;
    }
  }
  .speedtest__wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    .speedtest-dashboard {
      width: 400px;
      aspect-ratio: 25/13;
      margin-bottom: 5px;
      overflow: hidden;
    }
    .speed__title {
      text-align: center;
    }
    .speedtest-label {
      color: var(--common_gery-color);
      margin-bottom: 15px;
    }
    .btn {
      margin-bottom: 20px;
      .iconfont {
        margin-right: 5px;
      }
    }
  }
  .uptime {
    position: relative;
    margin-bottom: 10px;
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
      font-size: 30px;
      font-family: 'DINAlternate', sans-serif;
      font-weight: bold;
      &.padding-top {
        padding-top: 10px;
      }
    }
  }
  .speedtest {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999;
    color: #fff;
    background-color: rgba($color: #000000, $alpha: 0.8);
  }
}
@media screen and (max-width: 768px) {
  .router-info {
    min-width: 100%;
    padding: 0;
    .internet-wrapper {
      min-height: auto;
    }
    .back-wrap {
      position: static;
    }
    .main-wrap {
      height: fit-content;
      padding: 0;
      flex-direction: column;
    }
    .layout-left-wrap {
      margin: 0;
      .section__body {
        flex-direction: column-reverse;
        &.section__body--bridge {
          margin: 30px 0;
          font-size: 14px;
          > img {
            width: 40%;
          }
        }
      }
    }
    .layout-right-wrap {
      width: 100%;
      max-width: 100%;
      .section {
        width: 100%;
        border-radius: 0;
      }
    }
    .speedtest__wrap {
      margin-top: 0px;
      .speedtest-dashboard {
        width: 90%;
      }
      .speedtest-result__wrapper {
        width: 100%;
        .speed__item {
          .speed__unit {
            font-size: 24px;
          }
          .speed__value {
            font-size: 48px;
          }
          &::after {
            display: none;
          }
        }
      }
      .btn {
        max-width: 340px;
        margin-bottom: 40px;
      }
    }
    .waninfo__wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 0;
      padding: 15px 0;
      background: var(--internet_section-bgc);
      box-shadow: var(--internet_section-boxshadow);
      margin-bottom: 20px;
      .speed__item {
        &::after {
          display: none;
        }
      }
      .speed__item__wrap {
        align-items: flex-start;
        padding-left: 20px;
      }
      .realtime__speed {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
