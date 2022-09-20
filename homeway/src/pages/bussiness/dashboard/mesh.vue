<template>
  <div class="mesh-container">
    <div class="mesh-info">
      <div class="content">
        <div class="mesh-table">
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
              <span>&nbsp;/&nbsp;{{$t('trans0188')}}</span>
            </div>
            <div class="mac">{{$t('trans0201')}}</div>
            <div class="operate">{{$t('trans0370')}}</div>
          </div>
          <div class="table-content">
            <!-- 加载状态模块 -->
            <div class="loading-container"
                 v-if="showLoading">
              <m-loading :color="loadingColor"></m-loading>
            </div>
            <!-- mesh-Info模块 -->
            <template v-if="!showLoading">
              <div class="router"
                   :class="{'expand':router.expand}"
                   v-for="router in routers"
                   :key="router.sn"
                   @click="router.expand = !router.expand">
                <div class="name">
                  <div class="icon">
                    <img src="../../../assets/images/icon/ic_homeway_gateway.png"
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
                    <img src="../../../assets/images/icon/ic_side_bar_pick_up.png"
                         alt>
                  </div>
                </div>
                <div class="type">
                  <span class="label">{{$t('trans0068')}}</span>
                  <span class="value">AP</span>
                </div>
                <div class="equipment">
                  <span class="label">{{$t('trans0235')}}</span>
                  <span class="value equipment__value"
                        :class="{'is-disabled':!router.stations}"
                        @click.stop="showStationListModal(router)">
                    {{getRouterStationCount(router)}}
                  </span>
                  <img class="equipment__arrow"
                       src="../../../assets/images/icon/ic_inter.png" />
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
                  <span class="label">{{$t('trans0188')}}</span>
                  <span class="value">{{formatMac(router.mac.lan)}}</span>
                </div>
                <div class="operate">
                  <span class="btn-text btn-text-strange"
                        v-if="!isRouterOffline(router)"
                        @click="rebootNode(router)">{{$t('trans0122')}}</span>
                  <span v-if="router.is_gw"
                        class="btn-text text-primary btn-text-strange"
                        @click="resetNode(router)">{{$t('trans0205')}}</span>
                </div>
              </div>
            </template>
            <!-- 列表为空状态模块 -->
            <div class='table-empty'
                 v-if="!showLoading&&routers.length===0">
              <img src="../../../assets/images/img_default_empty.png"
                   alt="">
              <span>{{$t('trans0278')}}</span>
            </div>
          </div>
        </div>
        <div class="topo-container"
             v-if="!showLoading">
          <div class="legend-wrap">
            <p class="legend-title">
              <span>{{$t('trans0302')}}</span>
              <!-- <span class="icon-quality"
                    @click.stop="showRssiModal"></span> -->
            </p>
            <div class="legend">
              <div class="legend-item">{{$t('trans0193')}}</div>
              <div class="legend-item">{{$t('trans0196')}}</div>
              <div class="legend-item">{{$t('trans0214')}}</div>
            </div>
          </div>
          <div class="topo-wrap"
               id="topo-wrap">
            <div id="topo">
              <div class="upperAp-container"
                   :class="[{'offline':isOffline},{'wired-bridge':isWiredBridge},{'wireless_bridge_excellent':connectExcellent},{'wireless_bridge_fair':connectFair}]">
              </div>
              <div class="line-container "
                   :class="[{'offline':isOffline},{'wired-bridge':isWiredBridge},{'wireless_bridge_excellent':connectExcellent},{'wireless_bridge_fair':connectFair}]">
              </div>
              <div class="gateway-container">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改设备名称弹框 -->
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
    <!-- 连接质量说明弹框 -->
    <!-- <m-modal :visible.sync="rssiModalVisible">
      <m-modal-header>
        {{$t('trans0128')}}
      </m-modal-header>
      <m-modal-body>
        <div class="rssi-modal">

          <div class="examples">
            <div class="example error">
              <img src="../../../assets/images/img_help_error.png"
                   alt="">
              <div class="description">
                <span class="icon-circle">

                </span>
                <span>{{$t('trans0599')}}</span>
              </div>
            </div>
            <div class="example right">
              <img src="../../../assets/images/img_help_right.png"
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
    </m-modal> -->
    <!-- mesh列表弹框 -->
    <m-modal :visible.sync="stationListModalVisible"
             class="mesh-list-modal">
      <m-modal-header class="header">
        <img @click="hideMeshListModal"
             class="header__btn--close"
             src="../../../assets/images/icon/close.png"
             alt="" />
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
                <img src="../../../assets/images/icon/ic_user.png"
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
              <span class="mobile-show">{{bandMap[item.connected_network.band]}}</span>
            </div>
          </div>
        </div>
        <div class="table__empty"
             v-else>
          <img src="../../../assets/images/img_default_empty.png"
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

