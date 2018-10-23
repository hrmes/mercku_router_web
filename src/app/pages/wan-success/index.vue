<template>

  <div class="wan-success-page">
    <nav-bar :option="option" />
    <div class="banner-container">
      <img src="../../assets/images/ic_succeed.png" alt="">
      <p>{{$t('trans0157')}}</p>
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
      <button class="btn btn-default" @click="next">{{$t('trans0081')}}</button>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      option: {
        center: {
          text: this.$t('trans0223')
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
    next() {
      this.$http.post2native('PUT', 'OPEN_LOADING');
      this.$http
        .updateMeshConfig(this.routerConfig.getConfig())
        .then(() => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
          this.$router.replace({ path: '/complete' });
        })
        .catch(err => {
          this.$http.post2native('PUT', 'CLOSE_LOADING');
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$toast(this.$t('trans0039'));
          }
        });
    }
  },
  mounted() {
    this.$http.post2native('PUT', 'OPEN_LOADING');
    this.$http
      .getWanNetInfo()
      .then(res => {
        this.$http.post2native('PUT', 'CLOSE_LOADING');
        this.netinfo = res.data.result.netinfo;
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
          // 弹出错误提示
          this.$toast(this.$t(err.error.code));
        } else {
          this.$toast(this.$t('trans0039'));
        }
      });
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-success-page {
  padding: 0rem 0.15rem;
  .header {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    color: rgb(213, 184, 132);
    text-align: center;
  }
  .banner-container {
    font-size: 0.2rem;
    text-align: center;
    color: #fff;
    position: relative;
    margin-top: 0.9rem;
    p {
      width: 100%;
      font-size: 0.14rem;
      color: rgb(182, 182, 182);
    }
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  .net-info-container {
    align-items: center;
    margin-top: 0.4rem;
    font-size: 16px;
    .net-info {
      margin: 0 0.35rem;

      > div {
        text-align: left;
        padding: 0.1rem 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgb(189, 189, 189);
        label {
          font-weight: bold;
        }
        &:last-child {
          border: 0;
        }
      }
    }
  }
  .button-container {
    text-align: center;
    margin-top: 2.18rem;
  }
}
</style>
