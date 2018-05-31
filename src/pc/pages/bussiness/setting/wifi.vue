<template>
  <div class="setting-wifi-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0167')}}
      </div>
      <div class='form'>
        <div class='input-info'>
          <m-form :model="form" :rules='rules'>
            <m-form-item class="item" prop='ssid'>
              <m-input :label="$t('trans0168')" type='text' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item class="item" prop='password'>
              <m-input :label="$t('trans0172')" type='password' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
          </m-form>
          <div class="check-info">
            <label for=""> {{$t('trans0255')}}</label>
            <m-switch></m-switch>
            <label for="" style="margin-left:40px"> {{$t('trans0256')}}</label>
            <m-switch></m-switch>
          </div>
          <div class="btn-info">
            <button class="btn" @click='submit()'>{{$t('trans0081')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Switch from '../../../component/switch/index.vue';
import Input from '../../../component/input/input.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-input': Input
  },
  data() {
    return {
      isPsd: true,
      form: {
        ssid: '123',
        password: '12323'
      },
      rules: [
        {
          ssid: { require: true }
        }
      ]
    };
  },
  methods: {
    showPsd() {
      this.isPsd = !this.isPsd;
    },
    submit() {
      console.log(this.form);
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-wifi-container {
  position: relative;
  padding: 0 30px;
  // height: 100%;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    // height: 95%;
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
      padding: 50px 0;
      .item {
        margin-bottom: 20px;
      }

      .btn-info {
        margin-top: 40px;
      }
      .check-info {
        display: flex;
        align-items: center;
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
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

