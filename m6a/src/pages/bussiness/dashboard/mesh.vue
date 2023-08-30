<template>
  <div class="mesh-container">
    <div class="mesh-info">
      <div class="back-wrap">
        <div class="btn-container"
             @click="onBack($route.meta.parentPath)">
          <i class="iconfont ic_back_large"></i>
        </div>
        <div class="text-container">{{pageName}}</div>
      </div>
      <div class="content">
        <div class="topo-container"
             :class="{'show-table':showTable}">
          <div class="legend-wrap">
            <span class="btn-icon"
                  @click="resetChartPosition">
              <i class=" iconfont ic_center"></i>
            </span>
            <div class="info">
              <div class="legend">
                <div class="legend-item">{{$t('trans0193')}}</div>
                <div class="legend-item">{{$t('trans0196')}}</div>
                <div class="legend-item">{{$t('trans0214')}}</div>
              </div>
              <p class="legend-title">
                <span>{{$t('trans0302')}}</span>
                <i class="iconfont icon-ic_connection_quality icon-quality"
                   @click.stop="showRssiModal"></i>
              </p>
              <div class="legend-tx_power">
                <span>{{$t('trans1102')}}:</span>
                <m-loading v-if="!tx_power"
                           :id="'txpowerLoading'"
                           :size='18'
                           :color="'#29b96c'"
                           class="value loading"></m-loading>
                <span v-else
                      class="value text">{{txPowerMap[tx_power]}}</span>
              </div>
            </div>

          </div>
          <div class="topo-wrap"
               id="toppo-wrap">
            <div id="topo"></div>
          </div>
        </div>
        <transition name="fade-slide"
                    mode="out-in"
                    @after-leave="handleTransitionEnd">
          <div class="mesh-info-card"
               v-if="showTable">
            <div class="card-top">
              <div class="card-top__header">
                <span class="model-name info-label">{{modelName}}</span>
                <span class="gateway-label info-label"
                      v-if="isGateway">{{$t('trans0153')}}</span>
                <span class="connect-quality info-label"
                      :class="{'fair':connectQuality(selectedNodeInfo.color)===ConnectionQualityMap.fair,
                               'offline':connectQuality(selectedNodeInfo.color)===ConnectionQualityMap.offline
                              }"
                      v-if="!isGateway">{{connectQuality(selectedNodeInfo.color)}}</span>
                <span class="close btn-icon"
                      @click.stop="()=>showTable=false">
                  <i class="iconfont ic_close"></i>
                </span>
              </div>
              <div class="card-top__main">
                <div class="model__img"></div>
                <div class="mesh-router__info">
                  <div class="row-1">
                    <div class="line-icon"
                         :class="{'m6a_plus':modelID===M6aRouterSnModelVersion.M6a_Plus}"></div>
                    <span class="text"
                          :title="selectedNodeInfo.name">{{selectedNodeInfo.name}}</span>
                  </div>
                  <div class="row-2">
                    <span class="label">{{$t('trans0251')}}: </span>
                    <span class="value">{{selectedNodeInfo.sn}}</span>
                  </div>
                  <div class="row-3">
                    <span class="label">{{$t('trans0300')}}: </span>
                    <span class="value">{{selectedNodeInfo.version.current}}</span>
                  </div>
                  <div class="row-4">
                    <span class="label">{{$t('trans0151')}}: </span>
                    <span class="value">{{selectedNodeInfo.ip?selectedNodeInfo.ip:'-'}}</span>
                  </div>
                  <div class="row-5">
                    <span class="label">{{$t('trans0201')}}: </span>
                    <span class="value">{{formatMac(selectedNodeInfo.mac.lan) }}</span>
                  </div>
                </div>
                <div class="operation">
                  <span class="btn-icon"
                        v-if="!isRouterOffline(selectedNodeInfo)"
                        @click.stop="onClickRouterName(selectedNodeInfo)">
                    <i class="iconfont ic_edit"></i>
                    <span class="icon-hover-popover">{{$t('trans0034')}}</span>
                  </span>
                  <span class="btn-icon"
                        v-if="!isRouterOffline(selectedNodeInfo)"
                        @click.stop="rebootNode(selectedNodeInfo)">
                    <i class="iconfont ic_reboot"></i>
                    <span class="icon-hover-popover">{{$t('trans0122')}}</span>
                  </span>
                  <span class="btn-icon reset"
                        v-if="isGateway"
                        @click.stop="resetNode(selectedNodeInfo)">
                    <i class="iconfont ic_reset"></i>
                    <span class="icon-hover-popover">{{$t('trans0205')}}</span>
                  </span>
                  <span class="btn-icon"
                        v-if="!isGateway"
                        @click.stop="deleteNode(selectedNodeInfo)">
                    <i class="iconfont ic_trash"></i>
                    <span class="icon-hover-popover">{{$t('trans0033')}}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="card-bottom">
              <div class="card-bottom__offline-tips"
                   v-if="isRouterOffline(selectedNodeInfo)">
                The device is offline
                <span>{{$t('trans0128')}}</span>
              </div>
              <div class="card-bottom__header">
                <div class="col-1">
                  <span>{{$t('trans0174')}}</span>
                  <span v-if="!isMobile">({{selectedNodeStationCount}})</span>
                </div>
                <div class="col-2"
                     v-if="!isMobile">{{$t('trans0184')}}</div>
                <div class="col-3"
                     v-if="!isMobile">{{$t('trans0375')}}</div>
              </div>
              <ul class="card-bottom__main"
                  v-if="selectedNodeInfo.stations.length>0">
                <li v-for="sta in selectedNodeInfo.stations"
                    :key="sta.ip">
                  <div class="col-1">
                    <span class="local-device"
                          v-if="isThisMachine(sta.ip)"></span>
                    <span>{{sta.name}}</span>
                  </div>
                  <div class="col-2">
                    <div>
                      <span v-if="isMobile">{{$t('trans0151')}}: </span>
                      <span>{{sta.ip}}</span>
                    </div>
                    <div>
                      <span v-if="isMobile">{{$t('trans0188')}}: </span>
                      <span>{{formatMac(sta.mac)}}</span>
                    </div>
                  </div>
                  <div class="col-3">
                    <span class="band"
                          :class="{'wired':isWired(sta.connected_network.band)}">{{bandMap[sta.connected_network.band]}}</span>
                    <span class="guest"
                          v-if="isGuest(sta.connected_network.type)"></span>
                  </div>
                </li>
              </ul>
              <ul class="card-bottom__empty"
                  v-else>
                <li>{{$t('trans0278')}}</li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 编辑设备名称弹窗 -->
    <m-modal :visible.sync="showModal"
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
        </m-form>
        <div class="btn-inner">
          <button @click="closeUpdateModal"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button @click="updateMehsNode(selectedNodeInfo,form.name)"
                  class="btn">{{$t('trans0024')}}</button>
        </div>
      </m-modal-body>
    </m-modal>
    <!-- 连接质量弹窗 -->
    <m-modal :visible.sync="rssiModalVisible"
             class="connect-quality-modal">
      <m-modal-header class="header">
        <span> {{$t('trans0128')}}</span>
      </m-modal-header>
      <m-modal-body>
        <div class="connect-quality-modal-contnet">
          <div class="examples">
            <div class="example error">
              <img src="@/assets/images/img_help_error.webp"
                   alt="">
              <div class="description">
                <span class="icon-circle">
                </span>
                <span>{{$t('trans0599')}}</span>
              </div>
            </div>
            <div class="example right">
              <img src="@/assets/images/img_help_right.webp"
                   alt="">
              <div class="description">
                <span class="icon-circle">
                </span>
                <span>{{$t('trans0598')}}</span>
              </div>
            </div>
          </div>
          <div class="markdown-body"
               v-html="rssiTips"></div>
        </div>
      </m-modal-body>
      <m-modal-footer>
        <div class="form-button">
          <button class="btn btn-dialog-confirm"
                  @click="closeRssiModal">{{$t('trans0024')}}</button>
        </div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import marked from 'marked';
