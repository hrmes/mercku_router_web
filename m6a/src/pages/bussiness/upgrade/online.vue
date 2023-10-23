<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{ $t('trans0202') }}
      <div class="btn-info"
           v-if="nodes.length">
        <button class="btn btn-small"
                @click="submit()">
          {{ $t('trans0225') }}
        </button>
      </div>
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="nodes-wrapper"
             v-if="hasUpgradablityNodes">
          <div class="nodes-info">
            <div v-for="node in nodes"
                 :key="node.sn"
                 class="node">

              <div class="message"
                   @click="check(node)">
                <m-checkbox :readonly="true"
                            v-model="node.checked" />
                <div class="img-container">
                  <img :src="getNodeImage(node)"
                       alt="" />
                </div>
                <div class="info-container">
                  <p class="node-name"
                     :title="node.name">{{ node.name }}</p>
                  <p class="node-sn">
                    <label class="with-colon">{{ $t('trans0252') }}:</label>
                    <span>{{ node.sn }}</span>
                  </p>
                  <p class="node-version">
                    <label class="with-colon">{{ $t('trans0209') }}:</label>
                    <span>{{ node.version.current }}</span>
                  </p>
                  <div class="badges">
                    <m-tag class="gateway"
                           v-if="node.isGW">{{$t('trans0165')}}</m-tag>
                    <m-tag><span :title="$t('trans0210')">{{ node.version.latest }}</span></m-tag>
                  </div>
                  <p class="changelog"
                     @click.stop="showChangelog(node)">
                    {{ $t('trans0546') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="msg-wrapper"
             v-else>
          <div v-if="
            !hasUpgradablityNodes &&
              requestResult.complete &&
              !requestResult.error">
            <img src="@/assets/images/img_new_version.webp"
                 alt=""
                 width="220" />
            <p>{{ $t('trans0259') }}</p>
          </div>
          <div v-if="requestResult.error">
            <img src="@/assets/images/img_error.png"
                 alt=""
                 width="220" />
            <p>{{ requestResult.message }}</p>
          </div>
        </div>
      </div>
      <div class="page-content__bottom"
           v-if="!$store.state.isMobile && hasUpgradablityNodes">
        <div class="form-button__wrapper">
          <button class="btn"
                  @click="submit()">
            {{ $t('trans0225') }}
          </button>
        </div>
      </div>
    </div>
    <m-modal :visible.sync="showChangelogModal">
      <m-modal-header>
        {{ $t('trans0525') }}
      </m-modal-header>
      <m-modal-body class="modal-body">
        <div class="scroll-container">
          <div class="changelog markdown-body"
               v-html="changelog"></div>
        </div>
      </m-modal-body>
      <m-modal-footer>
        <div class="btn-wrap">
          <button class="btn btn-dialog-confirm"
                  @click="close()">
            {{ $t('trans0024') }}
          </button>
        </div>
      </m-modal-footer>
    </m-modal>
    <upgradeProcessDialog @after-close="afterCloseProgress"
                          :visible.sync="processDialogVisible" />
  </div>
</template>
<script>
import marked from 'marked';
import { compareVersion } from 'base/util/util';
import { RouterSnModel } from 'base/util/constant';
import RouterModel from 'base/mixins/router-model';
import upgradeProcessDialog from './components/progress.vue';

export default {
  data() {
    return {
      nodes: [],
      RouterSnModel,
      requestResult: {
        complete: false,
        error: null,
        message: ''
      },
      processDialogVisible: false,
      showChangelogModal: false,
      changelog: ''
    };
  },
  mounted() {
    this.firmwareList();
  },
  components: {
    upgradeProcessDialog
  },
  computed: {
    hasUpgradablityNodes() {
      return this.nodes.length > 0;
    }
  },
  mixins: [RouterModel],
  methods: {
    afterCloseProgress(success) {
      if (success) {
        // 升级成功
        const nodes = this.nodeChecked.filter(node => node.isGW);
        console.log(this.nodeChecked);
        if (nodes.length) {
          // 包含网关，强制刷新网页清空缓存
          window.location.reload(true);
        } else {
          // 从列表中移除升级成功的节点
          this.nodeChecked.forEach(node => {
            this.nodes = this.nodes.filter(n => n.sn !== node.sn);
          });
        }
      }
      console.log('after close event', success);
    },
    close() {
      this.showChangelogModal = false;
    },
    check(node) {
      if (node.checked) {
        node.checked = false;
      } else {
        this.nodes.forEach(item => {
          item.checked = false;
        });
        node.checked = true;
      }
    },
    showChangelog(node) {
      this.showChangelogModal = true;
      if (node.changelog) {
        this.changelog = marked(node.changelog, { sanitize: true });
      } else {
        this.changelog = '';
      }
    },
    firmwareList() {
      this.$loading.open();
      Promise.all([this.$http.firmwareList(), this.$http.getMeshNode()])
        .then(resArr => {
          this.$loading.close();
          const nodes = resArr[0].data.result;
          const gw = resArr[1].data.result.filter(node => node.is_gw)[0];

          this.requestResult.complete = true;

          const filter = node => {
            const { current, latest } = node.version;
            console.log('compare', current, latest);
            return compareVersion(current, latest);
          };
          let containGW = false;
          this.nodes = nodes.filter(filter).map(node => {
            let isGW = false;
            if (node.sn === gw.sn) {
              isGW = true;
              containGW = true;
            }
            return {
              ...node,
              isGW,
              checked: false
            };
          });
          if (containGW && this.nodes.length > 1) {
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              message: this.$t('trans0669'),
              callback: {
                ok: () => {
                  const meshNodes = this.nodes.filter(n => !n.isGW);
                  if (meshNodes.length) {
                    // 选中第一个节点
                    meshNodes[0].checked = true;
                  }
                }
              }
            });
          }
        })
        .catch(err => {
          this.$loading.close();
          this.requestResult.complete = true;
          if (err && err.error) {
            this.requestResult.error = true;
            this.requestResult.message = this.$t('trans0345');
          }
        });
    },
    submit() {
      const nodeChecked = this.nodes.filter(n => n.checked);
      if (!nodeChecked.length) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.$dialog.confirm({
        okText: this.$t('trans0225'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0213'),
        callback: {
          ok: () => {
            this.nodeChecked = nodeChecked;
            this.$loading.open();
            this.$http
              .upgradeMeshNode({ node_ids: nodeChecked.map(n => n.sn) })
              .then(() => {
                this.$loading.close();
                this.processDialogVisible = true;
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-header {
  justify-content: space-between;
}
.nodes-wrapper {
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  .nodes-info {
    display: flex;
    width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
    .node {
      width: 360px;
      height: 160px;
      border: 1px solid var(--tag-node-border-color);
      border-radius: 5px;
      margin-right: 20px;
      margin-bottom: 30px;
      position: relative;
      @media screen and (max-width: 414px) {
        width: 100%;
      }
      .message {
        display: flex;
        align-items: flex-start;
        padding: 0 20px;
        height: 100%;
        align-items: center;
        cursor: pointer;
        position: relative;
        .checkbox-container {
          flex-shrink: 0;
        }
        .img-container,
        .info-container {
          display: flex;
          align-items: center;
          align-content: center;
          height: 100%;
        }
        .img-container {
          margin: 0 5px;
          img {
            width: 120px;
            height: 120px;
          }
        }

        .info-container {
          flex-direction: column;
          align-items: start;
          align-content: start;
          justify-content: center;
          flex: 1;
          overflow: hidden;
          // padding-top: 38px;
          // padding-bottom: 10px;

          .node-name {
            padding: 0;
            margin: 0;
            text-align: left;
            line-height: 1;
            padding-top: 0px;
            font-size: 14px;
            font-weight: bold;
            word-break: break-all;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
          }
          .node-sn {
            padding: 0;
            margin: 0;
            text-align: left;
            font-size: 12px;
            line-height: 1;
            padding-top: 10px;
            white-space: nowrap;
          }
          .node-version {
            padding: 0;
            margin: 0;
            text-align: left;
            font-size: 10px;
            line-height: 1;
            padding-top: 10px;
            position: relative;
            span {
              display: inline-block;
            }
          }
          .changelog {
            font-size: 12px;
            font-weight: 600;
            text-decoration: underline;
            color: var(--text-default-color);
            margin: 0;
            padding-top: 7px;
          }
        }
      }
      .badges {
        display: flex;
        padding-top: 10px;
        .mk-tag {
          &.gateway {
            color: var(--tag-green-text-color);
            font-weight: 600;
            background: var(--tag-green-background-color);
          }
        }
      }
    }
  }
  .btn-info {
    margin-top: 0;
    padding-top: 25px;
    border-top: 1px solid var(--hr-color);
    text-align: left;
    .btn {
      width: 460px;
    }
  }
}
.msg-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  img {
    width: 200px;
  }
  p {
    color: var(--text-default-color);
    font-size: 16px;
  }
}
.modal-body {
  width: 600px;
  max-height: 400px;
  @media screen and (max-width: 768px) {
    height: 250px;
  }
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  .changelog {
    word-wrap: break-word;
    p:first-child {
      margin-top: 0;
    }
    pre {
      font-family: inherit;
    }
  }
  .btn-wrap {
    // padding: 20px 0;
    text-align: center;
    position: absolute;
    bottom: 0;
    background: #fff;
    width: 100%;
    left: 0;
    padding: 10px 0;
  }
}
@media screen and (max-width: 768px) {
  .nodes-wrapper {
    .nodes-info {
      .node {
        // width: 303px;

        margin-left: auto;
        margin-right: auto;
      }
    }
    .btn-info {
      margin: 20px 0;
    }
  }
  .modal-body {
    width: auto;
  }
}
@media screen and (min-width: 769px) and (max-width: 1000px) {
  .nodes-wrapper {
    .nodes-info {
      .node {
        width: 340px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}
@media screen and (min-width: 700px) and (max-width: 768px) {
  .nodes-wrapper {
    .nodes-info {
      .node {
        width: 303px;
        min-width: 303px;
        margin-left: 0;
      }
    }
    .btn-info {
      margin: 20px 0;
    }
  }
}
@media screen and (width: 320px) {
  .nodes-wrapper {
    .nodes-info {
      .node {
        height: 140px;
        margin-right: 0;
        .message {
          .img-container {
            img {
              width: 70px;
              height: 70px;
            }
          }
        }
      }
    }
    .btn-info {
      margin: 20px 0;
    }
  }
  .modal-body {
    width: auto;
  }
}
</style>
