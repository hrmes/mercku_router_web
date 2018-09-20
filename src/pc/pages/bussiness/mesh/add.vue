<template>
  <layout>
    <div class="mesh-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0194')}}
        </div>
        <div class="type-container" v-show="current===-1">
          <div class="tip">{{$t('trans0364')}}</div>
          <div class="router-category-container">
            <div class="router" v-for="(router,index) in routers" :key="index" @click="selectRouter(router)">
              <div class="check-container">
                <div class="checkbox" :class="{'checked':selectedCategory === router}"></div>
                <span class="text">{{router.name}}</span>
              </div>
              <img class="img" :src="router.image" alt="">
            </div>
          </div>
          <button class="btn btn-next" @click="step(0)">{{$t('trans0055')}}</button>
        </div>
        <div class="info-container" v-show="current>=0">
          <div class="step">
            <m-step :steps="steps" :current="current"></m-step>
          </div>
          <div class="step-content">
            <div class="step-item step-item0" v-show="current===0">
              <p>{{$t('trans0257')}}</p>
              <p>{{$t('trans0377')}}</p>
              <p>{{$t('trans0378')}}</p>
              <img :src="selectedCategory.tipImage" alt="">
              <div class="button-container">
                <button @click="step(-1)" class="btn btn-default ">{{$t('trans0057')}}</button>
                <button @click="step(1)" class="btn">{{$t('trans0055')}}</button>
              </div>
            </div>
            <div class="step-item step-item1" v-show="current===1">
              <div class="scaning" v-show="scaning">
                <img src="../../../assets/images/loading.gif" alt="">
                <p>{{$t('trans0334')}}</p>
              </div>
              <div class="scan-result" v-show="!scaning && nodes.length">
                <div class="router" v-for="(node,index) in nodes" :key="index" @click="selectNode(node)">
                  <div class="check-container">
                    <div class="checkbox" :class="{'checked':node.selected}"></div>
                    <div class="info">
                      <p>{{getNodeName(node)}}</p>
                      <p>{{$t('trans0252')}}{{node.sn}}</p>
                    </div>
                  </div>
                  <img class="img" :src="getNodeImg(node)" alt="">
                </div>
                <div class="button-container">
                  <button @click="step(0)" class="btn btn-default ">{{$t('trans0057')}}</button>
                  <button @click="addMeshNode" class="btn">{{$t('trans0055')}}</button>
                </div>
              </div>
              <div class="scan-empty" v-show="!scaning && !nodes.length">
                <p>{{$t('trans0181')}}</p>
                <span class="btn-help" @click="openHelpDialog">{{$t('trans0128')}}</span>
                <div class="button-container">
                  <button @click="step(0)" class="btn">{{$t('trans0057')}}</button>
                </div>
              </div>
            </div>
            <div class="step-item step-item2" v-show="current===2">
              <div class="success" v-if="added">
                <p>{{$t('trans0192')}}</p>
                <div class="button-container">
                  <button @click="backMesh" class="btn">{{$t('trans0233')}}</button>
                </div>
              </div>
              <div class="fail" v-if="!added">
                <p>{{$t('trans0248')}}</p>
                <span class="btn-help" @click="openHelpDialog">{{$t('trans0128')}}</span>
                <div class="button-container">
                  <button @click="backMesh" class="btn">{{$t('trans0233')}}</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-if="scaning"></div>
    <div class="help-dialog" v-if="showHelpDialog">

      <div class="help-dialog-content">
        <div class="close" @click="closeHelpDialog()">
          <img src="../../../assets/images/ic_delete.png" alt="">
        </div>
        <p>{{$t('trans0072')}}</p>
        <div>
          <p>1.{{$t('trans0234')}}</p>
          <p>2.{{$t('trans0215')}}</p>
          <p>3.{{$t('trans0313')}}</p>
          <p>4.{{$t('trans0175')}}</p>
          <p>5.{{$t('trans0330')}}</p>
          <p>6.{{$t('trans0372')}}</p>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
// import Input from '../../../component/input/input.vue';
import layout from '../../../layout.vue';
import mCheckbox from '../../../component/checkbox/index.vue';
import mStep from '../../../component/step/index.vue';
import { RouterSnModel } from '../../../../util/constant';

