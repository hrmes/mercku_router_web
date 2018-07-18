<template>
  <layout>
    <div class="upgrade-offline-container">
      <div class="content">
        <div class='w-header'>{{$t('trans0204')}}</div>
        <div class="form">
          <div class="description">
            <h4>
              <img src="../../../assets/images/ic_question.png" alt="">
              <span> {{$t('trans0331')}}</span>
            </h4>
            <p>1. 官网Mercku官方网站，下载最新固件。
              <a href="http://www.mercku.tech" target="_blank">www.mercku.tech</a>
            </p>
            <p>2. {{$t('trans0333')}}</p>
            <p>3. {{$t('trans0333')}}</p>
          </div>
          <div class="upload">
            <m-upload :label="$t('trans0339')" :percentage="percentage" :uploadStatus="status" :fileList="fileList" :multiple="multiple" :accept="accept" :berforUpload="beforeUpload" :uploadFiles="uploadFiles" :handleRemove="handleRemove" />
          </div>
          <div class="nodes-wrapper">
            <p>{{$t('trans0333')}}</p>
            <ul>
              <li v-for="node in localNodes" :key="node.sn">
                <p>{{node.sn}}</p>
                <p>{{node.model}}</p>
                <p>{{node.name}}</p>
                <p>{{node.version.current}}</p>
                <p>{{node.version.latest}}</p>
              </li>
            </ul>

          </div>
        </div>

      </div>

    </div>
  </layout>

</template>
<script>
import layout from '../../../layout.vue';
import Upload from '../../../component/upload/index.vue';

export default {
  components: {
    layout,
    'm-upload': Upload
  },
  data() {
    return {
      fileList: [],
      multiple: 1,
      accept: '.bin',
      percentage: 0,
      status: 'uploading',
      localNodes: []
    };
  },
  methods: {
    getExtendName(fileName) {
      const r = fileName.split('.');
      if (r.length) {
        return r[r.length - 1];
      }
      return '';
    },
    beforeUpload(file) {
      const entendName = this.getExtendName(file.name);
      if (!/bin/i.test(entendName)) {
        console.log('文件名不匹配', entendName);
        return false;
      }
      if (file.size === 0) {
        console.log('文件大小不匹配', file.size);
        return false;
      }
      return true;
    },
    uploadFiles(file) {
      this.fileList.push(file);
      this.submit();
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter(v => v.name !== file.name);
    },
    submit() {
      const fd = new FormData();
      this.fileList.forEach(v => fd.append('file', v));
      this.$http
        .firmwareUpload(fd, progressEvent => {
          console.log(progressEvent);
          if (progressEvent.lengthComputable) {
            this.percentage = progressEvent.loaded / progressEvent.total;
            console.log(this.percentage);
            this.status =
              progressEvent.loaded >= progressEvent.total
                ? 'success'
                : 'uploading';
          }
        })
        .then(res => {
          const data = res.data.result;
          this.localNodes = data.filter(v => v.updatable);
        })
        .catch(err => {
          console.log(err);
        });
    },
    upgrade() {
      const ids = this.localNodes.map(v => v.sn);
      this.$http.upgrade({ node_ids: ids, local: true }).then(res => {
        console.log(res);
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
    .nodes-wrapper {
      border-top: 1px solid #f1f1f1;
      margin-top: 50px;
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-safe-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 510px;
      background: white;
    }
  }
}
</style>