export default {
  data() {
    return {
      showLoading: false,
      // rssiModalVisible: false,
      RouterStatus,
      formatMac,
      pageActive: true,
      meshModeInfo: {},
      meshNodeTimer: null,
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
      }
    };
  },
  async mounted() {
    this.getMeshMode();
    this.createIntervalTask();
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
    isOffline() {
      return (this.meshModeInfo?.status ?? 'unlinked') === 'unlinked';
    },
    isWiredBridge() {
      return this.meshModeInfo?.status !== 'unlinked' && this.meshModeInfo?.mode === 'bridge';
    },
    connectExcellent() {
      return this.meshModeInfo?.status !== 'unlinked' && this.meshModeInfo?.mode === 'wireless_bridge' && this.meshModeInfo?.rssi > -60;
    },
    connectFair() {
      return this.meshModeInfo?.status !== 'unlinked' && this.meshModeInfo?.mode === 'wireless_bridge' && this.meshModeInfo?.rssi <= -60;
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
    // showRssiModal() {
    //   this.rssiModalVisible = true;
    // },
    // closeRssiModal() {
    //   this.rssiModalVisible = false;
    // },
    updateMeshBand(val) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .updateMeshBand({
                bands: {
                  '5G': true,
                  '2.4G': val
                }
              })
              .then(() => {
                this.$loading.close();
                this.$reconnect({
                  onsuccess: () => {
                    this.$toast(this.$t('trans0040'), 3000, 'success');
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  },
                  timeout: 60
                });
              })
              .catch(() => {
                this.mesh24g = !val;
                this.$loading.close();
              });
          },
          cancel: () => {
            this.mesh24g = !this.mesh24g;
          }
        }
      });
    },
    getMeshBand() {
      this.$http.getMeshBand().then(res => {
        this.mesh24g = res.data.result['2.4G'];
      });
    },
    getMeshMode() {
      this.$http.getWanStatus()
        .then(res1 => {
          const { status } = res1.data.result;
          this.$http.getMeshMode()
            .then(res2 => {
              this.meshModeInfo = res2.data.result;
              this.meshModeInfo.status = status;
            })
            .catch(() => {
              this.meshModeInfo = {
                status: 'unlinked',
              };
            });
        })
        .catch(() => {
          this.meshModeInfo = {
            status: 'unlinked',
          };
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
    createIntervalTask() {
      this.showLoading = true;
      this.getMeshNode();
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
          const oldRouters = this.routers;
          const selected = oldRouters.filter(or => or.expand).map(r => r.sn);
          this.routers = res.data.result;
          this.routers.forEach(r => {
            if (selected.includes(r.sn)) {
              this.$set(r, 'expand', true);
            } else {
              this.$set(r, 'expand', false);
            }
          });
          this.showLoading = false;
          if (this.pageActive) {
            this.meshNodeTimer = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
        })
        .catch(() => {
          this.showLoading = true;
          if (this.pageActive) {
            this.meshNodeTimer = setTimeout(() => {
              this.getMeshNode();
            }, 10000);
          }
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
      position: fixed;
      top: 65px;
      left: 0;
      width: 100% !important;
      height: calc(100% - 65px);
      overflow: scroll;
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
        // display: none;
        width: 180px;
      }
    }
    .table__header {
      height: 37px;
      background-color: #ebebeb;
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
      border-bottom: solid 1px #f1f1f1;
      .table__column {
        font-size: 14px;
        height: 60px;
        background-color: #fff;
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
          width: 75px;
          text-align: center;
          padding: 3px 0;
          border-radius: 3px;
          border: solid 1px #333333;
        }
        img {
          margin-left: 20px;
          width: 38px;
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
      color: #333333;
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
.rssi-modal {
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
          border: 1px solid #333;
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
            top: 7px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            background: #333;
            z-index: 999;
            position: absolute;
          }
          &::after {
            content: '';
            display: block;
            width: 7px;
            height: 1px;
            top: 7px;
            left: 50%;
            transform: translateX(-50%) rotate(-45deg);
            background: #333;
            z-index: 999;
            position: absolute;
          }
        }
      }
      &.right {
        .icon-circle {
          border-color: #00d061;
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 3px;
            height: 6px;
            border-right: 1px solid #00d061;
            border-bottom: 1px solid #00d061;
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
.mesh-container {
  flex: auto;
  display: flex;

  .tabs {
    padding: 0;
  }
  .mesh-info {
    display: flex;
    .title {
      position: relative;
      .tab {
        font-size: 16px;
      }
      .mobile-add {
        display: none;
      }
    }
    .btn-add {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    width: 100%;
    background: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0 20px;
    flex-direction: column;
    .content {
      padding-top: 20px;
      flex: auto;
      display: flex;
      flex-direction: column;
      .table-empty {
        padding-top: 30px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          width: 180px;
          // display: none;
        }
      }
      .loading-container {
        display: flex;
        justify-content: center;
        padding: 30px 0;
      }
      .topo-container {
        position: relative;
        flex: 1;
        display: flex;
        margin-top: 1.875rem;
        .legend-wrap {
          position: absolute;
          top: 0;
          right: 0;
          order: 3;
          width: 200px;
          .legend-title {
            font-size: 0.875rem;
            color: #333;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .icon-quality {
              width: 12px;
              height: 12px;
              margin-left: 5px;
              cursor: pointer;
              background: url(../../../assets/images/icon/ic_connection_quality.png)
                no-repeat center;
              background-size: 100%;
              &:hover {
                background: url(../../../assets/images/icon/ic_connection_quality_hover.png)
                  no-repeat center;
                background-size: 100%;
              }
            }
          }
          .legend {
            .legend-item {
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top: 10px;
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 450px;
            height: 450px;
            > div {
              -webkit-user-drag: none;
            }

            .upperAp-container {
              width: 60px;
              height: 60px;
              margin-bottom: 8px;
              &.wired-bridge {
                background: url(../../../assets/images/icon/ic_homeway_excellent.png)
                  center no-repeat;
                background-size: contain;
              }
              &.wireless_bridge_excellent {
                background: url(../../../assets/images/icon/ic_homeway_excellent.png)
                  center no-repeat;
                background-size: contain;
              }
              &.wireless_bridge_fair {
                background: url(../../../assets/images/icon/ic_homeway_fair.png)
                  center no-repeat;
                background-size: contain;
              }
              &.offline {
                background: url(../../../assets/images/icon/ic_homeway_offline.png)
                  center no-repeat;
                background-size: contain;
              }
            }
            .line-container {
              width: 2px;
              height: 100px;
              background-size: 100% 6px;
              background-repeat: repeat-y;
              &.wired-bridge {
                background-image: linear-gradient(
                  to bottom,
                  #00d061 0%,
                  #00d061 100%,
                  transparent 50%
                );
              }
              &.wireless_bridge_excellent {
                background-image: linear-gradient(
                  to bottom,
                  #00d061 0%,
                  #00d061 80%,
                  transparent 50%
                );
              }
              &.wireless_bridge_fair {
                background-image: linear-gradient(
                  to bottom,
                  #ff6f00 0%,
                  #ff6f00 80%,
                  transparent 50%
                );
              }
              &.offline {
                position: relative;
                background-image: linear-gradient(
                  to bottom,
                  #999999 0%,
                  #999999 80%,
                  transparent 50%
                );
                &::before {
                  content: '';
                  width: 14px;
                  height: 14px;
                  background: url(../../../assets/images/icon/ic_homeway_offline.svg)
                    center no-repeat;
                  background-size: contain;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  border-radius: 50%;
                }
              }
            }
            .gateway-container {
              width: 80px;
              height: 80px;
              margin-top: 8px;
              background: url(../../../assets/images/icon/ic_homeway_gateway.png)
                center no-repeat;
              background-size: contain;
            }
          }
        }
      }

      .mesh-table {
        width: 100%;
        .table-header {
          display: flex;
          padding: 15px 20px;
          background: #f1f1f1;
          display: flex;
          justify-content: space-between;
        }
        .name {
          width: 250px;
          padding-left: 50px;
        }
        .sn {
          width: 150px;
        }
        .type {
          width: 100px;
        }
        .equipment {
          width: 100px;
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
          width: 230px;
          .text-primary {
            color: #d6001c;
            &:hover {
              color: #e6586a;
            }
          }
        }
        .table-content {
          .router {
            display: flex;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f1f1f1;
            &:nth-child(2n) {
              background: #f7f7f7;
            }
            &:last-child {
              border: 0;
            }
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
                img {
                  width: 14px;
                  height: 7px;
                }
                transition: all 0.3s;
                &.expand {
                  transform: rotate(180deg);
                }
                &.collapse {
                  transform: rotate(0deg);
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
                color: #333;
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
                }
              }
            }
            .operate {
              span {
                margin-left: 20px;
                &:first-child {
                  margin-left: 0;
                }
              }
            }
          }
        }
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
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border: 0;
          outline: 0;
          border-radius: 50%;
          &::before {
            content: '';
            display: block;
            width: 2px;
            height: 14px;
            background: #fff;
            position: absolute;
            top: 8px;
            left: 14px;
            border-radius: 2px;
          }
          &::after {
            position: absolute;
            content: '';
            display: block;
            width: 2px;
            height: 14px;
            top: 8px;
            left: 14px;
            background: #fff;
            transform: rotate(90deg);
            border-radius: 2px;
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
          margin-top: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          .legend-wrap {
            order: 2;
            position: static;
            .legend-title {
              justify-content: flex-start;
            }
            width: 100%;
            .legend {
              display: flex;

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
            margin-bottom: 30px;
            width: 100%;
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
              background: #fff;
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
            background: #fff;
            .router {
              display: flex;
              flex-direction: column;
              // margin-bottom: 10px;
              background: #fff;
              border-radius: 5px;
              padding: 0;
              height: 60px;
              overflow: hidden;
              // background: #f1f1f1;
              margin: 0 20px;
              position: relative;
              &:nth-child(2n) {
                background: #fff;
              }
              &.expand {
                height: 470px;
                margin: 0;
                background: #f1f1f1;
                padding: 0 20px;
                padding-top: 60px;
                .name {
                  background: #fff;
                  position: absolute;
                  width: 100%;
                  top: 0;
                  left: 0;
                  padding: 0 20px;
                }
                > div:not(:first-child) {
                  background: #f1f1f1;
                  border-bottom: 1px solid #e0e0e0;
                }
              }
              span.label {
                display: inline;
              }
              > div {
                width: auto;
                padding: 15px 0;
                border-bottom: 1px solid #f1f1f1;
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
                  display: inline;
                }
              }
              .name {
                .wrap {
                  flex: 1;
                }
                .expand {
                  display: block;
                }
              }
              .operate {
                display: flex;
                justify-content: center;
                padding: 30px 20px;
                border-bottom: 0 !important;
              }
            }
          }
        }
      }
    }
  }
  .mesh-list-modal {
    .header {
      display: block;
      width: 100%;
      height: 40px;
      padding: 10px 10px 0 10px;
      &::before {
        content: '';
        display: table;
        clear: both;
      }
      .header__btn--close {
        height: 24px;
        float: left;
      }
    }
    .table {
      width: 100%;
      padding: 0 0 10px;
      .table__header {
        display: none;
      }
      .table__body {
        height: auto;
      }
      .table__row {
        flex-wrap: wrap;
        width: 100%;
        padding-bottom: 10px;
        border-bottom: solid 1px #ccc;
        .table__column--device {
          .device__host-name {
            width: 100%;
            &.has-padding-left {
              padding-left: 0;
            }
          }
        }
      }
      .table__empty {
        img {
          display: block;
        }
      }
      .table__column {
        &.table__column--device {
          font-weight: bold;
          height: 50px;
          width: 100%;
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
  }
}
@media screen and (width: 320px) {
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
