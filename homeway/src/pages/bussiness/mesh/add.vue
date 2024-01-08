<template>
  <div class="page">
    <div class="page-header">{{$t('trans0194')}}</div>
    <div class="page-content">
      <div class="choose__add__type center-wrap"
           v-if="showChooseType">
        <p class="tips__text">{{$t('trans0364')}}</p>
        <ul class="type__list">
          <li class="wired__wrap">
            <div class="card"
                 @click="updateChooseTypeVisible(false,'wired')">
              <span class="tips__text">{{$t('trans1112')}}</span>
              <img src="@/assets/images/icon/ic_mesh_add_wired.png"
                   alt="">
            </div>
          </li>
          <li class="wireless__wrap">
            <div class="card"
                 @click="updateChooseTypeVisible(false,'wireless')">
              <span class="tips__text">{{$t('trans1113')}}</span>
              <img src="@/assets/images/icon/ic_mesh_add_wireless.png"
                   alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="steps-container"
           v-if="!showChooseType&& !isAddSuccess && !isAddFail">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item--rich"
               v-show="isStep(0)">
            <div class="img-container">
              <img :src="getWwaxImg(0)">
            </div>
            <p class="step-item__tip">
              {{
              isWiredMesh?
              $t('trans1117'):
              $t('trans0693').replace('%s','homeway')
              }}
            </p>
            <p class="step-item__tip step-item__tip--gray">{{$t('trans0698')}}</p>
            <div v-if="isWirelessMesh"
                 @click="()=>allModelsVisible = true"
                 class="all-model">{{$t('trans1116')}}</div>
            <div class="button-container">
              <button @click="updateChooseTypeVisible(true)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(1)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(1)">
            <div class="img-container">
              <img src="~@/assets/images/img_add-step2.png"
                   alt="">
            </div>
            <p class="step-item__tip">{{$t('trans1005')}}</p>
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
              <img :src="getWwaxImg(2)">
            </div>
            <p class="step-item__tip">{{
                isWiredMesh?
                $t('trans1118'):
                $t('trans0636')
                }}
            </p>
            <div class="button-container">
              <button @click="forward2step(1)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="checkAddNodeType"
                      class="btn">{{isWiredMesh?$t('trans0018'):$t('trans0055')}}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="result-container"
           v-show="isAddSuccess || isAddFail">
        <div class="result-container__success"
             v-if="isAddSuccess">
          <div class="img-container">
            <img src="~@/assets/images/img_add-successful.png" />
          </div>
          <div class="node-sn">
            <span>{{$t('trans1006')}}:</span>
            {{snAdded}}
          </div>
          <div class="main-tips">
            <p>{{$t('trans0192')}}</p>
            <p class="sub">{{$t('trans1007')}}</p>
          </div>
          <div class="button-container">
            <button @click="backMesh"
                    class="btn btn-large">{{$t('trans0018')}}</button>
          </div>
        </div>
        <div class="result-container__fail"
             v-if="isAddFail">
          <div class="img-container">
            <img src="~@/assets/images/img_default_empty.png" />
          </div>
          <div class="main-tips">{{$t('trans0181')}}</div>
          <div class="fail-help">
            <span @click="()=>failHelpVisible=true">{{$t('trans0128')}}</span>
          </div>
          <div class="button-container">
            <button @click="retry"
                    class="btn btn-large">{{$t('trans0162')}}</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal for show all models -->
    <m-modal class="all-model-modal"
             :visible.sync="allModelsVisible">
      <m-modal-header>
        <div class="close-btn__wrapper">
          <span @click="()=>allModelsVisible=false">
            <img src="~@/assets/images/icon/ic_close.svg"
                 alt="">
          </span>
        </div>
      </m-modal-header>
      <m-modal-body class="modal-body">
        <div class="card">
          <div class="img-container">
            <img src="~@/assets/images/wireless-step1_230v.png">
          </div>
          <div class="text-container">
            <p class="main">230V</p>
            <p class="sub">{{$t('trans1115')}}</p>
          </div>
        </div>
        <div class="card">
          <div class="img-container">
            <img src="~@/assets/images/wireless-step1_poe1.png">
          </div>
          <div class="text-container">
            <p class="main">1 leg POE</p>
            <p class="sub">{{$t('trans1114')}}</p>
          </div>
        </div>
        <div class="card">
          <div class="img-container">
            <img src="~@/assets/images/wireless-step1_poe2.png">
          </div>
          <div class="text-container">
            <p class="main">2 leg POE</p>
            <p class="sub">{{$t('trans1114')}}</p>
          </div>
        </div>
        <div class="card">
          <div class="img-container">
            <img src="~@/assets/images/wireless-step1_230v+poe.png">
          </div>
          <div class="text-container">
            <p class="main">230V POE</p>
            <p class="sub">{{$t('trans1114')}}</p>
          </div>
        </div>
      </m-modal-body>
    </m-modal>
    <!--dialog for help after failed-->
    <m-modal class="fail-help-modal"
             :visible.sync="failHelpVisible">
      <m-modal-header>
        <div class="close-btn__wrapper">
          <span @click="()=>failHelpVisible=false">
            <img src="~@/assets/images/icon/ic_close.svg"
                 alt="">
          </span>
        </div>
      </m-modal-header>
      <m-modal-body>
        <ul class="fail-help-list">
          <li>{{$t('trans1001')}}</li>
          <li>{{$t('trans0215')}}</li>
          <li>{{$t('trans0651')}}</li>
          <li>{{$t('trans0698')}}</li>
          <li>{{$t('trans0661')}}</li>
        </ul>
      </m-modal-body>
    </m-modal>
  </div>
