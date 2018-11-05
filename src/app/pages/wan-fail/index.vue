<template>
  <div class="wan-check-container">
    <nav-bar :option="option" />
    <div class="status-info">
      <img src="../../assets/images/ic_test_internet_fail.png" alt="">
      <div class="message">{{message}}</div>
    </div>
    <div class="net-info-container">
      <div class="net-info">
        <div>
          <label for="">{{$t('trans0317')}}</label>
          <span>{{this.$t(access)}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0151')}}</label>
          <span>{{netinfo.ip}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0152')}}</label>
          <span>{{netinfo.mask}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0153')}}</label>
          <span>{{netinfo.gateway}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0236')}}</label>
          <span>{{netinfo.dns.join('/')}}</span>
        </div>
      </div>
    </div>

    <div class="button-info">
      <button class="btn btn-default" @click="forward2set()">{{$t('trans0019')}}</button>
      <div class="space"></div>
      <button class="btn btn-default retry" @click="$router.replace('/check-network')">{{$t('trans0162')}}</button>
    </div>
  </div>
</template>
<script>
import { WanType } from '../../../util/constant';

export default {
  computed: {
    message() {
      return this.$route.params.state === 'unlinked'
        ? this.$t('trans0161')
        : this.$t('trans0180');
    }
  },
  data() {
    return {
      option: {
        center: {
          text: this.$t('trans0223')
        },
        right: {
          text: this.$t('trans0163'),
          click: () => {
            this.$confirm({
              message: this.$t('trans0164'),
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              callback: {
                ok: () => {
                  const config = this.routerConfig.getConfig();
                  this.$http.post2native('PUT', 'OPEN_LOADING');
                  this.$http
                    .updateMeshConfig({
                      wifi: config.wifi,
                      admin: config.admin
                    })
                    .then(() => {
                      this.$http.post2native('PUT', 'CLOSE_LOADING');
                      this.$router.replace('/complete');
                    })
                    .catch(err => {
                      this.$http.post2native('PUT', 'CLOSE_LOADING');
                      if (err && err.error) {
                        this.$router.replace({ path: '/login' });
                      } else {
                        this.$toast(this.$t('trans0039'));
                      }
                    });
                }
              }
            });
          }
        },
        left: {
          icon: true,
          click: () => {
            if (this.$route.params.immediate) {
              this.$router.replace('/wlan');
            } else {
              this.$http.post2native('PUT', 'CLOSE_WEB_PAGE');
            }
          }
        }
      },
      netinfo: {
        ip: '-',
        mask: '-',
        gateway: '-',
        dns: ['-']
      },
      access: ''
    };
  },
  methods: {
    setWan(info = {}) {
      this.netinfo = {
        ip: info.ip || '-',
        mask: info.mask || '-',
        gateway: info.gateway || '-',
        dns: info.dns || ['-']
      };
    },
    forward2set() {
      if (this.access === WanType.pppoe) {
        this.$router.push({ path: '/pppoe' });
      } else if (this.access === WanType.static) {
        this.$router.push({ path: '/static-ip' });
      } else if (this.access === WanType.dhcp) {
        this.$router.push({ path: '/dhcp' });
      } else {
        this.$router.push({ path: '/wan-hand' });
      }
    }
  },
  mounted() {
    this.$http.post2native('PUT', 'OPEN_LOADING');
    this.$http
      .getWanNetInfo()
      .then(res => {
        this.$http.post2native('PUT', 'CLOSE_LOADING');
        this.setWan(res.data.result.netinfo);
        this.access = res.data.result.type;
        const { result } = res.data;
        this.routerConfig.setWan(
          this.access,
          result.pppoe || (result.static && result.static.netinfo) || ''
        );
      })
      .catch(err => {
        this.$http.post2native('PUT', 'CLOSE_LOADING');
        if (err && err.error) {
          // 这里不做错误提示，失败了就失败了
          // this.$toast(this.$t(err.error.code));
        } else {
          this.$toast(this.$t('trans0039'));
        }
      });
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-check-container {
  padding-right: 0.15rem;
  overflow: hidden;
  padding-left: 0.15rem;
  position: relative;
  .retry {
    background: #fff;
    color: rgb(214, 0, 28);
    border: 1px solid rgb(214, 0, 28);
    border-radius: 0.25rem;
    &:active {
      border-color: rgb(182, 0, 24);
      color: rgb(182, 0, 24);
    }
  }
  .status-info {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    .message {
      width: 100%;
      text-align: center;
      font-size: 0.14rem;
      color: rgb(51, 51, 51);
      font-weight: bold;
    }

    img {
      width: 1.4rem;
      height: 1.4rem;
      margin-top: 0.2rem;
    }
  }
  .net-info-container {
    align-items: center;
    margin-top: 0.4rem;
    font-size: 0.16rem;
    .net-info {
      margin: 0 0.15rem;

      > div {
        text-align: left;
        padding: 0.1rem 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgb(189, 189, 189);
        color: rgb(108, 108, 108);
        label {
          font-weight: bold;
        }
        &:last-child {
          border: 0;
        }
      }
    }
  }
}
</style>
