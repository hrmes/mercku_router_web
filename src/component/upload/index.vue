<template>
  <div class="upload-wrapper">
    <button class="btn fileinput-button"
            :disabled="uploadLoading"
            @click="click">
      <label>{{label}}</label>
      <input type="file"
             @change="handleChange"
             ref='upload'
             :multiple="multiple"
             :accept="accept"
             hidden="hidden" />
    </button>
    <div class='file'
         v-for="file in files"
         :key="file.lastModified">
      <div class="icon-wrap">
        <img src="../../assets/images/icon/ic_folder.png" />
      </div>
      <div class="des-cnt">
        <div class="description">
          <span>
            <span class="filename">{{file.name}}
              <span class="filesize">{{getSize(file)}}</span>
            </span>
            <span v-if="!uplodaSuccess"
                  class="percent">{{width}}</span>
          </span>
          <div class="packageinfo"
               v-if="uplodaSuccess">
            <span class="product">{{packageInfo.product}}</span>
            <span class="version">{{packageInfo.version}}</span>
          </div>
        </div>

        <div class="line"
             v-if="!uplodaSuccess">
          <span :class="{'loading':uploadLoading,'fail':uploadFail}"
                :style="{'width':width}"></span>
        </div>
        <span class="error-message"
              v-if="uploadFail">{{err || $t('trans0341')}}</span>
      </div>
      <div class="delete-wrap">
        <img v-if="uploadLoading ||uploadFail"
             src="../../assets/images/icon/ic_trash.png"
             alt=""
             width="24"
             @click="cancel(file)" />
      </div>
    </div>
  </div>
</template>
<script>
import { UploadStatus } from 'util/constant';

export default {
  props: {
    onSuccess: { type: Function },
    onError: { type: Function },
    onChange: { Function },
    onCancel: { type: Function },
    label: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    request: { type: Function },
    beforeUpload: { type: Function },
    packageInfo: {}
  },
  data() {
    return {
      files: [],
      percentage: 0,
      status: UploadStatus.ready,
      err: ''
    };
  },
  computed: {
    uplodaSuccess() {
      return this.status === UploadStatus.success;
    },
    uploadLoading() {
      return this.status === UploadStatus.uploading;
    },
    uploadFail() {
      return this.status === UploadStatus.fail;
    },
    percent() {
      return Math.min(this.percentage, 100);
    },
    width() {
      return `${this.percent}%`;
    }
  },
  methods: {
    getSize(file) {
      return `${(file.size / 1000 / 1000).toFixed(2)}MB`;
    },
    click() {
      this.files = [];
      this.err = '';
      this.percentage = 0;
      this.status = UploadStatus.ready;
      this.$refs.upload.value = null;
      this.$refs.upload.click();
      this.onChange && this.onChange();
    },

    handleChange(ev) {
      const { files } = ev.target;
      if (files && !files.length) return;
      const postFiles = Array.prototype.slice.call(files);
      this.upload(postFiles);
    },
    upload(files) {
      this.files = files;
      if (this.beforeUpload && !this.beforeUpload(this.files)) {
        this.status = UploadStatus.fail;
        return false;
      }
      if (!this.request) {
        // 组件内部实现自己的上传逻辑 this.post(this.files);
      } else {
        // 外部上传
        this.request(this.files);
      }
      return true;
    },
    cancel(file) {
      // 组件内部的取消逻辑
      this.files = this.files.filter(v => v.name !== file.name);
      this.$refs.upload.value = null;
      this.status = UploadStatus.ready;
      this.onCancel && this.onCancel(file);
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-wrapper {
  .file {
    width: 500px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    color: #999999;
    border-radius: 5px;
    background: #f1f1f1;
    padding: 20px;
    .icon-wrap {
      background: #fff;
      padding: 10px;
      border-radius: 50%;
      img {
        width: 20px;
        height: 20px;
        display: block;
      }
    }
    .des-cnt {
      position: relative;
      margin-left: 20px;
      flex: 1;
      .description {
        color: #333;
        display: flex;
        // align-items: center;
        flex-direction: column;
        > span {
          display: flex;
          justify-content: space-between;
        }
        .packageinfo {
          display: flex;
          .product,
          .version {
            display: flex;
            align-items: center;
            &::before {
              content: '';
              display: inline-block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              margin-right: 5px;
              background: #00d061;
            }
          }
          .product {
            margin-right: 10px;
          }
          .version {
            &::before {
              background: #ff6f00;
            }
          }
        }
      }
      .filename {
        max-width: 320px;
        white-space: nowrap;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .filesize {
        margin-left: 5px;
      }
      .percent {
        font-size: 12px;
        color: #999;
        display: flex;
        align-items: flex-end;
      }
      .del-btn {
        display: inline-block;
        width: 13px;
        height: 14px;
        background: url(../../assets/images/icon/ic_delete.png);
        background-size: 100%;
        border-radius: 13px;
        cursor: pointer;
      }
      img {
        float: right;
        margin-top: 5px;
        cursor: pointer;
        border: 1px red;
        :hover {
          border: 1px solid red;
        }
      }
      .line {
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 3px;
        background: #e3e3e3;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 1.5px;
        .loading {
          display: inline-block;
          height: 3px;
          transition: width 1s ease;
          background: #333;
        }
        .fail {
          display: inline-block;
          height: 3px;
          background: #ff0000;
        }
      }
      .error-message {
        font-size: 12px;
        color: #ff0000;
      }
    }
    .delete-wrap {
      margin-left: 20px;
      img {
        cursor: pointer;
      }
    }
  }
  .fileinput-button {
    position: relative;
    // display: inline-block;
    width: auto;
    height: 28px;
    min-width: 80px;
    cursor: pointer;
    &[disabled] {
      background: #999;
      cursor: not-allowed;
      label {
        cursor: not-allowed;
      }
    }
    label {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      align-items: center;
      margin: 0;
      cursor: pointer;
      img {
        width: 14px;
        margin-right: 5px;
      }
      font-size: 12px;
      font-weight: normal;
    }
  }
  .fileinput-button input {
    cursor: pointer;
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    width: 100%;
    height: 100%;
  }
}
</style>
