<template>
  <layout>
    <div class="blacklist-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0288')}}
        </div>
        <div class="table">
          <div class="table-header">
            <div class="name">{{$t('trans0005')}}</div>
            <div class="mac">{{$t('trans0188')}}</div>
            <div class="operate">{{$t('trans0370')}}</div>
          </div>
          <div class="table-content">
            <div class="device" v-for="device in blacklist" :key="device.mac">
              <div class="name">{{device.name}}</div>
              <div class="mac">{{formatMac(device.mac)}}</div>
              <div class="operate">
                <span class="delete" @click="removeBlacklist(device)">{{$t('trans0033')}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import layout from '../../../layout.vue';
import { formatMac } from '../../../../util/util';

export default {
  components: {
    layout
  },
  data() {
    return {
      blacklist: [],
      formatMac
    };
  },
  mounted() {
    this.getBlacklist();
  },
  methods: {
    getBlacklist() {
      this.$loading.open();
      this.$http
        .getBlacklist()
        .then(res => {
          this.$loading.close();
          this.blacklist = res.data.result;
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    removeBlacklist(device) {
      this.$loading.open();
      const macs = [device.mac];
      this.$http
        .removeBlacklist(macs)
        .then(() => {
          this.$loading.close();
          this.blacklist = this.blacklist
            .filter(d => d.mac !== device.mac)
            .sort();
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.blacklist-container {
  position: relative;
  flex: auto;
  padding: 0 2%;
  display: flex;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .table {
      .name,
      .mac {
        width: 40%;
      }
      .operate {
        width: 20%;
      }
      .table-header {
        display: flex;
        background: #f1f1f1;
        padding: 30px 15px;
      }
      .table-content {
        .device {
          display: flex;
          padding: 30px 15px;
          border-bottom: 1px solid #f1f1f1;
          .name,
          .mac,
          .operate {
            .delete {
              color: red;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
              &:active {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .blacklist-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
    }
  }
}
</style>

