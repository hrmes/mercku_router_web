<template>
  <div class="mesh-container">
    <div class='mesh-info'>
      <div class="title">
        <div class="tabs">
          <span class="tab" :class="{'selected':!showTable}" @click="showTable=false">{{$t('trans0312')}}</span>
          <span>/</span>
          <span class="tab" :class="{'selected':showTable}" @click="showTable=true">{{$t('trans0312')}}</span>
        </div>
        <div class="btn btn-add" @click="addMeshNode">{{$t('trans0194')}}</div>
      </div>
      <div class="content">
        <div id="topo" v-show="!showTable"></div>
        <div class="table" v-show="showTable">
          <div class="table-header">
            <div class="name">{{$t('trans0005')}}</div>
            <div class="type">{{$t('trans0068')}}</div>
            <div class="sn">{{$t('trans0251')}}</div>
            <div class="version">{{$t('trans0300')}}</div>
            <div class="ip">{{$t('trans0151')}}</div>
            <div class="mac">{{$t('trans0201')}}</div>
            <div class="operate">{{$t('trans0370')}}</div>
          </div>
          <div class="table-content">
            <div class="router" v-for="router in routers" :key="router.sn">
              <div class="name">{{router.name}}</div>
              <div class="type">{{router.is_gw ? $t('trans0165'): $t('trans0186')}}</div>
              <div class="sn">{{router.sn}}</div>
              <div class="version">{{router.version.current}}</div>
              <div class="ip">{{router.ip}}</div>
              <div class="mac">{{formatMac(router.mac.lan)}}</div>
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
  </div>
</template>
<script>
import echarts from 'echarts';
import layout from '../../../layout.vue';
import Progress from '../../../component/progress/index.vue';
import { formatMac } from '../../../../util/util';
import genData from './topo';

const Color = {
  good: '#00d061',
  bad: '#ff6f00'
};
export default {
  components: {
    'm-progress': Progress,
    layout
  },
  data() {
    return {
      formatMac,
      pageActive: true,
      meshNode: [],
      meshNodeTimer: null,
      chart: null,
      showTable: false,
      routers: [],
      reboot: false
    };
  },
  mounted() {
    this.initChart();
    this.createIntervalTask();
  },
  methods: {
    deleteNode(router) {},
    rebootNode(router) {
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
    },
    resetNode(router) {},
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
      this.routers = routers;
      const data = genData(routers);
      const option = {
        color: [Color.good, Color.bad],

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
                  return `${category.name}\n{underline|}`;
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
  padding: 0 2%;
  display: flex;
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
            &:hover {
              text-decoration: none;
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
      padding: 15px 0;

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
          > div {
            flex: 1;
          }
        }
        .table-content {
          padding: 0 30px;
          .router {
            display: flex;
            padding: 30px 0;
            > div {
              flex: 1;
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
</style>