</template>

<script>
import { AddNodeType } from 'base/util/constant';
import { debounce } from 'base/util/util';

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
const WwaxModelList = {
  '230v': '0',
  poe1: '1',
  poe2: '2',
  '230vPoe': '3'
};
export default {
  data() {
    return {
      showChooseType: true,
      AddNodeType,
      PageStatus,
      stepsOption: {
        current: 0,
        steps: new Array(3).fill(0).map(() => ({ text: '', success: false }))
      },
      addNodeType: AddNodeType.wired,
      allModelsVisible: false,
      failHelpVisible: false,
      pageStatus: '',
      snAdded: '',
      checkTimer: null,
      addTimeout: 15,
      nodes: [],
    };
  },
  created() {
    this.addMeshNodeDebounce = debounce(this.addMeshNode, 500);
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
    modelID() {
      return '3';
    },
    isWiredMesh() {
      return this.addNodeType === AddNodeType.wired;
    },
    isWirelessMesh() {
      return this.addNodeType === AddNodeType.wireless;
    }
  },
  methods: {
    updateChooseTypeVisible(visible, type) {
      if (type) {
        this.addNodeType = type;
      }
      if (!visible) {
        this.forward2step(0);
      }
      this.showChooseType = visible;
    },
    forward2step(index, status = true) {
      this.stepsOption.current = index;
      this.stepsOption.steps[index].success = status;
    },
    isStep(index) {
      return this.stepsOption.current === index;
    },
    backMesh() {
      this.$router.push({ path: '/dashboard/mesh/topo' });
    },
    checkAddNodeType() {
      if (this.isWiredMesh) {
        this.backMesh();
      } else {
        this.addMeshNodeDebounce();
      }
    },
    addMeshNode() {
      const template = `<div class="add-mesh-tip">${this.$t('trans1003')}</div>`;
      this.$loading.open({ template });
      this.$http.addMeshNode().then(() => {
        // 超时90秒，间隔3秒
        let timeout = this.addTimeout;
        if (this.checkTimer) {
          return;
        }
        this.checkTimer = setInterval(() => {
          console.log('time--');
          if (timeout < 0) {
            this.pageStatus = PageStatus.add_fail;
            this.$loading.close();
            clearInterval(this.checkTimer);
            this.checkTimer = null;
          }
          if (timeout % 3 === 0) {
            this.$http.getNewMeshNodeInfo()
              .then(res => {
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
    getStep1Img() {
      let img;
      if (this.isWirelessMesh) {
        switch (this.modelID) {
            case WwaxModelList['230v']:
            img = require('@/assets/images/wireless-step1_230v.png');
            break;
          case WwaxModelList.poe1:
            img = require('@/assets/images/wireless-step1_poe1.png');
            break;
          case WwaxModelList.poe2:
            img = require('@/assets/images/wireless-step1_poe2.png');
            break;
          case WwaxModelList['230vPoe']:
            img = require('@/assets/images/wireless-step1_230v+poe.png');
            break;
          default:
            break;
        }
      } else {
        img = require('@/assets/images/wired-step1.png');
      }
      return img;
    },
    getStep3Img() {
      if (this.isWirelessMesh) {
        return require('@/assets/images/wireless-step3.png');
      }
      return require('@/assets/images/wired-step3.png');
    },
    getWwaxImg(step) {
      if (step === Step.step1) {
        return this.getStep1Img();
      }
      return this.getStep3Img();
    },
    retry() {
      this.showChooseType = true;
      this.stepsOption.current = 0;
      this.pageStatus = '';
    },
  }
};
</script>
<style lang="scss">
.close-btn__wrapper {
  width: 100%;
  height: 24px;
  text-align: right;
  > span {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #f1f1f1;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    > img {
      width: 10px;
      height: 10px;
    }
  }
}
.all-model-modal {
  .modal-body {
    display: grid;
    grid-template-rows: repeat(2, 40vh);
    grid-template-columns: repeat(2, 38vh);
    grid-row-gap: 15px;
    grid-column-gap: 15px;
  }
  .card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    text-align: center;
    .img-container {
      width: 90%;
      aspect-ratio: 1;
      margin: 0 auto;
      > img {
        width: inherit;
        height: inherit;
      }
    }
    .text-container {
      width: 100%;
      > p {
        padding: 0;
        margin: 0;
        color: #333;
        &.main {
          font-size: 16px;
          font-weight: 500;
        }
        &.sub {
          font-size: 14px;
        }
      }
    }
  }
}
.fail-help-modal {
  .fail-help-list {
    max-width: 400px;
    padding: 0 20px 20px;
    margin: 0;
    > li {
      margin-bottom: 10px;
      &:last-child {
        margin: 0;
      }
    }
  }
}
@media screen and(max-width:768px) {
  .all-model-modal {
    .modal-body {
      display: grid;
      height: 75vh;
      overflow: scroll;
      grid-template-rows: repeat(4, 1fr);
      grid-template-columns: 100%;
      grid-row-gap: 15px;
      grid-column-gap: 0;
      border-radius: 10px;
    }
    .card {
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 10px;
      text-align: center;
      .img-container {
        width: 90%;
        aspect-ratio: 1;
        margin: 0 auto;
        > img {
          width: inherit;
          height: inherit;
        }
      }
      .text-container {
        width: 100%;
        > p {
          padding: 0;
          margin: 0;
          color: #333;
          &.main {
            font-size: 16px;
            font-weight: 500;
          }
          &.sub {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .choose__add__type {
    width: 340px;
    align-items: flex-start;
    .type__list {
      display: flex;
      flex-direction: column;
      .card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 120px;
        border-radius: 10px;
        background: #f7f7f7;
        margin: 20px 0 10px;
        padding: 20px 30px;
        font-size: 16px;
        transition: outline 0.3s ease-out;
        outline: 1.5px solid transparent;
        cursor: pointer;
        &:hover {
          outline-color: #0e6a99;
        }
        img {
          height: 100%;
        }
      }
    }
  }
  .steps-container {
    width: 410px;
    text-align: center;
    font-size: 14px;
    line-height: 1.43;
    .step {
      width: 340px;
      margin: 0 auto;
      margin-bottom: 50px;
    }
    .img-container {
      width: 100%;
      height: 300px;
      background-color: #fafafa;
      margin-bottom: 20px;
      > img {
        width: 300px;
        height: 300px;
      }
    }
    .step-item__tip {
      color: #333;
      margin-bottom: 10px;
      &.step-item__tip--gray {
        color: #808080;
        margin-bottom: 20px;
      }
    }
    .all-model {
      color: #0e6a99;
      text-decoration: underline;
      cursor: pointer;
    }
    .button-container {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 30px;
      width: 100%;
      margin-top: 30px;
      > button {
        width: auto;
      }
    }
  }
  .result-container {
    width: 340px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.43;
    text-align: center;
    color: #333;
    .img-container {
      width: inherit;
      text-align: center;
      margin-bottom: 30px;
      > img {
        width: 60%;
        aspect-ratio: 1;
        margin: 0 auto;
      }
    }
    .node-sn {
      margin-bottom: 40px;
    }
    .main-tips {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.63;
      margin-bottom: 50px;
      .sub {
        font-size: 14px;
        font-weight: 400;
      }
    }
    .fail-help {
      text-decoration: underline;
      color: #0e6a99;
      margin-top: 10px;
      margin-bottom: 50px;
      > span {
        cursor: pointer;
      }
    }
  }
}
@media screen and(max-width:768px) {
  .page {
    .choose__add__type {
      .type__list {
        .card {
          &:hover {
            outline-color: transparent;
          }
        }
      }
    }
    .steps-container {
      width: 100%;
      .button-container {
        > button {
          width: 100%;
        }
      }
    }
    .result-container {
      .img-container {
        margin-bottom: 10px;
      }
      .node-sn {
        margin-bottom: 20px;
      }
      .main-tips {
        margin-bottom: 30px;
      }
      .fail-help {
        text-decoration: underline;
        color: #0e6a99;
        margin-top: 10px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
