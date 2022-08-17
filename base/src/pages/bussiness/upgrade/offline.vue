<template>
  <div class="page">
    <div class="page-header">{{ $t('trans0204') }}</div>
    <div class="page-content">
      <div class="form">
        <div class="description">
          <p>
            1.
            <span>{{ $t('trans0332') }}&nbsp;</span>
            <a class="btn-text text-primary"
               :href="transWebsite('trans0338')"
               target="_blank">
              {{ transWebsite('trans0338') }}</a>
            <span>&nbsp;{{ $t('trans0377') }}</span>
          </p>
          <p>
            2.
            <span>{{ $t('trans0339') }}</span>
          </p>
          <p>
            3.
            <span>{{ $t('trans0348') }}</span>
          </p>
        </div>
        <div class="upload">
          <m-upload ref="uploader"
                    dragable
                    :onChange="onChange"
                    :onCancel="onCancel"
                    :beforeUpload="beforeUpload"
                    :request="upload"
                    :packageInfo="packageInfo"
                    :label="$t('trans0042')"
                    :accept="accept" />
        </div>
        <div class="nodes-wrapper"
             v-if="uploadStatus === UploadStatus.success && hasUpgradablityNodes"
             ref="renodes">
          <div class="retitle"
               :class="{
                 'retitle--fixed': isRetitleFixed
               }"
               ref="retitle">
            {{ $t('trans0333') }}
            <div class="retitle__btn-wrap">
              <button @click="upgrade()"
                      class="btn btn-small retitle__btn">
                {{ $t('trans0225') }}
              </button>
            </div>
          </div>
          <div class="nodes-info"
               :style="{
            'margin-top': isRetitleFixed ? `${nodesInfoMarginTop}px` : 0
          }">
            <div v-for="node in localNodes"
                 :key="node.sn"
                 class="node">
              <div class="badges">
                <m-tag v-if="node.isGW"
                       class="gateway">{{ $t('trans0165') }}</m-tag>
              </div>
              <div class="message"
                   @click="check(node)">
                <m-checkbox :readonly="true"
                            v-model="node.checked" />
                <div class="img-container">
                  <img :src="getNodeImage(node)"
                       alt="">
                </div>
                <div class="info-container">
                  <p class="node-name">{{ node.name }}</p>
                  <p class="node-sn">
                    <label class="with-colon">{{ $t('trans0252') }}:</label>
                    <span>{{ node.sn }}</span>
                  </p>
                  <p class="node-version">
                    <label class="with-colon">{{ $t('trans0209') }}:</label>
                    <span>{{ node.version.current }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="description-wrapper"
             v-if="
              uploadStatus === UploadStatus.success && !hasUpgradablityNodes
            ">
          <p>
            <img src="../../../assets/images/icon/ic_hint.png"
                 alt="" />
            {{ $t('trans0336') }}
          </p>
          <p>{{ $t('trans0337') }}</p>
          <p>{{ $t('trans0335') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { UploadStatus } from 'base/util/constant';
import { getFileExtendName } from 'base/util/util';
import RouterModel from 'base/mixins/router-model';

const mobileWidth = 768;
export default {
  mixins: [RouterModel],
  data() {
    return {
      files: [],
      accept: process.env.CUSTOMER_CONFIG.accept,
      localNodes: [],
      UploadStatus,
      uploadStatus: UploadStatus.ready,
      cancelToken: null,
      packageInfo: {},
      fwInfo: {},
      upgraded: false,
      isRetitleFixed: false,
      nodesInfoMarginTop: 114
    };
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.uploadStatus === UploadStatus.success &&
      !this.upgraded &&
      !to.path.includes('/login')
    ) {
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
      const product = this.Products[this.fwInfo.model.id];
      if (product) {
        return product.name;
      }
      return '';
    },
    modelName() {
      const product = this.Products[this.fwInfo.model.id];
      if (product) {
        return product.shortName;
      }
      return '';
    }
  },
  watch: {
    isRetitleFixed(val) {
      if (!val && this.$refs.retitle) {
        const { height } = this.$refs.retitle.getBoundingClientRect();
        this.nodesInfoMarginTop = height;
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler, true);
    window.addEventListener('resize', this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler, true);
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    transWebsite(text) {
      return this.$t(text).replace('%s', process.env.CUSTOMER_CONFIG.website.url);
    },
    resizeHandler() {
      if (document.body.clientWidth > mobileWidth) {
        this.isRetitleFixed = false;
      } else {
        this.scrollHandler();
      }
    },
    scrollHandler() {
      let flag = false;
      if (this.$refs.renodes && document.body.clientWidth <= mobileWidth) {
        const { top } = this.$refs.renodes.getBoundingClientRect();
        flag = top <= 0;
      }
      this.$nextTick(() => {
        this.isRetitleFixed = flag;
      });
    },
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
        uploader.err = this.$t('trans0271').replace('%s', process.env.CUSTOMER_CONFIG.accept);
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
      // 增加点击删除已上传的固件后，同时将可升级信息进行隐藏
      const { uploader } = this.$refs;
      this.uploadStatus = uploader.status;
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
                  timeout: 300,
                  progressVisible: true
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
  .retitle {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 0 30px 0;
    &.retitle--fixed {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      z-index: 1000;
      padding: 20px 20px 30px 20px;
      .retitle__btn-wrap {
        margin-top: 15px;
      }
      .retitle__btn {
        margin-left: 0;
      }
    }
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
      height: 136px;
      border: 1px solid #dbdbdb;
      border-radius: 5px;
      margin-right: 20px;
      margin-bottom: 30px;
      position: relative;
      .message {
        display: flex;
        align-items: flex-start;
        padding: 0 20px;
        height: 100%;
        align-items: center;
        cursor: pointer;
        position: relative;
        align-items: center;
        .checkbox-container {
          flex-shrink: 0;
        }
        .img-container,
        .info-container {
          display: flex;
          align-items: center;
          align-content: center;
          height: 100%;
        }
        .img-container {
          margin: 0 5px;
          img {
            width: 80px;
          }
        }

        .info-container {
          flex-direction: column;
          align-items: flex-start;
          align-content: flex-start;
          justify-content: flex-start;
          flex: 1;
          padding-top: 38px;
          padding-bottom: 20px;
          .node-name {
            // width: 100%;
            // overflow: hidden;
            // text-overflow: ellipsis;
            word-break: break-all;
            padding: 0;
            margin: 0;
            text-align: left;
            line-height: 1;
            padding-top: 0px;
            font-size: 14px;
            font-weight: bold;
          }
          .node-sn {
            padding: 0;
            margin: 0;
            text-align: left;
            font-size: 12px;
            padding-top: 10px;
            line-height: 1;
            white-space: nowrap;
          }
          .node-version {
            padding: 0;
            margin: 0;
            text-align: left;
            line-height: 1;
            font-size: 10px;
            padding-top: 10px;
            position: relative;
            span {
              display: inline-block;
            }
          }
        }
      }
      .badges {
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 1;
        display: flex;
        .mk-tag {
          &.gateway {
            background: #00d061;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .nodes-wrapper {
    .retitle {
      flex-direction: column;
      text-align: left;
      .retitle__btn-wrap {
        margin-top: 15px;
      }
    }
    .nodes-info {
      .node {
        width: 100%;
        margin-right: 0;
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1000px) {
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
