<template>
  <div class="page">
    <div v-if="isMobile"
         class="page-header">
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="page-content__main"
           v-if="isShowList">
        <div class="table">
          <div class="table-header">
            <div class="wrapper">
              <div class="checkbox">
                <m-checkbox :disabled="connecting"
                            v-model="checkAll"
                            @change="change"></m-checkbox>
              </div>
              <div class="status"
                   v-if="!isMobile">{{$t('trans0190')}}</div>
              <div class="name">
                {{$t('trans0108')}}
              </div>
            </div>
            <div class="protocol"
                 v-if="!isMobile">{{$t('trans0408')}}</div>
            <div class="operator">
              <button class="btn btn-small"
                      @click="mulDel"
                      :disabled="!hasChecked">{{$t('trans0033')}}</button>
              <button class="btn btn-small"
                      @click="add"
                      :disabled="connecting">{{$t('trans0035')}}</button>
            </div>
          </div>
          <div class="table-body">
            <div class="table-row vpn"
                 :class="{'close':!vpn.open}"
                 v-for="vpn in vpns"
                 :key="vpn.id">
              <div class="wrapper">
                <div class="checkbox">
                  <m-checkbox :disabled="connecting || vpn.enabled"
                              :stopPropagation="true"
                              v-model='vpn.checked'
                              @click.stop=''></m-checkbox>
                </div>
                <div class="status">
                  <m-loading :size="24"
                             class="spinner"
                             :color="getColor(vpn)"
                             v-if="isConnectingOrDisconnecting(vpn)"></m-loading>
                  <m-switch v-show="!isConnectingOrDisconnecting(vpn)"
                            :disabled="connecting"
                            v-model="vpn.enabled"
                            class="vpn-switch"
                            @change="(v)=>start(v,vpn)"></m-switch>
                </div>
                <div class="name"
                     @click.stop="vpn.open=!vpn.open">
                  <span class="name">{{vpn.name}}</span>
                </div>
              </div>
              <div class="protocol">
                <label class="m-title with-colon"
                       v-if="isMobile">{{$t('trans0408')}}:</label>
                {{vpn.protocol}}
              </div>
              <div class="operator">
                <span class="limit-icon"
                      :class="{'disabled':connecting || vpn.enabled}"
                      @click="edit(vpn)">
                  <i class=" iconfont ic_settings"></i>
                  <span class="hover-popover"> {{$t('trans0034')}}</span>
                </span>
                <span class="limit-icon"
                      :class="{'disabled':connecting || vpn.enabled}"
                      @click="del(vpn)">
                  <i class=" iconfont ic_trash"></i>
                  <span class="hover-popover"> {{$t('trans0033')}}</span>
                </span>
              </div>
            </div>
            <div class="empty"
                 v-if="hasVpns&&isEmpty">
              <img src="../../../../assets/images/img_default_empty.png"
                   alt="">
              <p class="empty-text">{{$t('trans0278')}}</p>
            </div>
          </div>
        </div>
      </div>
      <transition name="fade"
                  :css="!isMobile">
        <vpnForm v-if="isShowForm"
                 :isEdit="isEdit"
                 @closeForm="closeForm"
                 @refreshList="getVPNList"></vpnForm>
      </transition>
    </div>
  </div>
</template>
<script>
import { VPNType, VPNStatus, VPNAction } from 'base/util/constant';
import vpnForm from './form.vue';

