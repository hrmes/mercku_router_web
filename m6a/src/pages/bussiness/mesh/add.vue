<template>
  <div class="add-node">
    <div class="page-content"
         :class="{'has-bgc':!showChooseType}">
      <div class="choose__add__type center-wrap"
           v-if="showChooseType">
        <span class="tips__text">{{$t('trans1095')}}</span>
        <ul class="type__list">
          <li class="wireless__wrap">
            <div class="card"
                 @click="updateChooseTypeVisible(false,'wireless')">
              <div class="inner">
                <span>{{$t('trans1098')}}</span>

              </div>
            </div>
          </li>
          <li class="wired__wrap">
            <div class="card"
                 @click="updateChooseTypeVisible(false,'wired')">
              <div class="inner">
                <span>{{$t('trans1096')}}</span>
              </div>
            </div>
            <p class="tips__text tips__subtext">{{$t('trans1097')}}</p>
          </li>
        </ul>
      </div>
      <div class="steps-container"
           v-if="!showTips &&!showChooseType&& !isAddSuccess && !isAddFail&&!showTipsDialog">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item--rich"
               v-show="isStep(0)">
            <div class="main-content">
              <div class="img-container">
                <img :src="getM6aSeriesProductAddNodeImg(0)" />
              </div>
              <p class="step-item__tip">{{transText('trans0693')}}</p>
              <p class="step-item__tip step-item__tip--gray">{{$t('trans0698')}}</p>
            </div>
            <div class="button-container">
              <button @click="updateChooseTypeVisible(true)"
                      class="btn btn-default">{{$t('trans0057')}}</button>
              <button @click="forward2step(1)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(1)">
            <div class="main-content">
              <div class="img-container">
                <img :src="getM6aSeriesProductAddNodeImg(1)"
                     alt="">
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
                <img :src="getM6aSeriesProductAddNodeImg(2)"
                     alt="">
              </div>
              <div v-if="addNodeType===AddNodeType.wired">
                <p class="step-item__tip">{{$t('trans1114')}}</p>
                <p class="step-item__tip--gray ">{{$t('trans1099')}}</p>
              </div>
              <p v-else
                 class="step-item__tip">
                {{$t('trans0636')}}
              </p>
            </div>
            <div class="button-container">
              <button @click="forward2step(1)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="checkAddNodeType"
                      class="btn">{{this.addNodeType===AddNodeType.wired?$t('trans0018'):$t('trans0055')}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="result-container"
           v-show="isAddSuccess || isAddFail">
        <div class="result-container__success"
             v-if="isAddSuccess">
          <div class="text-center">
            <img class="result-container__img result-container__img--fail"
                 src="~@/assets/images/add/img_add_success.png"
                 alt="" />
          </div>
          <div class="node-sn">
            <span>{{$t('trans1006')}}:</span>
            {{snAdded}}
          </div>
          <div class="result-container__tips">
            <p>{{$t('trans0192')}}</p>
            <p style="font-weight:400">{{$t('trans1007')}}</p>
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
          <div class="result-container__tips">{{transDeviceId('trans0181')}}</div>
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
              <div class="tips__content__try-out"
                   @click.stop="updateTipsDialogVisible(true)">{{$t('trans0758')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="wireless-mesh-add-fail-tips"
      v-if="showTipsDialog">
        <div class="mesh-add-tips-list">
          <div class="mesh-add-tips-list__item list-item">
            <div class="list-item__img">
              <img :src="imgPath('addNodeFailTip1')"
                   alt="" />
            </div>
            <div class="list-item__text">
              <p>{{$t('trans0760')}}</p>
              <p>{{$t('trans0698')}}</p>
            </div>
          </div>
          <div class="mesh-add-tips-list__item list-item">
            <div class="list-item__img">
              <img :src="imgPath('addNodeFailTip2')" 
                   alt="" />
            </div>
            <div class="list-item__text">
              <p>{{$t('trans0761')}}</p>
            </div>
          </div>
          <div class="mesh-add-tips-list__item list-item">
            <div class="list-item__img">
              <img :src="imgPath('addNodeFailTip3')"
                   alt="" />
            </div>
            <div class="list-item__text">
              <p>{{$t('trans0762')}}</p>
              <p>{{$t('trans0763')}}</p>
            </div>
          </div>
        </div>
        <div class="button-container">
          <button @click="backMesh"
                  class="btn">{{$t('trans0055')}}</button>
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
    <!--loading for scan-->
    <div class="loading"
         v-if="isScanning"></div>
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
import debounce from 'lodash/debounce';
import { AddNodeType, RouterHasModelDistinctionMap } from 'base/util/constant';
import Assets from 'base/assets';

const PageStatus = {
  scanning: 'scanning',
  scan_finished: 'scan_finished',
  add_success: 'add_success',
  add_fail: 'add_fail'
};
const Step = {
  step1: 0,
  step2: 1,
  step3: 2
};

export default {
  data() {
    return {
      scrollbar: document.querySelector('.scrollbar-wrap'),
      AddNodeType,
      PageStatus,
      showChooseType: true,
      showTips: false,
      stepsOption: {
        current: 0,
        steps: new Array(3).fill(0).map(() => ({ text: '', success: false }))
      },
      pageStatus: '',
      nodes: [],
      addTimeout: 90,
      showHelpDialog: false,
      showTipsDialog: false,
      showWirelessMeshTipsDialog: false,
      snAdded: '',
      checkTimer: null,
      addNodeType: AddNodeType.wired
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
    modelVersion() {
      return this.$store.state.profile?.model_ab;
      return this.$store.state.modelVersion || localStorage.getItem('modelVersion');
    },
    isM6a() {
      return this.modelVersion === RouterHasModelDistinctionMap.M6a;
    },
    isM6aPlus() {
      return this.modelVersion === RouterHasModelDistinctionMap.M6a_Plus;
    },
    isM6c() {
      return this.modelVersion === RouterHasModelDistinctionMap.M6c;
    },
    isMobile() {
      return this.$store.state.isMobile;
    }
  },
  created() {
    this.addMeshNodeDebounce = debounce(this.addMeshNode, 500);
  },
  methods: {
    transText(text) {
      let resultText = '';
      const meta = Assets.getDeviceMeta();
      resultText = this.$t(text).replaceAll('%s', meta.shortName);
      return resultText;
    },
    imgPath(id) {
      const ab = this.$store.state.profile.model_ab;
      const j = this.$store.state.profile.model_j;
      return Assets.getImagePath(id, ab, j);
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
    updateChooseTypeVisible(visible, type) {
      this.showChooseType = visible;
      if (!visible) {
        this.forward2step(0);
        if (type === AddNodeType.wireless) {
          setTimeout(() => {
            this.showWirelessMeshTipsDialog = true;
          }, 400);
        }
      }
      if (type) {
        this.addNodeType = type;
      }
      this.isMobile && this.scrollbarToTop();
    },
    updateHelpVisible(visible) {
      this.showHelpDialog = visible;
    },
    updateTipsDialogVisible(visible) {
      this.showTipsDialog = visible;
      this.showChooseType = false;
      this.pageStatus = '';
      this.isMobile && this.scrollbarToTop();
    },
    updateResultVisiable() {
      this.pageStatus = '';
      this.showTips = true;
    },
    backMesh() {
      this.showTipsDialog = false;
      this.showChooseType = true;
      this.isMobile && this.scrollbarToTop();
    },
    retry() {
      this.showChooseType = true;
      this.stepsOption.current = 0;
      this.pageStatus = '';
      this.isMobile && this.scrollbarToTop();
    },
    addMeshNode() {
      this.$http.addMeshNode().then(() => {
        const template = `<div class="add-mesh-tip">${this.$t(
          'trans1003'
        )}</div>`;
        this.$loading.open({ template });
        // 超时90秒，间隔3秒
        let timeout = this.addTimeout;
        if (this.checkTimer) {
          return;
        }
        this.checkTimer = setInterval(() => {
          if (timeout < 0) {
            this.pageStatus = PageStatus.add_fail;
            this.$loading.close();
            clearInterval(this.checkTimer);
            this.checkTimer = null;
          }
          if (timeout % 3 === 0) {
            this.$http.getNewMeshNodeInfo().then(res => {
              if (res.data.result?.sn) {
                this.$loading.close();
                this.snAdded = res.data.result.sn;
                this.pageStatus = PageStatus.add_success;
                clearInterval(this.checkTimer);
              }
            });
          }
          timeout -= 1;
        }, 1000);
      });
    },
    forward2step(index, status = true) {
      this.stepsOption.current = index;
      this.stepsOption.steps[index].success = status;
      this.isMobile && this.scrollbarToTop();
    },
    getM6aSeriesProductAddNodeImg(step, type) {
      let img = '';
      const model_ab = this.$store.state.profile?.model_ab || '08';
      const model_j = this.$store.state.profile?.model_j || '0';
      if (step === Step.step1) {
        const path = Assets.getImagePath("wirelessAddNodeStep1", model_ab, model_j);
        img = path;
      }
      if (step === Step.step2) {
        return Assets.getImagePath("wirelessAddNodeStep2", model_ab, model_j);
      }
      if (step === Step.step3) {
        if (type == AddNodeType.wired) {
          img = Assets.getImagePath("wiredAddNodeStep3", model_ab, model_j);
        } else {
          img = Assets.getImagePath("wirelessAddNodeStep3", model_ab, model_j);
        }
      }
      // if (step === Step.step3 && type && this.isM6a) {
      //   switch (type) {
      //     case AddNodeType.wireless:
      //       const imgPath = Assets.getImagePath("wirelessAddNodeStep3", '08', '0');
      //       console.log("assets:", imgPath);
      //       // img = require(imgPath);
      //       img = imgPath;
      //       break;
      //     case AddNodeType.wired:
      //       img = require('@/assets/images/add/img_wired_add_03.svg');
      //       break;
      //     default:
      //       break;
      //   }
      // }
      // if (step === Step.step3 && type && !this.isM6a) {
      //   switch (type) {
      //     case AddNodeType.wireless:
      //       img = require('@/assets/images/add/m6a-4_lan_prots/img_wireless_add_03.svg');
      //       break;
      //     case AddNodeType.wired:
      //       img = require('@/assets/images/add/m6a-4_lan_prots/img_wired_add_03.svg');
      //       break;
      //     default:
      //       break;
      //   }
      // }
      return img;
    },
    getM6aSeriesProductNetworkingImg() {
      let img = '';
      switch (this.modelVersion) {
        case RouterHasModelDistinctionMap.M6a:
          img = require('@/assets/images/add/img_networking.svg');
          break;
        case RouterHasModelDistinctionMap.M6a_Plus:
        case RouterHasModelDistinctionMap.M6c:
          img = require('@/assets/images/add/m6a-4_lan_prots/img_networking.svg');
          break;
        default:
          break;
      }
      return img;
    },
    checkAddNodeType() {
      switch (this.addNodeType) {
        case AddNodeType.wired:
          this.showTips = true;
          this.isMobile && this.scrollbarToTop();
          break;
        case AddNodeType.wireless:
          this.addMeshNodeDebounce();
          break;
        default:
          break;
      }
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
  &.has-bgc {
    display: block;
    background: var(--primary-bgc);
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
    @media screen and (max-width:768px) {
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
.choose__add__type {
  align-items: center;
  .type__list {
    display: flex;
    > li {
      width: 340px;
      height: auto;
      margin-right: 30px;
      &:last-child {
        margin: 0;
      }
      &.wireless__wrap {
        .inner {
          background: url(#{$img_folder}/common/img_wireless.png) no-repeat
            bottom;
          background-size: contain;
        }
      }
      &.wired__wrap {
        .inner {
          background: url(#{$img_folder}/common/img_wired.png) no-repeat bottom;
          background-size: contain;
        }
      }
    }
    .card {
      position: relative;
      width: 100%;
      aspect-ratio: 17/15;
      margin: 20px 0;
      padding: 30px;
      font-size: 16px;
      border-radius: 10px;
      border: 3.5px solid var(--common_card-bgc);
      background-image: linear-gradient(
        to bottom,
        var(--common_card-bgc),
        var(--common_card-bgc)
      );
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      box-shadow: var(--common_card-boxshadow);
      cursor: pointer;
      &:hover {
        border-color: transparent;
        box-shadow: var(--common_card_hover-boxshadow);
        background-image: var(--step_item_current_num-bgimg);
      }
      .inner {
        width: 100%;
        height: 100%;
        > span {
          font-size: 20px;
          font-weight: 500;
        }
      }
    }
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
.router {
  .router__img {
    width: 240px;
    display: block;
    margin: 0 auto;
  }

  .router__mac,
  .router__sn {
    margin: 0;
    margin-top: 20px;
    text-align: center;
  }
}
.result-container {
  height: 100%;
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
      margin-top: 50px;
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
    & {
      font-size: 15px;
      text-align: center;
      color: var(--text_default-color);
      font-weight: bold;
      width: 360px;
    }
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
.wireless-mesh-add-fail-tips {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 50px;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 40px;
  .mesh-add-tips-list {
    display: grid;
    grid-template-rows: repeat(2, 300px);
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    .list-item {
      display: flex;
      font-size: 14px;
      color: var(--text_default-color);
      .list-item__img {
        background-color: var(--flexwarp_hasmenu-bgc);
        margin-right: 15px;
        border-radius: 2px;
        width: 55%;
        height: 225px;
        text-align: center;
        img {
          height: 100%;
        }
      }
      .list-item__text {
        flex: 1;
        p {
          padding: 0 30px 0 10px;
          margin: 0;
          &:not(:first-child) {
            margin-top: 20px;
          }
        }
      }
    }
  }
  .button-container {
    height: 50px;
    margin: 0;
    .btn {
      width: 340px;
    }
  }
  @media screen and (max-width: 768px) {
    .mesh-add-tips-list {
      .mesh-add-tips-list__item {
        width: 100%;
        &:not(:first-child) {
          margin-top: 20px;
        }
      }
      .list-item {
        flex-direction: column;
        .list-item__img {
          margin-right: 0;
          width: 100%;
        }
        .list-item__text {
          margin-top: 20px;
        }
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
  .choose__add__type {
    .type__list {
      width: 100%;
      flex-direction: column;
      > li {
        margin-right: 0;
        width: 100%;
      }
      .card {
        width: 100%;
        aspect-ratio: 17/13;
        &:hover {
          outline-color: transparent;
        }
      }
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

  .wireless-mesh-add-fail-tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    .mesh-add-tips-list {
      grid-template-rows: repeat(3, auto);
      grid-template-columns: 100%;
      grid-column-gap: 0;
      .list-item__text {
        height: fit-content;
      }
    }
    .button-container {
      margin: 30px auto 0;
      .btn {
        width: 100%;
        margin: 0;
      }
    }
  }
}
</style>
