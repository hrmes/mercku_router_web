<template>
  <div class="dashboard customized">
    <div class="net-info">
      <div class="device inner">
        <div class="card"
             data-e2e="dashboard-device-card"
             @click="forward2page('/dashboard/device/primary')">
          <div class="row-1">
            <h2 class="main-text">{{$t('trans0174')}}</h2>
          </div>
          <div class="row-2">
            <div class="devices-num">{{deviceCount}}</div>
          </div>
          <div class="row-3">
            <div class="current-device-info"
                 :class="{'empty':!localDeviceInfo.online_info.band}">
              <m-loading v-if="deviceLoading"
                         :id="'deviceLoading'"
                         :color="'#29b96c'"
                         :size='20'
                         class="deviceLoading"></m-loading>
              <div v-else
                   class="info">
                <div class="device-name"
                     :title="localDeviceInfo.name">
                  <img class="current-device-icon"
                       :src="require('base/assets/images/icon/ic_local-device.svg')" />
                  {{localDeviceInfo.name}}
                </div>
                <div class="other">
                  <div class="band"
                       :class="{'wired':isWired}">
                    {{bandMap[`${localDeviceInfo.online_info.band}`] }}</div>
                  <div class="uptime">{{transformDate(localDeviceInfo.online_info.online_duration)}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mesh inner">
        <div class="line-wrapper left"
             v-if="!isMobile">
          <div class="line"></div>
        </div>
        <div class="wrapper">
          <div class="router__img"
               :class="[$store.state.deviceColor]"></div>
          <div key="mesh-shadow"
               class="background-shadow"></div>
        </div>
        <div class="line-wrapper right"
             v-if="!isMobile">
          <div class="line"
               :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
            <div v-if="(!isTesting && !isConnected)"
                 class="icon-unconnected-container"
                 @click.stop="showTips()">
              <img :src="require('base/assets/images/icon/ic_default_error.png')" />
            </div>
          </div>
        </div>
      </div>
      <div class="internet inner">
        <div class="card"
             data-e2e="dashboard-internet-card"
             @click="forward2page('/dashboard/internet')">
          <div class="row-1">
            <h2 class="main-text">{{$t('trans0366')}}</h2>
            <h6 class="sub-text internet-type">{{networkTypeArr[netInfo.type]}}</h6>
          </div>
          <div class="row-2">
            <div v-if="isRouter"
                 class="speed">
              <div class="speed-info upload">
                <div class="speed-icon-wrap">
                  <img :src="require('base/assets/images/icon/ic_upload.png')" />
                </div>
                <div class="speed-wrap">
                  <div>
                    <span class="speed-num">{{realtimeSpeedUp.value}}</span>
                    <span class="speed-unit">{{realtimeSpeedUp.unit}}</span>
                  </div>
                  <div class="text-wrap">{{$t('trans0006')}}</div>
                </div>
              </div>
              <div class="speed-info download">
                <div class="speed-icon-wrap">
                  <img :src="require('base/assets/images/icon/ic_download.png')" />
                </div>
                <div class="speed-wrap">
                  <div>
                    <span class="speed-num">{{realtimeSpeedDown.value}}</span>
                    <span class="speed-unit">{{realtimeSpeedDown.unit}}</span>
                  </div>
                  <div class="text-wrap">{{$t('trans0007')}}</div>
                </div>
              </div>
            </div>
            <div v-else
                 class="bridge-mode-tip">
              <img v-if="!isMobile"
                   :src="require('base/assets/images/common/img_bridge.png')" />
              <span>{{$t('trans0984')}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="functional"
           data-e2e="dashboard-functional-panel">
        <div class="row-1">
          <div class="mesh-name"
               :title="meshGatewayInfo.name">
            {{meshGatewayInfo.name?meshGatewayInfo.name:'-'}}
          </div>
        </div>
        <div class="row-2">
          <div class="model">{{productName}}</div>
          <div class="gateway">{{$t('trans0153')}}</div>
        </div>
        <div class="row-3">
          <button class="btn"
                  data-e2e="dashboard-mesh-action"
                  @click="forward2page('/dashboard/mesh')">
            <i class="iconfont icon-ic_devices_mesh_normal"></i>
            Mesh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { WanNetStatus, RouterMode } from 'base/util/constant';
import { compareVersion, formatDate } from 'base/util/util';
// TODO(Task 9): migrate mesh-edit mixin (uses process.env.MODEL_CONFIG.id
// and process.env.CUSTOMER_CONFIG.routers). For now the mesh edit modal is
// omitted — the sample chain (login → dashboard → wlan → mode → unconnect)
// does not exercise it.

export default {
  data() {
    return {
      netStatus: WanNetStatus.unlinked,
      pageActive: true,
      deviceLoading: true,
      meshLoading: true,
      deviceCount: '-',
      deviceCountTimer: null,
      wanInfoTimer: null,
      wanNetStatsTimer: null,
      localDeviceInfo: {
        name: this.$t('trans0278'),
        online_info: {
          band: '',
          online_duration: ''
        }
      },
      meshGatewayInfo: {
        name: '',
        sn: ''
      },
      netInfo: {
        type: '-',
        realUp: 0,
        realDown: 0
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
        auto: this.$t('trans0696')
      }
    };
  },
  computed: {
    productName() {
      // Profile-driven: branding.productName replaces the legacy
      // CUSTOMER_CONFIG.routers[ModelIds[MODEL_CONFIG.id]].shortName lookup.
      return this.$store.getters.branding.productName || 'Router';
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    isRouter() {
      return RouterMode.router === this.$store.state.mode;
    },
    isConnected() {
      return this.netStatus === WanNetStatus.connected;
    },
    isTesting() {
      return this.netStatus === WanNetStatus.testing;
    },
    isWired() {
      return this.localDeviceInfo.online_info.band === 'wired';
    },
    realtimeSpeedUp() {
      return this.formatSpeed(this.netInfo.realUp);
    },
    realtimeSpeedDown() {
      return this.formatSpeed(this.netInfo.realDown);
    }
  },
  mounted() {
    this.getWanNetInfo();
    this.createIntercvalTask();
    this.getWanStatus();
    this.getLocalDeviceInfo();
    this.getMeshInfo();
  },
  watch: {
    '$store.state.mode': function watcher() {
      this.clearIntervalTask();
      this.createIntercvalTask();
    },
    netStatus: {
      handler(val) {
        this.$store.commit('setIsConnected', val === WanNetStatus.connected);
      }
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
  },
  methods: {
    forward2page(url) {
      this.$router.push({ path: url });
    },
    createIntercvalTask() {
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
    async getMeshInfo() {
      try {
        this.meshLoading = true;
        const res1 = await this.$http.getMeshNode();
        const meshNodeList = res1.data.result;
        if (meshNodeList.length === 0) {
          setTimeout(() => { this.getMeshInfo(); }, 1500);
          return;
        }
        const gatewayInfo = meshNodeList.find(item => item.is_gw);
        if (gatewayInfo) {
          this.meshGatewayInfo.name = gatewayInfo.name;
          this.meshGatewayInfo.sn = gatewayInfo.sn;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching mesh info:', error);
      } finally {
        this.meshLoading = false;
      }
    },
    async getDeviceCount() {
      clearTimeout(this.deviceCountTimer);
      try {
        const res = await this.$http.getDeviceCount({
          filters: [
            { type: 'primary', status: ['online'] },
            { type: 'guest', status: ['online'] }
          ]
        });
        this.deviceCount = res.data.result.count;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching device count:', error);
      } finally {
        if (this.pageActive) {
          this.deviceCountTimer = setTimeout(() => { this.getDeviceCount(); }, 10000);
        }
      }
    },
    getWanStatus() {
      this.netStatus = WanNetStatus.testing;
      const timer = setTimeout(() => {
        this.$http
          .getWanStatus()
          .then(res => {
            clearTimeout(timer);
            this.netStatus = res.data.result.status;
          })
          .catch(() => {
            clearTimeout(timer);
            this.netStatus = WanNetStatus.unlinked;
          });
      }, 1000);
    },
    async getLocalDeviceInfo() {
      try {
        this.deviceLoading = true;
        const res1 = await this.$http.getLocalDevice();
        const selfInfo = res1.data.result;
        const params = { filters: [{ type: 'primary', status: ['online'] }] };
        const res2 = await this.$http.getDeviceList(params);
        const deviceList = res2.data.result;
        const localDeviceInfoArr = deviceList.filter(item => item.ip === selfInfo.ip);
        if (localDeviceInfoArr.length > 0) {
          [this.localDeviceInfo] = localDeviceInfoArr;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching local device info:', error);
      } finally {
        this.deviceLoading = false;
      }
    },
    async getWanNetInfo() {
      try {
        const res = await this.$http.getWanNetInfo();
        this.netInfo.type = res.data.result.type || '-';
        clearTimeout(this.wanInfoTimer);
        this.wanInfoTimer = null;
      } catch {
        if (!this.wanInfoTimer) {
          this.wanInfoTimer = setTimeout(() => { this.getWanNetInfo(); }, 1000 * 3);
        }
      }
    },
    async getWanNetStats() {
      clearTimeout(this.wanNetStatsTimer);
      try {
        const res = await this.$http.getWanNetStats();
        if (this.pageActive) {
          this.netInfo.realUp = res.data.result.speed.realtime.up;
          this.netInfo.realDown = res.data.result.speed.realtime.down;
          this.wanNetStatsTimer = setTimeout(() => { this.getWanNetStats(); }, 10000);
        }
      } catch {
        if (this.pageActive) {
          this.wanNetStatsTimer = setTimeout(() => { this.getWanNetStats(); }, 10000);
        }
      }
    },
    transformDate(date) {
      if (!date) return '';
      if (date < 0) return '-';
      const split = [3600 * 24, 3600, 60, 5];
      if (date > split[0]) {
        const now = new Date().getTime();
        return formatDate(now - date * 1000);
      }
      if (date <= split[0] && date > split[1]) {
        return `${this.$t('trans0013').replace('%d', parseInt(date / split[1], 10))}`;
      }
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace('%d', parseInt(date / split[2], 10))}`;
      }
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(date, 10))}`;
      }
      return `${this.$t('trans0010')}`;
    },
    showTips() {
      if (this.isConnected) {
        this.$toast(this.$t('trans1190'), 1500, 'success');
      }
    },
    formatSpeed(value) {
      // TODO: wire Vue.prototype.formatSpeed via i18n.toLocaleNumber once
      // locale messages are loaded (Task 9). For now return raw value.
      return { value: value || 0, unit: '' };
    }
  }
};
</script>
<style lang="scss" scoped>
h2,
h4,
h6 {
  padding: 0;
  margin: 0;
}
@import '~base/style/mixin.scss';

$img_folder: '~base/assets/images';

.dashboard {
  min-height: calc(780px - 65px - 60px);
  flex: 1;
  .net-info {
    display: grid;
    grid-template-rows: 85% 15%;
    grid-template-columns: 1fr 1.1fr 1fr;
    grid-column-gap: 2%;
    width: 100%;
    height: 100%;
    padding: 0 5%;
    .inner {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2;
      .card {
        display: grid;
        position: relative;
        width: 90%;
        aspect-ratio: 1/1;
        max-width: 390px;
        min-width: 300px;
        max-height: 390px;
        min-height: 300px;
        padding: 20px;
        margin-top: -40px;
        border-radius: 20px;
        cursor: pointer;
        background-color: var(--common_card-bgc);
        box-shadow: var(--common_card-boxshadow);
      }
      .main-text {
        font-size: 18px;
      }
      .sub-text {
        font-size: 13px;
        font-weight: 500;
        color: var(--common_gery-color);
      }
    }
    .device {
      justify-content: flex-end;
      .card {
        grid-template-columns: 100%;
        grid-template-rows: 50px 2.5fr 1fr;
      }
      .row-2,
      .row-3 {
        position: relative;
      }
      .devices-num {
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 90px;
        font-weight: 600;
        font-family: 'DINAlternate', sans-serif;
        text-align: center;
      }
      .current-device-info {
        text-align: center;
        img {
          width: 16px;
          height: 16px;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 100%;
          min-width: 260px;
          max-width: 370px;
        }
        .device-name {
          position: relative;
          height: 24px;
          padding-left: 20px;
          font-size: 16px;
          font-weight: 500;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .current-device-icon {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-52%);
          }
        }
        .other {
          display: flex;
          justify-content: center;
          margin-top: 5px;
          .band {
            color: #fff;
            padding: 0 8px;
            margin-right: 10px;
            border-radius: 3px;
            background-image: linear-gradient(294deg, #1ad692 20%, #03aa56);
            &.wired {
              background-image: linear-gradient(294deg, #3da8ff 20%, #0c70b8);
            }
          }
          .uptime {
            color: var(--common_gery-color);
          }
        }
        &.empty {
          height: 100%;
        }
      }
    }
    .mesh {
      position: relative;
      justify-content: center;
      z-index: 1;
      .wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 0px;
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
        .router__img {
          width: 100%;
          min-width: 350px;
          max-width: 440px;
          position: relative;
          @include aspect(1, 1);
          z-index: 2;
        }
      }
      .background-shadow {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 0;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 40%;
        object-fit: contain;
        background-image: radial-gradient(
          circle at 50% 150%,
          rgba(130, 130, 130, 0.62),
          rgba(214, 214, 214, 0) 70%
        );
      }
      .line-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 25%;
        z-index: 9999;
        &.left {
          left: -15px;
        }
        &.right {
          right: -15px;
        }
        .line {
          width: 100%;
          height: 3px;
          background-color: #29b96c;
          margin: 0 auto;
          border-radius: 20px;
          &.testing {
            position: relative;
            background: none;
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
              height: 3px;
              width: 100%;
              background: var(--dashboard_unlinked-color);
              border-radius: 20px;
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
              width: 30px;
              height: 30px;
              background: var(--dashboard_unconnect_icon-bgc);
              z-index: 999;
              border-radius: 50%;
              cursor: pointer;
              & > img {
                width: 60%;
                height: 60%;
              }
            }
          }
        }
      }
    }
    .internet {
      justify-content: flex-start;
      .card {
        grid-template-columns: 100%;
        grid-template-rows: 50px 1fr;
      }
      .speed {
        width: 100%;
        height: 100%;
      }
      .speed-info {
        display: flex;
        width: 100%;
        height: 50%;
        padding-left: 10%;
        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
        &.upload {
          align-items: flex-end;
          padding-bottom: 5%;
        }
        &.download {
          align-items: flex-start;
          padding-top: 5%;
        }
      }
      .speed-wrap {
        flex: 1;
        .speed-num {
          font-size: 40px;
          margin-right: 6px;
          font-weight: 600;
          line-height: 1;
          font-family: 'DINAlternate', sans-serif;
        }
        .speed-unit {
          font-size: 24px;
          line-height: 1;
        }
      }
      .text-wrap {
        color: var(--common_gery-color);
      }
      .bridge-mode-tip {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 95%;
        margin-top: 5%;
        border-radius: 5px;
        font-size: 16px;
        background-color: var(--common_sub_card-bgc);
        img {
          width: 120px;
          height: 120px;
          margin-bottom: 10px;
        }
      }
    }
    .functional {
      position: relative;
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 1fr 30px 1.2fr;
      grid-area: 2 / 2 / 3 / 3;
      width: 100%;
      height: 140%;
      margin-top: -11%;
      z-index: 5;
      .row-1 {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        max-width: calc(400px - 46px);
        margin: 0 auto;
        .mesh-name {
          width: fit-content;
          max-width: 100%;
          height: 45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 28px;
          font-weight: 600;
          text-align: center;
        }
      }
      .row-2 {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        color: #fff;
        font-family: Helvetica;
        font-size: 16px;
        font-weight: bold;
        > div {
          border-radius: 5px;
          padding: 1px 8px;
          margin-right: 5px;
          &:last-child {
            margin: 0;
          }
        }
        .model {
          background-image: linear-gradient(117deg, #97006a, #f45199 100%);
        }
        .gateway {
          background-image: linear-gradient(97deg, #50cc83 6%, #3cc146 90%);
        }
      }
      .row-3 {
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 240px;
          font-weight: 700;
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
