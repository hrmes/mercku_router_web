<template>
  <div class="add-node">
    <div class="page-content">
      <div class="steps-container"
           v-if="!showTips && !isAddSuccess && !isAddFail">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item--rich"
               v-show="isStep(0)">
            <div class="main-content">
              <div class="img-container">
                <img src="@/assets/images/add/img_add_01.svg" />
              </div>
              <p class="step-item__tip">{{transText('trans0693')}}</p>
              <p class="step-item__tip step-item__tip--gray">{{$t('trans0698')}}</p>
            </div>
            <div class="button-container">
              <button @click="forward2step(1)"
                      class="btn btn-large">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(1)">
            <div class="main-content">
              <div class="img-container">
                <img src="@/assets/images/add/img_add_02.svg" />
              </div>
              <p class="step-item__tip">{{$t('trans1005')}}</p>
            </div>
            <div class="button-container">
              <button @click="forward2step(0)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(2)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(2)">
            <div class="main-content">
              <div class="img-container">
                <img src="@/assets/images/add/img_add_03.svg" />
              </div>
              <p class="step-item__tip">
                {{$t('trans0636')}}
              </p>
            </div>
            <div class="button-container">
              <button @click="forward2step(1)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(3)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--scan"
               v-show="isStep(3)">
            <div class="main-content">
              <div class="scaning "
                   v-if="isScanning">
                <m-lottie-loading :size="150"></m-lottie-loading>
                <p>{{transText($t('trans0334'))}}</p>
              </div>
              <div class="scan-result"
                   v-if="isScanFinished">
                <div v-if="nodes.length === 1"
                     class="scan-result__content">
                  <div class="router">
                    <img class="router__img"
                         :src="getNodeImage(nodes[0].sn)" />
                    <div class="router__info">
                      <h6 class="router__found">{{$t('trans0658')}}</h6>
                      <p class="router__sn"
                         v-if="nodes[0].sn">
                        <label class="with-colon">{{$t('trans0252')}}:</label>
                        <span>{{nodes[0].sn}}</span>
                      </p>
                      <p class="router__mac"
                         v-else>
                        <label class="with-colon">{{$t('trans0188')}}:</label>
                        <span>{{nodes[0].mac['2.4G'] || nodes[0].mac['5G']}}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else-if="nodes.length >1"
                     class="scan-result__much">
                  <img :src="require('base/assets/images/common/img_default_empty.png')" />
                  <p class="scan-result__title">{{$t('trans0773')}}</p>
                  <p class="scan-result__description">{{$t('trans0637')}}</p>
                </div>
                <div v-else
                     class="scan-result__empty">
                  <img class="scan-result__image"
                       :src="require('base/assets/images/common/img_default_empty.png')" />
                  <p class="scan-result__title">{{transText($t('trans0181')) }}</p>
                  <span class="btn-help"
                        @click.stop="updateHelpVisible(true)">{{$t('trans0128')}}</span>
                </div>
              </div>
              <div class="adding"
                   v-if="isAdding">
                <m-lottie-loading :size="150"
                                  :loadingType="'addNode'"></m-lottie-loading>
                <p>{{$t('trans0195')}}</p>
              </div>
            </div>
            <div v-if="isScanFinished"
                 class="button-container">
              <template v-if="nodes.length === 1">
                <button @click="forward2step(2)"
                        class="btn btn-default ">{{$t('trans0057')}}</button>
                <button @click="addMeshNode(nodes[0])"
                        class="btn">{{$t('trans0194')}}</button>
              </template>
              <template v-else-if="nodes.length >1">
                <button @click="forward2step(0)"
                        class="btn btn-large">{{$t('trans0162')}}</button>
              </template>
              <template v-else>
                <button @click="scanHandler"
                        class="btn btn-large">{{$t('trans0162')}}</button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="result-container"
           v-show="isAddSuccess || isAddFail">
        <div class="result-container__success"
             v-if="isAddSuccess">
          <div class="text-center">
            <img class="result-container__img"
                 src="~@/assets/images/add/img_add_success.png"
                 alt="" />
          </div>
          <div class="result-container__tips">
            <p>{{$t('trans0192')}}</p>
            <p style="font-weight:400">{{$t('trans1007')}}</p>
            <p v-if="isWeakSignal"
               style="font-weight:400;font-size:12px;color:#999;">{{$t('trans0652')}}</p>
          </div>
          <div class="button-container">
            <button @click="updateResultVisiable"
                    class="btn btn-large">{{$t('trans0018')}}</button>
          </div>
        </div>
        <div class="result-container__fail"
             v-if="isAddFail">
          <div class="text-center">
            <img class="result-container__img result-container__img--fail"
                 :src="require('base/assets/images/common/img_default_empty.png')" />
          </div>
          <div class="result-container__tips">{{$t('trans0248')}}</div>
          <div class="text-center">
            <span class="result-container__help"
                  @click.stop="updateHelpVisible(true)">{{$t('trans0128')}}</span>
          </div>
          <div class="button-container">
            <button @click="retry"
                    class="btn btn-large">{{$t('trans0162')}}</button>
          </div>
          <div class="tips">
            <div class="tips__header">
              <img :src="require('base/assets/images/icon/ic_note.svg')" />
              Tips
            </div>
            <div class="tips__content">
              <p>{{$t('trans0638')}}</p>
              <p>{{$t('trans0750')}}</p>
              <p>{{$t('trans0757')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="tips center-wrap"
           v-if="showTips">
        <div class="circle-animation"></div>
        <p class="tips__text successed">{{$t('trans0175')}}</p>
        <div class="button-container">
          <button class="btn btn-large"
                  @click="()=>$router.push('/dashboard/mesh')">{{$t('trans0211')}}</button>
        </div>
      </div>
    </div>
    <!--dialog for help-->
    <m-modal class="modal"
             :visible.sync="showHelpDialog">
      <div class="modal-content">
        <div class="help-dialog-content">
          <div>
            <p>{{transText('trans1001')}}</p>
            <p>{{$t('trans0215')}}</p>
            <p>{{$t('trans0651')}}</p>
            <p>{{$t('trans1002')}}</p>
            <p>{{$t('trans0175')}}</p>
            <p>{{$t('trans0698')}}</p>
            <p>{{$t('trans0661')}}</p>
          </div>
        </div>
      </div>
      <m-modal-footer>
        <button @click="updateHelpVisible(false)"
                class="btn btn-dialog-confirm">{{$t('trans0024')}}</button>
      </m-modal-footer>
    </m-modal>
    <!-- dialog for wireless mesh tips -->
    <m-modal class="wireless-mesh-tips-modal"
             :visible.sync='showWirelessMeshTipsDialog'>
      <m-modal-body class="wireless-mesh-tips-modal-body">
        <div class="img-container">
          <img src="@/assets/images/add/img_together.png"
               alt="">
        </div>
        <p class="tips">{{$t('trans1100')}}</p>
        <button class="btn"
                @click="showWirelessMeshTipsDialog=false">{{$t('trans0211')}}</button>
      </m-modal-body>
    </m-modal>
  </div>
</template>
<script>
import { getNodeImage } from 'base/mixins/router-model';
import { ModelIds, Bands } from 'base/util/constant';

const PageStatus = {
  scanning: 'scanning',
  scan_finished: 'scan_finished',
  adding: 'adding',
  add_success: 'add_success',
  add_fail: 'add_fail'
};
const checkWeakSignal = rssi => rssi < -65;
export default {
  mixins: [getNodeImage],
  data() {
    return {
      scrollbar: document.querySelector('.scrollbar-wrap'),
      PageStatus,
      stepsOption: {
        current: 0,
        steps: new Array(4).fill(0).map((item, index) => ({ text: '', success: index === 0 }))
      },
      pageStatus: '',
      nodes: [],
      addTimeout: 90,
      showTips: false,
      showHelpDialog: false,
      showWirelessMeshTipsDialog: false,
      checkTimer: null,
      isWeakSignal: true
    };
  },
  computed: {
    ...(() => {
      const result = {};
      Object.keys(PageStatus).forEach(k => {
        const strTransform = k
          .split('_')
          .map(str => {
            const [first, ...rest] = str;
            return first.toUpperCase() + rest.join('');
          })
          .join('');
        const key = `is${strTransform}`;
        const handler = function handler() {
          return this.pageStatus === PageStatus[k];
        };
        result[key] = handler;
      });
      return result;
    })(),
    tipsText() {
      return `${this.$t('trans0633')}: ${this.$t('trans0661')}`;
    },
    modelID() {
      const meshId = this.$store.state.meshId || localStorage.getItem('meshId');
      return meshId.charAt(9);
    },
    isMobile() {
      return this.$store.state.isMobile;
    }
  },
  mounted() {
    setTimeout(() => {
      this.showWirelessMeshTipsDialog = true;
    }, 400);
  },
  methods: {
    transText(text) {
      let resultText = '';
      resultText = this.$t(text).replaceAll(
        '%s',
        process.env.CUSTOMER_CONFIG.routers[`${ModelIds[process.env.MODEL_CONFIG.id]}`].shortName
      );
      return resultText;
    },
    transDeviceId(text) {
      console.log(process.env.CUSTOMER_CONFIG.deviceId);
      return this.$t(text).replaceAll(
        '%s',
        process.env.CUSTOMER_CONFIG.deviceID
      );
    },
    isStep(index) {
      return this.stepsOption.current === index;
    },
    updateHelpVisible(visible) {
      this.showHelpDialog = visible;
    },
    updateResultVisiable() {
      this.pageStatus = '';
      this.showTips = true;
    },
    retry() {
      this.stepsOption.current = 0;
      this.pageStatus = '';
      this.isMobile && this.scrollbarToTop();
    },
    addMeshNode(node) {
      if (!node) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.pageStatus = PageStatus.adding;
      // 超时90秒，间隔3秒
      this.$http
        .addMeshNode(
          { node },
          {
            hideToast: true
          }
        )
        .then(() => {
          let timeout = this.addTimeout;
          this.checkTimer = setInterval(() => {
            if (timeout < 0) {
              this.pageStatus = PageStatus.add_fail;
              clearInterval(this.checkTimer);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  this.pageStatus = PageStatus.add_success;
                  this.$http.getMeshNode().then(meshNodeRes => {
                    const meshNodes = meshNodeRes.data.result;
                    if (meshNodes.length) {
                      const type = node.mac[Bands.b5g] ? Bands.b5g : Bands.b24g;
                      // 获取刚添加的节点的sn
                      const meshNode = meshNodes.find(item => item.mac[type] === node.mac[type]);
                      if (meshNode) {
                        const { sn } = meshNode;
                        for (let i = 0; i < meshNodes.length; i += 1) {
                          const mNode = meshNodes[i];
                          if (mNode.sn !== sn && mNode.neighbors) {
                            const neighborNood = mNode.neighbors.find(nItem => nItem.sn === sn);
                            if (neighborNood) {
                              this.isWeakSignal = checkWeakSignal(neighborNood.rssi);
                              break;
                            }
                          }
                        }
                      }
                    }
                  });
                  clearInterval(this.checkTimer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
        })
        .catch(() => {
          this.pageStatus = PageStatus.add_fail;
        });
    },
    forward2step(index, status = true) {
      this.stepsOption.current = index;
      this.stepsOption.steps[index].success = status;
      this.isMobile && this.scrollbarToTop();
      if (index === 3) {
        this.scanHandler();
      }
    },
    scanHandler() {
      this.pageStatus = PageStatus.scanning;

      this.$http
        .scanMeshNode()
        .then(res => {
          this.nodes = res.data.result;
          this.pageStatus = PageStatus.scan_finished;
        })
        .catch(() => {
          this.pageStatus = PageStatus.scan_finished;
        });
    },
    scrollbarToTop() {
      this.scrollbar.scrollTop = 0;
    }
  }
};
</script>
<style lang="scss">
.wireless-mesh-tips-modal {
  .modal-content {
    display: flex;
    justify-content: center;
    padding: 20px !important;
  }
  .wireless-mesh-tips-modal-body {
    width: 300px;
    .img-container {
      width: 100%;
      > img {
        width: 100%;
      }
    }
    .tips {
      width: 100%;
      margin: 0 0 30px;
      white-space: pre-line;
    }
    .btn {
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {
    .wireless-mesh-tips-modal-body {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
$img_folder: '../../../../../base/src/assets/images';
.add-node {
  align-items: center;
  min-height: 600px;
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
}
.page-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: var(--primary-bgc);
}
.help-dialog-content {
  width: 400px;
  p {
    &:first-child {
      margin-top: 0;
    }
    &:before {
      content: '';
      position: relative;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: 5px;
      height: 5px;
      background-color: var(--text_default-color);
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.close {
  float: right;
  cursor: pointer;
  img {
    width: 15px;
    height: 15px;
  }
}
.button-container {
  display: flex;
  justify-content: center;
  margin: 30px 0 0;
  .btn-large {
    width: 340px;
  }
  button {
    display: inline-block;
    margin-right: 20px;
    min-width: 160px;
    width: auto;
    &:last-child {
      margin-right: 0;
    }
  }
}
.center-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 0 auto;
  &.tips {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .tips__text {
    margin: 0 auto;
    &.successed {
      max-width: 400px;
    }
    @media screen and(max-width:768px) {
      width: 100%;
    }
  }
  .tips__subtext {
    color: var(--common_gery-color);
    width: 100%;
    font-size: 12px;
    white-space: pre-line;
  }
}
.tips {
  .tips__text,
  .tips__subtext {
    text-align: center;
  }
}
.circle-animation {
  position: relative;
  background: url(#{$img_folder}/common/add_node_tip_bj.png) no-repeat center;
  background-size: 100%;
  width: 400px;
  aspect-ratio: 10/9;
  margin: 0 auto;
  margin-bottom: 50px;
}
.steps-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  padding: 30px 0;
  .btn-help {
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    color: var(--primary-color);
  }
  .step {
    width: 960px;
  }
  .step-content {
    flex: 1;
  }
  .step-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 340px;
    height: 100%;
    max-height: 660px;
    .step-item__tip {
      margin: 0;
      font-size: 14px;
      margin-top: 20px;
      text-align: left;
    }
    .step-item__tip--gray {
      margin-top: 10px;
      font-size: 12px;
      color: #999;
      white-space: pre-line;
    }
    &.step-item--rich {
      .img-container {
        width: 100%;
        height: 300px;
        background: var(--table_row-bgc);
        img {
          height: 100%;
          display: block;
          margin: 0 auto;
        }
      }
    }
    &.step-item--scan {
      .scaning,
      .adding {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .scan-result {
        .scan-result__empty {
          text-align: center;
          p {
            font-size: 14px;
            text-align: center;
          }
        }
        .scan-result__image {
          width: 200px;
        }
        .scan-result__title {
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0 10px;
        }
        .scan-result__content {
          .router {
            .router__img {
              width: 200px;
              display: block;
              margin: 0 auto;
            }
            .router__found {
              text-align: center;
              font-size: 14px;
            }

            .router__mac,
            .router__sn {
              margin: 0;
              margin-top: 10px;
              text-align: center;
            }
          }
        }
        .scan-result__much {
          text-align: center;
          img {
            width: 200px;
          }
        }
        .scan-result__description {
          text-align: center;
          font-size: 12px;
          color: var(--text_gery-color);
          margin: 10px 0 0 0;
        }
      }
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 15px;
      padding-top: 15px;
    }
    .btn-default {
      background-image: linear-gradient(
          to right,
          var(--primary-bgc),
          var(--primary-bgc)
        ),
        var(--common_btn_default-bgimg);
    }
  }
}
.result-container {
  height: 100%;
  margin: 0 auto;
  .result-container__success,
  .result-container__fail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: inherit;
  }
  .text-center {
    margin-top: 10px;
    text-align: center;
  }
  .result-container__success {
    .result-container__tips {
      margin-top: 30px;
    }
    .button-container {
      margin-top: 50px;
    }
  }
  .result-container__fail {
    .result-container__tips {
      margin-top: 10px;
    }
    .button-container {
      margin-bottom: 20px;
    }
  }
  .result-container__help {
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
    text-align: center;
    color: #d6001c;
  }
  .result-container__img {
    width: 200px;
    height: 200px;
  }
  .result-container__tips {
    font-size: 15px;
    text-align: center;
    color: var(--text_default-color);
    font-weight: bold;
    width: 360px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  .node-sn {
    color: var(--text_default-color);
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    span {
      padding-right: 4px;
    }
  }
  .tips {
    width: 360px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
    padding: 15px 15px 20px;
    box-sizing: border-box;
    border-radius: 5px;
    background: var(--flexwarp_hasmenu-bgc);
    color: var(--text_default-color);

    .tips__header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      img {
        width: 22px;
        height: 22px;
        margin-right: 5px;
      }
    }
    .tips__content {
      margin-top: 20px;
      p {
        font-size: 12px;
        font-weight: 500;
        padding: 0;
        margin: 5px 0 0 0;
        &:first-child {
          margin-top: 0;
        }
        &:before {
          content: '';
          position: relative;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          width: 5px;
          height: 5px;
          background-color: var(--text_default-color);
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      .tips__content__try-out {
        margin-top: 10px;
        cursor: pointer;
        font-size: 14px;
        text-decoration: underline;
        color: #d6001c;
      }
    }
  }
}

@media screen and (min-width: 769px) and (max-width: 1600px) {
  .help-dialog {
    padding: 250px;
  }
}
@media screen and (max-width: 768px) {
  .add-node {
    min-height: unset;
  }
  .page-content {
    padding: 20px;
  }
  .help-dialog-content {
    width: 100%;
    max-height: 350px;
    overflow: auto;
    a {
      word-wrap: break-word;
    }
  }
  .center-wrap {
    width: 100%;
  }
  .circle-animation {
    width: 280px;
  }
  .button-container {
    flex-direction: column-reverse;
    width: 100%;
    margin-top: 14px;
    .btn {
      width: 100%;
      margin-top: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .tips {
    .tip {
      width: 100%;
    }
  }
  .steps-container {
    width: 100%;
    height: 100%;
    padding: 0;
    .step {
      width: 100%;
    }
    .step-content {
      margin-top: 15px;
      width: 100%;
    }
    .step-item {
      width: 100%;
      max-height: 100%;
      &.step-item--rich {
        p {
          text-align: left;
        }
        img {
          width: 100%;
        }
        .main-content {
          margin-top: 0;
          padding-top: 10px;
        }
        .button-container {
          .btn {
            margin: 0;
            margin: 15px 0;
          }
        }
      }
    }
  }
}
</style>
