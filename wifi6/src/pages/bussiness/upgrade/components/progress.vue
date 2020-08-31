<template>
  <transition name="upgrade"
              @after-leave="afterLeave">
    <div class="mk-upgrade"
         v-if="visible">
      <div class="mk-upgrade__shadow"></div>
      <div class="mk-upgrade-body">
        <div class="mk-upgrade-header">
          <img class="mk-upgrade-header__close"
               @click="close"
               v-if="upgradeCompleted"
               src="@/assets/images/icon/ic_close_gray@2x.png"
               alt="">
        </div>
        <div class="mk-upgrade-content">

          <div class="mk-upgrade-content__title">{{title}}</div>
          <div v-if="upgradeDescriptionVisible"
               class="mk-upgrade-content__description">
            <img src="@/assets/images/icon/ic_warning2@2x.png"
                 alt="">
            <span>{{translate('trans0213')}}</span>
          </div>

          <div class="mk-upgrade-node">
            <img class="mk-upgrade-node__img"
                 :src="getNodeImage(node)"
                 alt="">
            <div class="mk-upgrade-node__name">{{node.name}}</div>
            <div class="mk-upgrade-node__sn">{{translate('trans0252')}}{{node.sn}}</div>
            <div class="mk-upgrade-node__version">
              {{translate('trans0342')}}：{{node.version.current}}</div>
          </div>

          <div class="mk-upgrade-result">
            <div v-if="installTimeout"
                 class="mk-upgrade-result__description">
              <div class="mk-upgrade-result__title">{{translate('trans0808')}}</div>
              <ul class="mk-upgrade-reasons reset-ul">
                <li class="mk-upgrade-reason">{{translate('trans0807')}}</li>
                <li class="mk-upgrade-reason">{{translate('trans0806')}}</li>
              </ul>
            </div>
            <div class="mk-upgrade-result__img">
              <m-spinner color="#d6001c"
                         :size="30"
                         v-if="status === Statuses.installing"></m-spinner>
              <m-loading :size="30"
                         v-if="status === Statuses.downloading"></m-loading>
              <img v-if="status === Statuses.download_fail || status === Statuses.install_fail"
                   src="@/assets/images/icon/ic_default_error.png"
                   alt="">
              <img v-if="status === Statuses.install_success"
                   src="@/assets/images/icon/ic_default_success.png"
                   alt="">
              <img v-if="status === Statuses.install_timeout"
                   src="@/assets/images/icon/ic_hint.png"
                   alt="">
            </div>
            <div class="mk-upgrade-result__status">{{translate(status)}}</div>
          </div>
        </div>

      </div>
    </div>
  </transition>

</template>
<script>
import { translate } from '@/i18n';
import RouterModel from '@/mixins/router-model';
import mSpinner from 'components/spinner/index.vue';
import mLoading from 'components/loading/loading-new.vue';
import { compareVersion } from '@/util/util';

