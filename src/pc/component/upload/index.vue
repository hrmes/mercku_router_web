<template>
  <div class="upload-wrapper">
    <div class="btn btn-success fileinput-button">
      <p> <img src="../../assets/images/ic_upgrade.png" alt="">{{label}}</p>
      <input type="file" @change="handleChange" ref='upload' :multiple="multiple" :accept="accept" title=" " />
    </div>
    <div class='file'>
      <!-- <div class='file' v-for="file in fileList" :key="file.lastModified"> -->
      <img src="../../assets/images/ic_file.png" alt="" width="18" />
      <div class="des-cnt">
        <span> mercku_123.bin 30MB</span>
        <img src="../../assets/images/ic_delete.png" alt="" width="10" @click="remove(file)" />
        <div class="line">
          <span class="loading"></span>
          <span>上传失败</span>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  props: {
    acceptHttp: {
      type: Boolean,
      default: false
    },
      uploadStatus: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: []
    },
    multiple: {
      type: Number,
      default: 1
    },
    percentage: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: ''
    },
    berforUpload: {
      type: Function,
      default: () => {}
    },
    uploadFiles: {
      type: Function,
      default: () => {}
    },
    handleRemove: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      chooseFiles: []
    };
  },
  methods: {
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      const postFiles = Array.prototype.slice.call(files);
      this.chooseFiles = this.chooseFiles.concat(postFiles);
      this.upload(postFiles);
    },
    upload(files) {
      if (this.chooseFiles.length > this.multiple) {
        this.chooseFiles = this.chooseFiles.filter(
          v => v.name !== files[0].name
        );
        return;
      }
      this.berforUpload(files[0]);
      this.uploadFiles(files[0]);
    },
    remove(file) {
      this.handleRemove(file);
      this.chooseFiles = this.chooseFiles.filter(v => v.name !== file.name);
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
    .des-cnt {
      width: 260px;
      position: relative;
      margin-left: 10px;
      padding-bottom: 5px;
      .del-btn {
        display: inline-block;
        width: 13px;
        height: 14px;
        background: url(../../assets/images/ic_delete.png);
        background-size: 100%;
        border-radius: 13px;
        cursor: pointer;
        // &:hover {
        //   border: 1px solid #4237dd;
        // }
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
      span {
        font-size: 14px;
        color: #999999;
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
          width: 30px;
          border: 1px solid #67dd37;
          position: absolute;
          bottom: -1px;
        }
        .fail {
          display: inline-block;
          height: 2px;
          width: 30px;
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
    width: 106px;
    height: 32px;
  }
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
    p {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      align-items: center;
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

