<template>
  <div class="page">
    <div v-if="isMobile"
         class="page-header">
      <span class="title"> {{ $t('trans0020') }}</span>
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="table">
          <div class="table-header">
            <div class="checkbox">
              <m-checkbox v-model="checkAllBlacklist"
                          @change="changeCheckboxAll"></m-checkbox>
            </div>
            <div class="name">
              <div>{{ $t('trans0005') }}</div>
            </div>
            <div class="mac"
                 v-if="!isMobile">{{ $t('trans0188') }}</div>
            <div class="tools">
              <button class="btn btn-small"
                      @click="removeBlacklist()"
                      :disabled="!someBlacklistChecked">
                {{ $t('trans0033') }}
              </button>
              <button class="btn btn-primary btn-small"
                      @click.stop="deviceModalVisible = !deviceModalVisible">
                {{ $t('trans0035') }}
              </button>
            </div>
          </div>
          <div class="table-body">
            <div class="device"
                 v-for="device in listOrdered"
                 :key="device.mac">
              <div class="checkbox">
                <m-checkbox v-model="device.checked"></m-checkbox>
              </div>
              <div class="name">
                <div class="name-container">{{ device.name }}</div>
                <div class="mac"
                     v-if="isMobile">
                  <span>{{$t('trans0188')}}: </span>
                  <span> {{ formatMac(device.mac) }}</span>
                </div>
              </div>
              <div class="mac"
                   v-if="!isMobile">
                {{ formatMac(device.mac) }}</div>
            </div>
            <div class="empty"
                 v-if="blacklist.length===0">
              <img src="../../../assets/images/img_default_empty.png"
                   alt="" />
              <p>{{ $t('trans0278') }}</p>
            </div>
          </div>
        </div>
      </div>
      <m-modal :visible.sync="deviceModalVisible">
        <m-modal-header class="modal-header">
          <span>{{ $t('trans0235') }}</span>
          <div class="btn-icon"
               @click.stop="() => (deviceModalVisible = false)">
            <i class="iconfont ic_close"></i>
          </div>
        </m-modal-header>
        <m-modal-body class="modal-body table">
          <div class="table-header">
            <div class="checkbox">
              <m-checkbox v-model="checkAllDevicelist"
                          @change="checkAllDevices"></m-checkbox>
            </div>
            <div class="name">
              <div>{{ $t('trans0005') }}</div>
            </div>
            <div class="mac"
                 v-if="!isMobile">{{ $t('trans0188') }}</div>
          </div>
          <div class="table-body">
            <div class="device"
                 @click.stop="checkDevice(item)"
                 v-for="(item, index) in devicesOrdered"
                 :key="index">
              <div class="checkbox">
                <m-checkbox :readonly="true"
                            v-model="item.checked"></m-checkbox>
              </div>
              <div class="name">
                <div class="name-container">{{  item.name }}</div>
                <div class="mac"
                     v-if="isMobile">
                  <span>{{$t('trans0188')}}: </span>
                  <span> {{ formatMac(item.mac) }}</span>
                </div>
              </div>
              <div class="mac"
                   v-if="!isMobile">{{ formatMac(item.mac) }}</div>
            </div>
            <div class="empty"
                 v-if="devices.length===0">
              <img src="../../../assets/images/img_default_empty.png"
                   alt="" />
              <p>{{ $t('trans0278') }}</p>
            </div>
          </div>
        </m-modal-body>
        <m-modal-footer class="modal-footer">
          <div class="form-button">
            <button class="btn btn-dialog-confirm"
                    @click="addBlacklist()"
                    :disabled="!someDevicesChecked">{{$t('trans0016')}}</button>
          </div>
        </m-modal-footer>
      </m-modal>
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
      checkAllDevicelist: false,
      deviceModalVisible: false,
      deviceListTimer: null
    };
  },
  mounted() {
    this.getBlacklist();
    this.getDeviceList();
  },
  beforeDestroy() {
    // clean up
    clearTimeout(this.deviceListTimer);
    this.deviceListTimer = null;
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    devicesOrdered() {
      return this.devices.sort((a, b) => {
        const wired = 'wired';
        if (a.online_info.band === wired || b.online_info.band === wired) {
          if (a.online_info.band === wired && b.online_info.band === wired) {
            const isLetterOrNumberReg = /[0-9A-Za-z]+/i;
            if (isLetterOrNumberReg.test(a.name) && !isLetterOrNumberReg.test(b.name)) {
              return -1;
            }
            if (!isLetterOrNumberReg.test(a.name) && isLetterOrNumberReg.test(b.name)) {
              return 1;
            }
            return a.name.localeCompare(b.name);
          }
          if (a.online_info.band === wired) {
            return 1;
          }
          if (b.online_info.band === wired) {
            return -1;
          }
          return 0;
        }
        return a.online_info.online_duration - b.online_info.online_duration;
      });
    },
    listOrdered() {
      return this.blacklist.sort((a, b) => {
        const isLetterOrNumberReg = /[0-9A-Za-z]+/i;
        if (isLetterOrNumberReg.test(a.name) && !isLetterOrNumberReg.test(b.name)) {
          return -1;
        }
        if (!isLetterOrNumberReg.test(a.name) && isLetterOrNumberReg.test(b.name)) {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });
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
    },
    devices: {
      handler(nv) {
        if (nv.length) {
          if (nv.every(v => v.checked)) {
            this.checkAllDevicelist = true;
          } else {
            this.checkAllDevicelist = false;
          }
        }
      },
      deep: true
    },
    deviceModalVisible: {
      handler(nv) {
        if (!nv) {
          this.devices.forEach(d => {
            d.checked = false;
          });
        }
      }
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
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.$loading.close();
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    },
    getDeviceList() {
      clearTimeout(this.deviceListTimer);
      this.deviceListTimer = null;
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
      ])
        .then(([res1, res2]) => {
          if (!this.deviceModalVisible) {
            this.devices = res1.data.result
              .map(d => ({
                ...d,
                checked: false
              }))
              .filter(d => d.ip !== res2.data.result.ip);
          }
          // let checkValue = false;
          // let checkedDeviceMac = [];
          // if (this.deviceModalVisible && this.checkAllDevicelist) checkValue = true;
          // if (this.deviceModalVisible && !this.checkAllDevicelist) {
          //   const checkedDevice = this.devices.filter(d => d.checked);
          //   checkedDeviceMac = checkedDevice.map(c => c.mac);
          // }
          // this.devices = res1.data.result
          //   .map(d => ({
          //     ...d,
          //     checked: checkedDeviceMac.includes(d.mac) ? true : checkValue
          //   }))
          //   .filter(d => d.ip !== res2.data.result.ip);
        })
        .finally(() => {
          this.deviceListTimer = setTimeout(() => {
            this.getDeviceList();
          }, 10000);
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
          this.$toast(this.$t('trans0040'), 2000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    checkAllDevices(val) {
      this.devices.forEach(device => {
        device.checked = val;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  .table-header {
    grid-template-columns: 20px 2fr 2fr 1fr;
  }
  .table-body {
    .device {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 20px 2fr 2fr 1fr;
      gap: 10px;
      width: 100%;
      padding: 20px 15px;
      background: var(--table_row-bgc);
      border-radius: 10px;
      margin-bottom: 5px;
    }
    .empty {
      height: auto;
      display: flex;
      flex-direction: column;
      p {
        margin: 0;
      }
    }
  }
  .checkbox {
    display: flex;
    align-items: center;
  }
  .name {
    display: flex;
    max-width: 400px;
    width: 100%;
    .name-container {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .empty-device {
    p {
      padding: 50px 0;
      margin: 0;
      text-align: center;
      color: var(--text_default-color);
    }
  }
}
.tools {
  display: flex;
  width: auto;
  align-items: center;
  justify-content: flex-end;
  .btn {
    margin-left: 20px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 660px;
  .btn-icon {
    background: var(--button_close-bgc);
  }
}
.modal-body {
  height: 50vh;
  .table-body {
    height: calc(100% - 45px);
    overflow-y: auto;
    .device {
      .name {
        max-width: 220px;
      }
      cursor: pointer;
      transition: background 0.3s ease;
      &:hover {
        background: var(--select-item-hover-bgc);
      }
    }
  }
}
.modal-footer {
  margin-top: 10px;
  padding: 20px 0 0;
  border-top: 1px solid var(--hr-color);
  .form-button {
    margin: 0 auto;
    button {
      width: 340px;
      height: 44px;
    }
  }
}
@media screen and (max-width: 768px) {
  .table {
    .table-header {
      grid-template-columns: 20px 1fr 1fr;
    }
    .table-body {
      .device {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 20px 1fr;
        width: 100%;
        background: var(--table_row-bgc);
        border-radius: 10px;
        margin-bottom: 5px;
      }
      .name {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: 100%;
        gap: 5px;
        max-width: calc(100vw - 40px - 40px - 30px);
        width: 100%;
        .mac {
          font-size: 12px;
          color: var(--common_gery-color);
        }
      }
      .empty {
        height: auto;
        display: flex;
        flex-direction: column;
        p {
          margin: 0;
        }
      }
    }
    .empty-device {
      p {
        padding: 50px 0;
        margin: 0;
        text-align: center;
        color: var(--text_default-color);
      }
    }
  }
  .tools {
    .btn {
      flex: 1;
      min-width: auto;
      margin-left: 10px;
    }
  }
  .modal-header {
    width: auto;
  }
  .modal-body {
    height: 55vh;
    .table-header {
      .name {
        grid-template-rows: 100%;
      }
    }
    .table-body {
      height: calc(100% - 45px);
      overflow-y: auto;
      .device {
        .name {
          max-width: 100%;
        }
        cursor: pointer;
        transition: background 0.3s ease;
        &:hover {
          background: var(--select-item-hover-bgc);
        }
      }
    }
  }
  .modal-footer {
    .form-button {
      button {
        width: auto;
      }
    }
  }
}
</style>
