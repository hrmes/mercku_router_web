<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0194')}}
    </div>
    <div class="page-content">
      <div class="tips"
           v-if="showTips">
        <div class="circle-animation">
          <!-- <div class="circle circle1"></div>
          <div class="circle circle2"></div>
          <div class="circle circle3"></div> -->
        </div>
        <p class="tips__text">{{$t('trans0175')}}</p>
        <div class="button-container">
          <button class="btn btn-large"
                  @click="updateTipsVisible(false)">{{$t('trans0467')}}</button>
        </div>
        <p class="tips__text tips__text--add">{{tipsText}}</p>
      </div>
      <div class="steps-container"
           v-if="!showTips && !isAddSuccess && !isAddFail">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <div class="step-item step-item--rich"
               v-show="isStep(0)">
            <img src="@/assets/images/pic_add_plug_01.png"
                 alt="">
            <p class="step-item__tip">{{$t('trans0634')}}</p>
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
            <img src="@/assets/images/pic_add_plug_02.png"
                 alt="">
            <p class="step-item__tip">{{$t('trans0635')}}</p>
            <div class="button-container">
              <button @click="forward2step(0)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="forward2step(2)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <div class="step-item step-item--rich"
               v-show="isStep(2)">
            <img src="@/assets/images/pic_add_plug_03.png"
                 alt="">
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
                 v-show="isScanning">
              <m-loading :color="loadingColor"></m-loading>
              <p>{{$t('trans0334')}}</p>
            </div>
            <div class="scan-result"
                 v-show="isScanFinished">
              <div class="scan-result__content"
                   v-if="nodes.length === 1">
                <div class="router">
                  <img class="router__img"
                       :src="getNodeImage(nodes[0])"
                       alt="">
                  <div class="router__info">
                    <p class="router__mac">
                      {{$t('trans0188')}}：{{nodes[0].mac['2.4G'] || nodes[0].mac['5G']}}
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
                <img src="@/assets/images/img_default_empty.png"
                     alt="">
                <p class="scan-result__title">{{$t('trans0637')}}</p>
                <p class="scan-result__description">{{$t('trans0638')}}</p>
                <div class="button-container">
                  <button @click="forward2step(0)"
                          class="btn">{{$t('trans0162')}}</button>
                </div>
              </div>
              <div class="scan-result__empty"
                   v-else>
                <img class="scan-result__image"
                     src="@/assets/images/img_default_empty.png"
                     alt="">
                <p>{{$t('trans0181')}}</p>
                <span class="btn-help"
                      @click.stop="updateHelpVisible(true)">{{$t('trans0128')}}</span>
                <div class="button-container">
                  <button @click="forward2step(0)"
                          class="btn">{{$t('trans0162')}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="result-container"
           v-show="isAddSuccess || isAddFail">
        <div class="result-container__success"
             v-if="isAddSuccess">
          <div class="result-container__icon result-container__icon--success"></div>
          <p>{{$t('trans0192')}}</p>
          <div class="button-container">
            <button @click="backMesh"
                    class="btn">{{$t('trans0233')}}</button>
          </div>
        </div>
        <div class="result-container__fail"
             v-if="isAddFail">
          <div class="result-container__icon result-container__icon--fail"></div>
          <p>{{$t('trans0248')}}</p>
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
         v-if="isScanning"></div>

    <!--dialog for help-->
    <m-modal class="modal"
             :visible.sync="showHelpDialog">
      <m-modal-header>
        <div>{{$t('trans0072')}}</div>
      </m-modal-header>
      <div class="modal-content">
        <div class="help-dialog-content">
          <div>
            <p>1. {{$t('trans0653')}}</p>
            <p>2. {{$t('trans0160')}}</p>
            <p>3. {{$t('trans0158')}}</p>
            <p>4. {{$t('trans0175')}}</p>
            <p>5. {{$t('trans0330')}}</p>
            <p>6. {{$t('trans0372')}} <a :href="$t('trans0477')"
                 target="_blank">{{$t('trans0477')}}</a> {{$t('trans0392')}}</p>
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
import RouterModel from '@/mixins/router-model';

const PageStatus = {
  scanning: 'scanning',
  scan_finished: 'scan_finished',
  add_success: 'add_success',
  add_fail: 'add_fail'
};
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
      showHelpDialog: false
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
    // perfer this style = =!
    // isScanning() {
    //   return this.pageStatus === PageStatus.scanning;
    // },
    // isScanFinished() {
    //   return this.pageStatus === PageStatus.scan_finished;
    // },
    // isAddSuccess() {
    //   return this.pageStatus === PageStatus.add_success;
    // },
    // isAddFail() {
    //   return this.pageStatus === PageStatus.add_fail;
    // }
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
      this.$router.push({ path: '/dashboard/mesh/topo' });
    },
    addMeshNode(node) {
      if (!node) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      const template = `<div class="add-mesh-tip">${this.$t(
        'trans0195'
      )}</div>`;
      this.$loading.open({ template });
      // 超时90秒，间隔3秒
      this.$http
        .addMeshNode({ node })
        .then(() => {
          let timeout = this.addTimeout;
          this.checkTimer = setInterval(() => {
            if (timeout < 0) {
              this.pageStatus = PageStatus.add_fail;
              this.$loading.close();
              clearInterval(this.checkTimer);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  this.$loading.close();
                  this.pageStatus = PageStatus.add_success;
                  clearInterval(this.checkTimer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
        })
        .catch(() => {
          this.$loading.close();
          this.forward2step(2, false);
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
  margin: 30px 0;
  display: flex;
  justify-content: center;
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
.tips {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;

  .tips__text {
    width: 340px;
    margin: 0 auto;
    @media screen and(max-width:768px) {
      width: 100%;
    }
  }

  .tips__text--add {
    color: #999;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
.circle-animation {
  position: relative;
  background: url(../../../assets/images/add_node_tip_bj.png) no-repeat center;
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
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
  .step-content {
    width: 100%;
  }
  .step {
    width: 410px;
  }
  .step-item {
    width: 410px;
    margin-top: 50px;
    .step-item__tip {
      margin: 0;
      font-size: 14px;
      margin-top: 20px;
      text-align: center;
    }
    .step-item__tip--gray {
      color: #999;
    }
    &.step-item--rich {
      img {
        width: 340px;
        display: block;
        margin: 0 auto;
      }
    }
    &.step-item--scan {
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
      .scan-result {
        .scan-result__empty {
          text-align: center;
          margin-top: 50px;
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
          font-size: 16px;
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
  .router__info {
  }
  .router__mac {
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
    margin-top: 50px;
  }
  .result-container__help {
    cursor: pointer;
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
    &.result-container__icon--success {
      border-color: #55c630;
      &::before {
        content: '';
        display: block;
        position: absolute;
        background: #55c630;
        width: 12px;
        height: 3px;
        top: 32px;
        left: 15px;
        border-radius: 2px;
        transform: rotate(45deg);
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        background: #55c630;
        width: 22px;
        height: 3px;
        top: 28px;
        left: 21px;
        border-radius: 2px;
        transform: rotate(-45deg);
      }
    }
    &.result-container__icon--fail {
      border-color: #ff0001;
      &::before {
        content: '';
        display: block;
        position: absolute;
        background: #ff0001;
        width: 22px;
        height: 3px;
        top: 27px;
        left: 16px;
        border-radius: 3px;
        transform: rotate(45deg);
      }
      &::after {
        content: '';
        display: block;
        position: absolute;
        background: #ff0001;
        width: 22px;
        height: 3px;
        top: 27px;
        left: 16px;
        border-radius: 3px;
        transform: rotate(-45deg);
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
  .help-dialog-content {
    width: 100%;
    max-height: 350px;
    overflow: auto;
    a {
      word-wrap: break-word;
    }
  }
  .circle-animation {
    width: 280px;
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

  .steps-container {
    width: 100%;
    .step {
      width: 100%;
    }
    .step-item {
      width: 100%;
      & .step-item--rich {
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
