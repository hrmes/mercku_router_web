<template>
  <div class="wan-hand-container">
    <nav-bar :option="option" />
    <div class="message">{{$t('trans0143')}} </div>
    <div class="list">
      <div class="item" @click="checkType('pppoe')">
        <div class="text">
          <label class="title">{{$t('trans0144')}}</label>
          <label class="des">{{$t('trans0145')}}</label>
        </div>
        <div class="icon" v-if="type==='pppoe'">
          <img src="../.././assets/images/ic_select@1.5x.png" alt="" style="width:16px">
        </div>
      </div>
      <div class="item" @click="checkType('dhcp')">
        <div class="text">
          <label class="title">{{$t('trans0146')}}</label>
          <label class="des">{{$t('trans0147')}}</label>
        </div>
        <div class="icon" v-if="type==='dhcp'">
          <img src="../.././assets/images/ic_select@1.5x.png" alt="" style="width:16px">
        </div>
      </div>
      <div class="item" @click="checkType('static')">
        <div class="text">
          <label class="title">{{$t('trans0148')}}</label>
          <label class="des">{{$t('trans0149')}}</label>
        </div>
        <div class="icon" v-if="type==='static'">
          <img src="../.././assets/images/ic_select@1.5x.png" alt="" style="width:16px">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const config = this.routerConfig.getWan();
    return {
      type: config.type,
      option: {
        center: {
          text: this.$t('trans0142')
        }
      }
    };
  },
  methods: {
    checkType(type) {
      this.type = type;
      switch (type) {
        case 'pppoe':
          this.$router.replace('/pppoe');
          break;
        case 'dhcp':
          this.$router.replace('/dhcp');
          break;
        case 'static':
          this.$router.replace('/static-ip');
          break;
        default:
          break;
      }
      this.routerConfig.setWan(type);
    }
  }
};
</script>

<style lang="scss" type="text/scss" scoped>
.wan-hand-container {
  .message {
    font-size: 12px;
    text-align: left;
    color: rgb(108, 108, 108);
    background: rgb(250, 250, 250);
    border: 1px solid rgb(241, 241, 241);
    padding: 0.16rem 0.15rem;
  }
  .list {
    margin-top: 0.2rem;
    padding: 0 0.15rem;
  }
  .item {
    margin-top: 0.28rem;
    width: 100%;
    display: flex;
    align-items: center;
    &:active {
      background: rgb(0, 0, 0);
      opacity: 0.9;
    }
    .text {
      flex: 1;
      label {
        display: block;
      }
      :first-child {
        font-size: 0.14rem;
        color: rgb(51, 51, 51);
      }
      :last-child {
        font-size: 0.12rem;
        color: rgb(153, 153, 153);
        padding-top: 0.05rem;
      }
    }
    .icon {
      text-align: right;
      i {
        color: #d5b884;
      }
    }
  }
}
</style>
