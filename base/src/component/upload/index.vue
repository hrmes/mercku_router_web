<template>
  <div class="upload">
    <div class="upload__box">
      <upload-dragger v-if="dragable"
                      :uploadLoading="uploadLoading"
                      @file="uploadDragFiles">
        <svg class="upload__icon"
             :class="uploadLoading ? 'is-upload-loading' : ''"
             viewBox="0 0 1536 1024"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M1241.6 378.24C1196.8 163.936 1004.8 0 768 0c-185.6 0-345.6 100.864-422.4 252.16C147.2 277.44 0 435.04 0 630.464c0 208.064 172.8 378.272 384 378.272h832c179.2 0 320-138.688 320-315.2 0-163.936-134.4-302.624-294.4-315.232zM896 567.424v252.16h-256v-252.16h-192l320-315.2 320 315.2h-192z"
                fill="#D6001C"></path>
        </svg>
        <p class="upload__text">
          {{$t('trans0928')}}
        </p>
        <button class="btn fileinput-button"
                :disabled="uploadLoading"
                @click="click">
          <label>{{label}}</label>
        </button>
      </upload-dragger>
      <template v-else>
        <button class="btn fileinput-button"
                :disabled="uploadLoading"
                @click="click">
          <label>{{label}}</label>
        </button>
      </template>
      <input type="file"
             @change="handleChange"
             ref='upload'
             :multiple="multiple"
             :accept="accept"
             hidden="hidden" />
    </div>
    <div class="upload__files">
      <div class='file'
           v-for="file in files"
           :key="file.lastModified">
        <div class="file__info">
          <div class="icon-wrap">
            <img :src="fileIcon" />
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
                   v-if="uplodaSuccess && packageInfo.product && packageInfo.version">
                <span class="product">{{packageInfo.product}}</span>
                <span class="version">{{packageInfo.version}}</span>
              </div>
            </div>

            <div class="line"
                 v-if="!uplodaSuccess">
              <span :class="{'loading':uploadLoading,'fail':uploadFail}"
                    :style="{'width':width}"></span>
            </div>
          </div>
          <div class="delete-wrap">
            <img v-if="uploadLoading ||uploadFail"
                 src="../../assets/images/icon/ic_trash.png"
                 alt=""
                 width="24"
                 @click="cancel(file)" />
          </div>
        </div>
        <div class="file__error"
             v-if="uploadFail">{{err || $t('trans0341')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { toLocaleNumber } from '../../util/util';
import { UploadStatus } from '../../util/constant';
import UploadDragger from './upload-dragger.vue';
import folderIcon from '../../assets/images/icon/ic_folder.svg';
import folderIconError from '../../assets/images/icon/ic_folder_error.svg';

export default {
  components: {
    UploadDragger
  },
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
    packageInfo: {},
    dragable: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 50 * 1000 * 1000
    }
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
    },
    fileIcon() {
      return this.uploadFail ? folderIconError : folderIcon;
    }
  },
  methods: {
    uploadDragFiles(files) {
      if (files && !files.length) return;
      let postFiles = [].slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      this.upload(postFiles);
    },
    getSize(file) {
      return `${toLocaleNumber(file.size / 1000 / 1000, this.$i18n.locale, 2, 2)}MB`;
    },
    click() {
      this.initUploadStatus();
      this.$refs.upload.click();
    },
    initUploadStatus() {
      this.files = [];
      this.err = '';
      this.percentage = 0;
      this.status = UploadStatus.ready;
      this.$refs.upload.value = null;
      this.onChange && this.onChange();
    },
    handleChange(ev) {
      const { files } = ev.target;
      if (files && !files.length) return;
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }
      this.upload(postFiles);
    },
    upload(files) {
      this.files = files;
      const isLimitOver = !!this.files.find(file => file.size >= this.limit);
      if (isLimitOver) {
        this.status = UploadStatus.fail;
        this.err = this.$t('trans0933');
        return false;
      }
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
.upload {
  .upload__box {
    position: relative;
    input {
      cursor: pointer;
      position: absolute;
      right: 0px;
      top: 0px;
      opacity: 0;
      -ms-filter: 'alpha(opacity=0)';
      width: 100%;
      height: 100%;
    }

    .upload__icon {
      width: 48px;
      height: 32px;
      path {
        fill: $button-background-color;
      }
      &.is-upload-loading {
        path {
          fill: $upload-button-disabled-color;
        }
      }
    }
    .upload__text {
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    .fileinput-button {
      width: auto;
      height: 28px;
      min-width: 80px;
      cursor: pointer;
      &[disabled] {
        background: $upload-button-disabled-color;
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
  }
  .upload__files {
    width: 513px;
    margin-top: 20px;
  }
  .file {
    & + .file {
      margin-top: 20px;
    }
    .file__info {
      display: flex;
      align-items: center;
      transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
      font-size: 14px;
      color: $upload-file-text-color;
      border-radius: 5px;
      background: $upload-background-color;
      padding: 20px;
      .icon-wrap {
        background: $upload-icon-background-color;
        padding: 10px;
        border-radius: 50%;
        img {
          width: 38px;
          height: 38px;
          display: block;
        }
      }
      .des-cnt {
        position: relative;
        margin-left: 20px;
        flex: 1;
        .description {
          color: $upload-file-description-color;
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
                background: $upload-file-info-product-dot-color;
              }
            }
            .product {
              margin-right: 10px;
            }
            .version {
              &::before {
                background: $upload-file-info-version-dot-color;
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
          color: $upload-file-text-color;
        }
        .percent {
          font-size: 12px;
          color: $upload-file-text-color;
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
          background: $upload-progress-color;
          margin-top: 10px;
          margin-bottom: 10px;
          border-radius: 1.5px;
          .loading {
            display: inline-block;
            height: 3px;
            transition: width 1s ease;
            background: $upload-progress-completed-color;
          }
          .fail {
            display: inline-block;
            height: 3px;
            background: $upload-error-text-color;
          }
        }
      }
      .delete-wrap {
        margin-left: 20px;
        img {
          cursor: pointer;
        }
      }
    }
    .file__error {
      margin-top: 10px;
      font-size: 12px;
      color: #ff0021;
    }
  }
}
</style>
