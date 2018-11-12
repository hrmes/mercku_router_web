<template>
  <div class="upgrade-online-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0202')}}
      </div>
      <div class="nodes-wrapper" v-if="hasUpgradablityNodes">
        <div class="nodes-info">
          <div v-for="node in nodes" :key="node.sn" class="node">
            <div class="badge-info">
              <img src="../../../assets/images/ic_new_version.png" alt="">
              <span>{{$t('trans0210')}}{{node.version.latest}}</span>
            </div>
            <div class="message" @click="check(node)">
              <m-checkbox :rect="false" v-model="node.checked" />
              <div class="img-container">
                <img class="img-m2" v-if="node.model.id===RouterSnModel.M2" src="../../../assets/images/img_m2.png" alt="">
                <img class="img-bee" v-else-if="node.model.id===RouterSnModel.Bee" src="../../../assets/images/img_bee.png" alt="">
                <img class="img-other" v-else src="../../../assets/images/ic_general_router.png" alt="">
              </div>
              <div class="info-container">
                <p class="node-name">{{node.name}}</p>
                <p class="node-sn">{{$t('trans0252')}}{{node.sn}}</p>
                <p class="node-version">
                  <span>{{$t('trans0209')}}{{node.version.current}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-info">
          <button class="btn re-btn" @click="submit()">{{$t('trans0225')}}</button>
        </div>
      </div>
      <div class="msg-wrapper" v-else>
        <div v-if="!hasUpgradablityNodes && requestResult.complete &&  !requestResult.error">
          <img src="../../../assets/images/img_new_version.png" alt="" width="220">
          <p>{{$t('trans0259')}}</p>
        </div>
        <div v-if="requestResult.error">
          <img src="../../../assets/images/img_error.png" alt="" width="220">
          <p>{{requestResult.message}}</p>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { RouterSnModel } from '../../../../util/constant';
import { compareVersion } from '../../../../util/util';

export default {
  data() {
    return {
      nodes: [],
      RouterSnModel,
      requestResult: {
        complete: false,
        error: null,
        message: ''
      }
    };
  },
  mounted() {
    this.firmwareList();
  },
  computed: {
    hasUpgradablityNodes() {
      return this.nodes.length > 0;
    }
  },
  methods: {
    check(node) {
      node.checked = !node.checked;
    },
    firmwareList() {
      this.$loading.open();
      this.$http
        .firmwareList()
        .then(res => {
          this.$loading.close();
          const data = res.data.result;
          this.requestResult.complete = true;
          data.forEach(node => {
            this.$set(node, 'checked', false);
          });
          this.nodes = data.filter(node =>
            compareVersion(node.version.current, node.version.latest)
          );
        })
        .catch(() => {
          this.$loading.close();
          this.requestResult.complete = true;
        });
    },
    submit() {
      const nodeIds = this.nodes.filter(n => n.checked).map(n => n.sn);
      if (!nodeIds.length) {
        this.$toast(this.$t('trans0381'));
        return;
      }
      this.$dialog.confirm({
        okText: this.$t('trans0225'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0213'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .upgradeMeshNode({ node_ids: nodeIds })
              .then(() => {
                this.$loading.close();
                this.$upgrade({
                  onsuccess: () => {
                    this.$router.push({ path: '/dashboard' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  }
                });
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
.upgrade-online-container {
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
      font-weight: bold;
    }
    .nodes-wrapper {
      text-align: center;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .nodes-info {
        display: flex;
        width: 100%;

        overflow: hidden;
        flex-wrap: wrap;
        // justify-content: space-between;
        .node {
          width: 340px;
          height: 132px;
          background: #f1f1f1;
          border-radius: 5px;
          margin-right: 20px;
          margin-top: 20px;
          position: relative;
          .message {
            display: flex;
            align-items: start;
            padding: 0 20px;
            height: 100%;
            align-items: center;
            cursor: pointer;
            .img-container,
            .info-container {
              display: flex;
              align-items: center;
              align-content: center;
              height: 100%;
            }
            .img-container {
              margin-right: 10px;
              img {
                width: 100px;
                height: 100px;
              }
            }

            .info-container {
              flex-direction: column;
              align-items: start;
              align-content: start;
              justify-content: center;

              .node-name {
                padding: 0;
                margin: 0;
                text-align: left;
                font-size: 12px;
                padding-top: 5px;
                padding-top: 0px;
                font-size: 14px;
                font-weight: bold;
              }
              .node-sn {
                padding: 0;
                margin: 0;
                text-align: left;
                font-size: 12px;
                padding-top: 5px;
                white-space: nowrap;
              }
              .node-version {
                padding: 0;
                margin: 0;
                text-align: left;
                font-size: 12px;
                font-size: 10px;
                margin-top: 10px;

                position: relative;
                span {
                  display: inline-block;
                  margin-left: 5px;
                }
                &:before {
                  content: '';
                  display: inline-block;
                  width: 3px;
                  height: 3px;
                  border-radius: 50%;
                  background: #000;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                }
              }
            }
          }
          .badge-info {
            width: auto;
            padding: 0 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            // border-radius: 100px;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
            border-top-right-radius: 5px;
            background-image: linear-gradient(290deg, #ff4343, #dd3792);
            position: absolute;
            right: 0;
            top: 0;
            img {
              width: 18px;
              margin-right: 5px;
            }
            span {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.95);
              font-weight: 100;
            }
          }
        }
      }
      .btn-info {
        margin: 30px 0;
      }
    }
    .msg-wrapper {
      width: 100%;
      text-align: center;
      margin-top: 30px;
      img {
        width: 200px;
      }
      p {
        color: #333333;
        font-size: 16px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .upgrade-online-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 510px;
      background: white;
      .nodes-wrapper {
        .nodes-info {
          .node {
            width: 303px;

            margin-left: auto;
            margin-right: auto;
          }
        }
        .btn-info {
          margin: 20px 0;
        }
      }
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 999px) {
  .upgrade-online-container {
    .content {
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
  }
}
@media screen and (min-width: 700px) and (max-width: 768px) {
  .upgrade-online-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      background: white;
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
  }
}
@media screen and (width: 320px) {
  .upgrade-online-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      background: white;
      .nodes-wrapper {
        .nodes-info {
          .node {
            width: 253px;
            min-width: 253px;
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
    }
  }
}
</style>

