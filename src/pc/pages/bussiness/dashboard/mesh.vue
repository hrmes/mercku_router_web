<template>
  <div class="mesh-container">
    <div class='mesh-info'>
      <div class="title">
        <div class="tabs">
          <span class="tab" :class="{'selected':!showTable}" @click="$router.push('/dashboard/mesh/topo')">{{$t('trans0312')}}</span>
          <span>/</span>
          <span class="tab" :class="{'selected':showTable}" @click="$router.push('/dashboard/mesh/table')">{{$t('trans0384')}}</span>
        </div>
        <div class="btn btn-add" @click="addMeshNode">{{$t('trans0194')}}</div>
      </div>
      <div class="content">
        <div id="topo" v-show="!showTable"></div>
        <div class="table" v-show="showTable">
          <div class="table-header">
            <div class="name">
              {{$t('trans0005')}}

            </div>
            <div class="type">{{$t('trans0068')}}</div>
            <div class="sn">{{$t('trans0251')}}</div>
            <div class="version">{{$t('trans0300')}}</div>
            <div class="ip">{{$t('trans0151')}}</div>
            <div class="mac">{{$t('trans0201')}}</div>
            <div class="operate">{{$t('trans0370')}}</div>
          </div>
          <div class="table-content">
            <div class="router" :class="{'expand':router.expand}" v-for="router in routers" :key="router.sn">
              <div class="name">
                <div class="icon">
                  <img :src="router.image" alt="">
                </div>
                  <div class="wrap">
                    <div class="text">{{router.name}}</div>
                    <div class="edit" @click="onClickRouterName(router)">
                      <img src="../../../assets/images/ic_edit.png" alt="">
                  </div>
                    </div>
                    <div @click="router.expand = !router.expand" class="expand" :class="{'expand':router.expand,'collapse':!router.expand}">
                      <img src="../../../assets/images/ic_side_bar_pick_up.png" alt="">
                </div>
                    </div>
                    <div class="type">
                      <span class="label">{{$t('trans0068')}}</span>
                      <span class="value">{{router.is_gw ? $t('trans0165'): $t('trans0186')}}</span>
                    </div>
                    <div class="sn">
                      <span class="label">{{$t('trans0251')}}</span>
                      <span class="value">{{router.sn}}</span>
                    </div>
                    <div class="version">
                      <span class="label">{{$t('trans0300')}}</span>
                      <span class="value"> {{router.version.current}}</span>
                    </div>
                    <div class="ip">
                      <span class="label">{{$t('trans0151')}}</span>
                      <span class="value">{{router.ip}}</span>
                    </div>
                    <div class="mac">
                      <span class="label">{{$t('trans0201')}}</span>
                      <span class="value">{{formatMac(router.mac.lan)}}</span>
                    </div>
                    <div class="operate">
                      <span class="reboot" @click="rebootNode(router)">{{$t('trans0122')}}</span>
                      <span v-if="router.is_gw" class="reset" @click="resetNode(router)">{{$t('trans0205')}}</span>
                      <span v-if="!router.is_gw" class="delete" @click="deleteNode(router)">{{$t('trans0033')}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="reboot">
            <m-progress :label="$t('trans0322')"></m-progress>
          </div>
          <div v-if="reset">
            <m-progress :label="$t('trans0116')"></m-progress>
          </div>
          <div class="edit-name-modal" v-if="showModal">
            <div class="opcity"></div>
            <div class="content">
              <m-form :model="form" :rules="rules">
                <m-form-item prop="newName">
                  <editable-select class="small" :options="options" :label="$t('trans0005')" v-model="form.newName"></editable-select>
                </m-form-item>
              </m-form>
              <div class="btn-inner">
                <button @click="closeUpdateModal" class="btn btn-default">{{$t('trans0025')}}</button>
                <button @click="updateMehsNode(routerSelected,form.newName)" class="btn">{{$t('trans0024')}}</button>
              </div>
            </div>
          </div>
        </div>
</template>
<script>
import echarts from 'echarts';
import layout from '../../../layout.vue';
import Progress from '../../../component/progress/index.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import editableSelect from '../../../component/editableSelect/index.vue';
import { formatMac, getStringByte } from '../../../../util/util';
import genData from './topo';

const Color = {
  good: '#00d061',
  bad: '#ff6f00'
};
export default {
  components: {
    'm-progress': Progress,
    layout,
    editableSelect,
    'm-form-item': FormItem,
    'm-form': Form
  },
  data() {
    return {
      formatMac,
      pageActive: true,
      meshNode: [],
      meshNodeTimer: null,
      chart: null,
      routers: [],
      reboot: false,
      reset: false,
      routerSelected: null,
      showModal: false,
      form: {
        newName: ''
      },
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
    closeUpdateModal() {
      this.form.newName = '';
      this.showModal = false;
    },
    onClickRouterName(router) {
      this.routerSelected = router;
      this.form.newName = router.name;
      this.showModal = true;
    },
    updateMehsNode(router, name) {
      this.$loading.open();
      this.$http
        .updateMeshNode(router.sn, { name })
        .then(() => {
          this.$loading.close();
          router.name = name;
          this.showModal = false;
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
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
            this.$http
              .reboot({ node_ids: [router.sn] })
              .then(() => {
                if (router.is_gw) {
                  this.reboot = true;
                  this.$reconnect({
                    onsuccess: () => {
                      this.reboot = false;
                      this.$router.push({ path: '/login' });
                    },
                    ontimeout: () => {
                      this.$router.push({ path: '/unconnect' });
                    }
                  });
                } else {
                  this.$toast(this.$t('trans0040'), 3000, 'success');
                  this.routers = this.routers.filter(r => r.sn === router.sn);
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
            this.$http
              .resetMeshNode({ node_ids: [router.sn] })
              .then(() => {
                this.reset = true;
                this.$reconnect({
                  onsuccess: () => {
                    this.reset = false;
                    window.location.href = '/';
                  },
                  ontimeout: () => {
                    window.location.href = '/';
                  }
                });
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
              });
          }
        }
      });
    },
    addMeshNode() {
      this.$router.push('/mesh/add');
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('topo'));
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
        color: [Color.good, Color.bad],

        title: {
          subtext: this.$t('trans0302'),
          subtextStyle: {
            color: '#333'
          },
          left: 20
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
            left: 20,
            top: 35,
            selectedMode: false
          }
        ],
        series: [
          {
            type: 'graph',
            top: 100,
            bottom: 60,
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: 3,
            cursor: 'pointer',
            hoverAnimation: false,
            label: {
              normal: {
                show: true,
                position: 'bottom',
                color: '#333',
                backgroundColor: '#fff',
                lineHeight: 12,
                formatter(category) {
                  // 处理手动加上的sn,label不显示sn
                  return `${category.name.replace(/:.*/, '')}`;
                },
                rich: {
                  underline: {
                    borderColor: '#777',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0,
                    lineHeight: 4
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
            lineStyle: {
              width: 2
            }
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
  display: flex;
  .edit-name-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    .opcity {
      width: 100%;
      height: 100%;
      position: fixed;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      z-index: -1;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 330px;
      height: 218px;
      border-radius: 5px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      background-color: #ffffff;
      border: solid 1px #f1f1f1;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
  .mesh-info {
    .title {
      font-size: 16px;
      color: #333333;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
      .tabs {
        display: inline-block;
        .tab {
          cursor: pointer;
          &.selected {
            color: #999;
            text-decoration: underline;
            &:hover {
              cursor: default;
              color: #999;
            }
          }
          &:hover {
            text-decoration: underline;
            color: #333;
          }
        }
      }
    }
    .btn-add {
      width: 100px;
      height: 28px;
      line-height: 28px;
      float: right;
    }
    width: 100%;
    background: white;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 0 20px;
    flex-direction: column;
    margin-bottom: 20px;
    .content {
      padding-top: 15px;

      #topo {
        width: 100%;
        height: 100%;
        min-height: 500px;
      }
      .table {
        .table-header {
          display: flex;
          padding: 15px 30px;
          background: #f1f1f1;
        }
        .name {
          flex: 1;
        }
        .sn {
          width: 140px;
        }
        .type {
          width: 120px;
        }
        .version {
          width: 100px;
        }
        .ip {
          width: 140px;
        }
        .mac {
          width: 140px;
        }
        .operate {
          width: 200px;
        }
        .table-content {
          padding: 0 30px;
          .router {
            display: flex;
            padding: 30px 0;
            span.label {
              display: none;
            }
            > div {
              display: flex;
              align-items: center;
            }
            .name {
              display: flex;
              align-items: center;
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
                // width: 80px;
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
                margin-left: 10px;
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
@media screen and (max-width: 768px) {
  .mesh-container {
    .edit-name-modal {
      .opcity {
      }

      .content {
        width: 80%;
        .select-container {
        }
        .btn-inner {
          .btn {
            &:last-child {
            }
          }
        }
      }
    }
    .mesh-info {
      background: #f1f1f1;
      padding: 0;
      .title {
        .tabs {
          .tab {
            font-size: 14px;
            &.selected {
              &:hover {
              }
            }
            &:hover {
            }
          }
        }
      }
      .btn-add {
        font-size: 12px;
        width: 80px;
      }

      .content {
        padding-top: 0;
        #topo {
          background: #fff;
          border-radius: 5px;
        }
        .table {
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
          .sn {
          }
          .type {
          }
          .version {
          }
          .ip {
          }
          .mac {
          }
          .operate {
          }
          .table-content {
            padding: 0;
            background: #f1f1f1;

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
                padding: 20px 0;
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
                  background: #4237dd;
                  color: #fff;
                  text-align: center;
                  border-radius: 4px;
                  height: 58px;
                  line-height: 58px;
                }
                .reset,
                .delete {
                  width: 255px;
                  background: transparent;
                  border: 1px solid #ff0500;
                  color: #ff0500;
                  text-align: center;
                  border-radius: 4px;
                  height: 58px;
                  line-height: 58px;
                  margin-left: 0;
                  margin-top: 20px;
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
    .edit-name-modal {
      .opcity {
      }

      .content {
        .select-container {
        }
        .btn-inner {
          .btn {
            &:last-child {
            }
          }
        }
      }
    }
    .mesh-info {
      .title {
        .tabs {
          .tab {
            font-size: 14px;
            &.selected {
              &:hover {
              }
            }
            &:hover {
            }
          }
        }
      }
      .btn-add {
        font-size: 12px;
        width: 80px;
      }

      .content {
        #topo {
        }
        .table {
          .table-header {
          }
          .name {
          }
          .sn {
          }
          .type {
          }
          .version {
          }
          .ip {
          }
          .mac {
          }
          .operate {
          }
          .table-content {
            .router {
              > div {
              }
              .name {
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
                span {
                  &:hover {
                  }
                  &:active {
                  }
                  &:first-child {
                  }
                }
                .reboot {
                }
                .reset,
                .delete {
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
