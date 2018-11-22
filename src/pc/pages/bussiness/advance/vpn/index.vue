<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="list" v-if="!isEmpty">
        <div class="vpn-list">
          <div class="vpn" v-for="vpn in vpns" :key="vpn.id">
            <div class="vpn-left">
              <div class="vpn-name">
                <span>{{vpn.name}}</span>
                <div class="spinner-container">
                  <m-spinner :size="30" class="spinner" :color="getColor(vpn)" v-if="isConnectingOrDisconnecting(vpn)"></m-spinner>
                  <span class="spinner-text" :style="{'color':getColor(vpn)}" v-if="isConnectingOrDisconnecting(vpn)">{{getSpinnerText(vpn)}}</span>
                </div>
              </div>

              <m-switch :disabled="connecting" v-model="vpn.enabled" class="vpn-switch" :onChange="(v)=>start(v,vpn)"></m-switch>
            </div>

            <div class="vpn-right">
              <!-- <div v-if="vpn.duration" class="vpn-duration">{{vpn.duration}}</div> -->

              <div class="vpn-edit" @click="edit(vpn)" :class="{'disabled':connecting}">{{$t('trans0034')}}</div>
              <div class="vpn-del" @click="del(vpn)" :class="{'disabled':connecting}">{{$t('trans0033')}}</div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" @click="add" :disabled="connecting">{{$t('trans0035')}}</button>
      </div>
      <div class="empty" v-if="isEmpty">
        <img src="../../../../assets/images/img_default_empty.png" alt="">
        <p class="empty-text">{{$t('trans0278')}}</p>
        <button class="btn btn-primary" @click="add" :disabled="connecting">{{$t('trans0035')}}</button>
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
    formatDuration(duration) {
      if (!duration) {
        return '00:00:00';
      }
      const total = Math.floor(duration / 1000);
      const hour = Math.floor(total / 3600);
      const min = Math.floor((total % 3600) / 60);
      const sec = (total % 3600) % 60;

      return (hour > 0 ? [hour, min, sec] : [min, sec])
        .map(x => `0${x}`.slice(-2))
        .join(':');
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
            let timeout = 60;
            this.timer = setInterval(() => {
              if (timeout < 0) {
                clearTimeout(this.timer);
                this.connecting = false;
                this.$toast(this.$t('trans0406'));
                vpn.enabled = false;
                vpn.status = VPNStatus.ready;
              } else if (timeout % 3 === 0) {
                this.$http.getVPNInfo().then(res => {
                  vpn.status = res.data.result.status;
                  if (vpn.status !== VPNStatus.connecting) {
                    clearTimeout(this.timer);
                    this.connecting = false;
                    if (vpn.status === VPNStatus.connected) {
                      this.$toast(this.$t('trans0040'), 3000, 'success');
                      vpn.enabled = true;
                    } else {
                      this.$toast(this.$t('trans0406'));
                      vpn.enabled = false;
                      vpn.status = VPNStatus.ready;
                    }
                  }
                });
              }
              timeout -= 1;
            }, 1000);
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
            let timeout = 60;
            this.timer = setInterval(() => {
              if (timeout < 0) {
                clearTimeout(this.timer);
                this.connecting = false;
                this.$toast(this.$t('trans0406'));
                vpn.enabled = true;
                vpn.status = VPNStatus.connected;
              } else if (timeout % 3 === 0) {
                this.$http.getVPNInfo().then(res => {
                  vpn.status = res.data.result.status;
                  if (vpn.status !== VPNStatus.disconnecting) {
                    clearTimeout(this.timer);
                    this.connecting = false;
                    if (vpn.status === VPNStatus.disconnected) {
                      this.$toast(this.$t('trans0040'), 3000, 'success');
                      vpn.enabled = false;
                    } else {
                      this.$toast(this.$t('trans0077'));
                      vpn.enabled = true;
                      vpn.status = VPNStatus.connected;
                    }
                  }
                });
              }
              timeout -= 1;
            }, 1000);
          })
          .catch(() => {
            vpn.enabled = true;
            vpn.status = VPNStatus.connected;
          });
      }
    },
    edit(vpn) {
      if (!this.connecting) {
        this.$store.state.vpn = vpn;
        this.$router.push(`/advance/vpn/form/${vpn.id}`);
      }
    },
    add() {
      if (this.vpns && this.vpns.length >= 5) {
        this.$toast('trans0060');
        return;
      }
      this.$router.push({ path: '/advance/vpn/form' });
    },
    del(vpn) {
      if (!this.connecting) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0376'),
          callback: {
            ok: () => {
              this.$http
                .deleteVPN({
                  vpn_id: vpn.id
                })
                .then(() => {
                  this.vpns = this.vpns.filter(v => v !== vpn);
                  this.$toast('trans0040', 3000, 'success');
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
            if (
              info.status === VPNStatus.connected &&
              v.id === info.default_vpn
            ) {
              v.enabled = true;
              // v.duration = info.connected_time;
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
          color: #333333;
          cursor: pointer;
          &.disabled {
            color: #999;
            cursor: not-allowed;
          }
        }
        .vpn-del {
          margin-left: 30px;
          color: #ff0001;
          cursor: pointer;
          &.disabled {
            color: #999;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
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
          .vpn-switch {
          }
        }
      }
    }
  }
}
</style>
