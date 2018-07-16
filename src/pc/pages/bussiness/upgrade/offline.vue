<template>
  <layout>
    <div class="upgrade-offline-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0204')}}
        </div>
        <div>
          <p>{{$t('trans0331')}}</p>
          <p>1. 官网Mercku官方网站，下载最新固件。
            <a href="http://www.mercku.tech" target="_blank">www.mercku.tech</a>
          </p>
          <p>{{$t('trans0333')}}</p>
        </div>

        <span class="btn btn-success fileinput-button">
          <span>上传</span>
          <input type="file" @change="fileUpload" />
        </span>
      </div>
    </div>
  </layout>

</template>
<script>
import layout from '../../../layout.vue';

export default {
  components: {
    layout
  },
  data() {
    return {
      reboot: false
    };
  },
  methods: {
    fileUpload(e) {
      console.log(e);
    }
  }
};
</script>
<style lang="scss" scoped>
.upgrade-offline-container {
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .fileinput-button input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    font-size: 200px;
  }
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
      // position: absolute;
      // padding-top: 100px;
      width: 100%;
      padding: 20px;
      text-align: center;
      margin: 0 auto;
      padding-bottom: 50px;
      // right: 50%;
      // transform: translateX(50%);
      img {
        width: 180px;
      }
      .re-btn {
        margin-top: 50px;
      }
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

