<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0288')}}
    </div>
    <div class="page-content">
      <div class="tools">
        <button class="btn btn-default btn-small">{{$t('trans0016')}}</button>
        <button class="btn btn-default btn-small"
                @click="removeBlacklist()"
                :disabled="!someBlacklistChecked">{{$t('trans0453')}}</button>
      </div>
      <div class="table">
        <div class="table-header">
          <div class="name">
            <div class="checkbox">
              <m-checkbox v-model="checkAllBlacklist"></m-checkbox>
            </div>
            <div>{{$t('trans0005')}}</div>
          </div>
          <div class="mac">{{$t('trans0188')}}</div>
          <!-- <div class="operate">{{$t('trans0370')}}</div> -->
        </div>
        <div class="table-content">
          <div class="device"
               v-for="device in listOrdered"
               :key="device.mac">
            <div class="name">
              <div class="checkbox">
                <m-checkbox v-model="device.checked"></m-checkbox>
              </div>
              <div>{{device.name}}</div>
            </div>
            <div class="mac">{{formatMac(device.mac)}}</div>
            <!-- <div class="operate">
              <span class="delete"
                    @click="removeSingleBlacklist(device)">{{$t('trans0033')}}</span>
            </div> -->
          </div>
          <div class="empty"
               v-if="!blacklist.length">
            <img src="../../../assets/images/img_default_empty.png"
                 alt="">
            {{$t('trans0278')}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMac } from '../../../../util/util';

export default {
  data() {
    return {
      devices: [],
      blacklist: [],
      formatMac,
      checkAllBlacklist: false
    };
  },
  mounted() {
    this.getBlacklist();
  },
  computed: {
    listOrdered() {
      return this.blacklist.sort((a, b) => a.name > b.name);
    },
    someBlacklistChecked() {
      return this.blacklist.some(b => b.checked);
    }
  },
  watch: {
    checkAllBlacklist(v) {
      let checked = false;
      if (v) {
        checked = true;
      }
      this.blacklist.forEach(device => {
        device.checked = checked;
      });
    }
  },
  methods: {
    getDeviceList() {
      this.$http.getDeviceList().then(res => {
        this.devices = res.data.result;
      });
    },
    getBlacklist() {
      this.$loading.open();
      this.$http
        .getBlacklist()
        .then(res => {
          this.$loading.close();
          this.blacklist = res.data.result.map(b => ({
            ...b,
            checked: false
          }));
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    removeBlacklist() {
      const macs = this.blacklist.filter(b => b.checked).map(b => b.mac);
      this.$loading.open();
      this.$http
        .removeBlacklist({ macs })
        .then(() => {
          macs.forEach(mac => {
            this.blacklist = this.blacklist.filter(d => d.mac !== mac);
          });
          this.checkAllBlacklist = false;
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.tools {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  .btn {
    margin-left: 30px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.table {
  width: 100%;
  .name,
  .mac {
    width: 50%;
  }
  .name {
    display: flex;
    .checkbox {
      margin-right: 20px;
    }
  }
  // .operate {
  //   width: 20%;
  // }
  .table-header {
    display: flex;
    background: #f1f1f1;
    padding: 15px 30px;
  }
  .table-content {
    .device {
      display: flex;
      padding: 30px;
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
    .empty {
      padding: 30px;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 220px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .table {
    .operate,
    .mac {
      margin-top: 10px;
    }
    .operate {
      text-align: right;
    }
    .table-header {
      display: none;
    }
    .table-content {
      .device {
        flex-direction: column;
        padding: 20px 0;
        .name,
        .mac,
        .operate {
          width: 100%;
        }
      }
    }
  }
}
</style>
