<template>
  <div class="setting-wifi-container">
    <div class="content">
      <div class='header'>
        {{$t('trans0167')}}
      </div>
      <div class='form'>
        <label for="" class="title"> {{$t('trans0168')}}</label>

        <m-input type='text' :placeholder="`${$t('trans0321')}${$t('trans0168')}`"></m-input>
        <!-- <input type="text" /> -->

        <label for="" class="title">{{$t('trans0172')}}</label>

        <m-input type='password' :placeholder="`${$t('trans0321')}${$t('trans0168')}`"></m-input>
        <!-- <input :type="isPsd?'password':'text'" :placeholder="`${$t('trans0321')}${$t('trans0172')}`" class="psd-input" />
          <span class='psd-icon'>
            <i :class="isPsd?'is-psd':'no-psd'" @click="showPsd()"></i>
          </span> -->

        <div class="check-info">
          <label for=""> {{$t('trans0255')}}</label>
          <m-switch></m-switch>
          <label for="" style="margin-left:40px"> {{$t('trans0256')}}</label>
          <m-switch></m-switch>
        </div>
        <div class="btn-info">
          <button class="btn">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import Switch from '../../../component/switch/index.vue';
import Input from '../../../component/input/input.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-input': Input
  },
  data() {
    return {
      isPsd: true
    };
  },
  methods: {
    showPsd() {
      this.isPsd = !this.isPsd;
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-wifi-container {
  position: relative;
  padding: 0 30px;
  height: 100%;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    height: 95%;
    position: relative;
    .header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .form {
      position: absolute;
      right: 50%;
      transform: translateX(50%);
      .input-box {
        width: 350px;
        height: 50px;
        border: 1px solid #b6b6b6;
        position: relative;
        margin-top: 10px;
        border-radius: 3px;
        box-sizing: border-box;
        input {
          margin: 1px;
          height: 46px;
          width: 346px;
          border: none;
          font-size: 16px;
          outline: none;
          padding-left: 10px;
          position: relative;
        }
      }
      .title {
        display: inline-block;
        font-size: 14px;
        color: #333333;
        margin-top: 30px;
      }

      .psd-input {
        width: 286px !important;
      }
      .psd-icon {
        display: inline-block;
        width: 54px;
        text-align: center;
        .is-psd {
          display: inline-block;
          cursor: pointer;
          width: 20px;
          height: 14px;
          background: url('../../../assets/images/ic_invisible.png');
        }
        .no-psd {
          display: inline-block;
          cursor: pointer;
          width: 20px;
          height: 12px;
          background: url('../../../assets/images/ic_visible.png');
        }
      }
      .btn-info {
        margin-top: 40px;
      }
      .check-info {
        display: flex;
        align-items: center;
        margin-top: 30px;
        label {
          margin-right: 10px;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-wifi-container {
    padding: 10px;
    .content {
      .form {
      }
    }
  }
}
</style>

