<template>
  <div class="home-container">
    <div class="check-info">
      <div class="row-1">
        <div class="name">{{ssid||'-'}}</div>
        <div class="router-icon"><img src="../../../assets/images/ic_router.png" alt=""></div>
      </div>
      <div class='check-status row-2'>
        <div class="check-txt-info">
          <span class='testing' v-if="isTesting"> {{$t('trans0298')}}...</span>
        </div>
        <span class="success-line" :class="{'testing-animation':isTesting}" v-if="isConnected || isTesting"></span>
        <span class='fail-line' v-if="isUnlinked ||isLinked"></span>
        <span class='fail-info' v-if="isUnlinked ||isLinked">
          <i class="fail-icon"></i>
        </span>
      </div>
      <div class="row-3">
        <div class="network-icon"><img src="../../../assets/images/ic_internet.png" alt=""></div>
        <div class="speed">
          <span>{{bandWidth(localTraffice.bandwidth)}}</span>M
        </div>
      </div>

    </div>
    <div class="test-speed-btn-container">
      <button class="btn check-btn" v-if="netStatus==='connected'" @click='createSpeedTimer()'>{{$t('trans0008')}}</button>
    </div>
    <div class="router-info">
      <div class="item">
        <div class="title">{{$t('trans0299')}}</div>
        <div class='message'>
          <div class="m-item">
            <label class="m-title">{{$t('trans0187')}}：</label>
            {{localRouterInfo.alias}}
          </div>
          <div class="m-item">
            <label class="m-title">{{$t('trans0300')}}：</label>
            {{localRouterInfo.version }}
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
            <label class="m-title">{{$t('trans0251')}}:</label>
            {{localRouterInfo.sn }}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="title">{{$t('trans0301')}}</div>
        <div class='message'>
          <div class="m-item">
            <label class="m-title">{{$t('trans0317')}}：</label>
            {{localNetInfo.type}}
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
                <span class="speed">{{format(localTraffice.traffic.dl).value}}</span>
                <span class='unit'> {{format(localTraffice.traffic.dl).unit}}</span>
              </p>
              <p class="note">{{$t('trans0309')}}</p>
            </div>
          </div>
          <div class="extra">
            <i class="t-up-icon"></i>
            <div>
              <p>
                <span class="speed">{{format(localTraffice.traffic.ul).value}}</span>
                <span class='unit'> {{format(localTraffice.traffic.ul).unit}}</span>
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
    <div class='mesh-info'>
      <div class="title">{{$t('trans0312')}}</div>
      <div class="content">
        <div v-for="item in meshNode" class="mesh" :class="diffMesh(item)">

          <div class="message">
            <img src="../../../assets/images/ic_plug_m2.png" alt="" v-if="item.model==='M2'">
            <img src="../../../assets/images/img_plug_Bee.png" alt="" v-if="item.model==='Bee'">
            <span>{{item.alias}}</span>
          </div>
          <div class="status">
            <img src="../../../assets/images/ic_plug_bad.png" alt="" v-if='item.rssi<-60'>
            <img src="../../../assets/images/ic_plug_fine.png" alt="" v-if='item.rssi<-50 && item.rssi>-60'>
            <img src="../../../assets/images/ic_plug_good.png" alt="" v-if='item.rssi>=-50'>
          </div>
        </div>
      </div>
    </div>
    <div class='speed-model-info' v-if='speedModelOpen'>
      <div class="shadow"></div>
      <div class='speed-content'>
        <div v-if="speedStatus==='testing'">
          <div class="test-info"></div>
          <p>{{$t('trans0045')}}...</p>
        </div>
        <div v-if="speedStatus==='done'" class="speed-completed">
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
                  <span class="speed">{{bandWidth(localSpeedInfo.speed.down)}}</span>
                  <span class='unit'> M</span>
                </p>
                <p class="note">{{$t('trans0029')}}</p>
              </div>
            </div>
          </div>
          <div class="btn-info">
            <button class="cmp-btn" @click="closeSpeedModal">{{$t('trans0018')}}</button>
            <button class="re-btn" @click="createSpeedTimer()">{{$t('trans0279')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      netStatus: 'unlinked', // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      speedStatus: 'testing',
      speedModelOpen: false,
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
      timer5: null
    };
  },
  mounted() {
    this.testWan();
    this.getRouter();
    this.getNet();
    this.createTimer();
    this.getSsid();
  },
  computed: {
    isTesting() {
      return this.netStatus === 'testing';
    },
    isConnected() {
      return this.netStatus === 'connected';
    },
    isLinked() {
      return this.netStatus === 'linked';
    },
    isUnlinked() {
      return this.netStatus === 'unlinked';
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
    format(v) {
      const units = ['KB', 'MB'];
      let index = -1;
      if (!isNaN(v)) {
        v /= 8;
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
    bandWidth(v) {
      return !isNaN(v) ? (v / (1024 * 1024)).toFixed(1) : v;
    },
    closeSpeedModal() {
      this.speedModelOpen = false;
      this.restoryOverflow();
    },
    setOverflow() {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    },
    restoryOverflow() {
      document.body.style.overflow = this.bodyOverflow || 'auto';
    },

    macFormat(v) {
      return v.length > 2 ? v.match(/.{2}/g).join(':') : v;
    },
    createTimer() {
      this.getTraffic();
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
      this.$http.getMeshData().then(res => {
        this.ssid = res.data.result.ssid;
      });
    },
    speedTesting() {
      this.$http
        .speedTesting()
        .then(res => {
          if (res.status === 200) {
            this.speedStatus = res.data.result.status;
            this.speedInfo = res.data.result;
            if (res.data.result.status === 'done') {
              clearInterval(this.timer4);
            }
          }
        })
        .catch(() => {
          clearInterval(this.timer4);
        });
    },
    createSpeedTimer() {
      this.speedModelOpen = true;
      this.speedStatus = 'testing';
      this.setOverflow();
      this.speedTesting();
      this.timer4 = setInterval(() => {
        this.speedTesting();
      }, 1000 * 5);
    },
    getTraffic() {
      clearTimeout(this.timer1);
      this.timer1 = null;
      this.$http
        .getTraffic()
        .then(res => {
          if (this.enter) {
            this.traffice = res.data.result;
            this.timer1 = setTimeout(() => {
              this.getTraffic();
            }, 1000 * 15);
          }
        })
        .catch(() => {
          if (this.enter) {
            this.timer1 = setTimeout(() => {
              this.getTraffic();
            }, 1000 * 15);
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
            }, 1000 * 20);
          }
        })
        .catch(() => {
          if (this.enter) {
            this.timer2 = setTimeout(() => {
              this.getDeviceCount();
            }, 1000 * 20);
          }
        });
    },
    getMeshNode() {
      clearTimeout(this.timer3);
      this.timer3 = null;
      this.$http
        .getMeshNode()
        .then(res => {
          this.meshNode = res.data.result;
          if (this.enter) {
            this.timer3 = setTimeout(() => {
              this.getMeshNode();
            }, 1000 * 30);
          }
        })
        .catch(() => {
          if (this.enter) {
            this.timer3 = setTimeout(() => {
              this.getMeshNode();
            }, 1000 * 30);
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
          if (error.response && error.response.status === 401) {
            this.timer5 = setTimeout(() => {
              this.getRouter();
            }, 1000 * 3);
          }
        });
    },
    getNet() {
      this.$http.getNet({ type: 'wan' }).then(res => {
        this.netInfo = res.data.result;
      });
    },
    testWan() {
      this.netStatus = 'testing';
      const timer = setTimeout(() => {
        this.$http
          .testWan()
          .then(res => {
            clearTimeout(timer);
            this.netStatus = res.data.result.status;
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = 'unlinked';
          });
      }, 1000);
    },

    diffMesh(item) {
      let className = '';
      if (item) {
        if (item.rssi >= -50) {
          className = 'signal-3';
        }
        if (item.rssi < -50 && item.rssi > -60) {
          className = 'signal-2';
        }
        if (item.rssi < -60) {
          className = 'signal-1';
        }
        className = `${className} ${item.is_gw && 'main'}`;
      }
      return className;
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
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.1;
  }
  60% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
.home-container {
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
    @keyframes speed-testing {
      0% {
        background: url('../../../assets/images/img_test_01.png') no-repeat;
        background-size: 100% 100%;
      }
      50% {
        background: url('../../../assets/images/img_test_02.png') no-repeat;
        background-size: 100% 100%;
      }
      100% {
        background: url('../../../assets/images/img_test_03.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .speed-content {
      text-align: center;
      .test-info {
        background: url('../../../assets/images/img_test_01.png') no-repeat;
        background-size: 100%;
        width: 330px;
        height: 330px;
        animation: speed-testing 1s linear infinite;
      }
      p {
        color: #ffffff;
        font-size: 16px;
        font-weight: 200;
      }
      .speed-completed {
        width: 600px;
        min-height: 265px;
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
              width: 25px;
              height: 34px;
              display: inline-block;
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
              margin-right: 5px;
            }
            .p-up-icon {
              width: 25px;
              height: 34px;
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
              padding: 0 3px;
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
  padding: 0 30px;
  padding-bottom: 30px;
  .check-info {
    .btn-info {
      width: 100%;
      text-align: center;
    }
    .row-1 {
      display: flex;
      max-width: 200px;
      align-items: center;
    }
    .row-3 {
      max-width: 200px;
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100%;

    flex-wrap: wrap;
    .name {
      //   font-weight: bold;
    }
    .network-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 55px;
        height: 55px;
      }
    }
    .router-icon {
      padding: 0 20px;
      img {
        display: inline-block;
        width: 40px;
        height: 55px;
      }
    }
    .check-status {
      flex: 1;
      max-width: 440px;
      min-width: 150px;
      min-height: 60px;
      position: relative;
      .success-line {
        position: absolute;
        max-width: 440px;
        min-width: 150px;
        width: 100%;
        height: 3px;
        border: 2px dashed #4237dd;
        box-sizing: border-box;

        &.testing-animation {
          border: none;
          &::after {
            content: '';
            display: block;
            border: 2px dashed #4237dd;
            animation: speed-test-line linear 1s infinite;
          }
        }
        //animation: speed-test-line 1s linear 2s infinite;
      }
      .fail-line {
        position: absolute;
        max-width: 440px;
        min-width: 150px;
        width: 100%;
        height: 3px;
        border: 2px dashed #999999;
        box-sizing: border-box;
      }
      .fail-info {
        position: absolute;
        padding: 0 10px;
        background: #f1f1f1;
        z-index: 111;
        width: 57px;
        height: 32px;
        // padding: 10px;
        background: #f1f1f1;
        top: 13px;
        right: 50%;
        transform: translateX(50%);
      }
      .fail-icon {
        position: absolute;
        width: 37px;
        height: 31px;
        background: url('../../../assets/images/ic_wifi_wrong.png');
        background-size: 100% 100%;
      }
      .check-txt-info {
        position: relative;
        min-height: 30px;
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
        // top: -24px;
        right: 50%;
        transform: translateX(50%);
      }
    }
    .check-btn {
      // margin-left: 30px;
      height: 50px;
      width: 160px;
    }
    .speed {
      font-weight: 200;
      // margin-right: 20px;
      span {
        font-size: 24px;
        color: #000;
        padding-right: 5px;
        font-weight: 400;
      }
    }
  }
  .router-info {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .item {
      // min-width: 400px;
      width: calc(50% - 10px);
      min-height: 220px;
      overflow: hidden;
      background: white;
      margin-bottom: 20px;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 0 20px;
      .extra {
        min-width: 140px;
        // text-align: left;
      }
      .title {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        padding: 15px 0;
        border-bottom: 1px solid #f1f1f1;
      }
      .speed {
        font-size: 26px;
        font-weight: bold;
        padding: 0 3px;
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
        padding-top: 10px;
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
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        min-height: 165px;
        div {
          display: inline-block;
          flex: 1;
          text-align: center;
          // min-width: 200px;
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
          width: 25px;
          height: 34px;
          display: inline-block;
          background: url('../../../assets/images/ic_ic_download.png') no-repeat;
          background-size: 100% 100%;
        }
        .t-up-icon {
          width: 25px;
          height: 34px;
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
        div {
          text-align: left;
        }
      }
    }
    .real-time-network {
      .content {
        display: flex;
        flex-wrap: wrap;
        min-height: 165px;
        .real-wrap {
          min-width: 270px;
          min-height: 60px !important;
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
            color: #999999;
            font-weight: 200;
            border: none;
          }
          .down {
            .r-dwon-icon {
              width: 12px;
              height: 16px;
              display: inline-block;
              background: url('../../../assets/images/ic_ic_download.png')
                no-repeat;
              background-size: 100% 100%;
            }
          }
          .up {
            padding-top: 15px;

            .r-up-icon {
              width: 12px;
              height: 16px;
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
      justify-content: flex-start;
      :nth-child(1) {
        margin-left: 0 !important;
      }
      .mesh {
        width: 220px;
        height: 120px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 20px;
        border-radius: 6px;
        overflow: hidden;
        display: flex;

        &.signal-3 {
          background: linear-gradient(to left bottom, #20e779, #19d191);
        }
        &.signal-2 {
          background: linear-gradient(to left bottom, #0089ff, #05befe);
        }
        &.signal-1 {
          background: linear-gradient(to left bottom, #ff9575, #ff527a);
        }
        .message {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 20px;
          width: 50%;
          img {
            width: 32px;
            // height: 29px;
          }
          span {
            font-size: 14px;
            color: white;
            padding-top: 10px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .status {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 60px;
            // height: 60px;
          }
        }
      }
      .main {
        width: 260px;
        margin-top: 10px;
        margin-right: 40px;
        display: flex;
        .message {
          img {
            width: 40px;
            // height: 55px;
          }
        }
        .status {
          img {
            width: 80px;
            // height: 80px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1068px) {
  .check-info {
    padding-bottom: 30px;
  }
  .row-1 {
    width: 120px;
    justify-content: center;
    flex-flow: column-reverse;
    .name {
      padding-top: 6px;
    }
  }
  .row-3 {
    width: 120px;
    flex-flow: column;
  }
}
@media screen and (max-width: 1220px) {
  .router-info {
    flex-direction: column;
    .item {
      width: 100% !important;
    }
  }
}
@media screen and (max-width: 540px) {
  .home-container {
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
              min-width: 120px;

              // padding-right: 10px;
              padding-bottom: 20px;
            }
          }
          width: 80%;
          margin: 0 auto;
          min-height: 265px !important;
        }
      }
    }
    .btn-info {
      width: 100%;
      margin-top: 20px;
      .btn {
        height: 44px;
      }
    }
    padding: 10px;
    padding-top: 30px;
    .router-info {
      .term-flow-info {
        .speep-info {
          .extra {
            text-align: left;
            .t-dwon-icon,
            .t-up-icon {
              width: 25px;
              height: 30px;
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
      .speed {
        // padding-top: 10px;
        span {
          font-size: 14px;
        }
      }
      .row-1 {
        width: 100px;
        font-size: 12px !important;
      }
      .row-3 {
        width: 100px;
        font-size: 12px !important;
        margin: 0;
      }
      .network-icon {
        padding: 0 10px;
        img {
          display: inline-block;
          width: 41px;
          height: 41px;
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
        min-width: 100px;
        .fail-info {
          width: 44px;
          top: 20px;
        }
        .fail-icon {
          width: 24px;
          height: 20px;
        }
        .success-line,
        .fail-line {
          min-width: 100px;
        }
      }
    }
  }
}
</style>

