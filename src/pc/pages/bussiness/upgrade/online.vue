<template>
  <layout>
    <div class="upgrade-online-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0202')}}
        </div>
        <p v-if="status===CONSTANTS.UpgradeStatus.checking">检测中</p>
        <div v-if="status===CONSTANTS.UpgradeStatus.updatable">
          <ul>
            <li v-for="node in filterNodes" :key="node.sn">
              <p>{{node.sn}}</p>
              <p>{{node.model}}</p>
              <p>{{node.name}}</p>
              <p>{{node.version.current}}</p>
              <p>{{node.version.latest}}</p>
            </li>
          </ul>
          <button class="btn re-btn" @click="submit()">全部更新</button>
        </div>
        <p v-if="status===CONSTANTS.UpgradeStatus.unrenewable">暂无更新</p>
      </div>
    </div>
  </layout>

</template>
<script>
import layout from '../../../layout.vue';
import * as CONSTANTS from '../../../../util/constant';

export default {
  components: {
    layout
  },
  data() {
    return {
      CONSTANTS: { ...CONSTANTS },
      status: CONSTANTS.UpgradeStatus.checking,
      nodes: []
    };
  },
  mounted() {
    this.firmwareList();
  },

  methods: {
    firmwareList() {
      this.status = CONSTANTS.UpgradeStatus.checking;
      this.$http
        .firmwareList()
        .then(res => {
          const data = res.data.result;
          const filterNodes = data.filter(node => node.updatable);
          if (filterNodes.length > 0) {
            this.status = CONSTANTS.UpgradeStatus.updatable;
            this.nodes = filterNodes;
          } else {
            this.status = CONSTANTS.UpgradeStatus.unrenewable;
          }
        })
        .catch(() => {
          this.status = CONSTANTS.UpgradeStatus.unrenewable;
        });
    },
    submit() {
      this.$http
        .upgrade({})
        .then(() => {
          this.$router.push('/upgrading');
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/disappear' });
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

