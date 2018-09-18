<template>
  <div class="mesh-container">
    <div class='mesh-info'>
      <div class="title">
        <span>{{$t('trans0312')}}</span>
        <div class="btn btn-add" @click="addMeshNode">{{$t('trans0194')}}</div>
      </div>

      <div class="content">
        <div id="topo"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import layout from '../../../layout.vue';
import { formatMac } from '../../../../util/util';
import genData from './topo';

const Color = {
  good: '#00d061',
  bad: '#ff6f00'
};
export default {
  components: {
    layout
  },
  data() {
    return {
      macFormat: formatMac,
      pageActive: true,
      meshNode: [],
      meshNodeTimer: null,
      chart: null
    };
  },
  mounted() {
    this.initChart();
    this.createIntervalTask();
  },
  methods: {
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
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
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
    }
  }
}
</style>