export default {
  components: {
    layout,
    mCheckbox,
    mStep
  },
  data() {
    return {
      RouterSnModel,
      routers: [
        {
          name: 'M2 Bee Wi-Fi Mesh Node',
          image: require('../../../assets/images/img_bee.png'),
          tipImage: require('../../../assets/images/img_add_plug_bee.jpg'),
          sn: '02'
        },
        {
          name: 'M2 Standalone Wi-Fi router',
          image: require('../../../assets/images/img_m2.png'),
          tipImage: require('../../../assets/images/img_add_plug_m2.jpg'),
          sn: '01'
        }
      ],
      current: -1,
      steps: ['', '', ''],
      scaning: false,
      nodes: [],
      added: false,
      addTimeout: 90,
      selectedCategory: null,
      showHelpDialog: false
    };
  },
  mounted() {
    this.selectedCategory = this.routers[0];
  },
  methods: {
    openHelpDialog() {
      this.showHelpDialog = true;
    },
    closeHelpDialog() {
      this.showHelpDialog = false;
    },
    backMesh() {
      this.$router.push({ path: '/dashboard/mesh' });
    },
    getNodeImg(node) {
      const id = node.sn.slice(0, 2);
      if (id === this.RouterSnModel.M2) {
        return require('../../../assets/images/img_m2.png');
      } else if (id === this.RouterSnModel.Bee) {
        return require('../../../assets/images/img_bee.png');
      }
      return require('../../../assets/images/ic_general_router.png');
    },
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      const num = node.sn.slice(-4);
      if (id === this.RouterSnModel.M2) {
        return `M2-${num}`;
      } else if (id === this.RouterSnModel.Bee) {
        return `Bee-${num}`;
      }
      return '';
    },
    selectRouter(router) {
      this.selectedCategory = router;
    },
    selectNode(node) {
      this.nodes.forEach(n => {
        n.selected = false;
      });
      node.selected = true;
    },
    addMeshNode() {
      const node = this.nodes.filter(n => n.selected)[0];
      if (!node) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.$loading.open({
        template: `<div class="add-mesh-tip">${this.$t('trans0195')}</div>`
      });
      // 超时90秒，间隔3秒
      this.$http
        .addMeshNode({ node })
        .then(() => {
          let timeout = this.addTimeout;
          this.checkTimer = setInterval(() => {
            if (timeout < 0) {
              this.added = false;
              this.step(2);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  this.$loading.close();
                  this.added = true;
                  this.step(2);
                  clearInterval(this.checkTimer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
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
    step(index) {
      this.current = index;
      if (this.current === 1) {
        this.scaning = true;
        this.$http.scanMeshNode().then(res => {
          this.nodes = res.data.result
            .filter(n => n.sn.slice(0, 2) === this.selectedCategory.sn)
            .map(n => ({ ...n, selected: false }));
          this.scaning = false;
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  opacity: 0;
  z-index: 1000;
}
.help-dialog {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  padding-left: 300px;
  background: rgba(0, 0, 0, 0.3);
  .help-dialog-content {
    width: 500px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px 30px;
    border-radius: 5px;
  }
  .close {
    float: right;
    cursor: pointer;
    img {
      width: 15px;
      height: 15px;
    }
  }
}
.mesh-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;

  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
      margin-bottom: 60px;
    }
    .type-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      align-items: center;
      .tip {
        margin-bottom: 30px;
      }
      .router {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 340px;
        height: 140px;
        border-radius: 5px;
        background-color: #f1f1f1;
        margin-bottom: 30px;
        cursor: pointer;
        .check-container {
          display: flex;
          align-items: center;
          align-content: center;
          .text {
            margin-left: 20px;
            display: inline-block;
            font-weight: bold;
            font-size: 14px;
            width: 120px;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border-radius: 2px;
            border: 1px solid #999;
            border-radius: 50%;
            &.checked {
              background: url(../../../assets/images/ic_selected.png) no-repeat
                center;
              border: none;
              background-size: 90%;
              background-color: #00d061;
            }
          }
        }
        img {
          width: 140px;
          height: 140px;
        }
        .name {
          width: 120px;
          font-weight: bold;
          font-size: 14px;
        }
      }
      .btn-next {
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }
    .info-container {
      width: 564px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn-help {
        font-size: 12px;
        text-decoration: underline;
        cursor: pointer;
      }
      .step-item {
        .button-container {
          margin-top: 36px;
          display: flex;
          button {
            display: inline-block;
            flex: 1;
            margin-right: 20px;
            width: 160px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .step-item0 {
        p {
          margin: 0;
          text-align: center;
          margin-bottom: 10px;
          &:first-child {
            margin-bottom: 20px;
            font-size: 16px;
          }
        }
        img {
          width: 280px;
          height: 280px;
          display: block;
          margin: 0 auto;
        }
      }
      .step-item1 {
        .button-container {
          margin-top: 140px;
        }
        .scaning {
          margin-top: 150px;
          img {
            display: block;
            margin: 0 auto;
          }
        }
        .scan-empty {
          text-align: center;
          margin-top: 50px;
          p {
            font-size: 14px;
            text-align: center;
          }
        }
        .scan-result {
          margin-top: 80px;
          .router {
            display: flex;
            background: #f1f1f1;
            width: 340px;
            height: 140px;
            border-radius: 5px;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .check-container {
              flex: 1;
              display: flex;
              align-items: center;
              align-content: center;
              margin-left: 20px;
              .info {
                margin-left: 20px;
                p {
                  margin: 0;
                  white-space: nowrap;
                  &:first-child {
                    margin-bottom: 10px;
                    font-weight: bold;
                  }
                }
              }
              .text {
                margin-left: 20px;
                display: inline-block;
                font-weight: bold;
                font-size: 14px;
                width: 120px;
              }
              .checkbox {
                width: 18px;
                height: 18px;
                border-radius: 2px;
                border: 1px solid #999;
                border-radius: 50%;
                &.checked {
                  background: url(../../../assets/images/ic_selected.png)
                    no-repeat center;
                  border: none;
                  background-size: 90%;
                  background-color: #00d061;
                }
              }
            }

            img {
              width: 100px;
              height: 100px;
            }
          }
        }
      }
      .step-item2 {
        p {
          font-size: 16px;
          text-align: center;
          margin-top: 50px;
        }
        .button-container {
          margin-top: 160px;
        }
        .fail {
          text-align: center;
        }
        .success {
          text-align: center;
        }
      }
    }
  }
}

@media screen and (min-width: 769px) and (max-width: 1599px) {
  .help-dialog {
    padding: 250px;
  }
}
@media screen and (max-width: 768px) {
  .help-dialog {
    padding: 0;
  }
  .mesh-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .type-container {
        .router {
          width: 300px;
          img {
            width: 120px;
            height: 120px;
          }
        }
        .btn-next {
          width: 300px;
        }
      }
      .info-container {
        width: 100%;
      }
    }
  }
}
@media screen and (width: 320px) {
  .mesh-container {
    .content {
      min-height: 450px;
      .type-container {
        .router {
          width: 250px;
          img {
            width: 80px;
            height: 80px;
          }
        }
        .btn-next {
          width: 250px;
        }
      }
    }
  }
}
</style>

