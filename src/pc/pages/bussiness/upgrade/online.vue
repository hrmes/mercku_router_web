<template>
  <layout>
    <div class="upgrade-online-container">
      <m-progress v-if="upgrade" :label="$t('trans0141')" :description="$t('trans0212')" :during="10*1000"></m-progress>
      <div class="content">
        <div class='w-header'>
          {{$t('trans0202')}}
        </div>
        <div class="nodes-wrapper" v-if="status==='hasNodes'">
          <div class="nodes-info">
            <div v-for="node in test" :key="node.sn" class="node">
              <div class="badge-info">
                <img src="../../../assets/images/ic_new_version.png" alt="">
                <span>{{$t('trans0210')}}{{node.version.latest}}</span>
              </div>
              <div class="message">
                <img v-if="node.model.id==='01'" src="../../../assets/images/img_m2.png" alt="">
                <img v-if="node.model.id==='02'" src="../../../assets/images/img_bee.png" alt="">
                <div>
                  <p>{{node.name}}</p>
                  <p>{{$t('trans0252')}}{{node.sn}}</p>
                  <p> · {{$t('trans0252')}}{{node.version.current}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-info">
            <button class="btn re-btn" @click="submit()">{{$t('trans0211')}}</button>
          </div>
        </div>
        <div class="msg-wrapper" v-else>
          <div v-if="status==='none'">
            <img src="../../../assets/images/img_new_version.png" alt="" width="220">
            <p>{{$t('trans0259')}}</p>
          </div>
          <div v-if="status==='fail'">
            <img src="../../../assets/images/img_new_version.png" alt="" width="220">
            <p>{{$t('trans0319')}}</p>
          </div>
        </div>
      </div>
    </div>
  </layout>

</template>
<script>
import layout from '../../../layout.vue';
import Progress from '../../../component/progress/index.vue';

const arr = Array.from(new Array(10)).map((_, i) => ({
  sn: `01010301230123${i}`,
  model: { id: i % 2 === 0 ? '01' : '02' },
  name: `mercku_00${i}`,
  version: {
    current: `0.0.${i}`,
    latest: '1.1.1'
  }
}));
export default {
  components: {
    layout,
    'm-progress': Progress
  },
  data() {
    return {
      upgrade: false,
      status: '',
      nodes: [],
      test: arr
    };
  },
  mounted() {
    this.firmwareList();
  },
  methods: {
    firmwareList() {
      this.$loading.open();
      this.$http
        .firmwareList()
        .then(res => {
          this.$loading.close();
          const data = res.data.result;
          const filterNodes = data.filter(node => node.updatable);
          this.nodes = filterNodes;
          if (this.nodes.length > 0) {
            this.status = 'hasNodes';
          } else {
            this.status = 'none';
          }
        })
        .catch(err => {
          this.$loading.close();
          if (err && err.error) {
            this.status = 'fail';
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/disappear' });
          }
        });
    },
    submit() {
      this.$dialog.confirm({
        okText: this.$t('trans0211'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0212'),
        callback: {
          ok: () => {
            this.$http
              .upgrade({})
              .then(() => {
                this.upgrade = true;
              })
              .catch(err => {
                if (err && err.error) {
                  this.upgrade = false;
                  this.$toast(this.$t(err.error.code));
                } else {
                  this.$router.push({ path: '/disappear' });
                }
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
      font-weight: 400;
    }
    .nodes-wrapper {
      text-align: center;
      height: 100%;
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
          border-radius: 4px;
          margin-left: 20px;
          margin-top: 20px;
          .message {
            display: flex;
            margin-top: 30px;
            align-items: center;
            padding: 0 20px;
            height: 100px;
            img {
              width: 50px;
            }
            div {
              padding-left: 20px;
              :first-child {
                font-size: 14px;
                font-weight: bold;
              }
              :last-child {
                font-size: 10px;
              }
              p {
                padding: 0;
                margin: 0;
                text-align: left;
                font-size: 12px;
                padding-top: 5px;
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
            border-top-left-radius: 100px;
            border-bottom-left-radius: 100px;
            background-image: linear-gradient(290deg, #4237dd, #7037dd);
            float: right;
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
          // flex: 1;
        }
      }
      .btn-info {
        height: 200px;
      }
    }
    .msg-wrapper {
      width: 100%;
      text-align: center;
      margin-top: 50px;
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

