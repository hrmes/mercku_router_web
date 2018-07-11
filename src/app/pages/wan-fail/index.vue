<template>
  <div class="wan-check-container">
    <nav-bar :option="option" />
    <div class="status-info">
      <img src="../../assets/images/img_default_empty@3x.png" alt="">
      <div class="message">{{$route.params.state==='unlinked'?$t('trans0161'):$t('trans0180')}}</div>
    </div>
    <div class="net-info-container">
      <div class="net-info">
        <div>
          <label for="">{{$t('trans0317')}}：</label>
          <span>{{this.$t(access)}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0151')}}：</label>
          <span>{{netinfo.ip}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0152')}}：</label>
          <span>{{netinfo.mask}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0153')}}：</label>
          <span>{{netinfo.gateway}}</span>
        </div>
        <div>
          <label for="">{{$t('trans0236')}}：</label>
          <span>{{netinfo.dns.join('/')}}</span>
        </div>
      </div>
    </div>

    <div class="button-info">
      <van-button size="normal" @click="forward2set()">{{$t('trans0019')}}</van-button>
      <div class="space"></div>
      <van-button size="normal" @click="$router.replace('/check-network')">{{$t('trans0162')}}</van-button>
    </div>
  </div>
</template>
<script>
import { WanType } from '../../../util/constant';

export default {
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
              confirmButtonText: this.$t('trans0024'),
              cancelButtonText: this.$t('trans0025')
            })
              .then(() => {
                const config = this.routerConfig.getConfig();
                this.$http
                  .update({
                    ...config.wifi
                  })
                  .then(() => {
                    this.$router.replace('/complete');
                  })
                  .catch(err => {
                    if (err && err.error) {
                      this.$router.replace({ path: '/login' });
                    } else {
                      this.$toast(this.$t('trans0039'));
                    }
                  });
              })
              .catch(() => {
                // on cancel
              });
          }
        },
        left: {
          icon: true,
          text: 'arrow-left',
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
        ip: '-.-.-.-',
        mask: '-.-.-.-',
        gateway: '-.-.-.-',
        dns: ['-.-.-.-']
      },
      access: ''
    };
  },
  methods: {
    setWan() {
      const wanConfig = this.routerConfig.getWan();
      this.netinfo = {
        ip: wanConfig.ip || '-.-.-.-',
        mask: wanConfig.mask || '-.-.-.-',
        gateway: wanConfig.gateway || '-.-.-.-',
        dns: wanConfig.dns || ['-.-.-.-']
      };
      this.access = wanConfig.type;
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
    this.setWan();
    this.$http
      .getWanNetInfo()
      .then(res => {
        this.netinfo = res.data.result.netinfo;
        this.access = res.data.result.type;
        const { result } = res.data;
        this.routerConfig.setWan(
          this.access,
          result.pppoe || (result.static && result.static.netinfo) || ''
        );
        this.setWan();
      })
      .catch(err => {
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
  .status-info {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    .message {
      width: 100%;
      text-align: center;
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
    }

    img {
      width: 1.4rem;
      height: 1.4rem;
      margin-top: 0.3rem;
    }
  }
  .net-info-container {
    display: flex;
    align-items: center;
    margin-top: 0.4rem;
    font-size: 16px;
    .net-info {
      display: inline-block;
      margin: 0 auto;
      > div {
        text-align: left;
        margin-top: 0.1rem;
      }
    }
  }
}
</style>
