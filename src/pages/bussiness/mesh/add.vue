<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0194')}}
    </div>
    <div class="page-content">
      <div class="type-container"
           v-show="welcomePage">
        <div class="tip">{{$t('trans0364')}}</div>
        <div class="router-category-container">
          <div class="router"
               v-for="(router,index) in routers"
               :key="index"
               @click="selectRouter(router)">
            <div class="check-container">
              <div class="checkbox"
                   :class="{'checked':selectedCategory === router}"></div>
              <span class="text">{{router.name}}</span>
            </div>
            <img class="img"
                 :src="router.image"
                 alt="">
          </div>
        </div>
        <button class="btn btn-next"
                @click="forwardStep0()">{{$t('trans0055')}}</button>
      </div>
      <div class="info-container"
           v-show="!welcomePage">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item0"
               v-show="stepsOption.current===0">
            <p>{{$t('trans0257')}}</p>
            <p>{{$t('trans0377')}}</p>
            <p>{{$t('trans0378')}}</p>
            <img :src="selectedCategory.tipImage"
                 alt="">
            <div class="button-container">
              <button @click="forwardWelcome()"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forwardStep1()"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item1"
               v-show="stepsOption.current===1">
            <div class="scaning"
                 v-show="scaning">
              <m-spinner color="#333"></m-spinner>
              <p>{{$t('trans0334')}}</p>
            </div>
            <div class="scan-result"
                 v-show="!scaning && nodes.length">
              <div class="router"
                   v-for="(node,index) in nodes"
                   :key="index"
                   @click="selectNode(node)">
                <div class="check-container">
                  <div class="checkbox"
                       :class="{'checked':node.selected}"></div>
                  <div class="info">
                    <p>{{getNodeName(node)}}</p>
                    <p>{{$t('trans0252')}}{{node.sn}}</p>
                  </div>
                </div>
                <img class="img"
                     :src="getNodeImg(node)"
                     alt="">
              </div>
              <div class="button-container">
                <button @click="forwardStep0()"
                        class="btn btn-default ">{{$t('trans0057')}}</button>
                <button @click="addMeshNode()"
                        class="btn">{{$t('trans0055')}}</button>
              </div>
            </div>
            <div class="scan-empty"
                 v-show="!scaning && !nodes.length">
              <p>{{$t('trans0181')}}</p>
              <span class="btn-help"
                    @click.stop="openHelpDialog">{{$t('trans0128')}}</span>
              <div class="button-container">
                <button @click="forwardStep0()"
                        class="btn">{{$t('trans0057')}}</button>
              </div>
            </div>
          </div>
          <div class="step-item step-item2"
               v-show="stepsOption.current===2">
            <div class="success"
                 v-if="added">
              <p>{{$t('trans0192')}}</p>
              <div class="button-container">
                <button @click="backMesh"
                        class="btn">{{$t('trans0233')}}</button>
              </div>
            </div>
            <div class="fail"
                 v-if="!added">
              <p>{{$t('trans0248')}}</p>
              <span class="btn-help"
                    @click.stop="openHelpDialog">{{$t('trans0128')}}</span>
              <div class="button-container">
                <button @click="backMesh"
                        class="btn">{{$t('trans0233')}}</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="loading"
         v-if="scaning"></div>
    <m-modal class="modal"
             :visible.sync="showHelpDialog">
      <div class="modal-content">
        <div class="help-dialog-content">
          <div class="close"
               @click="closeHelpDialog()">
            <img src="../../../assets/images/ic_delete.png"
                 alt="">
          </div>
          <p>{{$t('trans0072')}}</p>
          <div>
            <p>1. {{$t('trans0234')}}</p>
            <p>2. {{$t('trans0215')}}</p>
            <p>3. {{$t('trans0313')}}</p>
            <p>4. {{$t('trans0175')}}</p>
            <p>5. {{$t('trans0330')}}</p>
            <p>6. {{$t('trans0372')}} <a :href="$t('trans0477')"
                 target="_blank">{{$t('trans0477')}}</a> {{$t('trans0392')}}</p>
          </div>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { RouterSnModel } from 'util/constant';

