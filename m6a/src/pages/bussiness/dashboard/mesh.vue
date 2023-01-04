<template>
  <div class="mesh-container">
    <div class="mesh-info">
      <div class="title">
        <m-tabs>
          <m-tab :class="{'selected':!showTable}"
                 @click.native="$router.push('/dashboard/mesh/topo')">
            <i class="iconfont icon-ic_devices_mesh_normal"></i>
            {{$t('trans0312')}}
          </m-tab>
          <m-tab :class="{'selected':showTable}"
                 @click.native="$router.push('/dashboard/mesh/table')">
            <i class="iconfont icon-ic_devices_list_normal"></i>
            {{$t('trans0384')}}
          </m-tab>
        </m-tabs>
        <button class="btn btn-add btn-small"
                @click.stop="$router.push('/mesh/add')">
          <span class="add-icon"></span>
          {{$t('trans0194')}}
        </button>
        <button @click.stop="$router.push('/mesh/add')"
                class="btn mobile-add"></button>
      </div>
      <div class="content">
        <div class="topo-container"
             v-show="!showTable">
          <div class="legend-wrap">
            <p class="legend-title">
              <span>{{$t('trans0302')}}</span>
              <i class="iconfont icon-ic_connection_quality icon-quality"
                 @click.stop="showRssiModal"></i>
            </p>
            <div class="legend">

              <div class="legend-item">{{$t('trans0193')}}</div>
              <div class="legend-item">{{$t('trans0196')}}</div>
              <div class="legend-item">{{$t('trans0214')}}</div>
              <div class="legend-tx_power">
                <span>{{$t('trans1102')}}:</span>
                <m-loading :size='18'
                           :color="'#29b96c'"
                           class="value loading"
                           v-if="!tx_power"></m-loading>
                <span v-else
                      class="value text">{{txPowerMap[tx_power]}}</span>
              </div>
            </div>
          </div>
          <div class="switch-wrap">
          </div>
          <div class="topo-wrap"
               id="topo-wrap">
            <div id="topo"></div>
          </div>
        </div>
        <div class="mesh-table"
             v-show="showTable">
          <div class="table-header">
            <div class="name">{{$t('trans0005')}}</div>
            <div class="type">{{$t('trans0068')}}</div>
            <div class="equipment">
              {{$t('trans0235')}}
            </div>
            <div class="sn">{{$t('trans0251')}}</div>
            <div class="version">{{$t('trans0300')}}</div>
            <div class="ip">
              <span>{{$t('trans0151')}}</span>
              <span>&nbsp;/&nbsp;{{$t('trans0201')}}</span>
            </div>
            <div class="mac">{{$t('trans0201')}}</div>
            <div class="operate"></div>
          </div>
          <div class="table-content">
            <div class="router"
                 :class="{'expand':router.expand}"
                 v-for="router in routers"
                 :key="router.sn"
                 @click="router.expand = !router.expand">
              <div class="name">
                <div class="icon">
                  <img :src="router.image"
                       alt>
                </div>
                <div class="wrap">
                  <div class="text"
                       :title="router.name">{{router.name}}</div>
                  <div class="edit"
                       v-if="!isRouterOffline(router)"
                       @click.stop="onClickRouterName(router)">
                    <img class="btn-text icon-btn"
                         :title="$t('trans0034')"
                         src="../../../assets/images/icon/ic_edit.png"
                         alt>
                  </div>
                </div>
                <div class="expand"
                     :class="{'expand':router.expand,'collapse':!router.expand}">
                  <i class="expand iconfont icon-ic_dropdown_small"></i>
                </div>
              </div>
              <div class="type">
                <span class="label">{{$t('trans0068')}}</span>
                <span class="value">{{router.is_gw ? $t('trans0165'):
                  $t('trans0186')}}</span>
              </div>
              <div class="equipment">
                <span class="label">{{$t('trans0235')}}</span>
                <span class="value equipment__value"
                      :class="{'is-disabled':!router.stations}"
                      @click.stop="showStationListModal(router)">
                  {{getRouterStationCount(router)}}
                </span>
                <i class="equipment__arrow iconfont icon-ic_enter"></i>
              </div>
              <div class="sn">
                <span class="label">{{$t('trans0251')}}</span>
                <span class="value">{{router.sn}}</span>
              </div>
              <div class="version">
                <span class="label">{{$t('trans0300')}}</span>
                <span class="value">{{router.version.current}}</span>
              </div>
              <div class="ip">
                <span class="label">{{$t('trans0151')}}</span>
                <span class="value">{{router.ip}}</span>
                <span class="value">{{formatMac(router.mac.lan)}}</span>
              </div>
              <div class="mac">
                <span class="label">{{$t('trans0201')}}</span>
                <span class="value">{{formatMac(router.mac.lan)}}</span>
              </div>
              <div class="operate">
                <span v-if="!isRouterOffline(router)"
                      class="btn-icon"
                      @click="rebootNode(router)">
                  <i class="reboot iconfont icon-ic_router_reboot_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0122')}}</span>
                </span>
                <span v-if="isMobile"
                      class="label"
                      @click="rebootNode(router)">
                  {{$t('trans0122')}}
                </span>
                <span v-if="router.is_gw"
                      class="btn-icon"
                      @click="resetNode(router)">
                  <i class="reset iconfont icon-ic_router_reset_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0205')}}</span>
                </span>
                <span v-if="isMobile"
                      class="label"
                      @click="resetNode(router)">
                  {{$t('trans0205')}}
                </span>
                <span v-if="!router.is_gw"
                      class="btn-icon"
                      @click="deleteNode(router)">
                  <i class="delete iconfont icon-ic_trash_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
                </span>
                <span v-if="isMobile&&!router.is_gw"
                      class="label"
                      @click="deleteNode(router)">
                  {{$t('trans0033')}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑设备名称弹窗 -->
    <m-modal :visible.sync="showModal"
             class="edit-name-modal">
      <m-modal-body class="content">
        <m-form :model="form"
                class="form"
                :rules="rules"
                ref="form">
          <m-form-item prop="newName">
            <m-editable-select :options="options"
                               :label="$t('trans0005')"
                               v-model="form.newName"></m-editable-select>
          </m-form-item>
        </m-form>
        <div class="btn-inner">
          <button @click="closeUpdateModal"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button @click="updateMehsNode(routerSelected,form.newName)"
                  class="btn">{{$t('trans0024')}}</button>
        </div>
      </m-modal-body>
    </m-modal>
    <!-- 连接质量弹窗 -->
    <m-modal :visible.sync="rssiModalVisible"
             class="connect-quality-modal">
      <m-modal-header class="header">
        <span> {{$t('trans0128')}}</span>
        <!-- <span class="btn__close">
          <i class="iconfont icon-ic_close"></i>
        </span> -->
      </m-modal-header>
      <m-modal-body>
        <div class="connect-quality-modal-contnet">
          <div class="examples">
            <div class="example error">
              <img src="../../../assets/images/img_help_error.webp"
                   alt="">
              <div class="description">
                <span class="icon-circle">
                </span>
                <span>{{$t('trans0599')}}</span>
              </div>
            </div>
            <div class="example right">
              <img src="../../../assets/images/img_help_right.webp"
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
    <!-- mesh列表弹框 -->
    <m-modal :visible.sync="stationListModalVisible"
             class="mesh-list-modal">
      <m-modal-header class="header">
        <div class="header__btn--close"
             @click="hideMeshListModal">
          <i class="iconfont icon-ic_close"></i>
        </div>
      </m-modal-header>
      <m-modal-body class="table">
        <div class="table__header">
          <div class="table__column table__column--host"></div>
          <div class="table__column table__column--device">{{$t('trans0005')}}</div>
          <div class="table__column table__column--ip">{{$t('trans0184')}}</div>
          <div class="table__column table__column--guest">{{$t('trans0375')}}</div>
        </div>
        <div class="table__body"
             v-if="stationList.length">
          <div class="table__row"
               v-for="(item, index) in stationList"
               :key="index">
            <div class="table__column table__column--device">
              <span v-if="isThisMachine(item.ip)"
                    class="device__img">
                <img src="../../../assets/images/icon/ic_local-device.svg"
                     alt="">
              </span>
              <span class="device__host-name"
                    :class="hasPaddingLeft(item.ip)"
                    :title="item.name">
                {{item.name}}
              </span>
            </div>
            <div class="table__column table__column--ip">
              <div class="v4">{{item.ip}}</div>
              <div class="v6">{{formatMac(item.mac)}}</div>
            </div>
            <div class="table__column table__column--guest">
              <span class="laptop-show">{{bandMap[item.connected_network.band]}}</span>
              <img v-if="isGuest(item.connected_network.type)"
                   src="../../../assets/images/icon/ic_guest.svg"
                   alt="" />
              <span class="mobile-show">{{bandMap[item.connected_network.band]}}</span>
            </div>
          </div>
        </div>
        <div class="table__empty"
             v-else>
          <img src="../../../assets/images/img_default_empty.webp"
               alt="">
          <span>
            {{$t('trans0278')}}
          </span>
        </div>
      </m-modal-body>
    </m-modal>
  </div>
</template>
<script>
import marked from 'marked';
import { formatMac, getStringByte } from 'base/util/util';
import { RouterStatus } from 'base/util/constant';
import genData from './topo';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph');

const GUEST = 'guest'; // 是否是访客
export default {
  data() {
    return {
      rssiModalVisible: false,
      RouterStatus,
      formatMac,
      pageActive: true,
      meshNode: [],
      meshNodeTimer: null,
      chart: null,
      routers: [],
      routerSelected: null,
      showModal: false,
      form: { newName: '' },
      mesh24g: false,
      rules: {
        newName: [
          {
            rule: value => !/^\s*$/.test(value.trim()),
            message: this.$t('trans0237')
          },
          {
            rule: value => {
              const length = getStringByte(value.trim());
              if (length < 1 || length > 20) {
                return false;
              }
              return true;
            },
            message: this.$t('trans0261')
          }
        ]
      },
      options: [
        this.$t('trans0349'),
        this.$t('trans0350'),
        this.$t('trans0351'),
        this.$t('trans0352'),
        this.$t('trans0353'),
        this.$t('trans0354'),
        this.$t('trans0355'),
        this.$t('trans0356'),
        this.$t('trans0357'),
        this.$t('trans0358'),
        this.$t('trans0359'),
        this.$t('trans0360'),
        this.$t('trans0361'),
        this.$t('trans0362'),
        this.$t('trans0363')
      ],
      stationListModalVisible: false,
      stationList: [],
      localDeviceIP: '',
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      },
      txPowerMap: {
        high: this.$t('trans1089'),
        medium: this.$t('trans1090'),
        low: this.$t('trans1091')
      },
      tx_power: '',
      txPowerTimer: null,
      isDarkMode: false
    };
  },
  async mounted() {
    this.initChart();
    this.getMeshBand();
    this.createIntervalTask();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
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
    rssiTips() {
      return marked(this.$t('trans0595'), { sanitize: true });
    },
    showTable() {
      let result;
      if (this.$route.params.category === 'topo') {
        setTimeout(() => {
          this.chart && this.chart.resize();
        });
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    isMobile() {
      return this.$store.isMobile;
    },
    currentTheme() {
      return this.$store.theme;
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
        this.getMeshNode();
      },
      immediate: true
    }
  },
  methods: {
    getRouterStationCount(router) {
      if (!router.stations) {
        return '-';
      }
      return router.stations.length;
    },
    showStationListModal(router) {
      if (!router.stations) {
        return;
      }
      this.stationList = router.stations;
      this.stationListModalVisible = true;
    },
    hideMeshListModal() {
      this.stationListModalVisible = false;
    },
    hasPaddingLeft(ip) {
      return this.isThisMachine(ip) ? '' : 'has-padding-left';
    },
    // 是否是主机
    isThisMachine(ip) {
      return ip === this.localDeviceIP;
    },
    // 是否是访客
    isGuest(type) {
      return type === GUEST;
    },
    showRssiModal() {
      this.rssiModalVisible = true;
    },
    closeRssiModal() {
      this.rssiModalVisible = false;
    },
    getMeshBand() {
      this.$http.getMeshBand().then(res => {
        this.mesh24g = res.data.result['2.4G'];
      });
    },
    isRouterOffline(router) {
      return router.status === RouterStatus.offline;
    },
    closeUpdateModal() {
      this.form.newName = '';
      this.showModal = false;
    },
    onClickRouterName(router) {
      this.routerSelected = router;
      this.form.newName = router.name;
      this.showModal = true;
      this.clearIntervalTask();
    },
    updateMehsNode(router, name) {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .updateMeshNode({
            node_id: router.sn,
            data: { name: name.trim() }
          })
          .then(() => {
            router.name = name;
            this.$loading.close();
            this.showModal = false;
            this.createIntervalTask();
          })
          .catch(() => {
            this.$loading.close();
            this.createIntervalTask();
          });
      }
    },
    deleteNode(router) {
      this.$dialog.confirm({
        okText: this.$t('trans0203'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0218'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http.deleteMeshNode({ node: { sn: router.sn, mac: router.mac } })
              .then(() => {
                this.$loading.close();
                this.$toast(this.$t('trans0040'), 3000, 'success');
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
            this.$http.reboot({ node_ids: [router.sn] }).then(() => {
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
                this.$toast(this.$t('trans0040'), 3000, 'success');
                this.routers = this.routers.filter(r => r.sn !== router.sn);
              }
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
      this.chart.on('click', () => {
        this.$router.push('/dashboard/mesh/table');
      });
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize();
      });
    },
    drawTopo(routers) {
      const oldRouters = this.routers;
      const selected = oldRouters.filter(or => or.expand).map(r => r.sn);
      this.routers = routers;
      const data = genData(routers);
      data.nodes.forEach(n => {
        this.routers.forEach(r => {
          if (n.sn === r.sn) {
            this.$set(r, 'image', n.symbol.replace('image://', ''));
          }
        });
      });
      this.routers.forEach(r => {
        if (selected.includes(r.sn)) {
          this.$set(r, 'expand', true);
        } else {
          this.$set(r, 'expand', false);
        }
      });

      const option = {
        series: [
          {
            type: 'graph',
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: 3,
            cursor: 'pointer',
            layout: 'circular',
            hoverAnimation: false,
            edgeLabel: {
              show: false,
              formatter(series) {
                return series.data.rssi;
              }
            },
            label: {
              normal: {
                show: true,
                position: 'bottom',
                color: this.isDarkMode ? '#fff' : '#333',
                backgroundColor: 'transparent',
                formatter(category) {
                  // originName是节点的原始名称
                  const name = category.data.originName;
                  if (name.length <= 10) {
                    return name;
                  }
                  const splitor = ' ';
                  if (name.includes(splitor)) {
                    const sp = name.split(splitor);
                    let index = 1;
                    let start = sp[0];
                    while ((start + sp[index]).length < 10 && index < sp.length) {
                      start += ` ${sp[index]}`;
                      index += 1;
                    }
                    const end = sp.slice(index).join(splitor);
                    return `${start}\n${end}`;
                  }
                  return name.match(/.{1,10}/g).join('\n');
                }
              }
            },
            data: data.nodes,
            links: data.lines,
            categories: [{ name: `${this.$t('trans0193')}` }, { name: `${this.$t('trans0196')}` }],
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
    },
    getMeshNode() {
      clearTimeout(this.meshNodeTimer);
      this.meshNodeTimer = null;
      this.$http
        .getMeshNode()
        .then(res => {
          this.drawTopo(res.data.result);
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
          console.log(res);
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
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
  }
};
</script>
<style lang="scss">
#topo {
  canvas {
    // hack for safari, fix canvas overlay div
    position: static !important;
  }
}
.mesh-list-modal {
  .modal-content {
    padding: 0 !important;
  }
}
@media screen and (max-width: 768px) {
  .mesh-list-modal {
    .modal-content {
      width: 100% !important;
      height: 100%;
      border-radius: 0 !important;
      position: fixed;
      top: 0;
      left: 0;
      right: auto;
      bottom: auto;
      background: var(--grey-background-color) !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.mesh-list-modal {
  .header {
    display: none;
  }
  .table {
    .table__header,
    .table__row {
      display: flex;
    }
    .table__header {
      padding: 0 10px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    .table__body {
      height: 350px;
      overflow: auto;
      overflow: overlay;
      padding: 0 10px 10px 10px;
    }
    .table__empty {
      height: 350px;
      padding-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        display: none;
        width: 180px;
      }
    }
    .table__header {
      height: 37px;
      color: var(--dashboard-gery-color);
      background-color: var(--modal-header-background-color);
      .table__column {
        font-size: 12px;
        font-weight: 500;
        &.table__column--device {
          padding-left: 30px;
          box-sizing: border-box;
        }
      }
    }
    .table__row {
      border-bottom: 1px solid var(--modal-content-hr-color);
      .table__column {
        font-size: 14px;
        height: 60px;
        background-color: var(--modal-content-background);
      }
      .table__column--device {
        .device__img {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          img {
            width: 16px;
          }
        }
        .device__host-name {
          width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.has-padding-left {
            padding-left: 30px;
          }
        }
      }
      .table__column--ip {
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      .table__column--guest {
        span {
          width: 50px;
          text-align: center;
          padding: 3px 0;
          border-radius: 3px;
          font-size: 12px;
          color: #fff;
          background: var(--dashboard-band-background-color);
        }
        img {
          margin-left: 20px;
          width: 35px;
        }
        .laptop-show {
          display: inline-block;
        }
        .mobile-show {
          display: none;
        }
      }
    }
    .table__column {
      display: flex;
      align-items: center;
      height: 100%;
      &.table__column--device {
        width: 210px;
      }
      &.table__column--ip {
        width: 180px;
      }
      &.table__column--guest {
        width: 160px;
      }
    }
  }
}
.edit-name-modal {
  .content {
    display: flex;
    flex-direction: column;
    .select-container {
      width: 100%;
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
  flex: auto;
  display: flex;
  .mesh-info {
    display: flex;
    .title {
      position: relative;
      .iconfont {
        font-weight: 400;
      }
      .tab {
        font-size: 16px;
      }
      .mobile-add {
        display: none;
      }
    }
    .btn-add {
      height: auto;
      position: absolute;
      right: -15px;
      top: 0;
      padding: 7px 10px;
      border-radius: 5px;
      transform: translateY(-150%);
      .add-icon {
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          height: 2px;
          border-radius: 2px;
          width: 15px;
          // background: var(--button-default-text-color);
          background-color: #fff;
          transform: translate(-50%, -50%) rotate(0deg);
        }
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          height: 2px;
          border-radius: 2px;
          width: 15px;
          // background: var(--button-default-text-color);
          background-color: #fff;
          transform: translate(-50%, -50%) rotate(90deg);
        }
      }
      > span {
        display: flex;
        justify-content: center;
        align-items: center;
        // font-weight: 600;
        .iconfont {
          transform: rotate(45deg);
          margin-right: 10px;
        }
      }
    }
    width: 100%;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0 20px;
    flex-direction: column;
    .content {
      padding-top: 10px;
      flex: auto;
      display: flex;
      .topo-container {
        flex: 1;
        display: flex;
        // height: 500px;
        .legend-wrap {
          order: 3;
          width: 200px;
          .legend-title {
            font-size: 12px;
            color: var(--text-default-color);
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
          .legend {
            > div {
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top: 10px;
              color: var(--text-default-color);
            }
            .legend-item {
              &::after {
                content: '';
                margin-left: 15px;
                display: block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #00d061; //ff6f00
              }
              &:nth-child(2) {
                &::after {
                  background: #ff6f00;
                }
              }
              &:nth-child(3) {
                &::after {
                  background: rgb(158, 158, 158);
                }
              }
            }
            .legend-tx_power {
              .value {
                width: 20px;
                text-align: right;
                &.text {
                  margin-left: 3px;
                  margin-right: -3px;
                  width: fit-content;
                }
                &.loading {
                  margin-left: 5px;
                  margin-right: -6px;
                }
              }
            }
          }
        }
        .switch-wrap {
          order: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 200px;

          .switch-item {
            display: flex;
            width: 100%;
            & + .switch-item {
              margin-top: 20px;
            }
            label {
              display: flex;
              margin-right: 15px;
              // max-width: 200px;
              flex: 1;
              img {
                position: relative;
                cursor: pointer;
              }
            }
          }
        }
        .topo-wrap {
          order: 2;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          // width: 100%;
          // height: 500px;
          #topo {
            min-width: 500px;
            height: 500px;
          }
        }
      }

      .mesh-table {
        width: 100%;
        .table-header {
          display: flex;
          padding: 15px 20px;
          color: var(--text-gery-color);
          background: var(--table-row-background-color);
          display: flex;
          justify-content: space-between;
          border-radius: 10px;
          margin-bottom: 5px;
        }
        .name {
          width: 250px;
        }
        .sn {
          width: 150px;
        }
        .type {
          width: 150px;
        }
        .equipment {
          width: 150px;
        }
        .version {
          width: 100px;
        }
        .ip {
          width: 160px;
        }
        .mac {
          display: none;
        }
        .operate {
          justify-content: flex-end;
          width: 230px;
        }
        .table-content {
          .router {
            display: flex;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            background: var(--table-row-background-color);
            margin-bottom: 5px;
            border-radius: 10px;
            span.label {
              display: none;
            }
            > div {
              display: flex;
              align-items: center;
            }
            .ip {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
            }
            .mac {
              display: none;
            }
            .equipment {
              .equipment__value {
                cursor: pointer;
                text-decoration: underline;
                &.is-disabled {
                  text-decoration: none;
                  cursor: default;
                }
              }
              .equipment__arrow {
                display: none;
                width: 8px;
                margin-left: 8px;
              }
            }
            .name {
              display: flex;
              align-items: center;
              padding-left: 0;
              .expand {
                display: none;
                font-size: 12px;
                transition: all 0.3s;
                &.expand {
                  transform: rotate(0deg);
                }
                &.collapse {
                  transform: rotate(-90deg);
                }
              }
              .wrap {
                display: flex;
                align-items: center;
              }
              .icon {
                margin-right: 20px;
                display: flex;
                align-items: center;
                img {
                  width: 30px;
                  height: 30px;
                }
              }
              .text {
                font-size: 14px;
                margin-right: 10px;
                white-space: pre;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: pre;
                max-width: 150px;
              }
              .edit {
                cursor: pointer;
                width: 16px;
                height: 16px;
                img {
                  width: 16px;
                  height: 16px;
                  filter: var(--img-brightness);
                }
              }
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
      padding: 0;
      .title {
        .mobile-add {
          display: block;
          position: absolute;
          right: 20px;
          top: 0;
          transform: translateY(-140%);
          width: 30px;
          height: 30px;
          border: 0;
          outline: 0;
          // border-radius: 50%;
          &::before {
            content: '';
            display: block;
            width: 2px;
            height: 14px;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 2px;
          }
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 2px;
            height: 14px;
            background: #fff;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            border-radius: 2px;
          }
        }
        .tabs {
          padding: 0 20px;
          border-bottom: 1px solid var(--table-header-hr-color);
          justify-content: flex-start;
          .tab {
            width: auto;
            font-size: 14px;
            min-width: 100px;
          }
        }
      }
      .btn-add {
        display: none;
      }
      .content {
        padding-top: 0;
        .topo-container {
          padding: 20px 20px 0 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          .legend-wrap {
            order: 2;
            .legend-title {
              justify-content: flex-start;
              .iconfont {
                margin-left: 5px;
              }
            }
            width: 100%;
            .legend {
              display: flex;
              flex-wrap: wrap;
              .legend-item {
                flex-direction: row-reverse;
                margin-left: 0;
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
          }
          .switch-wrap {
            order: 1;
            padding-left: 0;
            width: 100%;
            height: 0;
            .switch-item {
              width: auto;
              label {
                flex: auto;
                max-width: 200px;
                span {
                  max-width: 100px;
                  // overflow: hidden;
                  // text-overflow: ellipsis;
                }
              }
            }
          }
          .topo-wrap {
            order: 3;
            padding-top: 0;
            #topo {
              width: 100%;
              min-width: initial;
            }
          }
        }
        .mesh-table {
          .table-header {
            display: none;
          }
          .name {
            flex: none;
            height: 60px !important;
            .icon {
              width: 30px;
            }
            .edit {
              display: inline-block;
            }
          }
          .ip {
            .label {
              span {
                display: none;
              }
            }
            .value:last-child {
              display: none !important;
            }
          }
          .table-content {
            padding: 0;
            margin: 5px 0 10px;
            .router {
              display: flex;
              flex-direction: column;
              background: var(--table-row-background-color);
              color: var(--text-default-color);
              border-radius: 5px;
              padding: 0 10px;
              height: 60px;
              overflow: hidden;
              margin: 0 10px 5px;
              position: relative;
              &.expand {
                height: 470px;
                margin: 0 10px;
                padding-top: 60px;
                .name {
                  position: absolute;
                  width: 100%;
                  top: 0;
                  left: 0;
                  padding: 0 10px;
                }
                > div {
                  border-bottom-color: var(--table-body-hr-color);
                }
              }
              span.label {
                display: inline;
                color: var(--text-gery-color);
              }
              > div {
                width: auto;
                padding: 15px 5px;
                border-bottom: 1px solid transparent;
                &:last-child {
                  border-bottom: 0;
                }
                .label {
                  width: 50%;
                  display: inline-block;
                  text-align: left;
                }
                .value {
                  width: 50%;
                  display: inline-block;
                  text-align: right;
                  white-space: nowrap;
                }
              }
              .ip {
                flex-direction: row;
                justify-content: flex-start;
              }
              .mac {
                display: flex;
              }
              .equipment {
                .equipment__value {
                  text-decoration: none;
                }
                .equipment__arrow {
                  display: inline-block;
                  // width: 15px;
                  // height: 15px;
                  font-size: 12px;
                  color: var(--text-default-color);
                }
              }
              .name {
                padding: 0;
                width: 100%;
                color: var(--text-default-color);
                .wrap {
                  flex: 1;
                }
                .expand {
                  display: block;
                }
              }
              .operate {
                display: flex;
                justify-content: flex-start;
                border-bottom: 0 !important;
                .label {
                  width: auto;
                  display: inline;
                }
              }
            }
          }
        }
      }
    }
  }
  .mesh-list-modal {
    .header {
      position: relative;
      display: block;
      padding: 10px 0;
      margin: 0 10px;
      border-bottom: 1px solid #ccc;
      &::after {
        content: '';
        height: 0;
        display: block;
        clear: both;
      }
      .header__btn--close {
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        color: var(--text-default-color);
        background: var(--primaryBackgroundColor);
        .iconfont {
          font-size: 13px;
        }
      }
    }
    .table {
      width: 100%;
      padding: 0 10px 10px 10px;
      .table__header {
        display: none;
      }
      .table__row {
        flex-wrap: wrap;
        width: 100%;
        padding-bottom: 10px;
        border-bottom: solid 1px #ccc;
        .table__column {
          background-color: var(--grey-background-color);
          &.table__column--device {
            font-weight: bold;
            height: 50px;
            width: 100%;
            .device__host-name {
              width: 100%;
              &.has-padding-left {
                padding-left: 0;
              }
            }
          }
          &.table__column--ip {
            height: 50px;
            width: 50%;
          }
          &.table__column--guest {
            justify-content: flex-end;
            height: 50px;
            width: 50%;
            img {
              margin-left: 0;
            }
            .laptop-show {
              display: none;
            }
            .mobile-show {
              display: inline-block;
              margin-left: 10px;
            }
          }
        }
      }
      .table__empty {
        img {
          display: block;
        }
      }
    }
  }
}
@media screen and (width: 374px) {
  .mesh-container {
    .mesh-info {
      .title {
        .tabs {
          .tab {
            font-size: 14px;
          }
        }
      }
      .btn-add {
        font-size: 12px;
      }
    }
  }
}
</style>
