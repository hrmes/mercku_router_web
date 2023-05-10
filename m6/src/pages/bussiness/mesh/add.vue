<template>
  <div class="page">
    <!-- <div class='page-header'>
      {{$t('trans0194')}}
    </div> -->
    <div class="page-content">
      <div class="tips"
           v-if="showTips">
        <div class="circle-animation">
          <!-- <div class="circle circle1"></div>
          <div class="circle circle2"></div>
          <div class="circle circle3"></div> -->
        </div>
        <p class="tips__text">{{$t('trans0175')}}</p>
        <p class="tips__text tips__text--add">{{tipsText}}</p>

        <div class="button-container">
          <button class="btn btn-large"
                  @click="updateTipsVisible(false)">{{$t('trans0467')}}</button>
        </div>
      </div>
      <div class="steps-container"
           v-if="!showTips && !isAddSuccess && !isAddFail">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item--rich"
               v-show="isStep(0)">
            <div class="img-container">
              <img src="@/assets/images/img_m6_add_01.svg"
                   alt="">
            </div>
            <p class="step-item__tip">{{transformText($t('trans0693'))}}</p>
            <p class="step-item__tip step-item__tip--gray">{{$t('trans0698')}}</p>
            <div class="button-container">
              <button @click="updateTipsVisible(true)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(1)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(1)">
            <div class="img-container">
              <img src="@/assets/images/img_m6_add_02.svg"
                   alt="">
            </div>
            <p class="step-item__tip">{{transformText($t('trans0713')) }}</p>
            <div class="button-container">
              <button @click="forward2step(0)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(2)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(2)">
            <div class="img-container">
              <img src="@/assets/images/img_m6_add_03.svg"
                   alt="">
            </div>
            <p class="step-item__tip">{{$t('trans0636')}}</p>
            <div class="button-container">
              <button @click="forward2step(1)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(3)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--scan"
               v-show="isStep(3)">
            <div class="scaning"
                 v-if="isScanning">
              <div class="icon-wrapper">
                <m-lottieLoading></m-lottieLoading>
              </div>
              <p>{{transformText($t('trans0334'))}}</p>
            </div>
            <div class="scan-result"
                 v-if="isScanFinished">
              <div v-if="nodes.length === 1"
                   class="scan-result__content">
                <div class="router">
                  <img class="router__img"
                       :src="getNodeImage(nodes[0])"
                       alt="">
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
                <div class="button-container">
                  <button @click="forward2step(2)"
                          class="btn btn-default ">{{$t('trans0057')}}</button>
                  <button @click="addMeshNode(nodes[0])"
                          class="btn">{{$t('trans0194')}}</button>
                </div>
              </div>
              <div v-else-if="nodes.length >1"
                   class="scan-result__much">
                <img src="@/assets/images/img_default_empty.webp"
                     alt="">
                <p class="scan-result__title">{{$t('trans0637')}}</p>
                <p class="scan-result__description">{{$t('trans0638')}}</p>
                <div class="button-container">
                  <button @click="forward2step(0)"
                          class="btn">{{$t('trans0162')}}</button>
                </div>
              </div>
              <div v-else
                   class="scan-result__empty">
                <img class="scan-result__image"
                     src="@/assets/images/img_default_empty.webp"
                     alt="">
                <p class="scan-result__title">{{transformText($t('trans0181')) }}</p>
                <span class="btn-help"
                      @click.stop="updateHelpVisible(true)">{{$t('trans0128')}}</span>
                <div class="button-container">
                  <button @click="forward2step(0)"
                          class="btn">{{$t('trans0162')}}</button>
                </div>
              </div>
            </div>
            <div class="adding"
                 v-if="isAdding">
              <div class="icon-wrapper">
                <m-lottieLoading :loadingType="'addNode'"></m-lottieLoading>
              </div>
              <p>{{$t('trans0195')}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="result-container"
           v-show="isAddSuccess || isAddFail">
        <div class="result-container__success"
             v-if="isAddSuccess">
          <img class="scan-result__image"
               src="@/assets/images/img_m6_add_success.webp"
               alt="">
          <p class="title">{{$t('trans0192')}}</p>
          <p v-if="isWeakSignal">{{$t('trans0652')}}</p>
          <span class="success-tips">{{$t('trans1007')}}</span>
          <div class="button-container">
            <button @click="backMesh"
                    class="btn">{{$t('trans0233')}}</button>
          </div>
        </div>
        <div class="result-container__fail"
             v-if="isAddFail">
          <img class="scan-result__image"
               src="@/assets/images/img_error.webp"
               alt="">
          <p class="title">{{$t('trans0248')}}</p>
          <span class="result-container__help"
                @click.stop="updateHelpVisible(true)">{{$t('trans0128')}}</span>
          <div class="button-container">
            <button @click="backMesh"
                    class="btn">{{$t('trans0233')}}</button>
          </div>
        </div>

      </div>
    </div>

    <!--loading for scan-->
    <div class="loading"
         v-if="isScanning||isAdding"></div>

    <!--dialog for help-->
    <m-modal class="modal"
             :visible.sync="showHelpDialog">
      <m-modal-header>
        <div>{{$t('trans0072')}}</div>
      </m-modal-header>
      <div class="modal-content">
        <div class="help-dialog-content">
          <div>
            <p>{{transformText($t('trans0653')) }}</p>
            <p>{{$t('trans0215')}}</p>
            <p>{{$t('trans0651')}}</p>
            <p>{{$t('trans0175')}}</p>
            <p>{{$t('trans0657')}}</p>
            <p>{{$t('trans0698')}}</p>
            <p>{{$t('trans0661')}}</p>
            <!-- <p>6. {{$t('trans0372')}}
              <a :href="$t('trans0477')"
                 target="_blank">{{$t('trans0477')}}</a> {{$t('trans0392')}}
            </p> -->
          </div>
        </div>
      </div>
      <m-modal-footer>
        <button @click="updateHelpVisible(false)"
                class="btn btn-dialog-confirm">{{$t('trans0024')}}</button>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import RouterModel from 'base/mixins/router-model';
import { Bands } from 'base/util/constant';

const PageStatus = {
  scanning: 'scanning',
  scan_finished: 'scan_finished',
  adding: 'adding',
  add_success: 'add_success',
  add_fail: 'add_fail'
};

const checkWeakSignal = rssi => rssi < -65;
export default {
  mixins: [RouterModel],
  data() {
    return {
      PageStatus,
      showTips: true,
      stepsOption: {
        current: 0,
        steps: new Array(4).fill(0).map(() => ({ text: '', success: false }))
      },
      pageStatus: '',
      nodes: [],
      addTimeout: 90,
      showHelpDialog: false,
      isWeakSignal: false
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
    m6Text() {
      return this.$t('trans0693').replace('%s', process.env.CUSTOMER_CONFIG.routers.M6.shortName);
    }
  },
  methods: {
    isStep(index) {
      return this.stepsOption.current === index;
    },
    updateTipsVisible(visible) {
      this.showTips = visible;
      if (!visible) {
        this.forward2step(0);
      }
    },
    updateHelpVisible(visible) {
      this.showHelpDialog = visible;
    },
    backMesh() {
      this.$router.push({ path: '/dashboard' });
    },
    addMeshNode(node) {
      if (!node) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.pageStatus = PageStatus.adding;
      // const template = `<div class="add-mesh-tip">${this.$t('trans0195')}</div>`;
      // this.$loading.open({ template });
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
              // this.$loading.close();
              clearInterval(this.checkTimer);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  // this.$loading.close();
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
          // this.$loading.close();
          this.pageStatus = PageStatus.add_fail;
        });
    },
    forward2step(index, status = true) {
      this.stepsOption.current = index;
      this.stepsOption.steps[index].success = status;
      // some special operation
      switch (index) {
        case 3:
          this.scanHandler();
          break;
        default:
          break;
      }
    },
    scanHandler() {
      this.pageStatus = PageStatus.scanning;

      this.$http
        .scanMeshNode()
        .then(res => {
          this.nodes = res.data.result.map(n => ({ ...n, selected: false }));
          this.pageStatus = PageStatus.scan_finished;
        })
        .catch(() => {
          this.pageStatus = PageStatus.scan_finished;
        });
    },
    transformText(text) {
      return text.replaceAll('%s', process.env.CUSTOMER_CONFIG.routers.M6.shortName);
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  70% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
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
  width: 600px;
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
      background-color: var(--text-default-color);
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
  margin: 30px 0 0;
  display: flex;
  justify-content: center;
  .btn-large {
    width: 340px;
  }
  button {
    display: inline-block;
    margin-right: 20px;
    min-width: 160px;
    // width: auto;
    &:last-child {
      margin-right: 0;
    }
  }
}
.tips {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 30px auto 0;
  width: 100%;
  .tips__text {
    width: 340px;
    margin: 0 auto;
    text-align: center;

    @media screen and(max-width:768px) {
      width: 100%;
    }
  }

  .tips__text--add {
    color: #999;
    width: 100%;
    font-size: 14px;
    margin-top: 20px;
  }
}
.circle-animation {
  position: relative;
  background: url(../../../assets/images/add_node_tip_bj.webp) no-repeat center;
  background-size: 100%;
  width: 340px;

  margin: 0 auto;
  margin-bottom: 50px;
  &::before {
    content: '';
    display: block;
    padding-top: 82%;
  }
  .circle {
    width: 200px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(
      rgba(214, 0, 28, 0) 39%,
      rgba(214, 0, 28, 0.29) 100%
    );
    transform: scale(1);
    opacity: 0;
    animation: ripple 1.4s linear 0.8s infinite;
    position: absolute;
    &.circle1 {
      left: 50px;
      top: 40px;
    }
    &.circle2 {
      left: 150px;
      top: 30px;
    }
    &.circle3 {
      left: 80px;
      top: 100px;
    }
  }
}
.steps-container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .btn-help {
    color: var(--primaryColor);
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .step-content {
    width: 100%;
  }
  .step {
    width: 340px;
  }
  .step-item {
    width: 340px;
    margin-top: 50px;
    .step-item__tip {
      margin: 0;
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }
    .step-item__tip--gray {
      color: #999;
    }
    .img-container {
      background: var(--table-row-background-color);
    }
    &.step-item--rich {
      img {
        width: 300px;
        display: block;
        margin: 0 auto;
      }
    }
    &.step-item--scan {
      .scaning,
      .adding {
        margin-top: 120px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-wrapper {
          position: relative;
          width: 150px;
          height: 150px;
        }
        img {
          display: block;
          margin: 0 auto;
        }
      }
      .scan-result {
        .scan-result__content {
          margin-top: 100px;
        }
        .scan-result__empty {
          text-align: center;
          margin-top: 100px;
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
          // font-weight: bold;
          margin: 30px 0 0 0;
        }
        .scan-result__much {
          text-align: center;
          img {
            width: 200px;
          }
        }
        .scan-result__description {
          text-align: center;
          font-size: 14px;
          color: #999;
          margin: 10px 0 0 0;
        }
      }
    }
  }
}
.router {
  .router__img {
    width: 240px;
    display: block;
    margin: 0 auto;
  }
  .router__found {
    font-size: 16px;
  }
  .router__found,
  .router__mac,
  .router__sn {
    margin: 0;
    margin-top: 20px;
    text-align: center;
  }
}
.result-container {
  .result-container__success,
  .result-container__fail {
    text-align: center;
    font-size: 16px;
    margin-top: 100px;
    img {
      width: 200px;
    }
  }
  .title {
    margin: 30px 0 0;
  }
  .success-tips {
    display: inline-block;
    width: 340px;
    font-size: 14px;
    margin-top: 15px;
    color: var(--text-gery-color);
  }
  .result-container__help {
    color: var(--primaryColor);
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
  }
  .result-container__icon {
    width: 60px;
    height: 60px;
    border: 3px solid;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
    }
  }
}
@media screen and (min-width: 1441px) {
  .steps-container {
    .step-item {
      margin-top: 100px;
      // &.step-item--scan {
      //   .scan-result {
      //     .scan-result__empty {
      //       margin-top: 100px;
      //     }
      //   }
      // }
    }
  }
}

@media screen and (min-width: 769px) and (max-width: 1600px) {
  .help-dialog {
    padding: 250px;
  }
}
@media screen and (max-width: 768px) {
  .help-dialog-content {
    width: 100%;
    max-height: 350px;
    overflow: auto;
    a {
      word-wrap: break-word;
    }
  }
  .circle-animation {
    width: 100%;
    .circle {
      width: 100px;
      height: 50px;
      &.circle1 {
        left: 70px;
        top: 60px;
      }
      &.circle2 {
        left: 155px;
        top: 50px;
      }
      &.circle3 {
        left: 100px;
        top: 110px;
      }
    }
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
  .result-container {
    .success-tips {
      width: 100%;
    }
  }

  .steps-container {
    width: 100%;
    .step {
      width: 100%;
    }
    .step-item {
      width: 100%;
      &.step-item--rich {
        margin-top: 30px;
        p {
          text-align: left;
        }
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
