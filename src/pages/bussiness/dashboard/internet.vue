<template>
  <div class="internet-container">
    <div class="info-container">
      <div class="grid">
        <div class="grid-item">
          <div class="grid-item__title">{{$t('trans0301')}}</div>
          <div class="grid-item-content">
            <div class="info-item">
              <label class="info-item__title">{{$t('trans0317')}}：</label>
              <span>{{ networkArr[localNetInfo.type]}}</span>
            </div>
            <div class="info-item">
              <label class="info-item__title">{{$t('trans0151')}}：</label>
              <span>{{localNetInfo.netinfo.ip}}</span>
            </div>
            <div class="info-item">
              <label class="info-item__title">{{$t('trans0152')}}：</label>
              <span>{{localNetInfo.netinfo.mask }}</span>
            </div>
            <div class="info-item">
              <label class="info-item__title">{{$t('trans0236')}}：</label>
              <span>{{localNetInfo.netinfo.dns.length>0?localNetInfo.netinfo.dns.join('/')
              :'-'}}</span>
            </div>
            <div class="info-item">
              <label class="info-item__title">{{$t('trans0153')}}：</label>
              <span>{{localNetInfo.netinfo.gateway}}</span>
            </div>
          </div>
        </div>

        <div class="grid-item realtime"
             v-if="isRouter">
          <div class="grid-item__title">{{$t('trans0303')}}</div>
          <div class="grid-item-content">
            <div class="realtime-speed">
              <div class="down">
                <label class="r-title">{{$t('trans0305')}}：</label>
                <i class="r-dwon-icon"></i>
                <span class="speed">{{realtimeSpeedDown.value}}</span>
                <span class="unit">{{realtimeSpeedDown.unit}}/s</span>
              </div>
              <div class="up">
                <label class="r-title">{{$t('trans0304')}}：</label>
                <i class="r-up-icon"></i>
                <span class="speed">{{realtimeSpeedUp.value}}</span>
                <span class="unit">{{realtimeSpeedUp.unit}}/s</span>
              </div>
            </div>
            <div class="peek-speed">
              <div class="down peek-speed-item">
                <i class="f-down-icon"></i>
                <div>
                  <div>
                    <span class="speed">{{peekDown.value}}</span>
                    <span class="unit">{{peekDown.unit}}/s</span>
                  </div>
                  <div class="note">{{$t('trans0307')}}</div>
                </div>

              </div>
              <div class="up peek-speed-item">
                <i class="f-up-icon"></i>
                <div>
                  <div>
                    <span class="speed">{{peekUp.value}}</span>
                    <span class="unit">{{peekUp.unit}}/s</span>
                  </div>
                  <div class="note">{{$t('trans0306')}}</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="grid-item traffic"
             v-if="isRouter">
          <div class="grid-item__title">{{$t('trans0308')}}</div>
          <div class="grid-item-content">
            <div class="traffic-info">
              <div class="traffic">
                <div class="extra">
                  <i class="t-dwon-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{trafficDl.value}}</span>
                      <span class="unit">{{trafficDl.unit}}</span>
                    </p>
                    <p class="note">{{$t('trans0309')}}</p>
                  </div>
                </div>
                <div class="extra">
                  <i class="t-up-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{trafficUl.value}}</span>
                      <span class="unit">{{trafficUl.unit}}</span>
                    </p>
                    <p class="note">{{$t('trans0310')}}</p>
                  </div>
                </div>
              </div>
              <div class="test-speed-btn-container">
                <button class="btn btn-middle"
                        @click="startSpeedTest()"
                        :class="{'disabled':!isConnected}"
                        :disabled="!isConnected">{{$t('trans0008')}}</button>
              </div>
            </div>
          </div>

        </div>
        <div class="grid-item uptime">
          <div class="grid-item__title">{{$t('trans0475')}}</div>
          <div class="grid-item-content">
            <div class="time-title">{{$t('trans0537')}}：</div>
            <div>
              <p class="time-top"
                 v-if="uptimeArr[1]&&uptimeArr[1].length>0">
                <span v-for="(bm,index) in uptimeArr[1]"
                      :key="index">
                  <span class="uptime-num">{{bm.num}}</span>
                  <span class="uptime-unit">{{bm.unit}}</span>
                  <span v-if="index!==uptimeArr[1].length-1">，</span>
                </span>
              </p>
              <p class="time-bottom"
                 :class="{'padding-top':uptimeArr[1]&&uptimeArr[1].length>0}">{{uptimeArr[0]}}</p>

            </div>
          </div>
          <img class="router-time-img"
               src="../../../assets/images/img_router_time.png">
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
import * as CONSTANTS from 'util/constant';

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
<style lang="scss" scoped>
@keyframes speed-testing {
  0% {
    transform: scale(0.3);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

.internet-container {
  flex: auto;
  margin-top: 50px !important;
  .info-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: minmax(200px, auto);
      grid-gap: 30px;
      .grid-item {
        background: #f1f1f1;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        .grid-item__title {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          padding: 15px 0;
          border-bottom: 1px solid #dbdbdb;
        }
        .grid-item-content {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          flex: auto;
          padding-bottom: 15px;
          .info-item {
            width: 50%;
            font-size: 14px;
            color: #333333;
            padding-top: 20px;
            .info-item__title {
              color: #333;
              width: 100px;
              font-weight: bold;
              font-size: 14px;
              display: inline-block;
            }
          }
          .speed {
            font-size: 24px;
            font-weight: bold;
          }
          .unit {
            font-size: 14px;
            font-weight: normal;
            color: #333333;
            margin-left: 5px;
          }
          .note {
            font-size: 14px;
            color: #999999;
            margin: 0;
          }
        }

        &.realtime {
          .grid-item-content {
            display: grid;
            grid-template-columns: 200px 1fr;
            .realtime-speed {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .r-title {
                font-size: 14px;
                display: inline-block;
                color: #333;
                font-weight: bold;
                border: none;
                width: 80px;
              }
              .down {
                .r-dwon-icon {
                  width: 10px;
                  height: 14.5px;
                  margin-right: 5px;
                  display: inline-block;
                  background: url('../../../assets/images/icon/ic_download.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
              }
              .up {
                padding-top: 15px;
                .r-up-icon {
                  width: 10px;
                  height: 14.5px;
                  margin-right: 5px;
                  display: inline-block;
                  background: url('../../../assets/images/icon/ic_upload.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
              }
            }
            .peek-speed {
              display: flex;
              align-items: center;
              .peek-speed-item {
                display: flex;
                align-items: center;
                i {
                  margin-right: 10px;
                }
                &.up {
                  flex: 1;
                  .f-up-icon {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    display: inline-block;
                    background: url('../../../assets/images/icon/ic_fast_upload.png')
                      no-repeat;
                    background-size: 100% 100%;
                  }
                }
                &.down {
                  flex: 1;
                  .f-down-icon {
                    width: 36px;
                    height: 36px;
                    display: inline-block;
                    background: url('../../../assets/images/icon/ic_fast_download.png')
                      no-repeat;
                    background-size: 100% 100%;
                    flex-shrink: 0;
                  }
                }
              }
            }
          }
          .content {
            display: flex;
            flex-wrap: wrap;
            padding: 15px 0;
            flex: auto;

            .real-time-info {
              position: relative;
              &::after {
                content: '';
                position: absolute;
                box-sizing: border-box;
                height: 70px;
                border-right: 1px solid #f1f1f1;
                right: 0;
              }
              width: 220px;
              display: flex;
              overflow: hidden;
              flex-direction: column;
              justify-content: center;
              color: #333333;
              font-size: 14px;
            }
          }
        }

        &.traffic {
          .grid-item-content {
            .traffic-info {
              width: 100%;
              padding: 15px 0;
              display: flex;
              .traffic {
                display: flex;
                flex: 1;
                .extra {
                  text-align: left;
                  min-width: 140px;
                  flex: 1;
                  display: flex;
                  align-content: center;
                  align-items: center;
                  i {
                    margin-right: 5px;
                    margin-bottom: 5px;
                  }
                  p {
                    margin: 0;
                    padding: 0;
                    text-align: left;
                  }
                  .t-dwon-icon {
                    width: 20px;
                    height: 29px;
                    display: inline-block;
                    background: url('../../../assets/images/icon/ic_download.png')
                      no-repeat;
                    background-size: 100% 100%;
                    margin-bottom: 5px;
                  }
                  .t-up-icon {
                    width: 20px;
                    height: 29px;
                    display: inline-block;
                    background: url('../../../assets/images/icon/ic_upload.png')
                      no-repeat;
                    background-size: 100% 100%;
                    margin-bottom: 5px;
                  }
                }
              }
            }
            .test-speed-btn-container {
              text-align: center;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              &:before {
                content: '';
                display: block;
                width: 0;
                height: 70px;
                border-left: 1px solid #f1f1f1;
                position: absolute;
                left: 0;
              }
            }
            .bandwidth {
              font-size: 24px;
              font-weight: bold;
            }
          }
        }

        &.uptime {
          position: relative;
          .router-time-img {
            width: 116px;
            position: absolute;
            right: 0;
            bottom: 0;
          }
          .grid-item-content {
            margin-top: 30px;
            .time-title {
              color: #333;
              font-weight: bold;
              font-size: 14px;
            }
            p {
              margin: 0;
              padding: 0;
              color: #333333;
              line-height: 1;
              padding-left: 15px;
            }
            .time-top {
              font-size: 24px;
              font-weight: bold;
              .uptime-unit {
                margin-left: 5px;
                font-size: 14px;
                font-weight: normal;
              }
            }
            .time-bottom {
              font-size: 24px;
              font-weight: bold;
              &.padding-top {
                padding-top: 10px;
              }
            }
          }
        }
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

@media screen and (max-width: 768px) {
  .internet-container {
    margin-top: 20px !important;
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
      .btn-wrap {
        width: 100%;
        margin-bottom: 50px;
        .btn {
          &:last-child {
            margin-left: 30px !important;
            @media screen and (max-width: 320px) {
              margin-left: 20px !important;
            }
          }
        }
      }
    }

    .info-container {
      flex-direction: column;
      .grid {
        grid-template-columns: repeat(1, 1fr);
        .grid-item {
          .speed {
            font-size: 20px;
          }
          .unit {
            font-size: 12px;
          }
          padding: 0 16px;
          .grid-item__title {
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            padding: 0;
          }
          &.realtime {
            .grid-item-content {
              padding-top: 10px;
              grid-template-columns: 1fr;
              .peek-speed {
                margin-top: 20px;
              }
            }
          }
          &.traffic {
            .traffic-info {
              padding-top: 10px;
              flex-direction: column;
            }
          }
          &.uptime {
            position: relative;
            .grid-item-content {
              margin: 0;
              padding-top: 10px;
              flex-direction: row;
              align-items: flex-start;
              .time-title {
                color: #333;
                font-weight: bold;
                font-size: 14px;
              }
              p {
                margin: 0;
                padding: 0;
                color: #333333;
                line-height: 1;
                padding-left: 0px;
              }
              .time-top {
                font-size: 20px;
              }
              .time-bottom {
                font-size: 20px;
              }
            }
            .router-time-img {
              width: 100px;
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
          .grid-item-content {
            width: 100%;
            flex-direction: column;
            padding-bottom: 20px;
            .info-item {
              width: 100%;
              padding-top: 10px;
              font-size: 14px;
            }
          }
        }
      }

      .test-speed-btn-container {
        padding: 40px 0 20px 0;
        width: 120px;
        margin: 0 auto;
        &::before {
          display: none;
        }
      }

      .realtime {
        .content {
          flex-direction: column;
        }
        .real-time-info {
          width: 100% !important;
          height: auto !important;
          &::after {
            border: none !important;
          }

          .r-title {
            font-size: 14px !important;
          }
        }
      }
    }
  }
}
</style>
