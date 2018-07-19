<template>
  <layout>
    <div class="upgrade-offline-container">
      <div class="content">
        <div class="pc-wrapper">
          <div class='w-header'>{{$t('trans0204')}}</div>
          <div class="form">
            <div class="description">
              <h4>
                <img src="../../../assets/images/ic_question.png" alt="">
                <span> {{$t('trans0331')}}</span>
              </h4>
              <p>1. 官网Mercku官方网站，下载最新固件。
                <a href="http://www.mercku.tech" target="_blank">www.mercku.tech</a>
              </p>
              <p>{{$t('trans0333')}}</p>
              <p>{{$t('trans0332')}}</p>
            </div>
            <div class="upload">
              <m-upload :label="$t('trans0339')" :multiple="multiple" :accept="accept" :onSuccess="onSuccess" :onError="onError" />
            </div>
            <div class="nodes-wrapper" v-if="hasUpgradablityNodes">
              <p class="title">{{$t('trans0333')}}</p>
              <div class="nodes-info">
                <div v-for="node in localNodes" :key="node.sn" class="node">
                  <div class="badge-info">
                    <img src="../../../assets/images/ic_new_version.png" alt="">
                    <span>{{$t('trans0210')}}{{node.version.latest}}</span>
                  </div>
                  <div class="message">
                    <img class="img-m2" v-if="node.model.id===RouterSnModel.M2" src="../../../assets/images/img_m2.png" alt="">
                    <img class="img-bee" v-if="node.model.id===RouterSnModel.Bee" src="../../../assets/images/img_bee.png" alt="">
                    <div>
                      <p class="node-name">{{node.name}}</p>
                      <p class="node-sn">{{$t('trans0252')}}{{node.sn}}</p>
                      <p class="node-version">
                        <span class="dot"></span>
                        <span>{{$t('trans0209')}}{{node.version.current}}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-info">
                <button class="btn re-btn">{{$t('trans0211')}}</button>
              </div>
            </div>
            <div class="description-wrapper" v-if="uploadComplete&&!hasUpgradablityNodes">
              <p> <img src="../../../assets/images/ic_hint.png" alt=""> {{$t('trans0336')}}</p>
              <p>1. 下载路由器固件时，请仔细核对路由器底部标签上的型号和产品名称，确保准确性。</p>
              <p>{{$t('trans0337')}}</p>
            </div>
          </div>
        </div>
        <div class="mobile-wrapper">
          <img src="../../../assets/images/ic_hint.png" alt="">
          <p>{{$t('trans0343')}} </p>
        </div>
      </div>
    </div>
  </layout>

</template>
<script>
import layout from '../../../layout.vue';
import Upload from '../../../component/upload/index.vue';
import Progress from '../../../component/progress/index.vue';
import { RouterSnModel } from '../../../../util/constant';

const arr = Array.from(new Array(3)).map((_, i) => ({
  sn: `01010301230123${i}`,
  model: { id: i % 2 === 0 ? '01' : '02' },
  name: `mercku_00${i}`,
  version: {
    current: `0.0.${i}`,
    latest: '1.1.1'
  }
}));

