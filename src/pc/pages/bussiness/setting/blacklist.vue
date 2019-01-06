<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0288')}}
    </div>
    <div class="page-content">
      <div class="tools">
        <button class="btn btn-primary btn-small"
                @click.stop="deviceModalVisible=!deviceModalVisible">{{$t('trans0016')}}
          <div class="modal"
               v-show="deviceModalVisible"
               @click.stop=""
               v-clickoutside="()=>deviceModalVisible=false">
            <div class="opcity"></div>
            <div class="modal-content">
              <div class="list"
                   :data="devices">
                <div class="device-item"
                     v-for="(item,index) in devices"
                     :key="index">
                  <div class="check">
                    <m-checkbox v-model="item.checked"></m-checkbox>
                  </div>
                  <div class="des">
                    <p>{{item.name}}</p>
                    <p>{{$t('trans0188')}}：{{formatMac(item.mac)}}</p>
                  </div>
                </div>
              </div>
              <div class="btn-wrap">
                <button class="btn"
                        @click="addBlacklist()">{{$t('trans0024')}}</button>
              </div>
            </div>
          </div>
        </button>
        <button class="btn btn-default btn-small"
                @click="removeBlacklist()"
                :disabled="!someBlacklistChecked">{{$t('trans0453')}}
        </button>
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
      checkAllBlacklist: false,
      deviceModalVisible: false
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
    },
    blacklist: {
      handler(nv) {
        if (nv.length) {
          if (nv.every(v => v.checked)) {
            this.checkAllBlacklist = true;
          } else {
            this.checkAllBlacklist = false;
          }
        }
      },
      deep: true
    },
    deviceModalVisible() {
      this.getDeviceList();
    }
  },
  methods: {
    addBlacklist() {
      this.$loading.open();
      this.deviceModalVisible = false;
      const devices = this.devices
        .filter(d => d.checked)
        .map(d => ({
          name: d.name,
          mac: d.mac
        }));
      this.$http
        .addToblackList({
          devices
        })
        .then(() => {
          this.blacklist = this.blacklist.concat(
            devices.map(d => ({
              ...d,
              checked: false
            }))
          );
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getDeviceList() {
      this.$http.getDeviceList().then(res => {
        this.devices = res.data.result.map(d => ({
          ...d,
          checked: false
        }));
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
.modal {
  position: absolute;
  top: 36px;
  z-index: 1;
  left: 0;
  width: 300px;
  border-radius: 2px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px #e7e7e7;
  background-color: #ffffff;
  .list {
    overflow: auto;
    max-height: 400px;
  }
  .device-item {
    display: flex;
    padding: 20px;
    align-items: center;
    cursor: default;
    .des {
      flex: 1;
      justify-content: flex-start;
      margin-left: 20px;
      p {
        color: #333333;
        line-height: 1;
        padding: 0;
        margin: 0;
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
        }
      }
    }
  }
  .btn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-default {
      display: none;
    }
    .btn {
      width: 120px;
      height: 42px;
    }
    height: 100px;
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
      padding: 15px 30px;
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
