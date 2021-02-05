<template>
  <div class="page">
    <div class='page-header'>
      <span class="title"> {{$t('trans0020')}}</span>
    </div>
    <div class="page-content">

      <div class="table">
        <div class="tools">
          <div class="checkbox">
            <m-checkbox v-model="checkAllBlacklist"
                        :text="$t('trans0032')"
                        @change="changeCheckboxAll"></m-checkbox>
          </div>
          <div class="btns">
            <div class="btn btn-primary btn-small"
                 @click.stop="deviceModalVisible=!deviceModalVisible">{{$t('trans0035')}}
              <div class="modal"
                   v-show="deviceModalVisible"
                   @click.stop=""
                   v-clickoutside="()=>deviceModalVisible=false">
                <div class="opcity"></div>
                <div class="modal-content">
                  <div class="modal__header">{{$t('trans0235')}}</div>
                  <div v-if="devices"
                       class="list">
                    <div class="device-item"
                         @click="checkDevice(item)"
                         v-for="(item,index) in devices"
                         :key="index">
                      <div class="check">
                        <m-checkbox :readonly="true"
                                    v-model="item.checked"></m-checkbox>
                      </div>
                      <div class="des">
                        <p>{{item.name}}</p>
                        <p>
                          <label class="with-colon">{{$t('trans0188')}}:</label>
                          {{formatMac(item.mac)}}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="empty-device"
                       v-if="!devices.length">
                    <p>{{$t('trans0278')}}</p>
                  </div>
                  <div class="btn-wrap">
                    <button class="btn btn-dialog-confirm"
                            @click="addBlacklist()"
                            :disabled="!someDevicesChecked">
                      {{$t('trans0016')}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-small"
                    @click="removeBlacklist()"
                    :disabled="!someBlacklistChecked">{{$t('trans0453')}}
            </button>
          </div>
        </div>
        <div class="table-header">
          <div class="name">
            <div class="checkbox">
              <m-checkbox v-model="checkAllBlacklist"
                          @change="changeCheckboxAll"></m-checkbox>
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
            <p>{{$t('trans0278')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatMac } from '../../../util/util';

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
    this.getDeviceList();
  },
  computed: {
    listOrdered() {
      return this.blacklist.sort((a, b) => a.name > b.name);
    },
    someBlacklistChecked() {
      return this.blacklist.some(b => b.checked);
    },
    someDevicesChecked() {
      return this.devices.some(d => d.checked);
    }
  },
  watch: {
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
    }
  },
  methods: {
    checkDevice(device) {
      device.checked = !device.checked;
    },
    changeCheckboxAll(v) {
      let checked = false;
      if (v) {
        checked = true;
      }
      this.blacklist.forEach(device => {
        device.checked = checked;
      });
    },
    addBlacklist() {
      this.deviceModalVisible = false;
      const devices = this.devices
        .filter(d => d.checked)
        .map(d => ({
          name: d.name,
          mac: d.mac
        }));
      const macs = devices.map(d => d.mac);
      if (devices.length) {
        this.$loading.open();
        this.$http
          .addToblackList({ devices })
          .then(() => {
            this.blacklist = this.blacklist.concat(
              devices.map(d => ({
                ...d,
                checked: false
              }))
            );
            this.devices = this.devices.filter(d => !macs.includes(d.mac));
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.$loading.close();
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    },
    getDeviceList() {
      Promise.all([
        this.$http.getDeviceList({
          filters: [
            { type: 'primary', status: ['online'] },
            {
              type: 'guest',
              status: ['online']
            }
          ]
        }),
        this.$http.getLocalDevice()
      ]).then(([res1, res2]) => {
        this.devices = res1.data.result
          .map(d => ({
            ...d,
            checked: false
          }))
          .filter(d => d.ip !== res2.data.result.ip);
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
  .btns {
    display: flex;
  }
  .btn {
    margin-left: 30px;
    &:first-child {
      margin-left: 0;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.modal {
  position: absolute;
  top: 34px;
  z-index: 1;
  left: 0;
  width: 480px;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  border: solid 1px #f1f1f1;
  background-color: #ffffff;
  .modal-content {
    .modal__header {
      color: #333;
      text-align: left;
      font-weight: bold;
      border-bottom: 1px solid #f1f1f1;

      font-size: 14px;
      padding: 20px 0 12px 0;
      margin: 0 30px;
    }
    .list {
      overflow: auto;
      max-height: 400px;
    }
    .device-item {
      display: flex;
      align-items: flex-start;
      padding: 20px 30px 0 30px;
      &:hover {
        background: #f1f1f1;
        cursor: pointer;
      }
      .des {
        flex: 1;
        justify-content: flex-start;
        margin-left: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #f1f1f1;
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
      padding-top: 50px;
      padding-bottom: 30px;
    }
  }
}
.table {
  width: 100%;
  .tools {
    .checkbox {
      display: none;
    }
  }
  .name,
  .mac {
    width: 50%;
  }
  .name {
    display: flex;
    .checkbox {
      margin-right: 22px;
    }
  }
  // .operate {
  //   width: 20%;
  // }
  .empty-device {
    p {
      padding: 50px 0;
      color: #333;
      margin: 0;
      text-align: center;
      border-bottom: 1px solid #f1f1f1;
    }
  }
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
      &:nth-child(2n) {
        background: #f7f7f7;
        @media screen and(max-width:768px) {
          background: #fff;
        }
      }
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
  .modal {
    position: fixed;
    width: auto;
    top: 50%;
    left: 20px;
    right: 20px;
    transform: translateY(-50%);
    .modal-content {
      .list {
        max-height: 250px;
      }
      .device-item {
        &:hover {
          background: none;
        }
      }
    }

    .btn {
      margin: 0 auto !important;
    }
  }
  .table {
    flex-direction: column;
    .operate,
    .mac {
      margin-top: 10px;
    }
    .operate {
      text-align: right;
    }
    .tools {
      border-bottom: 1px solid #f1f1f1;
      padding: 10px 0px;
      padding-top: 0;
      margin: 0;
      display: flex;
      justify-content: space-between;
      .checkbox {
        display: block;
      }
      .btns {
        display: flex;
      }
      .btn {
        width: auto;
        margin: 0;
        &:last-child {
          margin-left: 20px;
        }
      }
    }
    .table-header {
      display: none;
    }
    .table-content {
      .device {
        flex-direction: column;
        padding: 20px 0;
        .mac {
          margin-left: 38px;
        }
      }
    }
  }
}
</style>
