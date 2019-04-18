<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0194')}}
    </div>
    <div class="page-content">
      <div class="type-container"
           v-show="tipPage">

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
                  @click="forward2WelcomePage">{{$t('trans0467')}}</button>
        </div>

      </div>
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

        <div class="button-container">
          <button class="btn btn-default"
                  @click="back2WelcomePage">{{$t('trans0057')}}</button>
          <button class="btn btn-next"
                  @click="forwardStep0()">{{$t('trans0055')}}</button>
        </div>

      </div>
      <div class="info-container"
           v-show="!tipPage && !welcomePage">
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
              <m-loading></m-loading>
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
      <m-modal-header>
        <div>{{$t('trans0072')}}</div>
      </m-modal-header>
      <div class="modal-content">
        <div class="help-dialog-content">
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
      <m-modal-footer>
        <button @click="closeHelpDialog"
                class="btn btn-dialog-confirm">{{$t('trans0024')}}</button>
      </m-modal-footer>
    </m-modal>
  </div>
</template>
<script>
import { RouterSnModel } from 'util/constant';

const Routers = [
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
      routers: Routers,
      welcomePage: false,
      tipPage: true,
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
      selectedCategory: Routers[0],
      showHelpDialog: false
    };
  },
  methods: {
    back2WelcomePage() {
      this.tipPage = true;
      this.welcomePage = false;
    },
    forward2WelcomePage() {
      this.tipPage = false;
      this.welcomePage = true;
    },
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
      width: 160px;
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
      width: 80px;
      height: 80px;
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
          width: 80px;
          height: 80px;
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
    .tip {
      width: 100%;
    }
    .router {
      img {
        width: 80px;
        height: 80px;
      }
    }
    .circle-animation {
      .circle {
        width: 150px;
        height: 75px;
        &.circle1 {
          left: 70px;
          top: 50px;
        }
        &.circle2 {
          left: 170px;
          top: 50px;
        }
        &.circle3 {
          left: 100px;
          top: 120px;
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
