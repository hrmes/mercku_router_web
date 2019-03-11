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
        <button class="btn btn-add btn-primary btn-small"
                @click="addMeshNode">{{$t('trans0194')}}</button>
      </div>
      <div class="content">
        <div class="topo-container"
             v-show="!showTable">
          <div class="legend-wrap">
            <p class="legend-title">{{$t('trans0302')}}</p>
            <div class="legend">
              <div class="legend-item">{{$t('trans0193')}}</div>
              <div class="legend-item">{{$t('trans0196')}}</div>
              <div class="legend-item">{{$t('trans0214')}}</div>
            </div>
          </div>
          <div class="switch-wrap">
            <label for=""> {{$t('trans0562')}}
              <div class="tool">
                <m-popover :title="this.$t('trans0562')"
                           :content="this.$t('trans0558')">
                  <img width="14"
                       src="../../../assets/images/ic_question.png"
                       alt="">
                </m-popover>
              </div>
            </label>
            <m-switch v-model="mesh24g"
                      :onChange="(val)=>updateMeshBand(val)"></m-switch>
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
              {{$t('trans0151')}}
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
                  <div class="text">{{router.name}}</div>
                  <div class="edit"
                       v-if="!isRouterOffline(router)"
                       @click.stop="onClickRouterName(router)">
                    <img src="../../../assets/images/ic_edit.png"
                         alt>
                  </div>
                </div>
                <div class="expand"
                     :class="{'expand':router.expand,'collapse':!router.expand}">
                  <img src="../../../assets/images/ic_side_bar_pick_up.png"
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
                <span class="reboot"
                      v-if="!isRouterOffline(router)"
                      @click="rebootNode(router)">{{$t('trans0122')}}</span>
                <span v-if="router.is_gw"
                      class="reset"
                      @click="resetNode(router)">{{$t('trans0205')}}</span>
                <span v-if="!router.is_gw"
                      class="delete"
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
            <m-editable-select class="small"
                               :options="options"
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

  </div>
</template>
<script>
import { formatMac, getStringByte } from 'util/util';
import { RouterStatus } from 'util/constant';
import genData from './topo';

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/graph');

export default {
  data() {
    return {
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
  },
  computed: {
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
    updateMeshBand(val) {
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
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.mesh24g = !val;
          this.$loading.close();
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
<style lang="scss" scoped>
.mesh-container {
  flex: 1;
  display: flex;

  .mesh-info {
    display: flex;
    .title {
      position: relative;
      .tab {
        font-size: 16px;
        font-weight: bold;
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
      padding-top: 35px;
      flex: 1;
      display: flex;
      .topo-container {
        flex: 1;
        display: flex;
        .legend-wrap {
          order: 3;
          width: 200px;
          .legend-title {
            font-size: 12px;
            color: #333;
            margin: 0;
            text-align: right;
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
          align-items: flex-start;
          padding-left: 20px;
          width: 200px;
          label {
            display: flex;
            margin-right: 15px;
            img {
              position: relative;
              top: -7px;
              margin-left: 5px;
              cursor: pointer;
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
          width: 120px;
        }
        .ip {
          width: 150px;
        }
        .mac {
          display: none;
        }
        .operate {
          width: 150px;
        }
        .table-content {
          padding: 0 20px;

          .router {
            display: flex;
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f1f1f1;
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
                  width: 17px;
                  height: 7px;
                  opacity: 0.7;
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
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
                &:active {
                  text-decoration: underline;
                }
                &:first-child {
                  margin-left: 0;
                }
              }
              .reboot {
                color: #0b9eff;
              }
              .reset,
              .delete {
                color: #ff4949;
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
    .form {
      flex: 1;
    }
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
    .mesh-info {
      padding: 0;
      .title {
        .tabs {
          .tab {
            font-size: 14px;
          }
        }
      }
      .btn-add {
        font-size: 12px;
        width: 100px;
        height: 30px;
      }

      .content {
        padding-top: 25px;
        .topo-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          .legend-wrap {
            order: 2;
            .legend-title {
              text-align: left;
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
            padding: 15px 0 !important;
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
            .router {
              display: flex;
              flex-direction: column;
              margin-bottom: 10px;
              background: #fff;
              padding: 0 20px;
              border-radius: 5px;
              height: 60px;
              overflow: hidden;
              &.expand {
                height: 550px;
                overflow: auto;
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
                .icon {
                  img {
                  }
                }
                .text {
                }

                .edit {
                  img {
                  }
                }
              }
              .operate {
                display: flex;
                flex-direction: column;
                span {
                  &:hover {
                  }
                  &:active {
                  }
                  &:first-child {
                  }
                }
                .reboot {
                  width: 255px;
                  background: #d6001c;
                  color: #fff;
                  text-align: center;
                  border-radius: 4px;
                  height: 46px;
                  font-size: 14px;
                  padding: 16px 0;
                  line-height: 1;
                }
                .reset,
                .delete {
                  width: 255px;
                  background: transparent;
                  border: 1px solid #ff0500;
                  color: #ff0500;
                  text-align: center;
                  border-radius: 4px;
                  height: 46px;
                  font-size: 14px;
                  padding: 16px 0;
                  margin-left: 0;
                  margin-top: 20px;
                  line-height: 1;
                }
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
        width: 80px;
      }
    }
  }
}
</style>
