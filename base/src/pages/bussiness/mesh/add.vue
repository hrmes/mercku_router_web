<template>
  <div class="page">
    <div class='page-header page-header__add-mesh'>
      <span>{{$t('trans0194')}}</span>
      <span class="page-header__help"
            v-if="!isTipPage"
            @click.stop="openHelpDialog">{{$t('trans0128')}}</span>
    </div>
    <div class="page-content">
      <!-- 提示 -->
      <div class="type-container"
           v-if="isTipPage">
        <div class="router-category-container">
          <div class="circle-animation">
            <div class="circle circle1"></div>
            <div class="circle circle2"></div>
            <div class="circle circle3"></div>
          </div>
          <p>{{$t('trans0175')}}</p>
        </div>
        <div class="button-container">
          <button class="btn btn-large"
                  @click="go2WelcomePage">{{$t('trans0467')}}</button>
        </div>
      </div>
      <!-- 路由器选择 -->
      <div class="type-container"
           v-if="isWelcomePage">
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

        <div class="button-container">
          <button class="btn btn-default"
                  @click="backward2TipPage()">{{$t('trans0057')}}</button>
          <button class="btn btn-next"
                  @click="forward2Step0()">{{$t('trans0055')}}</button>
        </div>

      </div>
      <!-- 步骤 -->
      <div class="info-container"
           v-if="isStepPage">
        <div class="step">
          <m-step :option="stepsOption"></m-step>
        </div>
        <div class="step-content">
          <!-- 通电 -->
          <div class="step-item step-item0"
               v-show="stepsOption.current===0">
            <p>{{$t('trans0634')}}</p>
            <img :src="selectedCategory.powerOnImage"
                 alt="">
            <div class="button-container">
              <button @click="go2WelcomePage()"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="go2Step(1)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <!-- 观察指示灯 -->
          <div class="step-item step-item0"
               v-show="stepsOption.current===1">
            <p>{{$t('trans0635')}}</p>
            <img :src="selectedCategory.lampImage"
                 alt="">
            <div class="button-container">
              <button @click="go2Step(0)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="go2Step(2)"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <!-- 按Reset按键 -->
          <div class="step-item step-item0"
               v-show="isReset">
            <p>{{$t('trans0295')}}</p>
            <img :src="selectedCategory.tipImage"
                 alt="">
            <div class="button-container">
              <button @click="go2Step(1)"
                      class="btn btn-default ">{{$t('trans0057')}}</button>
              <button @click="search()"
                      class="btn">{{$t('trans0055')}}</button>
            </div>
          </div>
          <!-- 扫描中 -->
          <div class="step-item step-item1"
               v-show="isScaning">
            <div class="scaning">
              <m-loading :color="loadingColor"></m-loading>
              <p>{{$t('trans0334')}}</p>
            </div>
          </div>
          <!-- 扫描结果 -->
          <div class="step-item step-item1"
               v-show="stepsOption.current===3">
            <div class="scan-result"
                 v-show="nodes.length">
              <div class="router"
                   v-for="(node,index) in nodes"
                   :key="index"
                   @click="selectNode(node)">
                <div class="check-container">
                  <div class="checkbox"
                       :class="{'checked':node.selected}"></div>
                  <div class="info">
                    <p>{{getNodeName(node)}}</p>
                    <p>
                      <label class="with-colon">{{$t('trans0252')}}:</label>
                      <span>{{node.sn}}</span>
                    </p>
                  </div>
                </div>
                <img class="img"
                     :src="getNodeImg(node)"
                     alt="">
              </div>
              <div class="button-container">
                <button @click="go2Step(2)"
                        class="btn btn-default ">{{$t('trans0057')}}</button>
                <button @click="addMeshNode()"
                        class="btn">{{$t('trans0055')}}</button>
              </div>
            </div>
            <div class="scan-empty"
                 v-show="!nodes.length">
              <p>{{$t('trans0181')}}</p>
              <span class="btn-help"
                    @click.stop="openHelpDialog">{{$t('trans0128')}}</span>
              <div class="button-container">
                <button @click="go2Step(2)"
                        class="btn">{{$t('trans0057')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 组网结果 -->
      <div class="info-container"
           v-if="isResultPage">
        <div class="step-content">
          <div class="step-item step-item2">
            <div class="success"
                 v-if="added">
              <img src="../../../assets/images/icon/ic_success.png"
                   alt="" />
              <p>{{$t('trans0192')}}</p>
              <div class="button-container">
                <button @click="backMesh"
                        class="btn">{{$t('trans0233')}}</button>
              </div>
            </div>
            <div class="fail"
                 v-if="!added">
              <img src="../../../assets/images/icon/ic_fail.png"
                   alt="" />
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
      <m-modal-header>
        <div>{{$t('trans0072')}}</div>
      </m-modal-header>
      <div class="modal-content">
        <div class="help-dialog-content">
          <div>
            <p>{{$t('trans0234')}}</p>
            <p>{{$t('trans0160')}}</p>
            <p>{{$t('trans0158')}}</p>
            <p>{{$t('trans0175')}}</p>
            <p>{{$t('trans0330')}}</p>
          </div>
        </div>
      </div>
      <m-modal-footer>
        <button @click="closeHelpDialog"
                class="btn btn-dialog-confirm">{{$t('trans0024')}}</button>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import { RouterSnModel } from 'base/util/constant';

const PageType = {
  tipPage: 'tipPage',
  welcomePage: 'welcomePage',
  stepPage: 'stepPage',
  resultPage: 'resultPage'
};

export default {
  data() {
    const Routers = [];
    if (process.env.CUSTOMER_CONFIG.routers.Bee) {
      Routers.push({
        name: process.env.CUSTOMER_CONFIG.routers.Bee.name,
        image: require('../../../assets/images/img_bee.png'),
        powerOnImage: require('../../../assets/images/img_power_on_bee.jpg'),
        lampImage: require('../../../assets/images/pic_node_1_redlight.jpg'),
        tipImage: require('../../../assets/images/img_add_plug_bee.jpg'),
        sn: RouterSnModel.Bee
      });
    }
    if (process.env.CUSTOMER_CONFIG.routers.M2) {
      Routers.push({
        name: process.env.CUSTOMER_CONFIG.routers.M2.name,
        image: require('../../../assets/images/img_m2.png'),
        powerOnImage: require('../../../assets/images/pic_router_m2.jpg'),
        lampImage: require('../../../assets/images/img_power_on_m2.jpg'),
        tipImage: require('../../../assets/images/img_add_plug_m2.jpg'),
        sn: RouterSnModel.M2
      });
    }
    return {
      RouterSnModel,
      routers: Routers,
      pageType: PageType.tipPage,
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
      selectedCategory: Routers[0],
      showHelpDialog: false
    };
  },
  computed: {
    isTipPage() {
      return this.pageType === PageType.tipPage;
    },
    isWelcomePage() {
      return this.pageType === PageType.welcomePage;
    },
    isStepPage() {
      return this.pageType === PageType.stepPage;
    },
    isResultPage() {
      return this.pageType === PageType.resultPage;
    },
    isReset() {
      return this.stepsOption.current === 2 && !this.scaning;
    },
    isScaning() {
      return this.stepsOption.current === 2 && this.scaning;
    }
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
      return require('../../../assets/images/icon/ic_default_router.png');
    },
    getNodeName(node) {
      const id = node.sn.slice(0, 2);
      const num = node.sn.slice(-4);
      let name = '';
      switch (id) {
        case this.RouterSnModel.M2:
          name = `${process.env.CUSTOMER_CONFIG.routers.M2.shortName}-${num}`;
          break;
        case this.RouterSnModel.Bee:
          name = `${process.env.CUSTOMER_CONFIG.routers.Bee.shortName}-${num}`;
          break;
        default:
          break;
      }
      return name;
    },
    selectRouter(router) {
      this.selectedCategory = router;
      console.log('selectedCategory', this.selectedCategory);
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
      const template = `<div class="add-mesh-tip">${this.$t('trans0195')}</div>`;
      this.$loading.open({ template });
      // 超时90秒，间隔3秒
      this.$http
        .addMeshNode({ node })
        .then(() => {
          let timeout = this.addTimeout;
          this.checkTimer = setInterval(() => {
            if (timeout < 0) {
              this.pageType = PageType.resultPage;
              this.added = false;
              this.$loading.close();
              this.go2Step(3, false);
              clearInterval(this.checkTimer);
            }
            if (timeout % 3 === 0) {
              this.$http.isInMesh({ node }).then(res => {
                if (res.data.result.status) {
                  this.pageType = PageType.resultPage;
                  this.added = true;
                  this.$loading.close();
                  this.go2Step(3);
                  clearInterval(this.checkTimer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
        })
        .catch(() => {
          this.$loading.close();
          this.go2Step(3, false);
        });
    },
    go2WelcomePage() {
      this.pageType = PageType.welcomePage;
    },
    backward2TipPage() {
      this.pageType = PageType.tipPage;
    },
    go2Step(i, isSuccess = true) {
      this.stepsOption.current = i;
      this.stepsOption.steps[i].success = isSuccess;
    },
    forward2Step0() {
      this.pageType = PageType.stepPage;
      this.go2Step(0);
    },
    search() {
      this.scaning = true;
      this.$http
        .scanMeshNode()
        .then(res => {
          this.nodes = res.data.result
            .filter(n => n.sn.slice(0, 2) === this.selectedCategory.sn)
            .map(n => ({ ...n, selected: false }));
          this.scaning = false;
          this.go2Step(3);
        })
        .catch(() => {
          this.scaning = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes ani {
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
.page-header__add-mesh {
  justify-content: space-between;
}
.page-header__help {
  font-size: 14px;
  color: #333333;
  cursor: pointer;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  opacity: 0;
  z-index: var(--z-index_dialog);
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
      background-color: #333333;
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
.type-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  .button-container {
    margin: 36px 0;
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
    .btn-next {
      margin-bottom: 30px;
    }
  }
  .circle-animation {
    position: relative;
    background: url(../../../assets/images/add_node_tip_bj.jpg) no-repeat center;
    background-size: 100%;
    width: 340px;
    margin: 0 auto;
    margin-bottom: 50px;
    &::before {
      content: '';
      display: block;
      padding-top: 72%;
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
      animation: ani 1.4s linear 0.8s infinite;
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
  p {
    width: 340px;
    margin: 0 auto;
    @media screen and(max-width:768px) {
      width: 100%;
    }
  }
  .tip {
    margin-bottom: 30px;
  }
  .router {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 340px;
    height: 120px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #dbdbdb;
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
        width: 150px;
      }
      .checkbox {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid #999;
        background: #fff;
        &.checked {
          background: #333;
          position: relative;
          border-color: #333;
          &::after {
            content: '';
            display: block;
            border: 1px solid #fff;
            border-left: 0;
            border-top: 0;
            height: 8px;
            left: 6px;
            position: absolute;
            top: 3px;
            transform: rotate(45deg);
            width: 3px;
          }
        }
      }
    }
    img {
      width: 120px;
      height: 120px;
    }
    .name {
      width: 120px;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
.info-container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .step {
    width: 340px;
  }
  .btn-help {
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
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
        background: #fff;
        width: 340px;
        height: 140px;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 20px;
        border: 1px solid #f1f1f1;
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
            border-radius: 4px;
            border: 1px solid #999;
            background: #fff;
            &.checked {
              &.checked {
                background: #333;
                position: relative;
                border-color: #333;
                &::after {
                  content: '';
                  display: block;
                  border: 1px solid #fff;
                  border-left: 0;
                  border-top: 0;
                  height: 8px;
                  left: 6px;
                  position: absolute;
                  top: 3px;
                  transform: rotate(45deg);
                  width: 3px;
                }
              }
            }
          }
        }
        img {
          width: 120px;
          height: 120px;
        }
      }
    }
  }
  .step-item2 {
    img {
      width: 60px;
    }
    p {
      font-size: 16px;
      text-align: center;
      margin-top: 20px;
    }
    .button-container {
      margin-top: 137px;
      .btn {
        min-width: 160px;
        width: auto;
      }
    }
    .fail {
      margin-top: 60px;
      text-align: center;
      img {
        width: 60px;
      }
      .btn-help {
        color: #d6001c;
      }
    }
    .success {
      margin-top: 60px;
      text-align: center;
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
  .type-container {
    .tip {
      width: 100%;
    }
    .router {
      img {
        width: 120px;
        height: 120px;
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
    .btn-next {
      width: 300px;
    }
  }
  .info-container {
    width: 100%;
    .step-item {
      .button-container {
        display: flex;
        margin-top: 50px;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        button {
          width: 100%;
          margin: 0;
          &:last-child {
            margin-bottom: 20px;
          }
        }
      }
    }
    .step-item0 {
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
@media screen and (max-width: 414px) {
  .router-category-container {
    width: 100%;
    .router {
      width: 100%;
    }
  }
}
@media screen and (width: 320px) {
  .type-container {
    .router-category-container {
      width: 100%;
    }
    .router {
      width: 100%;
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
    .step {
      width: 100%;
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
