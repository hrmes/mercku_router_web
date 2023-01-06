<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      <span class="title"> {{ $t('trans0020') }}</span>
    </div>
    <div class="page-content">
      <div class="table">
        <div v-if="$store.state.isMobile"
             class="tools mobile">
          <div class="checkbox">
            <m-checkbox v-model="checkAllBlacklist"
                        :text="$t('trans0033')"
                        @change="changeCheckboxAll"></m-checkbox>
          </div>
          <div class="btns">
            <button class="btn btn-small"
                    @click="removeBlacklist()"
                    :disabled="!someBlacklistChecked">
              {{ $t('trans0453') }}
            </button>
            <div class="btn btn-primary btn-small"
                 @click.stop="showDeviceModal">
              {{ $t('trans0035') }}
              <div class="modal"
                   v-show="deviceModalVisible"
                   @click.stop=""
                   v-clickoutside="() => (deviceModalVisible = false)">
                <div class="opcity"></div>
                <div class="modal-content">
                  <div class="modal__header">{{ $t('trans0235') }}</div>
                  <div v-if="devices"
                       class="list">
                    <div class="device-item"
                         @click.stop="checkDevice(item)"
                         v-for="(item, index) in devices"
                         :key="index">
                      <div class="check">
                        <m-checkbox :readonly="true"
                                    v-model="item.checked"></m-checkbox>
                      </div>
                      <div class="des">
                        <p>{{ item.name }}</p>
                        <p>
                          <label class="with-colon"
                                 for="">{{ $t('trans0188') }}:</label>
                          <span>{{ formatMac(item.mac) }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="empty-device"
                       v-if="!devices.length">
                    <p>{{ $t('trans0278') }}</p>
                  </div>
                  <div class="btn-wrap">
                    <button class="btn btn-dialog-confirm"
                            @click="addBlacklist()"
                            :disabled="!someDevicesChecked">
                      {{ $t('trans0016') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="table-header">
          <div class="name">
            <div class="checkbox">
              <m-checkbox v-model="checkAllBlacklist"
                          @change="changeCheckboxAll"></m-checkbox>
            </div>
            <div>{{ $t('trans0005') }}</div>
          </div>
          <div class="mac">{{ $t('trans0188') }}</div>
          <div v-if="!$store.state.isMobile"
               class="tools laptop">
            <div class="btns">
              <button class="btn btn-small"
                      @click="removeBlacklist()"
                      :disabled="!someBlacklistChecked">
                {{ $t('trans0453') }}
              </button>
              <div class="btn btn-primary btn-small"
                   @click.stop="deviceModalVisible = !deviceModalVisible">
                {{ $t('trans0035') }}
                <div class="modal"
                     v-show="deviceModalVisible"
                     @click.stop=""
                     v-clickoutside="() => (deviceModalVisible = false)">
                  <div class="opcity"></div>
                  <div class="modal-content">
                    <div class="modal__header">{{ $t('trans0235') }}</div>
                    <div v-if="devices"
                         class="list">
                      <div class="device-item"
                           @click="checkDevice(item)"
                           v-for="(item, index) in devices"
                           :key="index">
                        <div class="check">
                          <m-checkbox :readonly="true"
                                      v-model="item.checked"></m-checkbox>
                        </div>
                        <div class="des">
                          <p>{{ item.name }}</p>
                          <p>
                            <label class="with-colon"
                                   for="">{{ $t('trans0188') }}:</label>
                            <span>{{ formatMac(item.mac) }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="empty-device"
                         v-if="!devices.length">
                      <p>{{ $t('trans0278') }}</p>
                    </div>
                    <div class="btn-wrap">
                      <button class="btn btn-dialog-confirm"
                              @click="addBlacklist()"
                              :disabled="!someDevicesChecked">
                        {{ $t('trans0016') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-content">
          <div class="device"
               v-for="device in listOrdered"
               :key="device.mac">
            <div class="name">
              <div class="checkbox">
                <m-checkbox v-model="device.checked"></m-checkbox>
              </div>
              <div>{{ device.name }}</div>
            </div>
            <div class="mac">{{ formatMac(device.mac) }}</div>
            <!-- <div class="operate">
              <span class="delete"
                    @click="removeSingleBlacklist(device)">{{ $t('trans0033') }}</span>
            </div> -->
          </div>
          <div class="empty"
               v-if="blacklist.length===0">
            <img src="../../../assets/images/img_default_empty.webp"
                 alt="" />
            <p>{{ $t('trans0278') }}</p>
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
      console.log('$$$', device);
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
    },
    showDeviceModal() {
      console.log(this.deviceModalVisible);
      this.deviceModalVisible = !this.deviceModalVisible;
      console.log(this.deviceModalVisible);
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
  &.laptop {
    width: auto;
  }
  .btns {
    display: flex;
  }
  .btn {
    margin-left: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    &:first-child {
      margin-left: 0;
    }
  }
}
.modal {
  position: absolute;
  top: 35px;
  z-index: 1;
  right: 0;
  width: 380px;
  border-radius: 5px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  background-color: var(--modal-content-background);
  .modal-content {
    .modal__header {
      color: var(--text-default-color);
      text-align: left;
      font-weight: bold;
      font-size: 14px;
      padding: 20px 0;
      margin: 0 15px;
    }
    .list {
      overflow: auto;
      padding: 0 10px;
      max-height: 400px;
    }
    .device-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border-radius: 10px;
      background: var(--table-row-background-color);
      overflow: hidden;
      margin-bottom: 5px;
      &:hover {
        background: var(--select-item-hover-background-color);
        cursor: pointer;
      }
      .des {
        flex: 1;
        justify-content: flex-start;
        margin-left: 20px;
        // padding-bottom: 20px;
        p {
          line-height: 1;
          padding: 0;
          margin: 0;
          text-align: left;
          &:first-child {
            color: var(--text-default-color);
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 7px;
          }
          &:nth-child(2) {
            color: var(--text-gery-color);
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
      padding-top: 30px;
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
  .mac {
    flex: 1;
  }
  .name {
    min-width: 25%;
    max-width: 50%;
    margin-right: 10px;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .checkbox {
      display: flex;
      align-items: center;
      margin-right: 22px;
    }
  }
  .empty-device {
    p {
      padding: 50px 0;
      margin: 0;
      text-align: center;
      color: var(--text-default-color);
    }
  }
  .table-header {
    display: flex;
    align-items: center;
    background: var(--table-row-background-color);
    padding: 15px 30px;
    margin-bottom: 5px;
    border-radius: 10px;
  }
  .table-content {
    .device {
      display: flex;
      padding: 15px 30px;
      background: var(--table-row-background-color);
      border-radius: 10px;
      margin-bottom: 5px;
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
      height: auto;
      display: flex;
      flex-direction: column;
      p {
        margin: 0;
      }
      img {
        width: 180px;
        height: 180px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .page-content {
    padding-top: 10px;
  }
  .modal {
    position: absolute;
    width: calc(100vw - 40px);
    right: 0px;
    top: 47px;
    transform: translateX(15px);
    .modal-content {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      .list {
        max-height: 31vh;
      }
      .device-item {
        &:hover {
          background: var(--table-row-background-color);
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
      margin: 0;
      display: flex;
      justify-content: space-between;
      .checkbox {
        display: flex;
        align-items: center;
      }
      .btns {
        display: flex;
      }
      .btn {
        // position: static;
        min-width: 70px;
        margin: 0;
        &:last-child {
          margin-left: 10px;
        }
      }
      &.mobile {
        padding: 15px;
        margin-bottom: 5px;
        border-radius: 10px;
        background: var(--table-row-background-color);
      }
    }
    .table-header {
      display: none;
    }
    .table-content {
      .device {
        flex-direction: column;
        padding: 15px;
        .mac {
          margin-left: 38px;
        }
      }
    }
  }
}
@media screen and (max-width: 374px) {
  .modal {
    .modal-content {
      .list {
        max-height: 28vh;
      }
    }
  }
  .table {
    .tools {
      .btn {
        min-width: 60px;
      }
    }
  }
}
</style>
