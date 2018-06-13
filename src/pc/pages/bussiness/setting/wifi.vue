<template>
  <div class="setting-wifi-container">
    <div v-if="reboot">
      <m-proress></m-proress>
    </div>
    <div class="content">
      <div class='w-header'>
        {{$t('trans0167')}}
      </div>
      <div class='form'>
        <div class='input-info'>
          <m-form ref="form" :model="form" :rules='rules'>
            <m-form-item class="item" prop='ssid'>
              <m-input v-model="form.ssid" :label="$t('trans0168')" type='text' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item class="item" prop='password'>
              <m-input v-model="form.password" :label="$t('trans0172')" type='password' :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
          </m-form>
          <div class="ssid-hidden">
            <m-checkbox v-model='hidden' :text="$t('trans0111')"></m-checkbox>
          </div>
          <div class="check-info">
            <label for=""> {{$t('trans0255')}}</label>
            <m-switch v-model="band1" :onChange="changeband1" />
            <label for="" style="margin-left:40px"> {{$t('trans0256')}}</label>
            <m-switch v-model="band2" :onChange="changeband2" />
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
import Progress from '../../../component/progress/index.vue';
import Checkbox from '../../../component/checkbox/index.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-input': Input,
    'm-proress': Progress,
    'm-checkbox': Checkbox
  },
  data() {
    return {
      band1: true,
      band2: true,
      reboot: false,
      hidden: false,
      meshData: {},
      form: {
        ssid: '',
        password: '',
        bands: {
          '2.4G': { enabled: true },
          '5G': { enabled: true }
        }
      },
      rules: {
        ssid: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => /^.{1,20}$/g.test(value),
            message: this.$t('trans0261')
          }
        ],
        password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0228') },
          {
            rule: value => /^[a-zA-Z0-9]{8,24}$/g.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  methods: {
    getMeshData() {
      this.$loading.open();
      this.$http
        .getMeshData()
        .then(res => {
          this.$loading.close();
          if (res.data.result) {
            this.meshData = res.data.result;
            this.form.ssid = this.meshData.ssid;
            this.form.password = this.meshData.password;
            this.band1 = this.meshData.bands['2.4G'].enabled;
            this.band2 = this.meshData.bands['5G'].enabled;
            this.hidden = this.meshData.hidden;
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    changeband1(v) {
      if (v === false) {
        this.band2 = true;
      }
    },
    changeband2(v) {
      if (v === false) {
        this.band1 = true;
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$http
          .update({
            wifi: {
              ...this.form,
              bands: {
                '2.4G': { enabled: this.band1 },
                '5G': { enabled: this.band2 }
              }
            }
          })
          .then(res => {
            if (res.status === 200) {
              this.reboot = true;
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/home' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/disappear' });
                }
              });
            }
          })
          .catch(err => {
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$router.push({ path: '/disappear' });
            }
          });
      }
    }
  },
  mounted() {
    this.getMeshData();
  }
};
</script>
<style lang="scss" scoped>
.setting-wifi-container {
  .ssid-hidden {
    margin-bottom: 10px;
  }
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
      padding: 30px 0;
      .item {
        // margin-bottom: 20px;
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

