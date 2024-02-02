<template>
  <div class="page">
    <div v-if="isMobile"
         class='page-header'>
      {{$t('trans1010')}}
    </div>
    <div class="page-content">
      <div class="backup">
        <div class="backup-wrapper">
          <div class="backup-wrapper__content">
            <p class="backup__tips">{{$t('trans1011')}}</p>
            <p class="backup__tips backup__tips--danger">*{{$t('trans1036')}}</p>
            <p class="backup__tips backup__tips--danger">*{{$t('trans1012')}}</p>
          </div>
          <button class="btn operate-btn"
                  :class="{'btn-default':isMobile,'btn-middle':!isMobile}"
                  :disabled="isDownloading"
                  @click="getBackup">{{$t('trans1013')}}</button>
        </div>
      </div>
      <div class="page-content__main">
        <div class="restore">
          <div class='restore-header'>
            {{$t('trans1014')}}
          </div>
          <div class="restore-notes">
            <p>{{$t('trans1016')}}</p>
            <p>{{$t('trans1017')}}</p>
            <p>{{$t('trans1230')}}</p>
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

          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn btn-primary"
                  @click="restoreBackup"
                  :disabled="!uplodaSuccess">{{$t('trans1027')}}</button>
        </div>
      </div>
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
    isMobile() {
      return this.$store.state.isMobile;
    },
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
            window.location.href = `/${fileName}${this.fileSuffix
              }?t=${Date.now()}`;
          }
        })
        .catch(() => {
          this.isDownloading = false;
          this.$toast(this.$t('trans1023'), 2000, 'error');
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
.page {
  background-color: transparent;
  .page-content {
    .backup {
      background-color: var(--common_card-bgc);
      margin-bottom: 15px;
      box-shadow: var(--common_card-boxshadow);
      padding: 15px 30px;
      border-radius: 10px;
      .backup-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .backup__tips {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 10px;
        &:last-child {
          margin: 0;
        }
      }
      .backup__tips--danger {
        font-size: 12px;
        font-weight: 400;
        color: var(--primary-color);
      }
      .btn-middle {
        min-width: 150px;
      }
    }
    .restore {
      padding: 20px 30px;
      .restore-header {
        font-size: 15px;
        font-weight: 600;
      }
      .restore-notes {
        font-size: 12px;
        color: var(--common_gery-color);
      }
    }
    .page-content__main {
      padding: 0;
      background-color: var(--common_card-bgc);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .page-content__bottom {
      background-color: var(--common_card-bgc);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    .page-content {
      .backup {
        border-radius: 0;
        padding: 20px;
        .backup-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .backup__tips {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 10px;
          &:last-child {
            margin-bottom: 20px;
          }
        }
        .backup__tips--danger {
          font-size: 12px;
          font-weight: 400;
          color: var(--primary-color);
        }
        .operate-btn {
          &.btn-default {
            background-image: linear-gradient(
                to right,
                var(--common_card-bgc),
                var(--common_card-bgc)
              ),
              var(--checkbox_checked-bgc);
          }
        }
      }
      .restore {
        padding: 20px 30px;
        .restore-header {
          font-size: 15px;
          font-weight: 500;
        }
        .restore-notes {
          font-size: 12px;
          color: var(--common_gery-color);
        }
      }
      .page-content__main {
        padding: 0;
        background-color: var(--common_card-bgc);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .page-content__bottom {
        background-color: var(--common_card-bgc);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
  }
}
</style>
