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
              <div class="vpn-name">{{vpn.name}}</div>
              <m-spinner class="spinner" color="#00d061" v-if="vpn.status === VPNStatus.connecting"></m-spinner>
            </div>

            <div class="vpn-right">
              <!-- <div v-if="vpn.duration" class="vpn-duration">{{vpn.duration}}</div> -->
              <m-switch v-model="vpn.enabled" class="vpn-switch" :onChange="(v)=>start(v,vpn)"></m-switch>
              <div class="vpn-edit" @click="edit(vpn)" :class="{'disabled':vpn.enabled}">{{$t('trans0034')}}</div>
              <div class="vpn-del" @click="del(vpn)" :class="{'disabled':vpn.enabled}">{{$t('trans0033')}}</div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" @click="add">{{$t('trans0035')}}</button>
      </div>
      <div class="empty" v-if="isEmpty">
        <img src="../../../../assets/images/img_default_empty.png" alt="">
        <p class="empty-text">{{$t('trans0278')}}</p>
        <button class="btn btn-primary" @click="add">{{$t('trans0035')}}</button>
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
      timer: null
    };
  },
  mounted() {
    this.getVPNList();
  },
  methods: {
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
      const action = vpn.enabled ? VPNAction.connect : VPNAction.disconnect;
      const status =
        action === VPNAction.connect
          ? VPNStatus.connecting
          : VPNStatus.disconnecting;
      vpn.status = status;
      this.$http
        .updateVPNConfig({
          vpn_id: vpn.id,
          status: action
        })
        .then(() => {
          let timeout = 10;

          this.timer = setInterval(() => {
            if (timeout < 0) {
              clearTimeout(this.timer);
              this.$toast(this.$t('trans0406'));
              vpn.enabled = !v;
            } else if (timeout % 3 === 0) {
              this.$http.getVPNInfo().then(res => {
                vpn.status = res.data.result.status;
                if (vpn.status === VPNStatus.connected) {
                  clearTimeout(this.timer);
                }
              });
            }
            timeout -= 1;
          }, 1000);
        })
        .catch(() => {
          vpn.enabled = !v;
          vpn.status = VPNStatus.stable;
        });
    },
    edit(vpn) {
      if (!vpn.enabled) {
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
      if (!vpn.enabled) {
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
              v.id === info.deleteVPN
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
        .spinner {
          margin-left: 10px;
        }
      }

      .vpn-right {
        flex: 1;
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
            cursor: default;
          }
        }
        .vpn-del {
          margin-left: 30px;
          color: #ff0001;
          cursor: pointer;
          &.disabled {
            color: #999;
            cursor: default;
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
    flex: 1;
    .vpn-list {
      width: 100%;
      .vpn {
        width: 100%;
        flex-direction: column;
        padding: 10px;
        align-items: flex-start;
        height: auto;
        .vpn-left {
          align-items: center;
          margin-bottom: 10px;
          height: 50px;
        }
        .vpn-right {
          width: 100%;
        }
      }
    }
  }
}
</style>
