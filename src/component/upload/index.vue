<template>
  <div class="upload-wrapper">
    <button class="btn btn-success fileinput-button"
            :disabled="uploadLoading"
            @click="click">
      <label> <img src="../../assets/images/icon/ic_upgrade.png"
             alt="">{{label}}</label>
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
      <img src="../../assets/images/icon/ic_file.png"
           alt=""
           width="18" />
      <div class="des-cnt">
        <span> {{file.name}} <br />{{(file.size/1000/1000).toFixed(2)}}MB</span>
        <img v-if="uploadLoading"
             src="../../assets/images/icon/ic_delete.png"
             alt=""
             width="10"
             @click="cancel(file)" />
        <div class="line"
             v-if="!uplodaSuccess">
          <span :class="{'loading':uploadLoading,'fail':uploadFail}"
                :style="{'width':width}"></span>
          <span v-if="uploadFail">{{err || $t('trans0341')}}</span>
        </div>
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
    beforeUpload: { type: Function }
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
    width() {
      const percent = Math.min(this.percentage, 100);
      return `${percent}%`;
    }
  },
  methods: {
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
  display: flex;

  .file {
    margin-left: 20px;
    display: flex;
    align-items: center;
    width: 300px;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    color: #999999;
    padding: 0 5px;
    &:hover {
      background: #f9f9f9;
      border-radius: 4px;
      color: #409eff;
    }
    .des-cnt {
      width: 260px;
      position: relative;
      margin-left: 10px;
      cursor: pointer;
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
        position: absolute;
        width: 100%;
        bottom: -5px;
        height: 2px;
        border: 1px solid #f1f1f1;
        .loading {
          display: inline-block;
          height: 2px;
          transition: width 1s ease;
          border: 1px solid #67dd37;
          position: absolute;
          bottom: -1px;
        }
        .fail {
          display: inline-block;
          height: 2px;

          border: 1px solid red;
          position: absolute;
          bottom: -1px;
        }
        span {
          display: inline-block;
          color: red;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
  }
  .fileinput-button {
    position: relative;
    display: inline-block;
    width: auto;
    height: 28px;
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
      font-size: 14px;
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
