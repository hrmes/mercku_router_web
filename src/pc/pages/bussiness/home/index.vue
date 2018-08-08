<template>
  <layout>
    <div class="home-container">
      <div class="home-inner">
        <div class="check-info">
          <div class="row-1">
            <div class="name" style="min-width:60px;overflow:hidden;text-overflow:ellipsis;" :title="ssid">{{ssid||'-'}}</div>
            <div class="router-icon"><img src="../../../assets/images/ic_router.png" alt=""></div>
          </div>
          <div class='check-status row-2'>
            <div class="check-txt-info">
              <span class='testing' v-if="isTesting"> {{$t('trans0298')}}</span>
            </div>
            <span class="success-line" :class="{'testing-animation':isTesting}" v-if="isConnected || isTesting"></span>
            <span class='fail-line' v-if="isUnlinked ||isLinked"></span>
            <span class='fail-info' v-if="isUnlinked ||isLinked">
              <i class="fail-icon"></i>
            </span>
          </div>
          <div class="row-3">
            <div class="network-icon"><img src="../../../assets/images/ic_internet.png" alt=""></div>
            <div class="speed" style="min-width:60px;" :title="formatBandWidth(localTraffice.bandwidth) + 'M'">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;">{{bandwidth}}
                <label style="font-weight:normal">M</label>
              </span>
            </div>
          </div>
          <div class='check-btn-info'>
            <button class="btn check-btn" @click='createSpeedTimer(false)' :class="!isConnected&&'disabled'" style='height:44px' :disabled="!isConnected">{{$t('trans0008')}}</button>
          </div>
        </div>
        <div class="router-info">
          <div class="row">
            <div class="item">
              <div class="title">{{$t('trans0299')}}</div>
              <div class='message'>
                <div class="m-item">
                  <label class="m-title">{{$t('trans0187')}}：</label>
                  {{getModel(localRouterInfo.sn.slice(0,2))}}
                </div>
                <div class="m-item">
                  <label class="m-title">{{$t('trans0300')}}：</label>
                  {{localRouterInfo.version.current }}
                </div>
                <div class="m-item">
                  <label class="m-title">{{$t('trans0200')}}：</label>
                  {{macFormat(localRouterInfo.mac.wan) }}
                </div>
                <div class="m-item">
                  <label class="m-title">{{$t('trans0201')}}：</label>
                  {{macFormat(localRouterInfo.mac.lan) }}
                </div>

                <div class="m-item">
                  <label class="m-title">{{$t('trans0251')}}：</label>
                  {{localRouterInfo.sn }}
                </div>
              </div>
            </div>
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
          </div>
          <div class="row">
            <div class="item real-time-network">
              <div class="title">{{$t('trans0303')}}</div>
              <div class="content">
                <div class="real-time-info">
                  <div class="down">
                    <label class="r-title">{{$t('trans0305')}}：</label>
                    <i class='r-dwon-icon'></i>
                    <span class="speed">{{format(localTraffice.speed.realtime.down).value}}</span>
                    <span class="unit"> {{format(localTraffice.speed.realtime.down).unit}}/s</span>
                  </div>
                  <div class='up'>
                    <label class="r-title">{{$t('trans0304')}}：</label>
                    <i class='r-up-icon'></i>
                    <span class="speed">{{format(localTraffice.speed.realtime.up).value}}</span>
                    <span class="unit"> {{format(localTraffice.speed.realtime.up).unit}}/s</span>
                  </div>
                </div>
                <div class="speep-info real-wrap">
                  <div class="extra">
                    <i class="f-up-icon"></i>
                    <div>
                      <p>
                        <span class="speed">{{format(localTraffice.speed.peak.up).value}}</span>
                        <span class='unit'> {{format(localTraffice.speed.peak.up).unit}}/s</span>
                      </p>
                      <p class="note">{{$t('trans0306')}}</p>
                    </div>
                  </div>
                  <div class="extra">
                    <i class="f-down-icon"></i>
                    <div>
                      <p>
                        <span class="speed">{{format(localTraffice.speed.peak.down).value}}</span>
                        <span class='unit'> {{format(localTraffice.speed.peak.down).unit}}/s</span>
                      </p>
                      <p class="note">{{$t('trans0307')}}</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="item term-flow-info">
              <div class="title">{{$t('trans0308')}}</div>
              <div class="speep-info">
                <div class="extra">
                  <i class="t-dwon-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{format(localTraffice.traffic.dl,'tranffic').value}}</span>
                      <span class='unit'> {{format(localTraffice.traffic.dl,'tranffic').unit}}</span>
                    </p>
                    <p class="note">{{$t('trans0309')}}</p>
                  </div>
                </div>
                <div class="extra">
                  <i class="t-up-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{format(localTraffice.traffic.ul,'tranffic').value}}</span>
                      <span class='unit'> {{format(localTraffice.traffic.ul,'tranffic').unit}}</span>
                    </p>
                    <p class="note">{{$t('trans0310')}}</p>
                  </div>
                </div>
                <div class="extra">
                  <i class="t-count-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{deviceCount.count||'-'}}</span>
                    </p>
                    <p class="note">{{$t('trans0311')}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='mesh-info'>
          <div class="title">{{$t('trans0312')}}</div>
          <div class="content">
            <div id="topo" style="width:100%;height:550px;"></div>
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
                      <span class="speed">{{format(localSpeedInfo.speed.down).value}}</span>
                      <span class='unit'> {{format(localSpeedInfo.speed.down).unit}}/s</span>
                    </p>
                    <p class="note">{{$t('trans0007')}}</p>
                  </div>
                </div>
                <div class="extra">
                  <i class="p-up-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{format(localSpeedInfo.speed.up).value}}</span>
                      <span class='unit'> {{format(localSpeedInfo.speed.up).unit}}/s</span>
                    </p>
                    <p class="note">{{$t('trans0006')}}</p>
                  </div>
                </div>
                <div class="extra">
                  <i class="p-count-icon"></i>
                  <div>
                    <p>
                      <span class="speed">{{formatBandWidth(localSpeedInfo.speed.down)}}</span>
                      <span class='unit'> M</span>
                    </p>
                    <p class="note">{{$t('trans0029')}}</p>
                  </div>
                </div>
              </div>
              <div class="btn-info">
                <button class="cmp-btn" @click="createSpeedTimer(true)">{{$t('trans0279')}}</button>
                <button class="re-btn" @click="closeSpeedModal">{{$t('trans0018')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import echarts from 'echarts';
import layout from '../../../layout.vue';
import * as CONSTANTS from '../../../../util/constant';
import genData from './topo';

const Color = {
  good: '#00d061',
  bad: '#ff6f00'
};
export default {
  components: {
    layout
  },
  data() {
    return {
      CONSTANTS: { ...CONSTANTS },
      networkArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144')
      },
      testTimeout: 60,
      testSpeedNumber: 60,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      speedStatus: CONSTANTS.SpeedTestStatus.testing,
      speedModelOpen: false,
      TextBandwidth: '-',
      enter: true,
      ssid: '',
      speedInfo: {},
      routerInfo: {},
      netInfo: {},
      traffice: {},
      deviceCount: {},
      isFetching: false,
      meshNode: [],
      timer1: null,
      timer2: null,
      timer3: null,
      timer4: null,
      timer5: null,
      timer6: null,
      chart: null
    };
  },
  mounted() {
    this.getWanStatus();
    this.getRouter();
    this.getWanNetInfo();
    this.createTimer();
    this.getSsid();
    this.initChart();
  },
  computed: {
    bandwidth() {
      return this.formatBandWidth(this.localTraffice.bandwidth);
    },
    isTesting() {
      return this.netStatus === CONSTANTS.WanNetStatus.testing;
    },
    isConnected() {
      return this.netStatus === CONSTANTS.WanNetStatus.connected;
    },
    isLinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.linked;
    },
    isUnlinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.unlinked;
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
    localTraffice() {
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
      if (this.traffice && this.traffice.speed) {
        return { ...local, ...this.traffice };
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
    localRouterInfo() {
      const local = {
        sn: '-',
        alias: '-',
        mac: { lan: '-', wan: '-' },
        owner: '-',
        model: '-',
        version: '-',
        mesh_id: '-',
        is_gw: '-',
        rssi: '-',
        status: '-'
      };
      if (this.routerInfo && this.routerInfo.mac) {
        return { ...local, ...this.routerInfo };
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
    }
  },
  methods: {
    getModel(id) {
      let result = '-';
      Object.keys(CONSTANTS.RouterSnModel).forEach(key => {
        const model = CONSTANTS.RouterSnModel[key];
        if (model === id) {
          result = key;
        }
      });
      return result;
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('topo'));
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    },
    drawTopo(routers) {
      const data = genData(routers);
      const option = {
        color: [Color.good, Color.bad],
        top: 10,
        title: {
          subtext: this.$t('trans0302'),
          subtextStyle: {
            color: '#333'
          }
        },
        legend: [
          {
            data: [
              {
                name: `${this.$t('trans0193')}`,
                icon: 'circle'
              },
              {
                name: `${this.$t('trans0196')}`,
                icon: 'circle'
              }
            ],
            orient: 'vertical',
            left: 0,
            top: 35,
            selectedMode: false
          }
        ],
        series: [
          {
            type: 'graph',
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: 3,
            cursor: 'default',
            hoverAnimation: false,
            label: {
              normal: {
                show: true,
                position: 'bottom',
                color: '#333'
              }
            },
            data: data.nodes,
            links: data.lines,
            categories: [
              { name: `${this.$t('trans0193')}` },
              { name: `${this.$t('trans0196')}` }
            ],
            lineStyle: {
              width: 2
            }
          }
        ]
      };

      this.chart.setOption(option);
    },
    format(v, type) {
      const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
      let index = -1;
      if (!isNaN(v)) {
        if (!type && type !== 'traffic') v /= 8;
        do {
          v /= 1024;
          index += 1;
        } while (v > 1024 && index < units.length - 1);
        return {
          value: v.toFixed(1),
          unit: units[index]
        };
      }
      return {
        value: '-',
        unit: 'KB'
      };
    },
    formatBandWidth(v) {
      return !isNaN(v) ? (v / (1024 * 1024)).toFixed(1) : v;
    },
    closeSpeedModal() {
      this.speedModelOpen = false;
      this.restoryOverflow();
    },
    setOverflow() {
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = 'auto';
    },

    macFormat(v) {
      return v.length > 2 ? v.match(/.{2}/g).join(':') : v;
    },
    createTimer() {
      this.getWanNetStats();
      this.getDeviceCount();
      this.getMeshNode();
    },
    clearTimer() {
      clearTimeout(this.timer1);
      clearTimeout(this.timer2);
      clearTimeout(this.timer3);
      this.timer1 = null;
      this.timer2 = null;
      this.timer3 = null;
    },
    getSsid() {
      this.$http.getMeshMeta().then(res => {
        this.ssid = res.data.result.ssid;
      });
    },
    speedTesting(force) {
      if (force === undefined) {
        force = false;
      }
      this.$http
        .speedTesting(force)
        .then(res => {
          if (res.status === 200) {
            this.speedStatus = res.data.result.status;
            this.speedInfo = res.data.result;
            if (res.data.result.status === CONSTANTS.SpeedTestStatus.done) {
              clearInterval(this.timer4);
              this.testSpeedNumber = this.testTimeout;
            }
            if (res.data.result.status === CONSTANTS.SpeedTestStatus.failed) {
              clearInterval(this.timer4);
              this.testSpeedNumber = this.testTimeout;
            }
          }
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }

          this.speedStatus = CONSTANTS.SpeedTestStatus.done;
          clearInterval(this.timer4);
          this.testSpeedNumber = this.testTimeout;
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    createSpeedTimer(force) {
      this.speedModelOpen = true;
      this.speedStatus = CONSTANTS.SpeedTestStatus.testing;
      this.setOverflow();
      this.speedTesting(force);
      this.timer4 = setInterval(() => {
        if (this.testSpeedNumber <= 0) {
          clearInterval(this.timer4);
          this.speedStatus = CONSTANTS.SpeedTestStatus.done;
          this.testSpeedNumber = this.testTimeout;
          return;
        }
        if (
          this.testSpeedNumber % 5 === 0 &&
          this.testSpeedNumber !== this.testTimeout
        ) {
          this.speedTesting();
        }
        this.testSpeedNumber -= 1;
      }, 1000);
    },
    getWanNetStats() {
      clearTimeout(this.timer1);
      this.timer1 = null;
      this.$http
        .getWanNetStats()
        .then(res => {
          if (this.enter) {
            this.traffice = res.data.result;
            this.timer1 = setTimeout(() => {
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
          if (this.enter) {
            this.timer1 = setTimeout(() => {
              this.getWanNetStats();
            }, 10000);
          }
        });
    },
    getDeviceCount() {
      clearTimeout(this.timer2);
      this.timer2 = null;
      this.$http
        .getDeviceCount()
        .then(res => {
          this.deviceCount = res.data.result;
          if (this.enter) {
            this.timer2 = setTimeout(() => {
              this.getDeviceCount();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.enter) {
            this.timer2 = setTimeout(() => {
              this.getDeviceCount();
            }, 10000);
          }
        });
    },
    getMeshNode() {
      clearTimeout(this.timer3);
      this.timer3 = null;
      this.$http
        .getMeshNode()
        .then(res => {
          this.drawTopo(res.data.result);
          if (this.enter) {
            this.timer3 = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.enter) {
            this.timer3 = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
        });
    },
    getRouter() {
      this.$http
        .getRouter()
        .then(res => {
          this.timer5 = null;
          clearTimeout(this.timer5);
          this.routerInfo = res.data.result;
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            this.timer5 = setTimeout(() => {
              this.getRouter();
            }, 1000 * 3);
          }
        });
    },
    getWanNetInfo() {
      this.$http
        .getWanNetInfo()
        .then(res => {
          this.timer6 = null;
          clearTimeout(this.timer6);
          this.netInfo = res.data.result;
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            this.timer6 = setTimeout(() => {
              this.getWanNetInfo();
            }, 1000 * 3);
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
    this.enter = false;
    this.clearTimer();
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

.home-container {
  flex: auto;
  padding: 0 2%;
  .test-speed-btn-container {
    width: 100%;
    text-align: center;
    height: 50px;
    margin-bottom: 20px;
    .btn {
      width: 160px;
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
              padding: 0 5px;
              color: #000;
            }
            .unit {
              font-size: 12px;
              font-weight: normal;
              letter-spacing: -0.2px;
              color: #333333;
            }
            .note {
              font-size: 12px;
              letter-spacing: -0.1px;
              color: #999999;
              margin-left: 3px !important;
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

  .check-info {
    .btn-info {
      width: 100%;
      text-align: center;
    }
    .row-1 {
      display: flex;
      align-items: center;
      text-align: center;
    }
    .row-3 {
      display: flex;
      align-items: center;
      margin-right: 20px;
      text-align: center;
    }
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    margin-bottom: 20px;
    width: 100%;

    flex-wrap: wrap;
    .network-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 49px;
      }
    }
    .router-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 38px;
      }
    }
    .check-status {
      width: 440px;
      position: relative;
      .success-line {
        position: absolute;
        width: 100%;
        height: 3px;
        background: url('../../../assets/images/ic_test_line.png') repeat-x;
        box-sizing: border-box;
        &.testing-animation {
          background: none;
          &::after {
            content: '';
            width: 10%;
            display: block;
            height: 3px;
            background: url('../../../assets/images/ic_test_line.png') repeat-x;
            animation: speed-test-line linear 1s infinite;
          }
        }
        //animation: speed-test-line 1s linear 2s infinite;
      }
      .fail-line {
        position: absolute;
        width: 100%;
        height: 3px;
        background: url('../../../assets/images/ic_test_line_fail.png') repeat-x;
        box-sizing: border-box;
      }
      .fail-info {
        position: absolute;
        padding: 0 10px;
        background: #f1f1f1;
        z-index: 111;
        width: 50px;
        height: 32px;
        background: #f1f1f1;
        top: -11px;
        right: 50%;
        transform: translateX(50%);
      }
      .fail-icon {
        margin-left: 6px;
        margin-top: 3px;
        position: absolute;
        width: 20px;
        height: 20px;
        background: url('../../../assets/images/ic_wifi_wrong.png');
        background-size: 100% 100%;
      }
      .check-txt-info {
        position: absolute;
        width: 100%;
      }
      .testing {
        display: inline-block;
        font-size: 12px;
        text-align: center;
        width: 100%;
        min-width: 100px;
        font-weight: 200;
        color: #333333;
        position: absolute;
        bottom: 10px;
        right: 50%;
        transform: translateX(50%);
      }
    }
    .check-btn {
      height: 50px;
      width: 100px;
    }
    .speed {
      font-weight: 200;
      span {
        font-size: 24px;
        color: #000;
        font-weight: 400;
      }
    }
  }
  .router-info {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .row {
      width: 100%;
    }
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
      .extra {
        min-width: 140px;
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
        padding: 0 5px;
      }
      .unit {
        font-size: 14px;
        font-weight: normal;
        letter-spacing: -0.2px;
        color: #333333;
      }
      .note {
        font-size: 14px;
        letter-spacing: -0.1px;
        color: #999999;
        margin-left: 3px !important;
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
          background: url('../../../assets/images/ic_fast_upload.png') no-repeat;
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
        .t-dwon-icon {
          width: 20px;
          height: 29px;
          display: inline-block;
          background: url('../../../assets/images/ic_ic_download.png') no-repeat;
          background-size: 100% 100%;
        }
        .t-up-icon {
          width: 20px;
          height: 29px;
          display: inline-block;
          background: url('../../../assets/images/ic_upload.png') no-repeat;
          background-size: 100% 100%;
        }
        .t-count-icon {
          width: 36px;
          height: 36px;
          display: inline-block;
          background: url('../../../assets/images/ic_contact_advice.png')
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .term-flow-info {
      .speep-info {
        padding: 15px 0;
        div {
          text-align: left;
        }
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
            width: 2px;
            height: 70px;
            border: 1px solid #f1f1f1;
            right: 0;
          }
          width: 260px;
          display: flex;
          // height: 165px;
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
  .mesh-info {
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
    }
    width: 100%;
    min-height: 273px;
    background: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0 20px;
    .content {
      display: flex;
      min-height: 200px;
      align-items: center;
      flex-wrap: wrap;

      padding-top: 15px;
      :nth-child(1) {
        margin-left: 0 !important;
      }
    }
  }
}
@media screen and (min-width: 1367px) and (max-width: 1680px) {
  .home-container {
    .check-info {
      .check-status {
        width: 400px;
      }
    }

    .router-info {
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
  .home-container {
    .check-info {
      .check-status {
        width: 300px;
      }
    }
    .router-info {
      flex-direction: column;
      .item {
        width: 100% !important;
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1100px) {
  .check-info {
    .check-btn-info {
      width: 100%;
      text-align: center;
      margin-top: 40px;
    }
  }
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
  .home-container {
    .check-info {
      .check-status {
        width: 280px !important;
      }
    }
    .router-info {
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
  .home-container {
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
    .router-info {
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
      .term-flow-info {
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
    .check-info {
      .check-btn-info {
        width: 100%;
        text-align: center;
        margin-top: 40px;
      }
      .speed {
        span {
          font-size: 14px;
        }
      }
      .row-1 {
        width: 80px;
        font-size: 12px !important;
        justify-content: center;
        flex-flow: column-reverse;
        text-align: center !important;
        position: relative;
        .name {
          position: absolute;
          top: 100%;
        }
      }

      .row-3 {
        width: 80px;
        font-size: 12px !important;
        justify-content: center;
        flex-flow: column;
        margin: 0;
        text-align: center !important;
        position: relative;
        .speed {
          position: absolute;
          top: 100%;
        }
      }
      .network-icon {
        padding: 0 10px;
        img {
          display: inline-block;
          width: 40px;
        }
      }
      .router-icon {
        padding: 0 10px;
        img {
          display: inline-block;
          width: 28px;
          height: 37px;
        }
      }
      .check-status {
        width: calc(100% - 200px);
        .fail-info {
          width: 22px;
          top: -10px;
          padding: 0;
        }
        .fail-icon {
          width: 16px;
          height: 16px;
          margin-top: 3px;
          margin-left: 6px;
        }
        .success-line,
        .fail-line {
          min-width: 100px;
          &.testing-animation {
            background: none;
            &::after {
              content: '';
              width: 10%;
              display: block;
              height: 3px;
              background: url('../../../assets/images/ic_test_line.png')
                repeat-x;
              animation: speed-test-line linear 0.6s infinite;
            }
          }
        }
      }
    }
  }
}
</style>

