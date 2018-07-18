<template>
  <div class="upload-wrapper">
    <div class="btn btn-success fileinput-button">
      <p> <img src="../../assets/images/ic_upgrade.png" alt="">{{label}}</p>
      <input type="file" @change="handleChange" ref='upload' :multiple="multiple" :accept="accept" />
    </div>
    <div class='file'>
      <!-- <div class='file' v-for="file in fileList" :key="file.lastModified"> -->
      <img src="../../assets/images/ic_file.png" alt="" width="18" />
      <div class="des-cnt">
        <span> mercku_123.bin 30MB</span>
        <img src="../../assets/images/ic_delete.png" alt="" width="10" />
      </div>
      <!-- <button @click="remove(file)">clear</button> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
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
    width: 260px;
    .des-cnt {
      width: 200px;
      img {
        float: right;
        margin-top: 5px;
      }
      span {
        margin: 0 10px;
        font-size: 14px;
        color: #999999;
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
      cursor: pointer;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .fileinput-button input {
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

