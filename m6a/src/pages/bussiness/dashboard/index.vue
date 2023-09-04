<template>
  <div class="dashboard customized">
    <div class="net-info">
      <div class="device inner">
        <div class="card"
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
                       src="@/assets/images/icon/ic_local-device.svg"
                       alt="">
                  {{localDeviceInfo.name}}
                </div>
                <div class="other">
                  <div class="band">{{bandMap[`${localDeviceInfo.online_info.band}`] }}</div>
                  <div v-if="!isWired"
                       class="uptime">{{transformDate(localDeviceInfo.online_info.online_duration)}}
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
               :class="$store.state.deviceColor"></div>
          <div key="mesh-shadow"
               class="background-shadow"></div>
        </div>
        <div class="line-wrapper right"
             v-if="!isMobile">
          <div class="line"
               :class="{'testing':isTesting,'unconnected':(!isTesting && !isConnected)}">
            <div class="icon-unconnected-container"
                 @click.stop="showTips()">
            </div>
          </div>
        </div>
        <div class="mobile-icon-wrapper"
             v-if="isMobile">
          <span class="btn-icon"
                :class="{disabled:!meshGatewayInfo.name}"
                @click.stop="editMesh(meshGatewayInfo)">
            <i class="iconfont ic_edit"></i>
          </span>
          <span class="btn-icon">
            <m-loading v-if="isTesting"
                       class="mobile-wan-loading"
                       :id="'mobileWanLoading'"
                       :size="20"
                       :color="'#29b96c'"></m-loading>
            <div v-else
                 @click.stop="showTips()">
              <i class="iconfont ic_internet_light"></i>
              <i class="sub"
                 :class="{'connected':isConnected,'unconnected':!isConnected}"></i>
            </div>
          </span>
        </div>
      </div>
      <div class="internet inner">
        <div class="card"
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
                  <img src="@/assets/images/icon/ic_upload.webp"
                       alt="">
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
                  <img src="@/assets/images/icon/ic_download.webp"
                       alt="">
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
                   src="../../../assets/images/img-bridge.webp">
              <span>{{$t('trans0984')}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="functional">
        <div class="row-1">
          <div class="mesh-name">
            {{meshGatewayInfo.name?meshGatewayInfo.name:'-'}}
          </div>
          <span class="btn-icon"
                :class="{disabled:!meshGatewayInfo.name}"
                v-if="!isMobile"
                @click.stop="editMesh(meshGatewayInfo)">
            <i class="iconfont ic_edit"></i>
            <span class="icon-hover-popover">{{$t('trans0034')}}</span>
          </span>
        </div>
        <div class="row-2">
          <div class="model">{{ModelName}}</div>
          <div class="gateway">{{$t('trans0153')}}</div>
        </div>
        <div class="row-3">
          <button class="btn"
                  @click="forward2page('/dashboard/mesh')">
            <i class="iconfont icon-ic_devices_mesh_normal"></i>
            Mesh
          </button>
        </div>
      </div>
    </div>
    <div class="jump-app-info"
         v-if="isMobile"
         @click="jumpApp">
      <div class="wrapper">
        <div class="icon mercku">
          <img src="@/assets/images/customer/mercku/ic_launcher.png"
               alt="">
        </div>
        <div class="text-container">{{$t('trans1118')}}</div>
      </div>

    </div>
    <!-- mesh编辑弹窗 -->
    <m-modal :visible.sync="showMeshEditModal"
             :closeOnClickMask="false"
             class="edit-name-modal">
      <m-modal-body class="content">
        <m-form :model="form"
                class="form"
                :rules="rules"
                ref="form">
          <m-form-item prop="name">
            <m-editable-select :options="options"
                               :label="$t('trans0108')"
                               v-model="form.name"></m-editable-select>
          </m-form-item>
          <m-form-item prop="color">
            <div class="color-select">
              <h4 class="label">Device Color</h4>
              <ul class="color-select__wrapper">
                <li v-for="(color,index) in deviceColorArr"
                    :key="index"
                    class="limit-icon">
                  <div class="color"
                       :class="{selected:selectedColorName===color.name,'light-color':color.name===RouterColor.white}"
                       :style="{backgroundImage:color.value}"
                       @click="changeDeviceColor(color)">
                  </div>
                  <span class="hover-popover"> {{color.name}}</span>
                </li>
              </ul>
            </div>
          </m-form-item>
        </m-form>
        <div class="btn-inner">
          <button @click="closeMeshEditModal"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button @click="updateMehsNode(meshGatewayInfo,form.name)"
                  class="btn">{{$t('trans0024')}}</button>
        </div>
      </m-modal-body>
    </m-modal>
    <!-- 无网弹窗 -->
    <m-modal :visible.sync="tipsModalVisible">
      <m-modal-body>
        <div class="tip-modal">
          <div class="tip-modal__text markdown-body"
               v-html="tips"></div>
        </div>
      </m-modal-body>
      <m-modal-footer v-if="isRouter">
        <div class="form-button">
          <button class="btn btn-dialog-confirm"
                  @click="forward2page('/setting/wan')">{{$t('trans0601')}}</button>
        </div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import marked from 'marked';
import {
  WanNetStatus,
  M6aRouterSnModelVersion,
  RouterMode
} from 'base/util/constant';
import { compareVersion, formatDate } from 'base/util/util';
import meshEditMixin from '@/mixins/mesh-edit.js';

export default {
  mixins: [meshEditMixin],
  data() {
    return {
      netStatus: WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      pageActive: true,
      deviceLoading: true,
      meshLoading: true,
      ssid: '',
      deviceCount: '-',
      deviceCountTimer: null,
      wanInfoTimer: null,
      wanNetStatsTimer: null,
      tipsModalVisible: false,
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
    ModelName() {
      let modelName = '';
      switch (this.$store.state.modelID) {
        case M6aRouterSnModelVersion.M6a:
          modelName = 'M6a';
          break;
        case M6aRouterSnModelVersion.M6a_Plus:
          modelName = 'M6a Plus';
          break;
        default:
          break;
      }
      return modelName;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    ...(() => {
      const result = {};
      Object.keys(WanNetStatus).forEach(key => {
        const value = WanNetStatus[key];
        const prop = value.slice(0, 1).toUpperCase() + value.slice(1);
        result[`is${prop}`] = function temp() {
          return this.netStatus === value;
        };
      });
      return result;
    })(),
    isRouter() {
      return RouterMode.router === this.$store.state.mode;
    },
    tips() {
      return marked(this.$t('trans0574'), { sanitize: true });
    },
    isConnected() {
      return this.netStatus === WanNetStatus.connected;
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
    this.getMeshInfo();
    this.getWanNetInfo();
    this.createIntercvalTask();
    this.getWanStatus();
    this.getLocalDeviceInfo();
  },
  watch: {
    '$store.mode': function watcher() {
      console.log(`watch task...mode is:${this.$store.mode}`);
      this.clearIntervalTask();
      this.createIntercvalTask();
    },
    netStatus: {
      handler(val) {
        this.$store.state.isConnected = val === WanNetStatus.connected;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('from:', from.path);
      console.log('to:', to.path);
      const fromPath = from.path;
      console.log('from path is:', fromPath);
      if (fromPath.includes('login')) {
        // add a flag
        vm.needCheckUpgradable = true;
      }
    });
  },
  methods: {
    async checkFirmwareLatest() {
      try {
        const res = await this.$http.firmwareList(undefined, {
          hideToast: true
        });

        const nodes = res.data.result;
        const nodesToUpdate = nodes.filter(node => {
          const { current, latest } = node.version;
          return compareVersion(current, latest);
        });

        if (nodesToUpdate.length > 0) {
          await this.showFirmwareUpdateDialog();
        }
      } catch (error) {
        console.error('Error fetching firmware list:', error);
      }
    },
    async showFirmwareUpdateDialog() {
      try {
        await this.$dialog.confirm({
          okText: this.$t('trans0225'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0383'),
          callback: {
            ok: () => {
              this.$router.push({ path: '/upgrade/online' });
            }
          }
        });
      } catch (error) {
        console.error('Error showing firmware update dialog:', error);
      }
    },
    editMesh() {
      if (!this.meshGatewayInfo.name) return;
      this.form.name = this.meshGatewayInfo.name;
      this.showMeshEditModal = true;
    },
    showTips() {
      if (this.isConnected) {
        this.$toast(this.$t('trans1190'), 1500, 'success');
      } else if (!this.isTesting) {
        this.tipsModalVisible = true;
      }
    },
    forward2page(url) {
      this.$router.push({ path: url });
    },
    createIntercvalTask() {
      console.log(`createInterval task...mode is:${this.$store.state.mode}`);
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

        const gatewayInfo = meshNodeList.find(item => item.is_gw);
        if (gatewayInfo) {
          this.meshGatewayInfo.name = gatewayInfo.name;
          this.meshGatewayInfo.sn = gatewayInfo.sn;
        }
      } catch (error) {
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
        console.error('Error fetching device count:', error);
      } finally {
        if (this.pageActive) {
          this.deviceCountTimer = setTimeout(() => {
            this.getDeviceCount();
          }, 10000);
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
            if (
              this.isConnected &&
              this.pageActive &&
              this.needCheckUpgradable
            ) {
              this.checkFirmwareLatest();
            }
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
        console.log('selfInfo', selfInfo);
        this.localDeviceIP = selfInfo.ip;

        const params = { filters: [{ type: 'primary', status: ['online'] }] };
        const res2 = await this.$http.getDeviceList(params);
        const deviceList = res2.data.result;
        console.log(deviceList);

        const localDeviceInfoArr = deviceList.filter(
          item => item.ip === selfInfo.ip
        );
        console.log(localDeviceInfoArr);

        if (localDeviceInfoArr.length > 0) {
          [this.localDeviceInfo] = localDeviceInfoArr;
        }
      } catch (error) {
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
          this.wanInfoTimer = setTimeout(() => {
            this.getWanNetInfo();
          }, 1000 * 3);
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
          this.wanNetStatsTimer = setTimeout(() => {
            this.getWanNetStats();
          }, 10000);
        }
      } catch {
        if (this.pageActive) {
          this.wanNetStatsTimer = setTimeout(() => {
            this.getWanNetStats();
          }, 10000);
        }
      }
    },
    transformDate(date) {
      if (!date) {
        return '';
      }
      if (date < 0) {
        return '-';
      }
      const split = [3600 * 24, 3600, 60, 5];
      // 大于1天
      if (date > split[0]) {
        const now = new Date().getTime();
        return formatDate(now - date * 1000);
      }
      // 小于1天大于1小时
      if (date <= split[0] && date > split[1]) {
        return `${this.$t('trans0013').replace(
          '%d',
          parseInt(date / split[1], 10)
        )}`;
      }
      // 小于1小时大于1分钟
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace(
          '%d',
          parseInt(date / split[2], 10)
        )}`;
      }
      // 小于1分钟大于5秒
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(date, 10))}`;
      }
      return `${this.$t('trans0010')}`;
    },
    jumpApp() {
      if (!this.$store.state.isMobile) return;
      window.open(process.env.CUSTOMER_CONFIG.appDownloadUrl);
    }
  },
  beforeDestroy() {
    // clean up
    this.pageActive = false;
    this.clearIntervalTask();
  }
};
</script>
<style lang="scss" scoped>
h2,
h6 {
  padding: 0;
  margin: 0;
}
.btn-icon {
  margin: 0;
  font-weight: 500;
}
@keyframes speed-test-line {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
@keyframes circle-out-center {
  from {
    clip-path: circle(0%);
  }
  to {
    clip-path: circle(125%);
  }
}

[transition-style='out:circle:center'] {
  animation: 2.5s cubic-bezier(0.25, 1, 0.3, 1) 0.5s circle-out-center both;
}
.edit-name-modal {
  .content {
    display: flex;
    flex-direction: column;
    .select-container {
      width: 100%;
      .select-text {
        white-space: pre;
      }
    }
    .btn-inner {
      display: flex;
      justify-content: center;
      .btn {
        width: 120px;
        height: 42px;
        &:last-child {
          margin-left: 30px;
        }
      }
    }
  }
}
.tip-modal {
  width: 500px;
  text-align: center;
  .form-button {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
  .tip-modal__text {
    text-align: left;
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    width: auto;
  }
}
.dashboard {
  min-height: calc(780px - 65px - 60px);
  flex: auto;
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
        aspect-ratio: 1;
        max-width: 390px;
        min-width: 300px;
        max-height: 390px;
        min-height: 300px;
        padding: 20px;
        margin-top: -40px;
        border-radius: 20px;
        cursor: pointer;
        background-color: var(--common-card-bgc);
        box-shadow: var(--common-card-boxshadow);
        &::before {
          content: '';
          display: block;
          position: absolute;
          top: 28px;
          right: 15px;
          width: 3px;
          height: 3px;
          border-top: 2px solid #808080;
          border-right: 2px solid #808080;
          border-bottom: 2px solid transparent;
          border-left: 2px solid transparent;
          border-radius: 2px;
          transform: rotate(45deg);
          transition: border 0.3s;
          z-index: inherit;
        }
        &:hover {
          &::before {
            border-top-color: var(--primaryColor);
            border-right-color: var(--primaryColor);
          }
        }
      }
      .main-text {
        font-size: 18px;
      }
      .sub-text {
        font-size: 13px;
        font-weight: 500;
        color: var(--common-gery-color);
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
        font-size: 80px;
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
          }
          .uptime {
            color: var(--common-gery-color);
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
          aspect-ratio: 1;
          position: relative;
          z-index: 2;
        }
      }
      .background-shadow {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 0;
        transform: translate(-50%, -50%);
        z-index: 0;
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
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 2px;
              width: 100%;
              background: linear-gradient(
                to right,
                #29b96c 0%,
                #29b96c 50%,
                transparent 50%
              );
              background-size: 10px 2px;
              background-repeat: repeat-x;
              animation: speed-test-line linear 0.5s infinite;
            }
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
              background: var(--dashboard-unlinked-color);
              background-size: 10px 2px;
              background-repeat: repeat-x;
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
              width: 20px;
              height: 20px;
              background: var(--dashboard-unconnect-icon-background-color);
              z-index: 999;
              border-radius: 50%;
              cursor: pointer;
              &::before {
                content: '';
                display: block;
                height: 2px;
                border-radius: 2px;
                width: 10px;
                background: var(--text-default-color);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
              }
              &::after {
                content: '';
                display: block;
                height: 2px;
                border-radius: 2px;
                width: 10px;
                background: var(--text-default-color);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
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
          img {
            margin-bottom: 7px;
          }
        }
        &.download {
          align-items: flex-start;
          padding-top: 5%;
          img {
            margin-top: 7px;
          }
        }
      }
      .speed-wrap {
        flex: 1;
        .speed-num {
          font-size: 36px;
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
        color: var(--common-gery-color);
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
        background-color: var(--common-sub_card-bgc);
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
      grid-area: 2 / 2 / 3 / 3; /* 将盒子  放在第二行的第二列 */
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
        @media screen and (min-width: 1920px) {
          max-width: calc(550px - 46px);
        }
        margin: 0 auto;
        .mesh-name {
          width: fit-content;
          max-width: 100%;
          height: 45px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 30px;
          font-weight: 600;
          text-align: center;
        }
        .btn-icon {
          position: absolute;
          top: 50%;
          right: -5px;
          transform: translate(100%, -50%);
          width: 36px;
          height: 36px;
          .iconfont {
            font-size: 18px;
          }
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
@media screen and (max-width: 768px) {
  .dashboard {
    min-width: auto;
    min-height: auto;
    .net-info {
      display: flex;
      flex-direction: column;
      padding: 55px 20px 20px;
      .inner {
        .card {
          width: 100%;
          height: auto;
          max-width: 100%;
          min-width: auto;
          max-height: auto;
          min-height: auto;
          min-width: auto;
          min-height: auto;
          margin-top: 0;
          aspect-ratio: auto;
        }
      }
      .mesh {
        order: 1;
        position: relative;
        .wrapper {
          .router__img {
            max-width: auto;
            max-height: auto;
            min-width: auto;
            min-height: auto;
            width: 195px;
          }
        }
        .background-shadow {
          width: 375px;
          height: 135px;
        }
        .mobile-icon-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          .btn-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 25px;
            &:last-child {
              margin-bottom: 0;
            }
            &.connected {
            }
            .sub {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 17px;
              height: 17px;
              color: #fff;
              border-radius: 50%;
              box-sizing: border-box;
              border: 2px solid var(--logout-btn-bgc);
              overflow: hidden;
              &.connected {
                background: url(../../../assets/images/v3/icon/ic_mobile_connected.svg)
                  center no-repeat;
                background-size: contain;
              }
              &.unconnected {
                background: url(../../../assets/images/v3/icon/ic_mobile_unconnect.svg)
                  center no-repeat;
                background-size: contain;
              }
            }
          }
        }
      }
      .functional {
        order: 2;
        margin-top: 0;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .row-1 {
          max-width: 90%;
          .mesh-name {
            font-size: 18px;
            height: auto;
          }
        }
        .row-2 {
          > div {
            font-size: 12px;
          }
        }
        .row-3 {
          width: 100%;
          margin-top: 10px;
          .btn {
            width: 50%;
            height: 44px;
          }
        }
      }
      .device {
        order: 3;
        justify-content: center;
        margin-bottom: 20px;
        .card {
          grid-template-columns: 4fr 1fr;
          grid-template-rows: 50px 1fr;
          grid-template-areas:
            'cardTitle cardTitle'
            'deviceInfo deviceNums';
        }
        .row-1 {
          grid-area: cardTitle;
        }
        .row-2 {
          grid-area: deviceNums;
          text-align: -webkit-right;
          .devices-num {
            font-size: 36px;
            position: static;
            transform: translateX(0);
            max-width: 65px;
            text-align: right;
          }
        }
        .row-3 {
          grid-area: deviceInfo;
          .deviceLoading {
            position: absolute;
            top: 40%;
            left: 40%;
          }
          .info {
            max-width: 220px;
            min-width: auto;
            margin: 0;
            align-items: flex-start;
          }
          .other {
            width: 100%;
            justify-content: flex-start;
            font-size: 12px;
          }
        }
      }
      .internet {
        order: 4;
        justify-content: center;
        .card {
          grid-row-gap: 15px;
        }
        .speed {
          display: flex;
          .speed-info {
            flex: 1;
            width: auto;
            height: auto;
            padding: 0;
            margin: 0;
            flex-direction: column;
            align-items: flex-start;
          }
          .speed-num {
            font-size: 30px;
          }
          .speed-unit {
            font-size: 18px;
          }
        }
        .bridge-mode-tip {
          font-size: 16px;
          margin-top: 0;
          span {
            margin: 30px 0;
          }
        }
      }
    }
    .jump-app-info {
      padding: 0 20px;
      width: 100%;
      .wrapper {
        position: relative;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: flex-end;
        border-radius: 20px;
        padding: 0 5px 0 20px;
        background-color: rgba(171, 171, 171, 0.2);
        margin-bottom: 20px;
      }
      .text-container {
        color: var(--text-default-color);
        flex: 1;
      }
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 374px) {
  .dashboard {
    .net-info {
      .inner {
        .card {
          padding: 10px 8px;
        }
      }
      .device {
        .row-3 {
          .info {
            max-width: 150px;
          }
        }
      }
    }
    .jump-app-info {
      .wrapper {
        padding: 0 0 0 8px;
      }
    }
  }
}
</style>