const Routes = [
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
];
export default {
  data() {
    return {
      RouterSnModel,
      routers: Routes,
      welcomePage: true,
      stepsOption: {
        current: 0,
        steps: [
          {
            text: '',
            success: false
          },
          {
            text: '',
            success: false
          },
          {
            text: '',
            success: false
          }
        ]
      },
      scaning: false,
      nodes: [],
      added: false,
      addTimeout: 90,
      selectedCategory: Routes[0],
      showHelpDialog: false
    };
  },
  methods: {
    openHelpDialog() {
      this.showHelpDialog = true;
    },
    closeHelpDialog() {
      this.showHelpDialog = false;
    },
    backMesh() {
      this.$router.push({ path: '/dashboard/mesh/topo' });
    },
    getNodeImg(node) {
      const id = node.sn.slice(0, 2);
      if (id === this.RouterSnModel.M2) {
        return require('../../../assets/images/img_m2.png');
      }
      if (id === this.RouterSnModel.Bee) {
        return require('../../../assets/images/img_bee.png');
      }
      return require('../../../assets/images/ic_general_router.png');
    },
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      const num = node.sn.slice(-4);
      if (id === this.RouterSnModel.M2) {
        return `M2-${num}`;
      }
      if (id === this.RouterSnModel.Bee) {
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
              this.$loading.close();
              this.forwardStep2(false);
              clearInterval(this.checkTimer);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  this.$loading.close();
                  this.added = true;
                  this.forwardStep2(true);
                  clearInterval(this.checkTimer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
        })
        .catch(() => {
          this.$loading.close();
          this.forwardStep2(false);
        });
    },
    forwardWelcome() {
      this.welcomePage = true;
    },
    forwardStep0() {
      this.welcomePage = false;
      this.stepsOption.current = 0;
      this.stepsOption.steps[0].success = true;
    },
    forwardStep1() {
      this.stepsOption.current = 1;
      this.stepsOption.steps[1].success = true;
      this.scaning = true;
      this.$http
        .scanMeshNode()
        .then(res => {
          this.nodes = res.data.result
            .filter(n => n.sn.slice(0, 2) === this.selectedCategory.sn)
            .map(n => ({ ...n, selected: false }));
          this.scaning = false;
        })
        .catch(() => {
          this.scaning = false;
        });
    },
    forwardStep2(result) {
      this.stepsOption.current = 2;
      this.stepsOption.steps[2].success = result;
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
.help-dialog-content {
  // width: 500px;
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
        background: #fff;
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
  // margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .step {
    width: 100%;
  }
  .btn-help {
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }c
  .step-content {
    width: 100%;
  }
  .step-item {
    .button-container {
      margin: 36px 0;
      display: flex;
      justify-content: center;
      button {
        display: inline-block;
        // flex: 1;
        margin-right: 20px;
        width: 160px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .step-item0 {
    margin-top: 50px;
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
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        display: block;
        margin: 0 auto;
      }
    }
    .scan-empty {
      text-align: center;
      margin-top: 100px;
      p {
        font-size: 14px;
        text-align: center;
      }
    }
    .scan-result {
      margin-top: 100px;
      .router {
        display: flex;
        background: #f1f1f1;
        width: 340px;
        height: 140px;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 20px;

        &:first-child {
          margin-top: 0;
        }
        .check-container {
          // flex: 1;
          display: flex;
          align-items: center;
          align-content: center;
          // margin-left: 20px;
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
            background: #fff;
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

@media screen and (min-width: 769px) and (max-width: 1599px) {
  .help-dialog {
    padding: 250px;
  }
}
@media screen and (max-width: 768px) {
  .help-dialog-content {
    a {
      word-wrap: break-word;
    }
  }

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
    .step-item {
      .button-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        button {
          width: 100%;
          margin: 0;
          &:last-child {
            margin-top: 20px;
          }
        }
      }
    }
    .step-item1 {
      .scan-result {
        .router {
          width: 300px;
        }
      }
    }
  }
}
@media screen and (width: 320px) {
  .type-container {
    .router {
      width: 250px;
      img {
        width: 70px;
        height: 70px;
      }
    }
    .btn-next {
      width: 250px;
    }
  }
  .info-container {
    .step-item0 {
      img {
        width: 250px;
        height: 250px;
      }
    }
    .step-item1 {
      .scan-result {
        .router {
          width: 100%;
          img {
            width: 70px;
            height: 70px;
          }
        }
      }
    }
  }
}
</style>