import { formatMac } from 'base/util/util';
import {
  RouterStatus,
  Color,
  M6aRouterSnModelVersion
} from 'base/util/constant';
import meshEditMixin from '@/mixins/mesh-edit.js';
import genData from './topo';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph');

const GUEST = 'guest'; // 是否是访客
export default {
  mixins: [meshEditMixin],
  data() {
    return {
      rssiModalVisible: false,
      RouterStatus,
      formatMac,
      M6aRouterSnModelVersion,
      pageActive: true,
      meshNodeTimer: null,
      chart: null,
      routers: [],
      localDeviceIP: '',
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      },
      ConnectionQualityMap: {
        excellent: this.$t('trans0193'),
        fair: this.$t('trans0196'),
        offline: this.$t('trans0214')
      },
      txPowerMap: {
        high: this.$t('trans1089'),
        medium: this.$t('trans1090'),
        low: this.$t('trans1091')
      },
      tx_power: '',
      txPowerTimer: null,
      isDarkMode: false,
      showTable: false,
      selectedSN: '',
      selectedNodeInfo: null
    };
  },
  async mounted() {
    this.createIntervalTask();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        this.checkThemeMode(event.matches);
      });
    // 获取当前设备信息
    try {
      const selfInfo = await this.$http.getLocalDevice();
      this.localDeviceIP = selfInfo.data.result.ip;
    } catch {
      this.localDeviceIP = '';
    }
  },
  computed: {
    pageName() {
      return this.$t(this.$route.meta.text);
    },
    rssiTips() {
      return marked(this.$t('trans0595'), { sanitize: true });
    },
    isGateway() {
      return this.selectedNodeInfo?.is_gw;
    },
    selectedNodeStationCount() {
      return this.selectedNodeInfo.stations.length ?? '0';
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    currentTheme() {
      return this.$store.state.theme;
    },
    modelID() {
      return this.$store.state.modelID;
    },
    modelName() {
      const routerConfig = process.env.CUSTOMER_CONFIG.routers;
      const name =
        routerConfig[
          this.modelID === M6aRouterSnModelVersion.M6a_Plus ? 'M6a_plus' : 'M6a'
        ].shortName;
      return name;
    }
  },
  watch: {
    currentTheme: {
      handler(nv) {
        if (nv === 'dark') {
          this.isDarkMode = true;
        } else {
          this.isDarkMode = false;
        }
        if (this.routers.length !== 0) {
          this.drawTopo(this.routers);
        }
      },
      immediate: true
    }
  },
  methods: {
    onBack(target) {
      if (target) {
        this.$router.replace({ path: target });
      } else {
        this.$router.go(-1);
      }
    },
    // 是否是主机
    isThisMachine(ip) {
      return ip === this.localDeviceIP;
    },
    // 是否是访客
    isGuest(type) {
      return type === GUEST;
    },
    isWired(band) {
      return band === 'wired';
    },
    connectQuality(color) {
      let result = '';
      switch (color) {
        case Color.good:
          result = this.ConnectionQualityMap.excellent;
          break;
        case Color.bad:
          result = this.ConnectionQualityMap.fair;
          break;
        case Color.offline:
          result = this.ConnectionQualityMap.offline;
          break;
        default:
          break;
      }
      return result;
    },
    showRssiModal() {
      this.rssiModalVisible = true;
    },
    closeRssiModal() {
      this.rssiModalVisible = false;
    },
    isRouterOffline(router) {
      return router.status === RouterStatus.offline;
    },
    onClickRouterName(router) {
      this.form.name = router.name;
      this.showModal = true;
      this.clearIntervalTask();
    },
    deleteNode(router) {
      this.$dialog.confirm({
        okText: this.$t('trans0203'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0218'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .deleteMeshNode({ node: { sn: router.sn, mac: router.mac } })
              .then(() => {
                this.$loading.close();
                this.showTable = false;
                this.$toast(this.$t('trans0040'), 2000, 'success');
                this.routers = this.routers.filter(r => r.sn !== router.sn);
              });
          }
        }
      });
    },
    rebootNode(router) {
      this.$dialog.confirm({
        okText: this.$t('trans0122'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0121'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .reboot({ node_ids: [router.sn] })
              .then(() => {
                if (router.is_gw) {
                  this.$reconnect({
                    timeout: 90,
                    onsuccess: () => {
                      this.$router.push({ path: '/login' });
                    },
                    ontimeout: () => {
                      this.$router.push({ path: '/unconnect' });
                    }
                  });
                } else {
                  this.$toast(this.$t('trans0040'), 2000, 'success');
                  this.routers = this.routers.filter(r => r.sn !== router.sn);
                }
              })
              .finally(() => {
                this.$loading.close();
              });
          }
        }
      });
    },
    resetNode(router) {
      this.$dialog.confirm({
        okText: this.$t('trans0205'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0206'),
        callback: {
          ok: () => {
            this.$http.resetMeshNode({ node_ids: [router.sn] }).then(() => {
              this.$reconnect({
                timeout: 90,
                onsuccess: () => {
                  this.reset = false;
                  window.location.href = '/';
                },
                ontimeout: () => {
                  window.location.href = '/';
                }
              });
            });
          }
        }
      });
    },
    initChart() {
      const topoEl = document.getElementById('topo');
      this.chart = echarts.init(topoEl);
      this.chart.on('click', e => {
        const {
          data: { sn }
        } = e;
        const {
          data: {
            itemStyle: { color }
          }
        } = e;
        this.selectedSN = sn;
        // eslint-disable-next-line prefer-destructuring
        this.selectedNodeInfo = {
          ...this.routers.filter(route => route.sn === sn)[0],
          color
        };
        console.log(this.selectedNodeInfo);
        this.showTable = true;

        // 立即重新绘制图表，并在下一个更新周期前调整大小
        this.chart.resize();
        this.$nextTick(() => {
          this.chart.resize();
        });
      });
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    },
    // 定义一个函数，用于将图表复位到原始位置
    resetChartPosition() {
      this.chart.setOption({
        series: [
          {
            center: ['50%', '50%'] // 设置原始位置为中央，上下水平居中
          }
        ]
      });
    },
    drawTopo(routers) {
      // const oldRouters = this.routers;
      const data = genData(routers);

      data.nodes.forEach(n => {
        this.routers = routers.map(r => {
          if (n.sn === r.sn) {
            this.$set(r, 'image', n.symbol.replace('image://', ''));
            this.$set(r, 'color', n.itemStyle.color);
          }
          return r;
        });
      });

      // eslint-disable-next-line prefer-destructuring
      this.selectedNodeInfo = this.routers.filter(
        node => node.sn === this.selectedSN
      )[0];
      // 维持设备之前的附加属性
      // if (oldRouters.length > 0) {
      //   oldRouters.forEach(or => {
      //     const device = this.routers.find(nr => nr.sn === or.sn);
      //     if (device) {
      //       device.expand = or.expand;
      //     }
      //   });
      // }
      const option = {
        series: [
          {
            type: 'graph',
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: 3,
            cursor: 'pointer',
            roam: 'move',
            layout: 'circular',
            hoverAnimation: false,
            edgeLabel: {
              show: false
            },
            label: {
              normal: {
                show: true,
                position: 'bottom',
                distance: 10,
                backgroundColor: 'transparent',
                formatter: category => this.labelFormatter(category),
                rich: {
                  name: {
                    color: this.isDarkMode ? '#fff' : '#333'
                  },
                  stationCount: {
                    height: 18,
                    padding: [0, 4],
                    borderRadius: 5,
                    borderColor: this.isDarkMode ? '#161616 ' : '#fff',
                    borderWidth: 1.5,
                    color: '#333333',
                    backgroundColor: '#d8d8d8'
                  },
                  good: {
                    color: '#29b96c',
                    align: 'center',
                    fontSize: 13,
                    lineHeight: 30
                  },
                  bad: {
                    color: '#e4752d',
                    align: 'center',
                    fontSize: 13,
                    lineHeight: 30
                  },
                  offline: {
                    color: '#b3b3b3',
                    align: 'center',
                    fontSize: 13,
                    lineHeight: 30
                  }
                }
              }
            },
            data: data.nodes,
            links: data.lines,
            categories: [
              { name: `${this.$t('trans0193')}` },
              { name: `${this.$t('trans0196')}` }
            ],
            lineStyle: { width: 2 }
          }
        ]
      };
      this.chart.setOption(option);
    },
    createIntervalTask() {
      this.getMeshNode();
      this.getTxpower();
    },
    clearIntervalTask() {
      clearTimeout(this.meshNodeTimer);
      this.meshNodeTimer = null;
      clearTimeout(this.txPowerTimer);
      this.txPowerTimer = null;
    },
    getMeshNode() {
      clearTimeout(this.meshNodeTimer);
      this.meshNodeTimer = null;
      this.$http
        .getMeshNode()
        .then(res => {
          const { result } = res.data;
          console.log(result);
          if (!this.chart) {
            this.initChart();
          }
          this.drawTopo(result);

          if (this.pageActive) {
            this.meshNodeTimer = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.pageActive) {
            this.meshNodeTimer = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
        });
    },
    getTxpower() {
      clearTimeout(this.txPowerTimer);
      this.txPowerTimer = null;
      this.$http
        .getMeshMeta()
        .then(res => {
          this.tx_power = res.data.result.tx_power;
          if (this.pageActive) {
            this.txPowerTimer = setTimeout(() => {
              this.getTxpower();
            }, 10000);
          }
        })
        .catch(() => {
          if (this.pageActive) {
            this.txPowerTimer = setTimeout(() => {
              this.getTxpower();
            }, 10000);
          }
        });
    },
    checkThemeMode(isDarkMode) {
      if (isDarkMode) {
        this.isDarkMode = true;
      } else {
        this.isDarkMode = false;
      }
      this.getMeshNode();
    },
    labelFormatter(category) {
      // originName是节点的原始名称
      let { originName: name } = category.data;
      const { stationsCount } = category.data;
      const {
        itemStyle: { color }
      } = category.data;
      const { isGateway } = category.data;
      let result;
      if (name.length > 12) {
        name = `${name.substring(0, 12)}...`;
      }
      if (isGateway) {
        result = `{name|${name}} {stationCount|${stationsCount}}`;
        return result;
      }
      switch (color) {
        case Color.good:
          result = `{name|${name}} {stationCount|${stationsCount}}\n{good|${this.$t(
            'trans0193'
          )}} `;
          break;
        case Color.bad:
          result = `{name|${name}} {stationCount|${stationsCount}}\n{bad|${this.$t(
            'trans0196'
          )}} `;
          break;
        case Color.offline:
          result = `{name|${name}}\n{offline|${this.$t('trans0214')}}`;
          break;
        default:
          break;
      }
      return result;
    },
    handleTransitionEnd() {
      // 过渡离开执行时立即重新绘制图表，并在下一个更新周期前调整大小
      this.chart.resize();
      this.$nextTick(() => {
        this.chart.resize();
      });
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
  }
};
</script>
<style lang="scss">
.fade-slide-enter-active {
  transition: all 0.3s ease-in-out;
}
.fade-slide-leave-active {
  transition: all 0.1s ease-out;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px); /* 初始平移位置，可以根据需求调整 */
}
#topo {
  canvas {
    // hack for safari, fix canvas overlay div
    position: static !important;
  }
}
</style>
<style lang="scss" scoped>
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
.connect-quality-modal {
  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    .btn__close {
      position: absolute;
      top: 0;
      right: -5px;
      // transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      background: #f1f1f1;
      .iconfont {
        font-size: 12px;
        color: #333;
      }
    }
  }
  .connect-quality-modal-contnet {
    width: 660px;
    max-height: 400px;
    padding: 0 10px;
    overflow: auto;
    overflow-x: hidden;
    .markdown-body {
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }
    @media screen and (max-width: 768px) {
      width: auto;
      height: 340px;
      overflow: auto;
    }
    .examples {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      @media screen and (max-width: 768px) {
        flex-direction: column;
      }

      .example {
        .description {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .icon-circle {
            width: 16px;
            height: 16px;
            border: 1px solid #ff4d64;
            border-radius: 50%;
            margin-right: 5px;
            position: relative;
          }
        }
        &.error {
          .icon-circle {
            &::before {
              content: '';
              display: block;
              width: 7px;
              height: 1px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              background: #ff4d64;
              z-index: 999;
              position: absolute;
            }
            &::after {
              content: '';
              display: block;
              width: 7px;
              height: 1px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              background: #ff4d64;
              z-index: 999;
              position: absolute;
            }
          }
        }
        &.right {
          .icon-circle {
            border-color: #55c630;
            &::after {
              position: absolute;
              content: '';
              display: block;
              width: 3px;
              height: 6px;
              border-right: 1px solid #55c630;
              border-bottom: 1px solid #55c630;
              border-left: 0;
              border-top: 0;
              transform: rotate(45deg);
              top: 3px;
              left: 5px;
            }
          }
        }

        img {
          width: 300px;
          @media screen and (max-width: 768px) {
            width: 100%;
          }
        }
      }
    }
    .form-button {
      margin: 20px 0;
      text-align: center;
    }
  }
}
.mesh-container {
  display: flex;
  .mesh-info {
    position: relative;
    display: flex;
    width: 100%;
    border-radius: 8px;
    box-sizing: border-box;
    flex-direction: column;
    .back-wrap {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
    }
    .content {
      width: 100%;
      height: 100%;
      display: flex;
      .topo-container {
        position: relative;
        width: 100%;
        &.show-table {
          width: 60%;
        }
        .legend-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 3;
          .btn-icon {
            margin-bottom: 10px;
          }
          .legend {
            display: flex;
            margin-bottom: 10px;
            > div {
              font-size: 12px;
              display: flex;
              align-items: center;
              margin-top: 10px;
              color: var(--text-default-color);
            }
            .legend-item {
              margin-right: 10px;
              &::before {
                content: '';
                margin-right: 3px;
                display: block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #00d061; //ff6f00
              }
              &:nth-child(2) {
                &::before {
                  background: #ff6f00;
                }
              }
              &:nth-child(3) {
                margin-right: 0;
                &::before {
                  background: rgb(158, 158, 158);
                }
              }
            }
          }
          .legend-title {
            font-size: 12px;
            color: var(--text-default-color);
            margin: 0;
            display: flex;
            align-items: center;
            .iconfont {
              margin-left: 10px;
              font-size: 12px;
              transform: translateX(25%);
              cursor: pointer;
              &:hover {
                color: var(--text-gery-color);
              }
            }
          }
          .legend-tx_power {
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-top: 10px;
            .value {
              width: 20px;
              text-align: right;
              &.text {
                width: fit-content;
                height: 18px;
                margin-left: 3px;
                margin-right: -3px;
              }
              &.loading {
                width: 18px;
                height: 18px;
                margin-left: 5px;
                margin-right: -6px;
              }
            }
          }
        }
        .topo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          #topo {
            min-width: 500px;
            width: 100%;
            height: 100%;
          }
        }
      }
      .mesh-info-card {
        display: flex;
        flex-direction: column;
        min-width: 540px;
        min-height: 475px;
        max-height: calc(100vh - 65px - 60px);
        width: 40%;
        height: 100%;
        background: var(--common-card-bgc);
        box-shadow: var(--common-card-boxshadow);
        border-radius: 10px;
        .card-top {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 236px;
          padding: 20px;
          .close {
            position: absolute;
            width: 25px;
            height: 25px;
            top: 15px;
            right: 20px;
            .iconfont {
              font-size: 12px;
            }
          }
          .card-top__main {
            flex: 1;
            display: flex;
            align-items: center;
            margin-top: 25px;
          }
          .card-top__header {
            display: flex;
            align-items: center;
            height: 26px;
          }
          .info-label {
            vertical-align: baseline;
            padding: 4px 10px;
            border-radius: 5px;
            color: #fff;
            margin-right: 5px;
            background-image: linear-gradient(97deg, #50cc83 6%, #3cc146 90%);
            &.model-name {
              background-image: linear-gradient(117deg, #97006a, #f45199 100%);
            }
            &.fair {
              background-image: linear-gradient(97deg, #ebb351 6%, #e16825 90%);
            }
            &.offline {
              background-image: linear-gradient(
                91deg,
                #c2c2c2 35%,
                #a2a2a2 90%
              );
            }
            &:last-child {
              margin-right: 0;
            }
          }
          .model__img {
            width: 150px;
            height: 150px;
            aspect-ratio: 1/1;
            background: url(../../../assets/images/v3/dashboard/m6/img_m6_black.png)
              center no-repeat;
            background-size: contain;
          }
          .mesh-router__info {
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 45px 1fr 1fr 1fr 1fr;
            flex: 1;
            height: 100%;
            > div {
              max-width: 430px;
              display: flex;
              align-items: center;
              overflow: hidden;
            }
            .row-1 {
              margin-bottom: 5px;
              .line-icon {
                width: 40px;
                height: 40px;
                margin-right: 5px;
                aspect-ratio: 1/1;
                background: url(../../../assets/images/icon/ic_homepage_m6a.png)
                  center no-repeat;
                background-size: contain;
                filter: var(--img-brightness);
                &.m6a_plus {
                  background: url(../../../assets/images/m6a_plus/ic_homepage_m6a-plus.png)
                    center no-repeat;
                  background-size: contain;
                }
              }
              .text {
                font-size: 18px;
                font-weight: 500;
                max-width: calc(100% - 45px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .row-2,
            .row-3,
            .row-4,
            .row-5 {
              font-size: 14px;
              font-weight: 500;
              color: var(--common-gery-color);
              .label {
                margin-right: 5px;
              }
            }
          }
          .operation {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            width: fit-content;
            height: 100%;
            margin-left: 10px;
            > span {
              background-color: var(--button-close-bgc);
              margin-right: 10px;
              &:last-child {
                margin: 0;
              }
            }
          }
        }
        .card-bottom {
          height: calc(100% - 236px);
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          overflow: hidden;
          .card-bottom__offline-tips {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            background-color: var(--mesh-table-offline_tips-bgc);
            > span {
              cursor: pointer;
              color: var(--mobile-menu-selected-color);
              margin-left: 7px;
              text-decoration: underline;
            }
          }
          .card-bottom__header {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            height: 35px;
            color: var(--text-gery-color);
            padding: 7px 0;
            background-color: var(--mesh-table-header-bgc);
            > div {
              text-align: center;
            }
          }
          .card-bottom__main {
            height: calc(100% - 35px);
            overflow-y: auto;
            overflow-x: hidden;
            > li {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: 100%;
              align-items: center;
              height: 60px;
              font-size: 14px;
              font-weight: 500;
              text-align: center;
              border-bottom: 1.5px solid var(--common-hr-color);
              .col-1 {
                padding: 0 10px;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .local-device {
                  display: inline-block;
                  width: 15px;
                  height: 15px;
                  margin-right: 5px;
                  vertical-align: text-top;
                  background: url(../../../assets/images/icon/ic_local-device.svg)
                    center no-repeat;
                  background-size: contain;
                }
              }
              .col-2 {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                > span {
                  margin-bottom: 5px;
                  &:last-child {
                    margin: 0;
                  }
                }
              }
              .col-3 {
                display: flex;
                justify-content: center;
                align-items: center;
                // align-items: center;
                .band {
                  min-width: 50px;
                  padding: 1px 10px;
                  border-radius: 5px;
                  color: #fff;
                  background-image: linear-gradient(
                    97deg,
                    #50cc83 6%,
                    #3cc146 90%
                  );
                  &.wired {
                    background-image: linear-gradient(
                      294deg,
                      #3da8ff 20%,
                      #0c70b8
                    );
                  }
                }
                .guest {
                  display: inline-block;
                  height: 20px;
                  aspect-ratio: 38/23;
                  margin-left: 15px;
                  background: url(../../../assets/images/icon/ic_guest.svg)
                    center no-repeat;
                  background-size: contain;
                  filter: var(--img-brightness);
                }
              }
            }
          }
          .card-bottom__empty {
            height: calc(100% - 35px);
            > li {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .mesh-container {
    padding: 0 !important;
    .mesh-info {
      position: relative;
      padding: 0 20px;
      .back-wrap {
        position: static;
        padding: 0;
      }
      .content {
        padding-top: 0;
        .topo-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          &.show-table {
            width: 100%;
          }
          .legend-wrap {
            width: 100%;
            position: static;
            display: flex;
            flex-direction: column-reverse;
            position: relative;
            .info {
              background-color: var(--common-card-bgc);
              padding: 15px;
              border-radius: 5px;
            }
            .legend-title {
              justify-content: flex-start;
              .iconfont {
                margin-left: 5px;
              }
            }
            .legend {
              display: flex;
              flex-wrap: wrap;
              .legend-item {
                margin: 0 20px 0 0;
                margin-right: 20px;
                &::after {
                  margin-right: 5px;
                  margin-left: 0;
                }
                &:first-child {
                  margin-left: 0;
                }
              }
            }
            .legend-tx_power {
              justify-content: flex-start;
            }
            .btn-icon {
              position: absolute;
              bottom: -10px;
              left: 0;
              transform: translateY(100%);
              margin: 0;
            }
          }
          .topo-wrap {
            padding-top: 0;
            min-height: 430px;
            #topo {
              width: 100%;
              min-width: initial;
            }
          }
        }
        .mesh-info-card {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          width: calc(100% - 20px * 2);
          min-width: auto;
          min-height: 100%;
          .card-top {
            padding: 15px;
            .card-top__main {
              position: relative;
              display: grid;
              grid-template-rows: 110px 1fr;
              grid-template-columns: 110px 1fr;
            }
            .model__img {
              grid-row: 1 / 2; /* 第一行 */
              grid-column: 1 / 2; /* 第一列 */
              width: 100%;
              height: auto;
            }
            .mesh-router__info {
              grid-row: 1 / 2; /* 第一行 */
              grid-column: 2 / 3; /* 第二列 */
              .row-1 {
                .line-icon {
                  width: 30px;
                }
              }
              .row-2,
              .row-3,
              .row-4,
              .row-5 {
                font-size: 12px;
              }
            }
            .operation {
              grid-row: 2 / 3; /* 第二行 */
              grid-column: 1 / 3; /* 横跨两列 */
              width: 100%;
              justify-content: center;
              margin: 0;
              > span {
                margin: 0;
                margin-right: 30px;
                &:last-child {
                  margin: 0;
                }
              }
            }
          }
          .card-bottom {
            .card-bottom__header {
              .col-1 {
                text-align: left;
                padding-left: 10px;
              }
            }
            .card-bottom__main {
              > li {
                height: auto;
                display: grid;
                grid-template-rows: 1fr 40px;
                grid-template-columns: 1.4fr 1fr;
                padding: 10px 0 5px;
                .col-1 {
                  grid-row: 1 / 2; /* 第二行 */
                  grid-column: 1 / 3; /* 横跨两列 */
                  width: 100%;
                  text-align: left;
                  margin-bottom: 5px;
                }
                .col-2 {
                  padding: 0 10px;
                  font-size: 12px;
                  align-items: flex-start;
                  > span {
                    text-align: left;
                  }
                }
                .col-3 {
                  padding: 0 10px;
                  justify-content: flex-end;
                  font-size: 12px;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 300px) {
  .mesh-container {
    .mesh-info {
      .content {
        .mesh-info-card {
          .card-top {
            padding: 15px 5px;
            .card-top__main {
              grid-template-rows: 110px 1fr;
              grid-template-columns: 60px 1fr;
            }
            .mesh-router__info {
              .row-1 {
                .text {
                  font-size: 14px;
                }
                .line-icon {
                  width: 20px;
                }
              }
            }
          }
          .card-bottom {
            .card-bottom__main {
              > li {
                grid-template-rows: 1fr 80px;

                .col-2 {
                  > div {
                    text-align: left;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
