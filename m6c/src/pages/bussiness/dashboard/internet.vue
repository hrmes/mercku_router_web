<template>
  <div class="internet">
    <div class="header">
      <div class="header__uptime">
        <button class="btn btn-middle btn-uptime">
          <m-icon name="time"
                  class="icon icon__time"></m-icon>
          <span class="btn-uptime__text">{{$t('trans0537')}}</span>
        </button>
        <div class="running is-laptop">
          <template v-if="uptimeArr[1]&&uptimeArr[1].length>0">
            <div v-for="(bm, index) in uptimeArr[1]"
                 :key="index"
                 class="running__date date">
              <div class="date__wrap">
                <span class="date__value">{{bm.num}}</span>
                <span class="date__unit">{{bm.unit}}</span>
              </div>
              <div class="date__splite-line"></div>
            </div>
          </template>
          <div class="running__time">
            {{uptimeArr[0]}}
          </div>
        </div>
      </div>
      <div class="header__speedtest">
        <button class="btn btn-middle speedtest"
                @click="startSpeedTest()"
                :class="{'disabled':!isConnected}"
                :disabled="!isConnected">{{$t('trans0008')}}</button>
      </div>
    </div>
    <div class="main">
      <!-- download -->
      <div class="main__data trans-wrap">
        <div class="trans">
          <div class="trans__left trans__layout">
            <m-icon name="download"
                    class="icon icon__download"></m-icon>
            <div class="trans__download trans__download--current label">
              <span class="label__key">{{$t('trans0305')}}</span>
              <span class="label__value">{{realtimeSpeedDown.value}}</span>
              <span class="label__unit">{{realtimeSpeedDown.unit}}/s</span>
            </div>
          </div>
          <div class="trans__right">
            <div class="trans__layout">
              <m-icon name="peak_download"
                      class="icon icon__download"></m-icon>
              <div class="trans__download trans__download--peack label">
                <div class="label__wrap">
                  <span class="label__value">{{peekDown.value}}</span>
                  <span class="label__unit">{{peekDown.unit}}/s</span>
                </div>
                <span class="label__key">{{$t('trans0307')}}</span>
              </div>
            </div>
            <div class="trans__layout">
              <m-icon name="total_download"
                      class="icon icon__download"></m-icon>
              <div class="trans__download trans__download--total label">
                <div class="label__wrap">
                  <span class="label__value">{{trafficDl.value}}</span>
                  <span class="label__unit">{{trafficDl.unit}}</span>
                </div>
                <span class="label__key">{{$t('trans0309')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- upload -->
      <div class="main__data trans-wrap">
        <div class="trans">
          <div class="trans__layout trans__left">
            <m-icon name="upload"
                    class="icon icon__download"></m-icon>
            <div class="trans__download trans__download--current label">
              <span class="label__key">{{$t('trans0304')}}</span>
              <span class="label__value">{{realtimeSpeedUp.value}}</span>
              <span class="label__unit">{{realtimeSpeedUp.unit}}/s</span>
            </div>
          </div>
          <div class="trans__right">
            <div class="trans__layout">
              <m-icon name="peak_upload"
                      class="icon icon__download"></m-icon>
              <div class="trans__download trans__download--peack label">
                <div class="label__wrap">
                  <span class="label__value">{{peekUp.value}}</span>
                  <span class="label__unit">{{peekUp.unit}}/s</span>
                </div>
                <span class="label__key">{{$t('trans0306')}}</span>
              </div>
            </div>
            <div class="trans__layout">
              <m-icon name="total_upload"
                      class="icon icon__download"></m-icon>
              <div class="trans__download trans__download--total label">
                <div class="label__wrap">
                  <span class="label__value">{{trafficUl.value}}</span>
                  <span class="label__unit">{{trafficUl.unit}}</span>
                </div>
                <span class="label__key">{{$t('trans0310')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main__data wan">
        <h2 class="wan__title">{{$t('trans0301')}}</h2>
        <div class="wan__table">
          <div class="table">
            <div class="table__item">
              <div class="item">
                <label class="item__key"
                       for="">{{$t('trans0317')}}</label>
                <span class="item__value">{{networkArr[localNetInfo.type]}}</span>
              </div>
            </div>
            <div class="table__item">
              <div class="item">
                <label class="item__key"
                       for="">{{$t('trans0152')}}</label>
                <span class="item__value">{{localNetInfo.netinfo.mask }}</span>
              </div>
            </div>
            <div class="table__item">
              <div class="item">
                <label class="item__key"
                       for="">{{$t('trans0153')}}</label>
                <span class="item__value">{{localNetInfo.netinfo.gateway}}</span>
              </div>
            </div>
            <div class="table__item">
              <div class="item">
                <label class="item__key"
                       for="">{{$t('trans0151')}}</label>
                <span class="item__value">{{localNetInfo.netinfo.ip}}</span>
              </div>
            </div>
            <div class="table__item">
              <div class="item">
                <label class="item__key"
                       for="">{{$t('trans0236')}}</label>
                <span class="item__value">
                  {{DNSText}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='speed-model-info'
         v-if='speedModelOpen'>
      <div class="shadow"></div>
      <div class="speed-content">
        <div v-if="isSpeedTesting">
          <div class="test-info">
            <img src="../../../assets/images/speed_test.gif"
                 alt="">
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
                  <p>
                    <span class="speed">{{speedDown.value}}</span>
                    <span class="unit">{{speedDown.unit}}</span>
                  </p>
                  <p class="note">{{$t('trans0007')}}</p>
                </div>
              </div>
              <div class="extra">
                <i class="p-up-icon"></i>
                <div>
                  <p>
                    <span class="speed">{{speedUp.value}}</span>
                    <span class="unit">{{speedUp.unit}}</span>
                  </p>
                  <p class="note">{{$t('trans0006')}}</p>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button class="btn btn-default btn-middle"
                      @click="startSpeedTest(true)">{{$t('trans0279')}}</button>
              <button class="btn btn-middle"
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
      uptime: 0,
      CONSTANTS,
      networkArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144')
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
      uptimeTimer: null
    };
  },
  mounted() {
    this.getWanNetInfo();
    this.createIntervalTask();
    this.getRouteMeta();
  },
  computed: {
    isRouter() {
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
        return { ...local, ...this.netInfo };
      }
      return local;
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
    },
    DNSText() {
      return this.localNetInfo.netinfo.dns.length > 0
        ? this.localNetInfo.netinfo.dns.join('/')
        : '-';
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
.internet {
  .is-laptop {
    visibility: visible;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .header__uptime {
      display: flex;
    }
    .btn-uptime {
      display: flex;
      align-items: center;
      border-radius: 3px;
      background-color: #ffebeb;
      .btn-uptime__text {
        font-size: 16px;
        color: #d16e6e;
        margin-left: 11px;
      }
    }
    .running {
      margin-left: 10px;
      display: flex;
      height: 38px;
      box-sizing: border-box;
      align-items: center;
      padding: 8px 10px;
      border-radius: 3px;
      border: solid 1px #ebebeb;
      .running__date {
        display: flex;
        align-items: center;
      }
      .running__time {
        font-size: 16px;
        color: #333333;
      }
      .date {
        .date__wrap {
          .date__value {
            margin-right: 2px;
            font-size: 16px;
            color: #333333;
          }
          .date__unit {
            font-size: 16px;
            color: #a3a3a3;
          }
        }
        .date__splite-line {
          width: 1px;
          height: 14px;
          margin: 0 10px;
          border: solid 1px #ebebeb;
        }
      }
    }
    .speedtest {
      background-color: #333333;
      &.disabled {
        background-color: #b2b2b2;
      }
    }
  }
  .main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 25px;
    .main__data {
      border-radius: 8px;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .trans-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 49%;
      height: 200px;
    }
    .trans {
      display: flex;
      .trans__right {
        margin-left: 40px;
      }
      .trans__layout {
        display: flex;
        align-items: center;
      }
      .trans__download {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        span {
          display: inline-block;
        }
      }
      .trans__download--current {
        &.label {
          span {
            width: 100px;
            text-align: center;
          }
          .label__key {
            font-size: 16px;
            color: #999;
          }
          .label__value {
            font-size: 48px;
            color: #333;
          }
          .label__unit {
            font-size: 14px;
            color: #333;
          }
        }
      }
      .trans__download--peack,
      .trans__download--total {
        &.label {
          .label__key {
            font-size: 14px;
            color: #999;
          }
          .label__value {
            font-size: 24px;
            color: #333;
          }
          .label__unit {
            font-size: 14px;
            color: #333;
            margin-left: 4px;
          }
          .label__wrap {
            margin-bottom: 2px;
          }
        }
      }
    }
    .wan {
      margin-top: 30px;
      width: 100%;
      padding: 15px 20px;
      .wan__title {
        font-size: 16px;
        color: #3a3a3a;
        padding-bottom: 15px;
        border-bottom: solid 1px #dbdbdb;
      }
      .wan__table {
        padding: 22px 0;
        .table {
          display: flex;
          .table__item {
            width: 20%;
            .item {
              display: flex;
              flex-direction: column;
              font-size: 14px;
              .item__key {
                color: #a3a3a3;
              }
              .item__value {
                margin-top: 10px;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
  .icon {
    &.icon__time {
      width: 18px;
      height: 18px;
    }
    &.icon__download {
      width: 32px;
      height: 32px;
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
                background: url('../../../assets/images/icon/ic_download.png')
                  no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
              }
              .p-up-icon {
                width: 20px;
                height: 29px;
                display: inline-block;
                background: url('../../../assets/images/icon/ic_upload.png')
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
  .internet {
    .main {
      .trans {
        .trans__right {
          margin-left: 15px;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .internet {
    .is-laptop {
      visibility: hidden;
    }
    .header {
      margin-top: 20px;
    }
    .main {
      margin-top: 30px;
      .trans-wrap {
        width: 100%;
        height: 152px;
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
      .trans {
        .trans__right {
          margin-left: 50px;
        }
        .trans__download {
          margin-left: 5px;
        }
        .trans__download--current {
          &.label {
            span {
              width: 60px;
            }
            .label__key {
              font-size: 12px;
            }
            .label__value {
              font-size: 32px;
            }
            .label__unit {
              font-size: 12px;
            }
          }
        }
        .trans__download--peack,
        .trans__download--total {
          &.label {
            .label__key {
              font-size: 12px;
            }
            .label__value {
              font-size: 12px;
            }
            .label__unit {
              font-size: 14px;
              margin-left: 2px;
            }
          }
        }
      }
      .wan {
        margin-top: 20px;
        padding: 13px 16px;
        .wan__title {
          padding-bottom: 13px;
          border-bottom: solid 1px #dbdbdb;
        }
        .wan__table {
          padding: 20px 0;
          .table {
            display: flex;
            .table__item {
              width: 100%;
              + .table__item {
                margin-bottom: 12px;
              }
              .item {
                .item__key {
                  color: #a3a3a3;
                }
                .item__value {
                  margin-top: 2px;
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
    .icon {
      &.icon__time {
        width: 14px;
        height: 14px;
      }
      &.icon__download {
        width: 28px;
        height: 28px;
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