export default {
  components: {
    vpnForm
  },
  data() {
    return {
      ScrollPage: document.querySelector('.scrollbar-wrap'),
      vpns: [],
      VPNStatus,
      timer: null,
      connecting: false,
      checkAll: false,
      isShowForm: false,
      isEdit: false
    };
  },
  mounted() {
    this.getVPNList();
  },
  methods: {
    isConnectingOrDisconnecting(vpn) {
      return (
        vpn.status === VPNStatus.connecting ||
        vpn.status === VPNStatus.disconnecting
      );
    },
    getSpinnerText(vpn) {
      return vpn.status === VPNStatus.connecting
        ? this.$t('trans0407')
        : this.$t('trans0484');
    },
    getColor(vpn) {
      return vpn.status === VPNStatus.connecting ? '#00d061' : '#ff0001';
    },
    start(v, vpn) {
      if (v) {
        // 打开
        vpn.status = VPNStatus.connecting;
        this.connecting = true;
        this.$http
          .updateVPNConfig({
            vpn_id: vpn.id,
            status: VPNAction.connect
          })
          .then(() => {
            if (vpn.protocol.toLowerCase() === VPNType.wireguard) {
              this.wireguardSwitchHandler(v, vpn);
            } else {
              this.createIntervalTask(
                vpn,
                false,
                VPNStatus.ready,
                VPNStatus.connecting,
                VPNStatus.connected
              );
            }
          })
          .catch(() => {
            vpn.enabled = false;
            vpn.status = VPNStatus.ready;
          });
      } else {
        // 关闭
        vpn.status = VPNStatus.disconnecting;
        this.connecting = true;
        this.$http
          .updateVPNConfig({
            vpn_id: vpn.id,
            status: VPNAction.disconnect
          })
          .then(() => {
            if (vpn.protocol.toLowerCase() === VPNType.wireguard) {
              this.wireguardSwitchHandler(v, vpn);
            } else {
              this.createIntervalTask(
                vpn,
                true,
                VPNStatus.connected,
                VPNStatus.disconnecting,
                VPNStatus.disconnected
              );
            }
          })
          .catch(() => {
            vpn.enabled = true;
            vpn.status = VPNStatus.connected;
          });
      }
    },
    createIntervalTask(vpn, pEnabled, pStatus, checkStatus, eStatus) {
      let timeout = 60;
      this.connecting = true;
      this.timer = setInterval(() => {
        if (timeout < 0) {
          clearTimeout(this.timer);
          this.connecting = false;
          this.$toast(this.$t('trans0406'));
          vpn.enabled = pEnabled;
          vpn.status = pStatus;
          if (!pEnabled) {
            // 当前操作的拨通vpn,失败之前的VPN也被断开了
            this.vpns.forEach(vv => {
              vv.enabled = false;
            });
          }
        } else if (timeout % 5 === 0) {
          this.$http.getVPNInfo().then(res => {
            vpn.status = res.data.result.status;
            if (vpn.status !== checkStatus) {
              clearTimeout(this.timer);
              this.connecting = false;
              if (!pEnabled) {
                // 当前操作的拨通vpn,失败之前的VPN也被断开了
                this.vpns.forEach(vv => {
                  vv.enabled = false;
                });
              }
              if (vpn.status === eStatus) {
                this.$toast(this.$t('trans0040'), 2000, 'success');
                vpn.enabled = !pEnabled;
              } else {
                this.$toast(this.$t('trans0077'));
                vpn.enabled = pEnabled;
                vpn.status = pStatus;
              }
            }
          });
        }
        timeout -= 1;
      }, 1000);
    },
    edit(vpn) {
      if (!this.connecting && !vpn.enabled) {
        this.$store.state.modules.vpn = vpn;
        this.isEdit = true;
        if (this.isMobile) {
          this.ScrollPage.scrollTop = 0;
        }
        this.isShowForm = true;
      }
    },
    add() {
      if (this.vpns && this.vpns.length >= 5) {
        this.$toast(this.$t('trans0060'));
        return;
      }
      this.isEdit = false;
      if (this.isMobile) {
        this.ScrollPage.scrollTop = 0;
      }
      this.isShowForm = true;
    },
    mulDel() {
      const deleteVpnArr = [];
      this.vpns.forEach(v => {
        if (v.checked) {
          deleteVpnArr.push(v);
        }
      });
      this.del(deleteVpnArr);
    },
    del(vpn) {
      const vpnIds = [];
      if (Array.isArray(vpn)) {
        vpn.map(item => vpnIds.push(item.id));
        if (!this.connecting && !vpn.every(i => i.enabled)) {
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0376'),
            callback: {
              ok: () => {
                this.$http.deleteVPN({ vpn_ids: vpnIds }).then(() => {
                  this.vpns = this.vpns.filter(v => v !== vpn);
                  this.$toast(this.$t('trans0040'), 2000, 'success');
                  this.getVPNList();
                });
              }
            }
          });
        }
      } else {
        vpnIds.push(vpn.id);
        if (!this.connecting && !vpn.enabled) {
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0376'),
            callback: {
              ok: () => {
                this.$http.deleteVPN({ vpn_ids: vpnIds }).then(() => {
                  this.vpns = this.vpns.filter(v => v !== vpn);
                  this.$toast(this.$t('trans0040'), 2000, 'success');
                  this.getVPNList();
                });
              }
            }
          });
        }
      }
    },
    getVPNList() {
      this.$loading.open();
      Promise.all([this.$http.getVPNInfo(), this.$http.getVPNlist()])
        .then(result => {
          const info = result[0].data.result;
          const vpns = result[1].data.result;
          this.vpns = vpns.map(v => {
            if (v.protocol === VPNType.wireguard) {
              this.$set(v, 'enabled', false);
              if (v.id === info.default_vpn) {
                v.enabled = info.enabled;
              }
            } else {
              this.$set(v, 'enabled', false);
              this.$set(v, 'status', VPNStatus.disconnected);
            }

            if (v.protocol !== VPNType.wireguard && v.id === info.default_vpn) {
              v.status = info.status;
              if (info.status === VPNStatus.connected) {
                v.enabled = true;
              }
              if (info.status === VPNStatus.connecting) {
                this.createIntervalTask(
                  v,
                  false,
                  VPNStatus.ready,
                  VPNStatus.connecting,
                  VPNStatus.connected
                );
              }
              if (info.status === VPNStatus.disconnecting) {
                v.enabled = true;
                this.createIntervalTask(
                  v,
                  true,
                  VPNStatus.connected,
                  VPNStatus.disconnecting,
                  VPNStatus.disconnected
                );
              }
            }
            // 处理vpn protocol文本显示
            switch (v.protocol) {
              case VPNType.wireguard:
                v.protocol = this.$t('trans1172');
                break;
              case VPNType.openvpn:
                v.protocol = this.$t('trans0676');
                break;
              default:
                v.protocol = v.protocol?.toUpperCase();
                break;
            }

            return { ...v, checked: false, open: false };
          });
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    change(v) {
      this.vpns.forEach(item => {
        if (item.enabled) return;
        if (v) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    wireguardSwitchHandler(status, vpn) {
      this.$reconnect({
        onsuccess: () => {
          if (status) {
            this.vpns.forEach(vv => {
              vv.enabled = false;
            });
            vpn.status = VPNStatus.connected;
            vpn.enabled = true;
          } else {
            vpn.status = VPNStatus.disconnected;
            vpn.enabled = false;
            this.connecting = false;
          }
          this.connecting = false;
        },
        ontimeout: () => {
          this.$router.push({ path: '/unconnect' });
        },
        timeout: 30,
        showLoading: false
      });
    },
    closeForm() {
      this.isShowForm = false;
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    hasVpns() {
      return this.vpns !== null;
    },
    isEmpty() {
      return this.vpns !== null && !this.vpns.length;
    },
    hasChecked() {
      return this.vpns.some(i => i.checked);
    },
    isShowList() {
      if (!this.isMobile) {
        return true;
      }
      return !this.isShowForm;
    }
  },
  watch: {
    vpns: {
      handler(nv) {
        if (nv.length) {
          if (nv.every(v => v.checked)) {
            this.checkAll = true;
          } else {
            this.checkAll = false;
          }
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.table {
  .table-header {
    grid-template-columns: 2fr 1fr 1fr;
    .wrapper {
      grid-template-columns: 30px 80px 1fr;
    }
  }
  .table-body {
    .table-row {
      grid-template-columns: 2fr 1fr 1fr;
    }
  }
  .wrapper {
    grid-template-columns: 30px 80px 1fr;
  }
  .checkbox {
    display: flex;
    align-items: center;
  }
  .name {
    max-width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .operator {
    display: flex;
    justify-content: flex-end;
    button {
      margin-left: 20px;
      &:first-child {
        margin: 0;
      }
    }
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .btn-middle {
    width: 340px;
    height: 48px;
    margin-top: 50px;
  }
}
@media screen and (min-width: 770px) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
@media screen and (max-width: 768px) {
  .table {
    .table-header {
      grid-template-columns: 1fr 2fr;
      .wrapper {
        grid-template-columns: 30px 1fr;
        gap: 0;
      }
      .operator {
        .btn {
          width: auto;
          min-width: auto;
          margin: 0 0 0 15px;
          &:first-child {
            margin: 0;
          }
        }
      }
    }
    .table-body {
      .table-row {
        grid-template-rows: repeat(3, 50px);
        grid-template-columns: 100%;
        font-weight: 400;
        font-size: 13px;
        color: var(--common_gery-color);
        > div {
          height: 50px;
          border-bottom: 1px solid var(--hr-color);
          &:last-child {
            border: none;
            padding: 0;
          }
        }
        &.close {
          grid-template-rows: 100%;
          .wrapper {
            padding-bottom: 0;
            border-color: transparent;
            .status {
              &::after {
                transform: translateY(-50%) rotate(0deg);
              }
            }
          }
          .protocol,
          .operator {
            display: none;
          }
        }
      }
      .wrapper {
        grid-template-columns: 30px 2fr 0.7fr;
        grid-template-areas: 'checkbox name status';
        gap: 0;
        .checkbox {
          grid-area: checkbox;
        }
        .name {
          grid-area: name;
          color: var(--text_default-color);
          height: 100%;
          > span {
            line-height: 50px;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .status {
          grid-area: status;
          position: relative;
          display: flex;
          align-items: center;
          &::after {
            content: '\e6c2';
            font-family: 'iconfont';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%) rotate(90deg);
            font-size: 12px;
            transition: transform 0.3s;
            color: var(--text_default-color);
          }
        }
      }
      .protocol {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .operator {
        align-items: center;
      }
    }
  }
}
</style>
