<template>
  <div class="setting-safe-container">
    <div class="content">
      <div class='w-header'>
        {{$t('')}} 修改管理密码
      </div>
      <div class='form'>
        <div class='input-info'>
          <label for="" class="title"> {{$t('trans0117')}}</label>
          <m-input type='password' :placeholder="`${$t('trans0321')}`"></m-input>
          <label for="" class="title">{{$t('trans0113')}}</label>
          <m-input type='password' :placeholder="`${$t('trans0321')}`"></m-input>
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
.setting-safe-container {
  position: relative;
  padding: 0 30px;

  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;

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
      display: flex;
      justify-content: center;
      padding-bottom: 30px;
      flex-direction: column;
      align-items: center;
      .title {
        display: block;
        font-size: 14px;
        color: #333333;
        margin-top: 30px;
        margin-bottom: 10px;
      }

      .btn-info {
        margin-top: 40px;
        display: block;
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
  .setting-safe-container {
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
        // padding: 0 20px;
        .input-info {
          width: 100%;
        }
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
          width: 100%;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

