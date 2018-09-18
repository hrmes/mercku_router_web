<template>
  <div class="internet-container">
    <div class="info-container">
      <div class="row">
        <div class="item">
          <div class="title">{{$t('trans0301')}}</div>
          <div class='message'>
            <div class="m-item">
              <label class="m-title">{{$t('trans0317')}}：</label>
              {{ networkArr[localNetInfo.type]}}
            </div>
            <div class="m-item">
              <label class="m-title">{{$t('trans0151')}}：</label>
              {{localNetInfo.netinfo.ip}}
            </div>
            <div class="m-item">
              <label class="m-title">{{$t('trans0152')}}：</label>
              {{localNetInfo.netinfo.mask }}
            </div>
            <div class="m-item">
              <label class="m-title">{{$t('trans0236')}}：</label>
              {{localNetInfo.netinfo.dns.length>0?localNetInfo.netinfo.dns.join('/') :'-'}}
            </div>
            <div class="m-item">
              <label class="m-title">{{$t('trans0153')}}：</label>
              {{localNetInfo.netinfo.gateway}}
            </div>
          </div>
        </div>
        <div class="item real-time-network">
          <div class="title">{{$t('trans0303')}}</div>
          <div class="content">
            <div class="real-time-info">
              <div class="down">
                <label class="r-title">{{$t('trans0305')}}：</label>
                <i class='r-dwon-icon'></i>
                <span class="speed">{{realtimeSpeedDown.value}}</span>
                <span class="unit"> {{realtimeSpeedDown.unit}}/s</span>
              </div>
              <div class='up'>
                <label class="r-title">{{$t('trans0304')}}：</label>
                <i class='r-up-icon'></i>
                <span class="speed">{{realtimeSpeedUp.value}}</span>
                <span class="unit"> {{realtimeSpeedUp.unit}}/s</span>
              </div>
            </div>
            <div class="speep-info real-wrap">
              <div class="extra">
                <i class="f-up-icon"></i>
                <div>
                  <p>
                    <span class="speed">{{peekUp.value}}</span>
                    <span class='unit'> {{peekUp.unit}}/s</span>
                  </p>
                  <p class="note">{{$t('trans0306')}}</p>
                </div>
              </div>
              <div class="extra">
                <i class="f-down-icon"></i>
                <div>
                  <p>
                    <span class="speed">{{peekDown.value}}</span>
                    <span class='unit'> {{peekDown.unit}}/s</span>
                  </p>
                  <p class="note">{{$t('trans0307')}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="item traffic-container">
          <div class="title">{{$t('trans0308')}}</div>
          <div class="traffic-info">
            <div class="extra">
              <i class="t-dwon-icon"></i>
              <div>
                <p>
                  <span class="speed">{{trafficDl.value}}</span>
                  <span class='unit'> {{trafficDl.unit}}</span>
                </p>
                <p class="note">{{$t('trans0309')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="t-up-icon"></i>
              <div>
                <p>
                  <span class="speed">{{trafficUl.value}}</span>
                  <span class='unit'> {{trafficUl.unit}}</span>
                </p>
                <p class="note">{{$t('trans0310')}}</p>
              </div>
            </div>
            <div class="test-speed-btn-container">
              <span class="bandwidth">{{bandwidth.value}} </span>
              <span style="margin-top:5px;">{{bandwidth.unit}}</span>
              <button class="btn check-btn btn-speed-test" @click='startSpeedTest()' :class="{'disabled':!isConnected}" :disabled="!isConnected">{{$t('trans0008')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='speed-model-info' v-if='speedModelOpen'>
      <div class="shadow"></div>
      <div class='speed-content'>
        <div v-if="isSpeedTesting">
          <div class="test-info">
            <div class="animation-container1"></div>
            <div class="animation-container2"></div>
            <div class="animation-container3"></div>
          </div>
          <p>{{$t('trans0045')}}...{{testSpeedNumber}}s</p>
        </div>
        <div v-if="isSpeedDone || isSpeedFailed" class="speed-completed">
          <div class="speed-result-info">
            <div class="extra">
              <i class="p-dwon-icon"></i>
              <div>
                <p>
                  <span class="speed">{{speedDown.value}}</span>
                  <span class='unit'> {{speedDown.unit}}/s</span>
                </p>
                <p class="note">{{$t('trans0007')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="p-up-icon"></i>
              <div>
                <p>
                  <span class="speed">{{speedUp.value}}</span>
                  <span class='unit'> {{speedUp.unit}}/s</span>
                </p>
                <p class="note">{{$t('trans0006')}}</p>
              </div>
            </div>
            <div class="extra">
              <i class="p-count-icon"></i>
              <div>
                <p>
                  <span class="speed">{{newBandwidth.value}}</span>
                  <span class='unit'> {{newBandwidth.unit}}</span>
                </p>
                <p class="note">{{$t('trans0029')}}</p>
              </div>
            </div>
          </div>
          <div class="btn-info">
            <button class="cmp-btn" @click="startSpeedTest(true)">{{$t('trans0279')}}</button>
            <button class="re-btn" @click="closeSpeedModal">{{$t('trans0018')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import layout from '../../../layout.vue';
import * as CONSTANTS from '../../../../util/constant';

export default {
  components: {
    layout
  },
  data() {
    return {
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
      wanInfoTimer: null
    };
  },
  mounted() {
    this.getWanNetInfo();
    this.createIntervalTask();
  },
  computed: {
    isConnected() {
      return this.$parent.$parent.isConnected;
    },
    bandwidth() {
      return this.formatBandWidth(this.localTraffic.bandwidth);
    },
    newBandwidth() {
      return this.formatBandWidth(this.localSpeedInfo.speed.down);
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
      return this.formatSpeed(this.localTraffic.traffic.ul * 8);
    },
    trafficDl() {
      return this.formatSpeed(this.localTraffic.traffic.dl * 8);
    },
    speedDown() {
      return this.formatSpeed(this.localSpeedInfo.speed.down);
    },
    speedUp() {
      return this.formatSpeed(this.localSpeedInfo.speed.up);
    }
  },
  methods: {
    formatSpeed(value) {
      value /= 8;
      const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
      let index = -1;
      if (!isNaN(value)) {
        do {
          value /= 1024;
          index += 1;
        } while (value > 1024 && index < units.length - 1);
        return {
          value: value.toFixed(1),
          unit: units[index]
        };
      }
      return {
        value: '-',
        unit: 'KB'
      };
    },
    formatBandWidth(value) {
      const units = ['B', 'K', 'M', 'G', 'T', 'P'];
      let index = 0;
      if (!isNaN(value)) {
        do {
          value /= 1024;
          index += 1;
        } while (value > 1024 && index < units.length - 1);
        return {
          value: value.toFixed(1),
          unit: units[index]
        };
      }
      return {
        value: '-',
        unit: 'B'
      };
    },
    closeSpeedModal() {
      this.createIntervalTask();
      this.speedModelOpen = false;
      this.restoryOverflow();
    },
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    },
    createIntervalTask() {
      this.getWanNetStats();
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
        .testSpeed(force)
        .then(res => {
          this.speedStatus = res.data.result.status;
          this.speedInfo = res.data.result;
          if (res.data.result.status !== CONSTANTS.SpeedTestStatus.testing) {
            clearInterval(this.speedTestTimer);
            this.testSpeedNumber = this.testTimeout;
          }
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.speedStatus = CONSTANTS.SpeedTestStatus.done;
          clearInterval(this.speedTestTimer);
          this.testSpeedNumber = this.testTimeout;
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    startSpeedTest(force) {
      force = !!force;
      this.speedModelOpen = true;
      this.speedStatus = CONSTANTS.SpeedTestStatus.testing;
      this.clearIntervalTask();
      this.setOverflow();
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
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
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
        .catch(err => {
          if (err.response && err.response.status === 400) {
            this.wanInfoTimer = setTimeout(() => {
              this.getWanNetInfo();
            }, 1000 * 3);
          }
        });
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
    this.restoryOverflow();
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
  padding: 0 2%;
  .info-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .row {
      width: 100%;
      .item {
        width: 49%;
        overflow: hidden;
        background: white;
        margin-bottom: 20px;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 0 20px;
        min-height: 200px;

        &:nth-child(1) {
          float: left;
        }
        &:nth-child(2) {
          float: right;
        }
        .title {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          padding: 15px 0;
          border-bottom: 1px solid #f1f1f1;
        }
        .speed {
          font-size: 26px;
          font-weight: bold;
        }
        .unit {
          font-size: 14px;
          font-weight: normal;
          color: #333333;
        }
        .note {
          font-size: 14px;
          color: #999999;
        }
        .message {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 15px;
          .m-item {
            width: 50%;
            font-size: 14px;
            color: #333333;
            padding-top: 20px;
            .m-title {
              color: #999999;
            }
          }
        }

        .speep-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          min-height: 148px;
          i {
            margin-right: 5px;
            margin-bottom: 5px;
          }
          div {
            display: inline-block;
            flex: 1;
            text-align: center;
            p {
              margin: 0;
              padding: 0;
              text-align: left;
            }
          }
          .f-up-icon {
            width: 36px;
            height: 36px;
            display: inline-block;
            background: url('../../../assets/images/ic_fast_upload.png')
              no-repeat;
            background-size: 100% 100%;
          }
          .f-down-icon {
            width: 36px;
            height: 36px;
            display: inline-block;
            background: url('../../../assets/images/ic_fast_download.png')
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }

    .traffic-container {
      .traffic-info {
        padding: 15px 0;
        display: flex;
        min-height: 148px;
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
            background: url('../../../assets/images/ic_ic_download.png')
              no-repeat;
            background-size: 100% 100%;
            margin-bottom: 5px;
          }
          .t-up-icon {
            width: 20px;
            height: 29px;
            display: inline-block;
            background: url('../../../assets/images/ic_upload.png') no-repeat;
            background-size: 100% 100%;
            margin-bottom: 5px;
          }
        }
      }
      .bandwidth {
        font-size: 24px;
        font-weight: bold;
        margin-right: 5px;
      }
    }
    .real-time-network {
      display: flex;
      flex-direction: column;
      .content {
        display: flex;
        flex-wrap: wrap;
        padding: 15px 0;
        flex: auto;

        .real-wrap {
          min-height: 60px !important;
          flex: 1;
        }
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
          width: 260px;
          display: flex;
          overflow: hidden;
          flex-direction: column;
          justify-content: center;
          color: #333333;
          font-size: 14px;
          .r-title {
            font-size: 17px;
            display: inline-block;
            color: #999999;
            font-weight: 200;
            border: none;
            width: 85px;
          }
          .down {
            .r-dwon-icon {
              width: 10px;
              height: 14.5px;
              display: inline-block;
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
            }
          }
          .up {
            padding-top: 15px;

            .r-up-icon {
              width: 10px;
              height: 14.5px;
              display: inline-block;
              background: url('../../../assets/images/ic_upload.png') no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
  }
  .test-speed-btn-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    position: relative;
    &:before {
      content: '';
      display: block;
      width: 0;
      height: 70px;
      border-left: 1px solid #f1f1f1;
      position: absolute;
      left: -40px;
    }
    .btn {
      width: 100px;
      height: 38px;
      margin-left: 20px;
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
        .animation-container1 {
          background: rgba(65, 55, 221, 1);
          width: 110px;
          height: 110px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -55px;
          margin-top: -55px;
          border-radius: 50%;
          animation: speed-testing 1s linear infinite;
        }
        .animation-container2 {
          background: rgba(65, 55, 221, 0.6);
          width: 220px;
          height: 220px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -110px;
          margin-top: -110px;
          border-radius: 50%;
          animation: speed-testing 1s linear infinite;
        }
        .animation-container3 {
          background: rgba(65, 55, 221, 0.2);
          width: 330px;
          height: 330px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -165px;
          margin-top: -165px;
          border-radius: 50%;
          animation: speed-testing 1s linear infinite;
        }
        //background: url('../../../assets/images/img_test_03.png') no-repeat;
        background-size: 100%;
        width: 330px;
        height: 330px;
      }
      p {
        color: #ffffff;
        font-size: 16px;
        font-weight: 200;
      }
      .speed-completed {
        width: 600px;
        height: 280px;
        background: white;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .speed-result-info {
          flex: 1;

          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
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
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .p-up-icon {
              width: 20px;
              height: 29px;
              display: inline-block;
              background: url('../../../assets/images/ic_upload.png') no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .p-count-icon {
              width: 30px;
              height: 30px;
              display: inline-block;
              background: url('../../../assets/images/ic_broadband.png')
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
              // padding: 0 5px;
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
              // margin-left: 3px !important;
            }
          }
        }
        .btn-info {
          height: 100px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .cmp-btn {
            cursor: pointer;
            width: 120px;
            height: 42px;
            border-radius: 4px;
            border: solid 1px #b6b6b6;
            color: #333333;
            background: white;
            outline: none;
            box-sizing: border-box;
            &:active {
              opacity: 0.6;
            }
          }
          .re-btn {
            cursor: pointer;
            outline: none;
            width: 120px;
            height: 42px;
            border-radius: 4px;
            background-color: #4237dd;
            border: solid 1px #4237dd;
            color: #ffffff;
            margin-left: 40px;
            &:active {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1367px) and (max-width: 1680px) {
  .internet-container {
    .info-container {
      .real-time-network {
        .content {
          .speep-info {
            justify-content: flex-start;
            div {
              text-align: left;
            }
          }
          .real-time-info {
            text-align: left;
            width: 100%;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .down {
              flex: 1;
            }
            .up {
              padding: 0;
              flex: 1;
            }
            &::after {
              border: none;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1366px) {
  .internet-container {
    .info-container {
      flex-direction: column;
      .item {
        width: 100% !important;
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1100px) {
  .row-1 {
    min-width: 100px;
    justify-content: center;
    flex-flow: column-reverse;
    font-size: 12px;
    position: relative;
    img {
      width: 30px !important;
    }
    .name {
      position: absolute;
      top: 100%;
    }
  }
  .row-3 {
    min-width: 80px;
    flex-flow: column;
    font-size: 12px;
    position: relative;
    img {
      width: 40px !important;
    }
    .speed {
      position: absolute;
      top: 100%;
      span {
        font-weight: 200 !important;
        label {
          font-weight: 200 !important;
        }
      }
    }
  }
  .internet-container {
    .check-info {
      .check-status {
        width: 280px !important;
      }
    }
    .info-container {
      .item {
        .message {
          flex-direction: column;
          padding-bottom: 20px;
          .m-item {
            width: 100%;
            padding-top: 10px;
            font-size: 14px;
          }
        }
      }
      .real-time-network {
        .content {
          .speep-info {
            justify-content: flex-start;
            div {
              text-align: left;
            }
          }
          .real-time-info {
            text-align: left;
            width: 100%;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .down {
              flex: 1;
            }
            .up {
              padding: 0;
              flex: 1;
            }
            &::after {
              border: none;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .internet-container {
    .speed-model-info {
      .speed-content {
        width: 100%;
        .test-info {
          width: 150px;
          height: 150px;
          margin: 0 auto;
        }
        .speed-completed {
          padding: 10px;
          .speed-result-info {
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            padding-top: 20px;
            .extra {
              min-width: 100%;

              padding-bottom: 30px;
            }
          }
          width: 80%;
          margin: 0 auto;
          height: auto !important;
        }
      }
    }
    .btn-info {
      width: 100%;
      .btn {
        height: 44px;
      }
    }
    padding: 10px;
    padding-top: 30px;
    .info-container {
      flex-direction: column;
      .item {
        width: 100%;
        .message {
          flex-direction: column;
          padding-bottom: 20px;
          .m-item {
            width: 100%;
            padding-top: 10px;
            font-size: 14px;
          }
        }
      }
      .traffic-container {
        .speep-info {
          .extra {
            text-align: left;
            flex: auto;
            .t-dwon-icon,
            .t-up-icon {
              width: 25px;
              height: 36.25px;
            }
            .t-count-icon {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
      .real-wrap {
        min-height: 60px !important;
        margin: 10px 0;
        div {
          text-align: left !important;
        }
        i {
          width: 30px !important;
          height: 30px !important;
        }
      }
      .item {
        padding: 0 10px;
        .title {
          height: 44px;
          line-height: 44px;
          font-size: 14px;
          padding: 0;
        }
      }
      .speed {
        font-size: 20px !important;
      }
      .unit {
        font-size: 12px !important;
      }
      .note {
        font-size: 12px !important;
      }
      .real-time-network {
        .content {
          flex-direction: column;
        }
        .real-time-info {
          .down {
            padding-top: 20px;
          }
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
