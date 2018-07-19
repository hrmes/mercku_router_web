<template>
  <div class="upload-wrapper">
    <button class="btn btn-success fileinput-button" :disabled="uploadLoading" @click="click">
      <label> <img src="../../assets/images/ic_upgrade.png" alt="">{{label}}</label>
      <input type="file" @change="handleChange" ref='upload' :multiple="multiple" :accept="accept" hidden="hidden" />
    </button>
    <div class='file' v-for="file in files" :key="file.lastModified">
      <img src="../../assets/images/ic_file.png" alt="" width="18" />
      <div class="des-cnt">
        <span> {{file.name}} &nbsp;&nbsp;{{(file.size/1024/1024).toFixed(2)}}MB</span>
        <img src="../../assets/images/ic_delete.png" alt="" width="10" @click="cancel(file)" />
        <div class="line" v-if="!uplodaSuccess">
          <span :class="{'loading':uploadLoading,'fail':uploadFail}" :style="style"></span>
          <span v-if="uploadFail">{{$t(err) || $t('trans0341')}}</span>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { UploadStatus } from '../../../util/constant';

export default {
  props: {
    onSuccess: {
      type: Function,
      default: () => {}
    },
    onError: {
      type: Function,
      default: () => {}
    },
    acceptHttp: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    multiple: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      UploadStatus,
      files: [],
      percentage: 0,
      status: UploadStatus.success,
      source: null,
      err: '',
      style: {
        width: 0
      }
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
    }
  },
  methods: {
    click() {
      console.log(this.$refs.upload);
      this.$refs.upload.click();
    },
    getExtendName(fileName) {
      const r = fileName.split('.');
      if (r.length) {
        return r[r.length - 1];
      }
      return '';
    },
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      const postFiles = Array.prototype.slice.call(files);
      this.upload(postFiles[0]);
    },

    upload(file) {
      if (this.accept) {
        const entendName = this.getExtendName(file.name);
        if (!/^ma$/i.test(entendName)) {
          this.$toast(this.$t('trans0271'));
          return false;
        }
        if (file.size === 0) {
          this.$toast(this.$t('trans0341'));
          return false;
        }
      }
      if (!this.acceptHttp) {
        this.files = [file];
        this.post(this.files);
      }
      return true;
    },
    post(files) {
      const fd = new FormData();
      files.forEach(v => fd.append('file', v));
      this.$http
        .firmwareUpload(fd, (progressEvent, source) => {
          this.source = source;
          if (progressEvent.lengthComputable) {
            this.percentage = Math.floor(
              progressEvent.loaded / progressEvent.total * 100
            );
            this.style.width = `${this.percentage / 100 * 260}px`;
            this.status =
              progressEvent.loaded >= progressEvent.total
                ? UploadStatus.success
                : UploadStatus.uploading;
          }
        })
        .then(res => {
          this.status = UploadStatus.success;
          this.onSuccess(res, this.files);
        })
        .catch(err => {
          if (err && err.error) {
            this.err = err.error.code;
          }
          this.status = UploadStatus.fail;
          this.percentage = 0;
          this.onError(err, this.files, this.source);
        });
    },
    cancel(file) {
      if (this.source) {
        this.source.cancel('cancel upload');
      }
      this.files = this.files.filter(v => v.name !== file.name);
      this.$refs.upload.value = null;
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
        background: url(../../assets/images/ic_delete.png);
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
  .btn {
    width: auto;
    height: 32px;
    &[disabled] {
      background: #999;
    }
  }
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
    label {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      align-items: center;
      cursor: pointer;
      margin: 0;
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

