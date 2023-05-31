<template>
  <div class="page backup">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans1010')}}
    </div>
    <div class="backup__content">
      <p class="backup__tips">{{$t('trans1011')}}</p>
      <p class="backup__tips">{{$t('trans1036')}}</p>
      <p class="backup__tips backup__tips--danger">*{{$t('trans1012')}}</p>
      <button class="btn btn-middle operate-btn"
              :disabled="isDownloading"
              @click="getBackup">{{$t('trans1013')}}</button>
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
              @click="restoreBackup"
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
      upgraded: false,
      isDownloading: false,
      downloadTimer: null
    };
  },
  computed: {
    uplodaSuccess() {
      return this.uploadStatus === UploadStatus.success;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.uplodaSuccess &&
      !this.upgraded &&
      !to.path.includes('/login') &&
      !to.path.includes('/unconnect')
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
  beforeDestroy() {
    clearTimeout(this.downloadTimer);
    this.downloadTimer = null;
  },
  methods: {
    getBackup() {
      this.$loading.open();
      this.isDownloading = true;
      this.$http
        .getRouterConfigBackup()
        .then(res => {
          if (res.status) {
            this.downloadTimer = setTimeout(() => {
              this.isDownloading = false;
              clearTimeout(this.downloadTimer);
              this.downloadTimer = null;
            }, 5000);
            window.location.href = `/${fileName}${this.fileSuffix}?t=${Date.now()}`;
          }
        })
        .catch(() => {
          this.isDownloading = false;
          this.$toast(this.$t('trans1023'), 3000, 'error');
        })
        .finally(() => {
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
        uploader.err = this.$t('trans1028');
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
    restoreBackup() {
      this.$loading.open();
      this.$http
        .restoreRouterConfig()
        .then(res => {
          this.$loading.close();
          if (res.status) {
            this.upgraded = true;
            this.$reconnect({
              timeout: 150,
              onsuccess: () => {
                this.$router.push({ path: '/login' });
              },
              ontimeout: () => {
                this.$router.push({ path: '/unconnect' });
              }
            });
          }
        })
        .finally(() => {
          this.$loading.close();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.backup {
  p {
    width: 500px;
    padding: 0;
    margin: 0;
  }
  .operate-btn {
    margin-top: 30px;
    width: 500px;
  }
  .backup__content {
    padding: 30px 20px;
  }
  .backup__tips {
    font-size: 14px;
    color: var(--text-default-color);
    &.backup__tips--danger {
      color: var(--warning-color);
    }
    & + .backup__tips {
      margin-top: 12px;
    }
  }
  .backup__notes {
    margin-top: 20px;
    font-size: 12px;
    color: var(--text-default-color);
  }
  @media screen and (max-width: 768px) {
    .btn {
      margin-left: 0;
    }
    p {
      width: 100%;
    }
    .operate-btn {
      width: 100%;
    }
    .backup__content {
      padding: 20px;
    }
  }
}
</style>