export default {
  components: {
    layout,
    'm-upload': Upload,
    'm-progress': Progress
  },
  data() {
    return {
      files: [],
      RouterSnModel,
      multiple: 1,
      accept: '.ma',
      localNodes: arr,
      uploadComplete: false
    };
  },
  beforeRouteLeave(_, __, next) {
    this.$dialog.confirm({
      okText: this.$t('trans0024'),
      cancelText: this.$t('trans0025'),
      message: this.$t('trans0334'),
      callback: {
        ok: () => {
          next();
        },
        cancel: () => {
          next(false);
        }
      }
    });
  },
  computed: {
    hasUpgradablityNodes() {
      return this.localNodes.length > 0;
    },
    hasUploadFile() {
      return this.files.length > 0;
    }
  },
  methods: {
    onSuccess(res, files) {
      this.files = files;
      this.uploadComplete = true;
      const data = res.data.result;
      if (data && data.length > 0) {
        this.localNodes = data.filter(v => v.updatable);
      }
    },
    onError(err, files) {
      this.files = files;
      if (err && err.error) {
        this.$toast(this.$t(err.error.code));
      } else {
        this.$router.push({ path: '/unconnect' });
      }
    },
    upgrade() {
      const ids = this.localNodes.map(v => v.sn);
      this.$http.upgradeMeshNode({ node_ids: ids, local: true }).then(() => {
        this.$upgrade({
          onsuccess: () => {
            this.$router.push({ path: '/home' });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.upgrade-offline-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    flex: 1;
    position: relative;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      margin: 0 3%;
    }
    .description {
      margin-top: 30px;
      p {
        margin: 0;
        font-size: 14px;
        color: #333333;
        margin-bottom: 20px;
      }
      h4 {
        display: flex;
        align-items: center;
        font-weight: normal;
        margin: 0;
        margin-bottom: 40px;
        img {
          width: 20px;
          margin-right: 10px;
          span {
            font-size: 16px;
            color: #333333;
          }
        }
      }
    }
    .description-wrapper {
      border-top: 1px solid #f1f1f1;
      margin-top: 50px;
      text-align: center;
      padding-top: 60px;
      color: #333333;
      font-size: 14px;
      :first-child {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 24px;
          margin-right: 10px;
        }
      }
    }
    .nodes-wrapper {
      .title {
        text-align: left;
      }
      border-top: 1px solid #f1f1f1;
      margin-top: 50px;
      text-align: center;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .nodes-info {
        display: flex;
        width: 100%;

        overflow: hidden;
        flex-wrap: wrap;
        // justify-content: space-between;
        .node {
          width: 340px;
          height: 132px;
          background: #f1f1f1;
          border-radius: 5px;
          margin-right: 20px;
          margin-top: 20px;
          .message {
            display: flex;
            margin-top: 40px;
            align-items: start;
            padding: 0 20px;
            .img-m2 {
              width: 50px;
            }
            .img-bee {
              width: 50px;
            }
            .dot {
              display: inline-block;
              width: 3px;
              height: 3px;
              border-radius: 50%;
              background: #000;
              position: relative;
              top: -3px;
            }
            .node-name {
              padding: 0;
              margin: 0;
              text-align: left;
              font-size: 12px;
              padding-top: 5px;
              padding-top: 0px;
              font-size: 14px;
              font-weight: bold;
            }
            .node-sn {
              padding: 0;
              margin: 0;
              text-align: left;
              font-size: 12px;
              padding-top: 5px;
            }
            .node-version {
              padding: 0;
              margin: 0;
              text-align: left;
              font-size: 12px;
              padding-top: 5px;
              font-size: 10px;
              padding-top: 10px;
            }
            div {
              padding-left: 20px;
            }
          }
          .badge-info {
            width: auto;
            padding: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            // border-radius: 100px;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
            border-top-right-radius: 5px;
            background-image: linear-gradient(290deg, #4237dd, #7037dd);
            float: right;
            img {
              width: 18px;
              margin-right: 5px;
            }
            span {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.95);
              font-weight: 100;
            }
          }
          // flex: 1;
        }
      }
      .btn-info {
        margin-top: 40px;
      }
    }
  }
}
@media screen and (min-width: 769px) {
  .pc-wrapper {
    display: block;
  }
  .mobile-wrapper {
    display: none;
  }
}
@media screen and (max-width: 768px) {
  .upgrade-offline-container {
    .pc-wrapper {
      display: none;
    }
    .mobile-wrapper {
      display: block;
      text-align: center;
      font-size: 14px;
      color: #333333;
      img {
        width: 30px;
        margin-top: 70px;
      }
    }
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }

      background: white;
    }
  }
}
</style>

