<template>
  <div class="router-info">
    <div class="section">
      <div class="section__inner">
        <div class="section__title">{{$t('trans1062')}}</div>
        <div class="section__body">
          <div class="item">
            <label class="item__label">{{$t('trans0317')}}</label>
            <span class="item__value">{{networkArr[localNetInfo.type]}}</span>
          </div>
          <div class="item">
            <label class="item__label">{{$t('trans0151')}}</label>
            <span class="item__value">{{localNetInfo.netinfo.ip}}</span>
          </div>
          <div class="item">
            <label class="item__label">{{$t('trans0152')}}</label>
            <span class="item__value">{{localNetInfo.netinfo.mask }}</span>
          </div>
          <div class="item">
            <label class="item__label">{{$t('trans0236')}}</label>
            <span class="item__value">
              {{dnsText}}
            </span>
          </div>
          <div class="item">
            <label class="item__label">{{$t('trans0153')}}</label>
            <span class="item__value">{{localNetInfo.netinfo.gateway}}</span>
          </div>
        </div>
      </div>
    </div>
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
                 :class="{'padding-top':uptimeArr[1]&&uptimeArr[1].length>0}">{{uptimeArr[0]}}</div>
            <img class="uptime__bg"
                 src="../../../../assets/images/img_router_time.png">
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="section"
           v-if="this.ipv6NetInfo.enabled">
        <div class="section__inner">
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
      </div>
    </transition>
  </div>
</template>
<script>
import * as CONSTANTS from 'base/util/constant';

export default {
  data() {
    return {
      routerMeta: {},
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
      ipv6InfoTimer: null,
      uptimeTimer: null,
      ipv6NetInfo: {
        enabled: null,
        type: '-',
        ip: '-',
        gateway: '-',
        dns: '-',
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
    isRouter() {
      console.log('2312313', this.$store.mode);
      return CONSTANTS.RouterMode.router === this.$store.mode;
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
      return this.$parent.isConnected;
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
    '$store.mode': function watcher() {
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
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
    clearInterval(this.uptimeTimer);
    this.uptimeTimer = null;
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.router-info {
  display: flex;
  margin-top: 10px !important;
  .section {
    flex: 1;
    padding: 0 10px;
    margin-top: 20px;
    height: 363px;
    .section__inner {
      background: #f1f1f1;
      border-radius: 8px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .section__title {
      margin: 0 20px;
      padding: 12px 0;
      font-size: 16px;
      border-bottom: 1px solid #dbdbdb;
    }
    .section__body {
      padding: 20px;
      flex: 1;
      &.section__body--row {
        display: flex;
        justify-content: center;
        align-items: center;
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
      color: #999;
    }
    .item__value {
      font-size: 16px;
      color: #333;
      font-weight: bold;
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
        margin-top: 30px;
      }
    }
    .speed__icon {
      width: 10px;
      height: 14.5px;
      margin-right: 10px;
      display: block;
      top: 12px;
      position: relative;
      &.speed__icon--up {
        background: url('~@/assets/images/icon/ic_upload.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--down {
        background: url('~@/assets/images/icon/ic_download.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficup {
        width: 20px;
        height: 29px;
        background: url('~@/assets/images/icon/ic_upload.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficdown {
        width: 20px;
        height: 29px;
        background: url('~@/assets/images/icon/ic_download.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekdown {
        width: 36px;
        height: 36px;
        background: url('~@/assets/images/icon/ic_fast_download.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekup {
        width: 36px;
        height: 36px;
        background: url('~@/assets/images/icon/ic_fast_upload.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .speed__right {
      display: flex;
      flex-direction: column;
    }
    .speed__title {
      font-size: 14px;
      color: #999;
    }
    .speed__value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  }
  .speedtest-btn-wrap {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
  .releative {
    position: relative;
  }
  .uptime {
    .uptime__bg {
      position: absolute;
      width: 116px;
      right: 0;
      bottom: 0;
    }
    .uptime__top {
      font-size: 24px;
      font-weight: bold;
    }
    .uptime__value {
    }
    .uptime__unit {
      margin-left: 5px;
      font-size: 14px;
      font-weight: normal;
    }
    .uptime__bottom {
      font-size: 24px;
      font-weight: bold;
      position: relative;
      z-index: 5;
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
        img {
          width: 100px;
        }
      }
      p {
        color: #ffffff;
        font-size: 14px;
      }
      .speed-completed {
        width: 441px;
        height: 263px;
        background: white;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .speed-result-info {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          .title {
            padding: 30px 0 40px 0;
            width: 100%;
            line-height: 1;
            color: #333;
            position: relative;
            &:before {
              content: '';
              display: block;
              width: 60px;
              height: 1px;
              background: #f1f1f1;
              position: absolute;
              left: 50%;
              top: 36px;
              transform: translateX(-200%);
            }
            &:after {
              content: '';
              height: 1px;
              background: #f1f1f1;
              display: block;
              width: 60px;
              height: 1px;
              position: absolute;
              left: 50%;
              top: 36px;
              transform: translateX(100%);
            }
          }
          .content {
            display: flex;
            .extra {
              flex: 1;
              p {
                margin: 0;
                padding: 0;
              }
              text-align: left;
              display: flex;
              justify-content: center;
              align-items: center;
              .p-dwon-icon {
                width: 20px;
                height: 29px;
                display: inline-block;
                background: url('../../../../assets/images/icon/ic_download.png')
                  no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
              }
              .p-up-icon {
                width: 20px;
                height: 29px;
                display: inline-block;
                background: url('../../../../assets/images/icon/ic_upload.png')
                  no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
              }
              .title {
                font-size: 16px;
                color: #333333;
                font-weight: 600;
                padding: 15px 0;
                border-bottom: 1px solid #f1f1f1;
              }
              .speed {
                font-size: 22px;
                font-weight: bold;
                color: #000;
              }
              .unit {
                padding-left: 5px;
                font-size: 12px;
                font-weight: normal;
                letter-spacing: -0.2px;
                color: #333333;
              }
              .note {
                font-size: 12px;
                letter-spacing: -0.1px;
                color: #999999;
              }
            }
          }
        }
        .btn-wrap {
          margin-top: 56px;
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
    .section {
      width: 50%;
    }
  }
}
@media screen and (max-width: 768px) {
  .router-info {
    display: flex;
    flex-direction: column;
    .uptime {
      .uptime__bg {
        width: 64px;
      }
    }
    .section {
      width: 100%;
      padding: 0;
      .section__title {
        margin: 0 16px;
        padding: 16px 0;
      }
    }
    .speedtest-btn-wrap {
      left: 50%;
      transform: translateX(-50%);
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
            justify-content: center;
            align-items: center;
            .btn-wrap {
              padding-bottom: 20px;
            }
            .content {
              flex-direction: column;
              .extra {
                margin-top: 30px;
                &:first-child {
                  margin-top: 0;
                }
              }
            }
          }
          width: 80%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
