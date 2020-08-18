<template>
  <div class="mesh-container">
    <div class="mesh-info">
      <div class="title">
        <m-tabs>
          <m-tab :class="{'selected':!showTable}"
                 @click.native="$router.push('/dashboard/mesh/topo')">{{$t('trans0312')}}</m-tab>
          <m-tab :class="{'selected':showTable}"
                 @click.native="$router.push('/dashboard/mesh/table')">{{$t('trans0384')}}</m-tab>
        </m-tabs>
        <button class="btn btn-add btn-small"
                @click="addMeshNode">{{$t('trans0194')}}</button>

        <button @click="addMeshNode"
                class="btn mobile-add"></button>

      </div>
      <div class="content">
        <div class="topo-container"
             v-show="!showTable">
          <div class="legend-wrap">
            <p class="legend-title">
              <span>{{$t('trans0302')}}</span>
              <span class="icon-quality"
                    @click.stop="showRssiModal"></span>
            </p>
            <div class="legend">
              <div class="legend-item">{{$t('trans0193')}}</div>
              <div class="legend-item">{{$t('trans0196')}}</div>
              <div class="legend-item">{{$t('trans0214')}}</div>
            </div>
          </div>
          <div class="switch-wrap">
            <div class="switch-item">
              <label>
                <span>{{$t('trans0562')}}</span>
                <div class="tool"
                     style="width:14px;">
                  <m-popover position="bottom left"
                             style="top:-7px"
                             :title="this.$t('trans0562')"
                             :content="this.$t('trans0558')">
                    <img width="14"
                         src="../../../assets/images/icon/ic_question.png">
                  </m-popover>
                </div>
              </label>
              <m-switch v-model="mesh24g"
                        :onChange="(val)=>updateMeshBand(val)"></m-switch>
            </div>
            <div class="switch-item">
              <label>
                <span>{{$t('trans0667')}}</span>
                <div class="tool"
                     style="width:14px;">
                  <m-popover position="bottom left"
                             style="top:-7px"
                             :title="this.$t('trans0667')"
                             :content="this.$t('trans0668')">
                    <img width="14"
                         src="../../../assets/images/icon/ic_question.png">
                  </m-popover>
                </div>
              </label>
              <m-switch v-model="fullline"
                        :onChange="val => onFulllineChange(val)"></m-switch>
            </div>

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
            <div class="sn">{{$t('trans0251')}}</div>
            <div class="version">{{$t('trans0300')}}</div>
            <div class="ip">
              <span>{{$t('trans0151')}}</span>
              <span>&nbsp;/&nbsp;{{$t('trans0201')}}</span>
            </div>
            <div class="mac">{{$t('trans0201')}}</div>
            <div class="operate">{{$t('trans0370')}}</div>
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
                  <img src="../../../assets/images/icon/ic_side_bar_pick_up.png"
                       alt>
                </div>
              </div>
              <div class="type">
                <span class="label">{{$t('trans0068')}}</span>
                <span class="value">{{router.is_gw ? $t('trans0165'):
                  $t('trans0186')}}</span>
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
                <span class="btn-text btn-text-strange"
                      v-if="!isRouterOffline(router)"
                      @click="rebootNode(router)">{{$t('trans0122')}}</span>
                <span v-if="router.is_gw"
                      class="btn-text text-primary btn-text-strange"
                      @click="resetNode(router)">{{$t('trans0205')}}</span>
                <span v-if="!router.is_gw"
                      class="btn-text text-primary btn-text-strange"
                      @click="deleteNode(router)">{{$t('trans0033')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <m-modal :visible.sync="rssiModalVisible">
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
                  @click="closeRssiModal">{{$t('trans0024')}}</button></div>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import marked from 'marked';
import { formatMac, getStringByte } from '@/util/util';
import { RouterStatus } from '@/util/constant';
import genData from './topo';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph');

export default {
  data() {
    return {
      fullline: false,
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
            rule: value => !/^\s*$/.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => {
              const length = getStringByte(value);
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
      ]
    };
  },
  mounted() {
    this.initChart();
    this.getMeshBand();
    this.createIntervalTask();

    let fullline;
    fullline = localStorage.getItem('fullline');
    if (fullline !== null && fullline === 'true') {
      fullline = true;
    } else {
      fullline = false;
    }
    this.fullline = fullline;
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
    }
  },
  methods: {
    onFulllineChange(val) {
      localStorage.setItem('fullline', val);
      this.drawTopo(this.routers);
    },
    showRssiModal() {
      this.rssiModalVisible = true;
    },
    closeRssiModal() {
      this.rssiModalVisible = false;
    },
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
            data: { name }
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
            this.$http
              .deleteMeshNode({ node: { sn: router.sn, mac: router.mac } })
              .then(() => {
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
    addMeshNode() {
      this.$router.push('/mesh/add');
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

      const data = genData(routers, this.fullline);
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
                color: '#333',
                backgroundColor: '#fff',
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
                    while (
                      (start + sp[index]).length < 10 &&
                      index < sp.length
                    ) {
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
</style>
<style lang="scss" scoped>
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
      .topo-container {
        flex: 1;
        display: flex;
        // height: 500px;
        .legend-wrap {
          order: 3;
          width: 200px;
          .legend-title {
            font-size: 12px;
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
          width: 230px;
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
            }
            .mac {
              display: none;
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

        .tabs {
          padding: 0 20px;
          .tab {
            width: auto;
            font-size: 14px;
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
                  // max-width: 200px;
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
                height: 408px;
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
              }
              .mac {
                display: flex;
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
