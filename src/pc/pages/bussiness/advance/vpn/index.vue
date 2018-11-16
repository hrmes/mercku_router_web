<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0402')}}
    </div>
    <div class="page-content">
      <div class="list" v-if="!isEmpty">
        <div class="vpn-list">
          <div class="vpn" v-for="vpn in vpns" :key="vpn.id">
            <div class="vpn-name">{{vpn.name}}</div>
            <div class="vpn-right">
              <div v-if="vpn.duration" class="vpn-duration">{{vpn.duration}}</div>
              <m-switch v-model="vpn.enabled" class="vpn-switch" :onChange="start(vpn)"></m-switch>
              <div class="vpn-edit">{{$t('trans0034')}}</div>
              <div class="vpn-del" @click="del(vpn)">{{$t('trans0033')}}</div>
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
import { VPNStatus } from 'util/constant';

export default {
  data() {
    return {
      vpns: [
        {
          id: '<id>',
          name: '<name>',
          protocol: 'L2TP|PPTP', // L2TP or PPTP
          server: '<server ip or host>',
          username: '<username>',
          password: '<password>',
          enabled: false,
          // protocol=pptp时提供
          pptp: {
            mppe: true,
            mppc: true
          }
        }
      ]
    };
  },
  mounted() {
    this.getVPNList();
  },
  methods: {
    start(vpn) {
      this.$loading.open();
      this.$http
        .updateVPNConfig({
          vpn_id: vpn.id,
          status: vpn.enabled ? VPNStatus.connect : VPNStatus.disconnect
        })
        .then(res => {
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    add() {
      if (this.vpns.length >= 5) {
        this.$toast('trans0060');
        return;
      }
      this.$router.push({ path: '/advance/vpn/form' });
    },
    del(vpn) {
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
                this.$toast('trans0040', 3000, 'success');
              });
          }
        }
      });
    },
    getVPNList() {
      this.$loading.open();
      Promise.all([this.$http.getVPNInfo(), this.$http.getVPNlist()])
        .then(result => {
          this.vpns = result.data.result;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  computed: {
    isEmpty() {
      return this.vpns === null || !this.vpns.length;
    }
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
      width: 550px;
      display: flex;
      border-radius: 4px;
      border: solid 1px #dedede;
      background-color: #fafafa;
      padding: 23px 20px;
      margin-bottom: 20px;
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
        }
        .vpn-del {
          margin-left: 30px;
          color: #ff0001;
          cursor: pointer;
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
    .vpn-list {
      .vpn {
        width: 100%;
      }
    }
  }
}
</style>
