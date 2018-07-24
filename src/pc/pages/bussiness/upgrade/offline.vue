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
              <p>1.
                <span>{{$t('trans0332')}}</span>
                <a href="http://www.mercku.tech" target="_blank">www.mercku.tech</a>
                <span>,{{$t('trans0346')}}</span>
              </p>
              <p>2.
                <span>{{$t('trans0339')}}</span>
              </p>
              <p>3.
                <span>{{$t('trans0348')}}</span>
              </p>
            </div>
            <div class="upload">
              <m-upload ref="uploader" :onCancel="onCancel" :beforeUpload="beforeUpload" :request="upload" :label="$t('trans0339')" :accept="accept" />
            </div>
            <div class="nodes-wrapper" v-if="uploadStatus === UploadStatus.success && hasUpgradablityNodes">
              <p class="title">{{$t('trans0333')}}</p>
              <div class="nodes-info">
                <div v-for="node in localNodes" :key="node.sn" class="node">
                  <div class="message">
                    <img class="img-m2" v-if="packageInfo.model.id===RouterSnModel.M2" src="../../../assets/images/img_m2.png" alt="">
                    <img class="img-bee" v-if="packageInfo.model.id===RouterSnModel.Bee" src="../../../assets/images/img_bee.png" alt="">
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
                <button @click="upgrade()" class="btn re-btn">{{$t('trans0211')}}</button>
              </div>
            </div>
            <div class="description-wrapper" v-if="uploadStatus === UploadStatus.success && !hasUpgradablityNodes">
              <p> <img src="../../../assets/images/ic_hint.png" alt=""> {{$t('trans0336')}}</p>
              <p>{{$t('trans0337')}}</p>
              <p>{{$t('trans0335')}}</p>
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
import { RouterSnModel, UploadStatus } from '../../../../util/constant';
import { getFileExtendName } from '../../../../util/util';

export default {
  components: {
    layout,
    'm-upload': Upload
  },
  data() {
    return {
      files: [],
      RouterSnModel,
      accept: '.ma',
      localNodes: [],
      UploadStatus,
      uploadStatus: UploadStatus.ready,
      cancelToken: null,
      packageInfo: null
    };
  },
  beforeRouteLeave(_, __, next) {
    if (this.uploadStatus === UploadStatus.success) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0230'),
        callback: {
          ok: () => {
            next();
          },
          cancel: () => {
            next(false);
          }
        }
      });
    } else {
      next();
    }
  },
  computed: {
    hasUpgradablityNodes() {
      return this.localNodes.length > 0;
    }
  },
  methods: {
    beforeUpload(files) {
      const file = files[0];
      const uploader = this.$refs.uploader;
      const entendName = getFileExtendName(file);
      const reg = new RegExp(`^${this.accept.slice(1)}$`, 'i');
      if (!reg.test(entendName)) {
        uploader.err = this.$t('trans0271');
        return false;
      }
      if (file.size === 0) {
        uploader.err = this.$t('trans0341');
        return false;
      }
      return true;
    },
    onCancel() {
      this.cancelToken.cancel('cancel');
    },
    upload(files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      const uploader = this.$refs.uploader;
      this.uploadStatus = UploadStatus.uploading;
      uploader.status = UploadStatus.uploading;
      return this.$http
        .firmwareUpload(formData, (progressEvent, token) => {
          this.cancelToken = token;
          const { loaded, total, lengthComputable } = progressEvent;
          if (lengthComputable) {
            uploader.percentage = Math.floor(loaded / total * 100);
            uploader.status =
              loaded >= total ? UploadStatus.success : UploadStatus.uploading;
          }
        })
        .then(res => {
          uploader.status = UploadStatus.success;
          this.uploadStatus = UploadStatus.success;
          this.localNodes = res.data.result.nodes;
          this.packageInfo = res.data.result.fw_info;
        })
        .catch(err => {
          uploader.status = UploadStatus.fail;
          this.uploadStatus = UploadStatus.fail;
          if (err && err.error) {
            uploader.err = err.error.code;
          } else if (!err.message) {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    upgrade() {
      const ids = this.localNodes.map(v => v.sn);
      this.$http
        .upgradeMeshNode({ node_ids: ids, local: true })
        .then(() => {
          this.$upgrade({
            onsuccess: () => {
              this.$router.push({ path: '/home' });
            }
          });
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
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
        margin: 100px 0;
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
  }
}
@media screen and (min-width: 769px) and (max-width: 999px) {
  .upgrade-offline-container {
    .content {
      .nodes-wrapper {
        .nodes-info {
          .node {
            width: 340px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      }
      .btn-info {
        margin: 20px 0;
      }
    }
  }
}
</style>

