<template>
  <div class="setting-wifi-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0167')}}
      </div>
      <div class='form'>
        <div class='input-info'>
          <label for="" class="title"> {{$t('trans0168')}}</label>
          <m-input type='text' :placeholder="`${$t('trans0321')}`"></m-input>
          <label for="" class="title">{{$t('trans0172')}}</label>
          <m-input type='password' :placeholder="`${$t('trans0321')}`"></m-input>
        </div>
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
    .w-header {
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
      .title {
        display: inline-block;
        font-size: 14px;
        color: #333333;
        margin-top: 30px;
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
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .form {
        width: 100%;
        padding: 0 20px;
        .title {
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .check-info {
          display: flex;
          align-items: center;
          margin-top: 20px;
          label {
            margin-right: 10px;
            font-size: 16px;
            color: #333333;
          }
        }
        .btn-info {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

