<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="list">
        <div class="vpn-list">
          <div class="vpn-list-header">
            <div class="column-name">
              <div class="column-check">
                <m-checkbox v-model="checkAll"
                            @change="change"></m-checkbox>
              </div>
              {{$t('trans0108')}}
            </div>
            <div v-if="!$store.state.isMobile"
                 class="column-protocol">{{$t('trans0408')}}</div>
            <div v-if="!$store.state.isMobile"
                 class="column-status">{{$t('trans0190')}}</div>
            <div class="column-handle">
              <div class="btn-wrap">
                <button class="btn btn-small"
                        @click="mulDel"
                        :disabled="!hasChecked">{{$t('trans0033')}}</button>

                <button class="btn btn-small"
                        @click="add"
                        :disabled="connecting">{{$t('trans0035')}}</button>
              </div>
            </div>
          </div>
          <div class="vpn"
               :class="{'open':vpn.open}"
               v-for="vpn in vpns"
               :key="vpn.id">
            <div class="column-name"
                 @click.stop="vpn.open=!vpn.open">
              <div class="column-check">
                <m-checkbox :disabled="connecting || vpn.enabled"
                            :stopPropagation="true"
                            v-model='vpn.checked'
                            @click.stop=''></m-checkbox>
              </div>
              <span>{{vpn.name}}</span>
            </div>
            <div class="column-protocol">
              <label class="m-title with-colon">{{$t('trans0408')}}:</label>
              {{vpn.protocol}}
            </div>
            <div class="column-status">
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
            <div class="column-handle">
              <span class="btn-icon"
                    :class="{'disabled':connecting || vpn.enabled}"
                    @click="edit(vpn)">
                <i class=" iconfont icon-ic_settings_normal"></i>
                <span class="icon-hover-popover"> {{$t('trans0034')}}</span>
              </span>
              <span v-if="$store.state.isMobile"
                    class="label"
                    :class="{'disabled':connecting || vpn.enabled}"
                    @click="edit(vpn)">
                {{$t('trans0034')}}
              </span>
              <span class="btn-icon"
                    :class="{'disabled':connecting || vpn.enabled}"
                    @click="del(vpn)">
                <i class=" iconfont icon-ic_trash_normal"></i>
                <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
              </span>
              <span v-if="$store.state.isMobile"
                    class="label"
                    :class="{'disabled':connecting || vpn.enabled}"
                    @click="del(vpn)">
                {{$t('trans0033')}}
              </span>
            </div>
          </div>
          <div class="vpn-empty"
               v-if="hasVpns&&isEmpty">
            <img src="../../../../assets/images/img_default_empty.png"
                 alt="">
            <p class="empty-text">{{$t('trans0278')}}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { VPNAction, VPNStatus } from 'base/util/constant';

export default {
  data() {
    return {
      vpns: [],
      VPNStatus,
      timer: null,
      connecting: false,
      checkAll: false
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
            this.createIntervalTask(
              vpn,
              false,
              VPNStatus.ready,
              VPNStatus.connecting,
              VPNStatus.connected
            );
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
            this.createIntervalTask(
              vpn,
              true,
              VPNStatus.connected,
              VPNStatus.disconnecting,
              VPNStatus.disconnected
            );
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
        this.$router.push(`/advance/vpn/form/${vpn.id}`);
      }
    },
    add() {
      if (this.vpns && this.vpns.length >= 5) {
        this.$toast(this.$t('trans0060'));
        return;
      }
      this.$router.push({ path: '/advance/vpn/form' });
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
            this.$set(v, 'enabled', false);
            this.$set(v, 'status', VPNStatus.disconnected);

            if (v.id === info.default_vpn) {
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

            return { ...v, checked: false, open: false };
          });
          this.$loading.close();
          console.log('###', this.vpns);
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
    }
  },
  computed: {
    hasVpns() {
      return this.vpns !== null;
    },
    isEmpty() {
      return this.vpns !== null && !this.vpns.length;
    },
    hasChecked() {
      return this.vpns.some(i => i.checked);
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
.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btn {
    // margin-top: 30px;
    align-self: flex-start;
  }
  .vpn-list {
    width: 100%;
    .vpn-list-header {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-bottom: 5px;
      height: 50px;
      border-radius: 10px;
      color: var(--text_gery-color);
      background: var(--table_row-bgc);
      > div {
        display: flex;
        align-items: center;
      }
    }
    .vpn {
      height: 56px;
      display: flex;
      justify-content: space-between;
      border-radius: 10px;
      color: var(--text_default-color);
      background: var(--table_row-bgc);
      padding: 0px 20px;
      margin-bottom: 5px;
      align-items: center;
      > div {
        display: flex;
      }
    }
    .column-check {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    .column-name {
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .column-protocol {
      width: 70px;
      .m-title {
        display: none;
      }
    }
    .column-status {
      width: 40px;
    }
    .column-handle {
      width: 200px;
      justify-content: flex-end;
      .btn-wrap {
        display: flex;
        .btn {
          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

.vpn-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  img {
    width: 180px;
  }
  .btn-middle {
    width: 340px;
    height: 48px;
    margin-top: 50px;
  }
}
@media screen and (max-width: 768px) {
  .page-content {
    padding-top: 10px;
  }
  .list {
    width: 100%;
    .btn {
      margin-top: 0;
    }
    .vpn-list {
      width: 100%;
      .vpn-list-header {
        .btn-wrap {
          .btn {
            min-width: 60px;
          }
        }
      }
      .vpn {
        position: relative;
        width: 100%;
        height: auto;
        flex-direction: column;
        padding: 10px 20px;
        align-items: flex-start;
        .column-name {
          position: relative;
          width: 100%;
          height: 50px;
          border-bottom: 1px solid transparent;
          span {
            display: flex;
            align-items: center;
          }
          &::after {
            content: '\e65b';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%) rotate(-90deg);
            font-family: 'iconfont';
          }
        }
        .column-protocol {
          width: 100%;
          height: 50px;
          display: none;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--table_body_hr-color);
          .m-title {
            display: block;
          }
        }
        .column-status {
          position: absolute;
          top: 22px;
          right: 50px;
        }
        .column-handle {
          display: none;
          height: 50px;
          justify-content: flex-start;
          align-items: center;
          .label {
            &.disabled {
              color: var(--button_icon_disabled-color);
            }
          }
        }
        &.open {
          .column-handle,
          .column-protocol {
            display: flex;
          }
          .column-handle {
            width: fit-content;
          }
          .column-name {
            border-bottom-color: var(--table_body_hr-color);
            &::after {
              transform: translateY(-50%) rotate(0deg);
            }
          }
        }
      }
    }
  }
  .vpn-empty {
    .btn {
      width: auto;
      height: 38px;
      margin-top: 10px;
    }
  }
}
</style>
