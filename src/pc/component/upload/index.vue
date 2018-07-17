<template>
  <div class="upload-wrapper">
    <span class="btn btn-success fileinput-button">
      <span>选择文件</span>
      <input type="file" @change="handleChange" ref='upload' :multiple="multiple" :accept="accept" />
    </span>
    <p v-for="file in fileList" :key="file.lastModified">{{file.name&&file.name}}
      <button @click="remove(file)">clear</button>
    </p>

  </div>
</template>
<script>
export default {
  props: {
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
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
    span {
      display: block;

      line-height: 58px;
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