const Statuses = {
  downloading: 'downloading',
  installing: 'installing',
  download_fail: 'download_fail',
  install_fail: 'install_fail',
  install_success: 'install_success',
  install_timeout: 'install_timeout'
};
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      translate,
      Statuses,
      status: '',
      node: {
        sn: '030000000000000',
        name: '',
        version: {
          current: '1.0.0'
        }
      },
      preStatus: '',
      preVersion: '',
      timer: null,
      pageActive: true
    };
  },
  components: {
    mSpinner,
    mLoading
  },
  mixins: [RouterModel],
  computed: {
    installTimeout() {
      return this.status === Statuses.install_timeout;
    },
    title() {
      let text = '';
      switch (this.status) {
        case Statuses.downloading:
        case Statuses.download_fail:
        case Statuses.installing:
          text = translate('trans0385');
          break;
        case Statuses.install_fail:
        case Statuses.install_success:
        case Statuses.install_timeout:
          text = translate('trans0603');
          break;
        default:
          text = '';
      }
      return text;
    },
    upgradeDescriptionVisible() {
      return (
        this.status === Statuses.downloading ||
        this.status === Statuses.download_fail ||
        this.status === Statuses.installing
      );
    },
    upgradeCompleted() {
      return (
        this.status === Statuses.download_fail ||
        this.status === Statuses.install_fail ||
        this.status === Statuses.install_success ||
        this.status === Statuses.install_timeout
      );
    },
    success() {
      return this.status === Statuses.install_success;
    }
  },
  watch: {
    visible(nv, ov) {
      if (nv !== ov && nv === true) {
        this.getNodeUpgrading();
      }
    }
  },
  methods: {
    afterLeave() {
      const { parentNode } = this.$el;
      parentNode.removeChild(this.$el);
      this.$emit('after-close', this.success);
    },
    close() {
      this.$emit('update:visible', false);
    },
    getNodeUpgrading() {
      this.$http.getMeshNode().then(res => {
        const nodes = res.data.result;
        console.log('getMeshNode');
        console.log('nodes is ', nodes);
        [this.node] = nodes.filter(n => {
          if (
            n.status === Statuses.downloading ||
            n.status === Statuses.installing
          ) {
            return true;
          }
          return false;
        });
        console.log('node is:', this.node);
        if (!this.node) {
          // 升级已经结束了，需要退出等待
          this.close();
        } else {
          this.status = this.node.status;
          this.preStatus = this.node.status;
          this.preVersion = this.node.version.current;
          this.checkNodeStatus();
        }
      });
    },
    checkNodeStatus() {
      clearTimeout(this.timer);
      this.timer = null;
      this.$http
        .getMeshNode(null, {
          noRedirect: true
        })
        .then(res => {
          const nodes = res.data.result;
          const [node] = nodes.filter(n => n.sn === this.node.sn);
          if (!node) {
            return;
          }
          this.node = node;
          // 状态已经变更
          if (node.status !== this.preStatus) {
            // 前一个状态是downloading，但是现在不是安装中，表示下载失败了
            if (this.preStatus === Statuses.downloading) {
              if (node.status !== Statuses.installing) {
                this.status = Statuses.download_fail;
              } else {
                this.status = Statuses.installing;
                this.preStatus = Statuses.installing;
              }
            } else if (this.preStatus === Statuses.installing) {
              if (compareVersion(this.preVersion, node.version.current)) {
                this.status = Statuses.install_success;
              } else {
                this.status = Statuses.install_fail;
              }
            }
          }
          if (
            (node.status === Statuses.downloading ||
              node.status === Statuses.installing) &&
            this.pageActive
          ) {
            this.timer = setTimeout(() => {
              this.checkNodeStatus();
            }, 5000);
          }
        })
        .catch(err => {
          console.log('in catch......', err);
          // 这种情况是gw重启了，需要定时去检查gw是否重启完成
          let timeout = 600000;
          const interval = 5000;
          let responsed = true;

          let timer = setInterval(() => {
            timeout -= interval;
            if (timeout <= 0) {
              clearInterval(timer);
              timer = null;
              this.$http.getRouter(); // 超时跳转到未连接页面
            }
            if (responsed) {
              responsed = false;
              this.$http
                .getRouter(null, {
                  noRedirect: true
                })
                .then(res => {
                  responsed = true;
                  const node = res.data.result;
                  this.node = node;
                  if (compareVersion(this.preVersion, node.version.current)) {
                    this.status = Statuses.install_success;
                  } else {
                    this.status = Statuses.install_fail;
                  }
                  clearInterval(timer);
                  timer = null;
                })
                .catch(() => {
                  responsed = true;
                });
            }
          }, interval);
        });
    }
  }
};
</script>
<style lang="scss">
.mk-upgrade {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  &.upgrade-enter {
    opacity: 0;
  }
  &.upgrade-enter-active {
    transition: all 0.3s ease-in;
  }
  &.upgrade-leave-active {
    opacity: 0;
    transition: all 0.3s ease-out;
  }
  .mk-upgrade__shadow {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: -1;
  }

  .mk-upgrade-body {
    padding: 15px;
    .mk-upgrade-header {
      .mk-upgrade-header__close {
        width: 24px;
        display: block;
        height: 24px;
        cursor: pointer;
        margin-left: auto;
      }
    }
    .mk-upgrade-content {
      margin-top: 10px;
      padding: 0 45px;
      .mk-upgrade-content__title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
      .mk-upgrade-content__description {
        display: flex;
        margin-top: 5px;
        img {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          display: block;
          margin-top: 1px;
        }
        span {
          font-size: 12px;
          margin-left: 5px;
        }
      }
      .mk-upgrade-node {
        margin-top: 20px;

        .mk-upgrade-node__img {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          display: block;
        }
        .mk-upgrade-node__name {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          line-height: 16px;
          height: 16px;
          margin-top: 10px;
        }
        .mk-upgrade-node__sn {
          font-size: 12px;
          text-align: center;
          margin-top: 5px;
        }
        .mk-upgrade-node__version {
          font-size: 12px;
          text-align: center;
          margin-top: 5px;
        }
      }
      .mk-upgrade-result {
        text-align: center;
        margin-top: 40px;
        margin-bottom: 45px;
        .mk-upgrade-result__img {
          margin-top: 40px;
          img {
            width: 30px;
          }
        }
        .mk-upgrade-result__status {
          font-size: 12px;
          font-weight: bold;
        }
        .mk-upgrade-result__description {
          .mk-upgrade-result__title {
            text-align: left;
            font-size: 12px;
            font-weight: bold;
          }
          .mk-upgrade-reasons {
            padding-left: 20px;
            // list-style: none;
            text-align: left;
            margin-top: 10px;
            font-size: 12px;
            .mk-upgrade-reason {
            }
          }
        }
      }
    }
    background: #fff;
    width: 420px;
    border-radius: 10px;
  }
}
@media screen and (max-width: 767px) {
  .mk-upgrade {
    &.upgrade-enter {
    }
    &.upgrade-enter-active {
    }
    &.upgrade-leave-active {
    }
    .mk-upgrade__shadow {
    }

    .mk-upgrade-body {
      width: 320px;
      .mk-upgrade-header {
        .mk-upgrade-header__close {
        }
      }
      .mk-upgrade-content {
        padding: 0 20px;
        .mk-upgrade-content__title {
        }
        .mk-upgrade-content__description {
          img {
          }
          span {
          }
        }
        .mk-upgrade-node {
          .mk-upgrade-node__img {
          }
          .mk-upgrade-node__name {
          }
          .mk-upgrade-node__sn {
          }
          .mk-upgrade-node__version {
          }
        }
        .mk-upgrade-result {
          margin-bottom: 25px;
          .mk-upgrade-result__img {
            img {
            }
          }
          .mk-upgrade-result__status {
          }
          .mk-upgrade-result__description {
            .mk-upgrade-result__title {
            }
            .mk-upgrade-reasons {
              .mk-upgrade-reason {
              }
            }
          }
        }
      }
    }
  }
}
</style>
