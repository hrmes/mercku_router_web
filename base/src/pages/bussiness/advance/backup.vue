<template>
  <div class="page backup">
    <div class='page-header'>
      {{$t('trans1010')}}
    </div>
    <div class="backup__content">
      <p class="backup__tips--primary">{{$t('trans1011')}}</p>
      <p class="backup__tips--danger">*{{$t('trans1012')}}</p>
      <button class="btn btn-middle btn-primary operate-btn"
              @click="getRouterConfigBackup">{{$t('trans1013')}}</button>
    </div>
    <div class='page-header'>
      {{$t('trans1014')}}
    </div>
    <div class="backup__content">
      <div class="backup__upload">
        <m-upload ref="uploader"
                  dragable
                  :onChange="onChange"
                  :onCancel="onCancel"
                  :beforeUpload="beforeUpload"
                  :request="upload"
                  :label="$t('trans1015')"
                  :accept="fileSuffix" />
      </div>
      <div class="backup__notes">
        <p>{{$t('trans1018')}}</p>
        <p>{{$t('trans1016')}}</p>
        <p>{{$t('trans1017')}}</p>
      </div>
      <button class="btn btn-middle btn-primary operate-btn"
              @click="restore"
              v-if="uplodaSuccess">{{$t('trans1027')}}</button>
    </div>
  </div>
</template>
<script>
import { UploadStatus } from 'base/util/constant';
import { getFileExtendName } from 'base/util/util';
import RouterModel from 'base/mixins/router-model';

const backUp = 'backup';
const fileName = 'configs';

export default {
  mixins: [RouterModel],
  data() {
    return {
      fileSuffix: '.dat',
      UploadStatus,
      uploadStatus: UploadStatus.ready,
      cancelToken: null,
      upgraded: false
    };
  },
  computed: {
    uplodaSuccess() {
      return this.uploadStatus === UploadStatus.success;
    }
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
  methods: {
    getRouterConfigBackup() {
      this.$loading.open();
      this.$http
        .getRouterConfigBackup()
        .then(res => {
          this.$loading.close();
          if (res.status) {
            window.location.href = `/${fileName}${this.fileSuffix}`;
          }
        })
        .catch(() => {
          this.$toast(this.$t('trans1023'), 3000, 'error');
          this.$loading.close();
        });
    },
    onChange() {
      const { uploader } = this.$refs;
      this.uploadStatus = uploader.status;
    },
    onCancel() {
      const { uploader } = this.$refs;
      this.uploadStatus = uploader.status;
      this.cancelToken.cancel('cancel');
    },
    beforeUpload(files) {
      const file = files[0];
      const { uploader } = this.$refs;
      const entendName = getFileExtendName(file);
      const reg = new RegExp(`^${this.fileSuffix.slice(1)}$`, 'i');
      if (!reg.test(entendName)) {
        uploader.err = this.$t('trans0271');
        return false;
      }
      if (file.size === 0) {
        uploader.err = this.$t('trans0341');
        return false;
      }
      return true;
    },
    upload(files) {
      const formData = new FormData();
      formData.append('type', backUp);
      formData.append('file', files[0]);
      const { uploader } = this.$refs;
      this.uploadStatus = UploadStatus.uploading;
      uploader.status = UploadStatus.uploading;
      return this.$http
        .uploadFile(formData, (progressEvent, token) => {
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
        .then(() => {
          uploader.status = UploadStatus.success;
          this.uploadStatus = UploadStatus.success;
        })
        .catch(err => {
          uploader.status = UploadStatus.fail;
          this.uploadStatus = UploadStatus.fail;
          if (err.response && err.response.data && err.response.data.error) {
            uploader.err = this.$t(err.response.data.error.code);
          }
        });
    },
    restore() {
      this.$loading.open();
      this.$http.restoreRouterConfig().then(res => {
        this.$loading.close();
        if (res.status) {
          this.$reconnect({
            timeout: 120,
            onsuccess: () => {
              this.$refs.uploader.initUploadStatus();
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.backup {
  p {
    width: 600px;
    padding: 0;
    margin: 0;
  }
  .operate-btn {
    margin-top: 30px;
  }
  .backup__content {
    padding: 30px 20px;
  }
  .backup__tips--primary {
    font-size: 14px;
    color: #333;
  }
  .backup__tips--danger {
    margin-top: 12px;
    font-size: 14px;
    color: #d6001c;
  }
  .backup__notes {
    margin-top: 20px;
    font-size: 12px;
    color: #333;
  }
  @media screen and (max-width: 768px) {
    .btn {
      margin-left: 0;
    }
    p {
      width: 100%;
    }
    .backup__content {
      padding: 20px;
    }
  }
}
</style>
