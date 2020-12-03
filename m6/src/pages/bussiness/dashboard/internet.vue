<template>
  <div class="router-info">
    <div class="section">
      <div class="section__inner">
        <div class="section__title">{{$t('trans0301')}}</div>
        <div class="section__body">
          <div class="item">
            <label class="item__label">{{$t('trans0317')}}</label>
            <span class="item__value">{{ networkArr[localNetInfo.type]}}</span>
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
              {{localNetInfo.netinfo.dns.length>0?localNetInfo.netinfo.dns.join('/')
              :'-'}}
            </span>
          </div>
          <div class="item">
            <label class="item__label">{{$t('trans0153')}}</label>
            <span class="item__value">{{localNetInfo.netinfo.gateway}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section"
         v-if="isRouter">
      <div class="section__inner">
        <div class="section__title">{{$t('trans0303')}}</div>
        <div class="section__body section__body--row">
          <div class="speed">
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--down"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{realtimeSpeedDown.value}}</span>
                  <span class="speed__unit">{{realtimeSpeedDown.unit}}/s</span>
                </span>
                <label class="speed__title">{{$t('trans0305')}}</label>
              </div>

            </div>
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--up"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{realtimeSpeedUp.value}}</span>
                  <span class="speed__unit">{{realtimeSpeedUp.unit}}/s</span>
                </span>
                <label class="speed__title">{{$t('trans0304')}}</label>
              </div>
            </div>
          </div>

          <div class="speed">
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--peekdown"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{peekDown.value}}</span>
                  <span class="speed__unit">{{peekDown.unit}}/s</span>
                </span>
                <label class="speed__title">{{$t('trans0307')}}</label>
              </div>
            </div>
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--peekup"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{peekUp.value}}</span>
                  <span class="speed__unit">{{peekUp.unit}}/s</span>
                </span>
                <label class="speed__title">{{$t('trans0306')}}</label>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    <div class="section"
         v-if="isRouter">
      <div class="section__inner">
        <div class="section__title">{{$t('trans0308')}}</div>
        <div class="section__body section__body--row releative">
          <div class="speed speed--traffic ">
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--trafficdown"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{trafficDl.value}}</span>
                  <span class="speed__unit">{{trafficDl.unit}}</span>
                </span>
                <label class="speed__title">{{$t('trans0309')}}</label>
              </div>

            </div>
            <div class="speed__item">
              <div class="speed__left">
                <i class="speed__icon speed__icon--trafficup"></i>
              </div>
              <div class="speed__right">
                <span>
                  <span class="speed__value">{{trafficUl.value}}</span>
                  <span class="speed__unit">{{trafficUl.unit}}</span>
                </span>
                <label class="speed__title">{{$t('trans0310')}}</label>
              </div>
            </div>
            <div class="speedtest-btn-wrap">
              <button class="btn btn-middle"
                      @click="startSpeedTest()"
                      :class="{'disabled':!isConnected}"
                      :disabled="!isConnected">{{$t('trans0008')}}</button>
            </div>
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
                 src="../../../assets/images/img_router_time.png">
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
import * as CONSTANTS from '@/util/constant';

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
.router-info {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px !important;
  .section {
    width: 33%;
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
        background: url('../../../assets/images/icon/ic_upload.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--down {
        background: url('../../../assets/images/icon/ic_download.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficup {
        width: 20px;
        height: 29px;
        background: url('../../../assets/images/icon/ic_upload.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--trafficdown {
        width: 20px;
        height: 29px;
        background: url('../../../assets/images/icon/ic_download.png') no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekdown {
        width: 36px;
        height: 36px;
        background: url('../../../assets/images/icon/ic_fast_download.png')
          no-repeat;
        background-size: 100% 100%;
      }
      &.speed__icon--peekup {
        width: 36px;
        height: 36px;
        background: url('../../../assets/images/icon/ic_fast_upload.png')
          no-repeat;
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
  .router-info {
    .section {
      width: 50%;
    }
  }
}
@media screen and (max-width: 768px) {
  .router-info {
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
