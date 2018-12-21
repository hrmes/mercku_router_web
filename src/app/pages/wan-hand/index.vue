<template>
  <div class="wan-hand-container">
    <nav-bar :option="option" />
    <div class="message">{{$t('trans0143')}} </div>
    <div class="list">
      <div class="item"
           v-for="t in types"
           :key="t.value"
           @click="checkType(t.value)">
        <div class="text">
          <label class="title">{{$t(t.title)}}</label>
          <label class="des">{{$t(t.des)}}</label>
        </div>
        <div class="icon"
             v-if="type===t.value"></div>
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
      types: [
        {
          title: 'trans0144',
          des: 'trans0145',
          value: 'pppoe'
        },
        {
          title: 'trans0146',
          des: 'trans0147',
          value: 'dhcp'
        },
        {
          title: 'trans0148',
          des: 'trans0149',
          value: 'static'
        }
      ],
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
    font-size: 0.12rem;
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
      opacity: 0.7;
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
      width: 0.16rem;
      height: 0.16rem;
      background: url(../.././assets/images/ic_select.png) no-repeat;
      background-size: 100%;
    }
  }
}
</style>
