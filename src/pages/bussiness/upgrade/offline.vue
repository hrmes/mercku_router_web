<template>
  <div class="page">
    <div class="pc-wrapper">
      <div class='page-header'>{{$t('trans0204')}}</div>
      <div class="page-content">
        <div class="form">
          <div class="description">
            <p>1.
              <span>{{$t('trans0332')}}</span>
              <a :href="$t('trans0482')"
                 target="_blank">{{$t('trans0482')}}</a>
              <span>,&nbsp;{{$t('trans0346')}}</span>
            </p>
            <p>2.
              <span>{{$t('trans0339')}}</span>
            </p>
            <p>3.
              <span>{{$t('trans0348')}}</span>
            </p>
          </div>
          <div class="upload">
            <m-upload ref="uploader"
                      :onChange="onChange"
                      :onCancel="onCancel"
                      :beforeUpload="beforeUpload"
                      :request="upload"
                      :packageInfo="packageInfo"
                      :label="$t('trans0042')"
                      :accept="accept" />
          </div>
          <div class="nodes-wrapper"
               v-if="uploadStatus === UploadStatus.success && hasUpgradablityNodes">
            <div class="title">{{$t('trans0333')}}
              <div class="btn-info">
                <button @click="upgrade()"
                        class="btn btn-small re-btn">{{$t('trans0225')}}</button>
              </div>
            </div>
            <div class="nodes-info">
              <div v-for="node in localNodes"
                   :key="node.sn"
                   class="node">
                <div class="badges">
                  <div v-if="node.isGW"
                       class="badge-info gateway">
                    <span>{{$t('trans0165')}}</span>
                  </div>
                </div>
                <div class="message"
                     @click="check(node)">
                  <m-checkbox :readonly="true"
                              v-model="node.checked" />
                  <div class="img-container">
                    <img class="img-m2"
                         v-if="fwInfo.model.id===RouterSnModel.M2"
                         src="../../../assets/images/img_m2.png"
                         alt="">
                    <img class="img-bee"
                         v-else-if="fwInfo.model.id===RouterSnModel.Bee"
                         src="../../../assets/images/img_bee.png"
                         alt="">
                    <img class="img-other"
                         v-else
                         src="../../../assets/images/icon/ic_default_router.png"
                         alt="">
                  </div>
                  <div class="info-container">
                    <p class="node-name">{{node.name}}</p>
                    <p class="node-sn">{{$t('trans0252')}}{{node.sn}}</p>
                    <p class="node-version">
                      <span>{{$t('trans0209')}}{{node.version.current}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="description-wrapper"
               v-if="uploadStatus === UploadStatus.success && !hasUpgradablityNodes">
            <p> <img src="../../../assets/images/icon/ic_hint.png"
                   alt=""> {{$t('trans0336')}}</p>
            <p>{{$t('trans0337')}}</p>
            <p>{{$t('trans0335')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-wrapper">
      <img src="../../../assets/images/icon/ic_hint.png"
           alt="">
      <p>{{$t('trans0343')}} </p>
    </div>
  </div>

</template>
<script>
import { RouterSnModel, UploadStatus } from 'util/constant';
import { getFileExtendName } from 'util/util';

export default {
  data() {
    return {
      files: [],
      RouterSnModel,
      accept: process.env.CUSTOMER_CONFIG.accept,
      localNodes: [],
      UploadStatus,
      uploadStatus: UploadStatus.ready,
      cancelToken: null,
      packageInfo: {},
      fwInfo: {},
      upgraded: false,
      Products: {
        M2: {
          name: 'M2 Wi-Fi Router',
          shortName: 'M2'
        },
        Bee: {
          name: 'M2 Bee Node',
          shortName: 'Bee'
        }
      }
    };
  },
  beforeRouteLeave(_, __, next) {
    if (this.uploadStatus === UploadStatus.success && !this.upgraded) {
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
    },
    productName() {
      return this.fwInfo.model.id === RouterSnModel.M2
        ? this.Products.M2.name
        : this.Products.Bee.name;
    },
    modelName() {
      return this.fwInfo.model.id === RouterSnModel.M2
        ? this.Products.M2.shortName
        : this.Products.Bee.shortName;
    }
  },
  methods: {
    check(node) {
      node.checked = !node.checked;
    },
    onChange() {
      const { uploader } = this.$refs;
      this.uploadStatus = uploader.status;
    },
    beforeUpload(files) {
      const file = files[0];
      const { uploader } = this.$refs;
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
      const { uploader } = this.$refs;
      this.uploadStatus = UploadStatus.uploading;
      uploader.status = UploadStatus.uploading;
      return this.$http
        .uploadFirmware(formData, (progressEvent, token) => {
          this.cancelToken = token;
          const { loaded, total, lengthComputable } = progressEvent;
          if (lengthComputable) {
            uploader.percentage = Math.floor((loaded / total) * 100);
            if (loaded >= total) {
              uploader.status = UploadStatus.success;
            } else {
              uploader.status = UploadStatus.uploading;
            }
          }
        })
        .then(res => {
          this.$http.getMeshNode().then(res1 => {
            const gw = res1.data.result.filter(node => node.is_gw)[0];
            let { nodes } = res.data.result;
            nodes = nodes.map(node => {
              let isGW = false;
              if (node.sn === gw.sn) {
                isGW = true;
              }
              return {
                ...node,
                isGW,
                checked: false
              };
            });
            this.localNodes = nodes;
            this.fwInfo = res.data.result.fw_info;
            this.packageInfo = {
              product: this.productName,
              version: this.fwInfo.version,
              model: this.modelName
            };
            uploader.status = UploadStatus.success;
            this.uploadStatus = UploadStatus.success;
          });
        })
        .catch(err => {
          uploader.status = UploadStatus.fail;
          this.uploadStatus = UploadStatus.fail;
          if (err.response && err.response.data && err.response.data.error) {
            uploader.err = this.$t(err.response.data.error.code);
          }
        });
    },
    upgrade() {
      const nodeIds = this.localNodes.filter(n => n.checked).map(n => n.sn);
      if (!nodeIds.length) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.$dialog.confirm({
        okText: this.$t('trans0225'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0213'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .upgradeMeshNode({ node_ids: nodeIds, local: true })
              .then(() => {
                this.$loading.close();
                this.upgraded = true;
                this.$upgrade({
                  onsuccess: () => {
                    this.$router.push({ path: '/dashboard' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  },
                  timeout: 100
                });
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.pc-wrapper {
  .page-content {
    align-items: flex-start;
  }
}
.form {
  width: 100%;
  .package-info {
    background: #f1f1f1;
    border-radius: 3px;
    margin-top: 30px;
    display: inline-block;
    padding: 0 20px;
    .info-item {
      display: inline-block;
      margin-right: 50px;
    }
  }
}
.description {
  p {
    margin: 0;
    font-size: 14px;
    color: #333333;
    margin-bottom: 10px;
    a {
      color: #d6001c;
    }
    &:last-child {
      margin-bottom: 20px;
    }
  }
  h4 {
    display: flex;
    align-items: center;
    font-weight: normal;
    margin: 0;
    margin-bottom: 20px;
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 0 30px 0;
  }
  border-top: 1px solid #f1f1f1;
  margin-top: 30px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .nodes-info {
    display: flex;
    width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
    .node {
      width: 340px;
      height: 120px;
      border: 1px solid #dbdbdb;
      border-radius: 5px;
      margin-right: 20px;
      margin-bottom: 30px;
      position: relative;
      .message {
        display: flex;
        align-items: start;
        padding: 0 10px;
        padding-left: 20px;
        height: 100%;
        align-items: center;
        cursor: pointer;
        position: relative;
        align-items: center;
        .img-container,
        .info-container {
          display: flex;
          align-items: center;
          align-content: center;
          height: 100%;
        }
        .img-container {
          margin-right: 10px;
          margin-left: 20px;
          .img-m2 {
            width: 60px;
          }
          .img-bee {
            width: 60px;
          }
          .img-other {
            width: 60px;
          }
        }

        .info-container {
          flex-direction: column;
          align-items: start;
          align-content: start;
          justify-content: center;
          flex: 1;
          padding-top: 20px;
          padding-bottom: 20px;
          .node-name {
            padding: 0;
            margin: 0;
            text-align: left;

            padding-top: 0px;
            font-size: 16px;
            font-weight: bold;
          }
          .node-sn {
            padding: 0;
            margin: 0;
            text-align: left;
            font-size: 12px;
            padding-top: 5px;
            white-space: nowrap;
          }
          .node-version {
            padding: 0;
            margin: 0;
            text-align: left;

            font-size: 10px;
            padding-top: 2px;

            position: relative;
            span {
              display: inline-block;
            }
          }
        }
      }
      .badges {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 1;
        display: flex;
        .badge-info {
          width: auto;
          padding: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #d6001c;
          border-radius: 10px;
          &.gateway {
            background: #00d061;
          }
          + .badge-info {
            margin-left: 5px;
          }
          img {
            width: 18px;
            margin-right: 5px;
          }
          span {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.95);
            font-weight: normal;
          }
        }
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
  .pc-wrapper {
    display: none;
  }
  .mobile-wrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: #333333;
    img {
      width: 30px;
    }
    p {
      width: 70%;
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 999px) {
  .nodes-wrapper {
    .nodes-info {
      .node {
        width: 340px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}
</style>
