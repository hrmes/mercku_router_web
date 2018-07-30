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
    line-height: 1.8;
    font-size: 0.12rem;
    text-align: left;
    color: rgb(124, 124, 124);
    background: rgb(0, 0, 0);
    padding: 0.1rem 0.15rem;
  }
  .list {
    margin-top: 0.2rem;
  }
  .item {
    height: 0.8rem;
    width: 100%;
    display: table;
    &:active {
      background: rgb(0, 0, 0);
      opacity: 0.9;
    }
    .text {
      display: table-cell;
      overflow: hidden;
      vertical-align: middle;
      padding-left: 0.15rem;
      label {
        display: block;
      }
      :first-child {
        font-size: 0.14rem;
        color: rgb(182, 182, 182);
      }
      :last-child {
        font-size: 0.12rem;
        color: rgb(124, 124, 124);
        padding-top: 0.05rem;
      }
    }
    .icon {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      padding-right: 0.15rem;
      i {
        color: #d5b884;
      }
    }
  }
}
</style>
