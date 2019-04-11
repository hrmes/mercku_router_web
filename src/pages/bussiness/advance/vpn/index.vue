<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="list"
           v-if="hasVpns&&!isEmpty">
        <div class="vpn-list">
          <div class="vpn"
               v-for="vpn in vpns"
               :key="vpn.id">
            <div class="vpn-left">
              <div class="vpn-name">
                <span>{{vpn.name}}</span>
                <div class="spinner-container">
                  <m-loading :size="30"
                             class="spinner"
                             :color="getColor(vpn)"
                             v-if="isConnectingOrDisconnecting(vpn)"></m-loading>
                  <span class="spinner-text"
                        :style="{'color':getColor(vpn)}"
                        v-if="isConnectingOrDisconnecting(vpn)">{{getSpinnerText(vpn)}}</span>
                </div>
              </div>

              <m-switch :disabled="connecting"
                        v-model="vpn.enabled"
                        class="vpn-switch"
                        :onChange="(v)=>start(v,vpn)"></m-switch>
            </div>

            <div class="vpn-right">
              <!-- <div v-if="vpn.duration" class="vpn-duration">{{vpn.duration}}</div> -->

              <div class="vpn-edit btn-text"
                   @click="edit(vpn)"
                   :class="{'disabled':connecting || vpn.enabled}">{{$t('trans0034')}}</div>
              <div class="vpn-del btn-text text-primary"
                   @click="del(vpn)"
                   :class="{'disabled':connecting || vpn.enabled}">{{$t('trans0033')}}</div>
            </div>
          </div>
        </div>
        <div class="form-button">
          <button class="btn btn-primary"
                  @click="add"
                  :disabled="connecting">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class="vpn-empty"
           v-if="hasVpns&&isEmpty">
        <img src="../../../../assets/images/img_default_empty.png"
             alt="">
        <p class="empty-text">{{$t('trans0278')}}</p>
        <button class="btn btn-primary"
                @click="add"
                :disabled="connecting">{{$t('trans0035')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { VPNAction, VPNStatus } from 'util/constant';

export default {
  data() {
    return {
      vpns: null,
      VPNStatus,
      timer: null,
      connecting: false
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
                this.$toast(this.$t('trans0040'), 3000, 'success');
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
        this.$store.modules.vpn = vpn;
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
    del(vpn) {
      if (!this.connecting && !vpn.enabled) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0376'),
          callback: {
            ok: () => {
              this.$http.deleteVPN({ vpn_ids: [vpn.id] }).then(() => {
                this.vpns = this.vpns.filter(v => v !== vpn);
                this.$toast(this.$t('trans0040'), 3000, 'success');
              });
            }
          }
        });
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

            return v;
          });
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  computed: {
    hasVpns() {
      return this.vpns !== null;
    },
    isEmpty() {
      return this.vpns !== null && !this.vpns.length;
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
    margin-top: 30px;
    align-self: flex-start;
  }
  .vpn-list {
    .vpn {
      width: 500px;
      height: 56px;
      display: flex;
      border-radius: 4px;
      border: solid 1px #dedede;
      background-color: #fafafa;
      padding: 0px 20px;
      margin-bottom: 20px;
      align-items: center;
      .vpn-left {
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: space-between;
        .vpn-name {
          display: flex;
          align-items: center;
        }
        .spinner-container {
          display: flex;
          align-items: center;
          margin-left: 20px;
          .spinner-text {
            margin-left: 10px;
          }
        }
      }

      .vpn-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .vpn-switch {
          margin-left: 10px;
        }
        .vpn-edit {
          margin-left: 30px;
          &.disabled {
            color: #999;
            cursor: not-allowed;
          }
        }
        .vpn-del {
          margin-left: 30px;
          &.disabled {
            color: #999;
            cursor: not-allowed;
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
    width: 220px;
  }
  .empty-text {
    margin-bottom: 50px;
  }
}
@media screen and (max-width: 768px) {
  .list {
    width: 100%;
    .vpn-list {
      width: 100%;
      .vpn {
        width: 100%;
        flex-direction: column;
        padding: 10px;
        align-items: flex-start;
        height: auto;
        .vpn-left {
          width: 100%;
          align-items: center;
          margin-bottom: 10px;
          justify-content: space-between;
          height: 36px;
        }
        .vpn-right {
          width: 100%;
        }
      }
    }
  }
}
</style>
