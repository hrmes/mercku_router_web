<template>
  <div class="wlan-page">
    <div class="header">
      {{$t('trans0222')}}
    </div>
    <div class="h1">
      {{$t('trans0167')}}
    </div>
    <div class="wlan-settings">
      <div class="ssid-container">
        <div class="ssid-input">
          <van-field v-model="ssid" :placeholder="$t('trans0168')" />
        </div>
        <div class="ssid-preview">
          <van-icon name="password-view" />
        </div>
      </div>
      <div class="pwd-container">
        <div class="pwd-input">
          <van-field v-model="pwd" :placeholder="$t('trans0003')" />
        </div>
        <div class="pwd-preview">
          <van-icon name="password-view" />
        </div>
      </div>
      <div class="check-container">
        <van-checkbox v-model="checked" shape="square">{{$t('trans0166')}}</van-checkbox>
      </div>
      <div class="adminpwd-container">
        <div class="adminpwd-input">
          <van-field v-model="adminPwd" :placeholder="$t('trans0067')" />
        </div>
        <div class="adminpwd-preview">
          <van-icon name="password-view" />
        </div>
      </div>
    </div>
    <div class="button-container">
      <van-button>{{$t('trans0018')}}</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      ssid: '',
      pwd: '',
      adminPwd: ''
    };
  }
};
</script>
<style lang="scss" scoped>
.wlan-page {
  .header {
    height: 0.44rem;
    line-height: 0.44rem;
    font-size: 0.16rem;
    color: rgb(213, 184, 132);
    text-align: center;
  }
  .h1 {
    background: #000;
    color: rgb(124, 124, 124);
    padding: 0.16rem 0 0.16rem 0.2rem;
  }
  .wlan-settings {
    padding: 0 0.2rem;
    .ssid-container,
    .pwd-container,
    .adminpwd-container,
    .check-container {
      margin-top: 0.35rem;
      position: relative;
      .ssid-input,
      .pwd-input,
      .adminpwd-input {
        width: 100%;
        padding-right: 20px;
        box-sizing: border-box;
      }
      .ssid-preview,
      .pwd-preview,
      .adminpwd-preview {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        width: 0.2rem;
        text-align: center;
      }
    }
  }
  .button-container {
    text-align: center;
    margin-top: 2rem;
  }
}
</style>
