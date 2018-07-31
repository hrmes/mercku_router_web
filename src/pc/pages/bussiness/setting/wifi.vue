<template>
  <layout>
    <div class="setting-wifi-container">
      <div v-if="reboot">
        <m-proress :label="$t('trans0315')"></m-proress>
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
            <div class="item" style="margin-bottom:30px;">
              <m-select :label="$t('trans0111')" v-model="band" :options="options"></m-select>
            </div>
            <div class="check-info">
              <label for=""> {{$t('trans0110')}} </label>
              <div class="tool">
                <m-popover v-model='popShow' :title="this.$t('trans0110')" :content="this.$t('trans0325')" />
                <img width="14" src="../../../assets/images/ic_wifi_setting_question.png" alt="" @click="popIsShow">
              </div>
              <m-switch v-model="form.hidden" :onChange="changehandle" />
            </div>
            <div class="btn-info">
              <button class="btn" @click='submit()'>{{$t('trans0081')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Switch from '../../../component/switch/index.vue';
import mSelect from '../../../component/select/index.vue';
import Popover from '../../../component/popover/index.vue';
import Input from '../../../component/input/input.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Progress from '../../../component/progress/index.vue';
import Checkbox from '../../../component/checkbox/index.vue';
import layout from '../../../layout.vue';

export default {
  components: {
    'm-switch': Switch,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-input': Input,
    'm-proress': Progress,
    'm-checkbox': Checkbox,
    'm-popover': Popover,
    'm-select': mSelect,
    layout
  },
  data() {
    return {
      band: '2.4G5G',
      popShow: false,
      reboot: false,
      meshData: {},
      options: [
        {
          value: '2.4G5G',
          text: this.$t('trans0327'),
          bands: {
            '2.4G': { enabled: true },
            '5G': { enabled: true }
          }
        },
        {
          value: '2.4G',
          text: this.$t('trans0328'),
          bands: {
            '2.4G': { enabled: true },
            '5G': { enabled: false }
          }
        },
        {
          value: '5G',
          text: this.$t('trans0329'),
          bands: {
            '2.4G': { enabled: false },
            '5G': { enabled: true }
          }
        }
      ],
      form: {
        ssid: '',
        password: '',
        hidden: false,
        bands: {
          '2.4G': { enabled: true },
          '5G': { enabled: true }
        }
      },
      rules: {
        ssid: [
          {
            rule: value => /^.{1,20}$/g.test(value),
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
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
  computed: {
    combineBands() {
      const hash = {};
      this.options.forEach(v => {
        hash[v.value] = v.bands;
      });
      return hash;
    }
  },
  methods: {
    popIsShow() {
      this.popShow = !this.popShow;
    },
    bandsToStr(bands) {
      return Object.keys(bands)
        .map(v => bands[v].enabled)
        .join('');
    },
    splitBands(bands) {
      this.options.forEach(v => {
        if (this.bandsToStr(bands) === this.bandsToStr(v.bands)) {
          this.band = v.value;
        }
      });
    },
    getMeshMeta() {
      this.$loading.open();
      this.$http
        .getMeshMeta()
        .then(res => {
          this.$loading.close();
          if (res.data.result) {
            this.meshData = res.data.result;
            this.form.ssid = this.meshData.ssid;
            this.form.password = this.meshData.password;
            this.form.bands = this.meshData.bands;
            this.splitBands(this.meshData.bands);
            this.form.hidden = this.meshData.hidden;
          }
        })
        .catch(err => {
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    changehandle(v) {
      this.form.hidden = v;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$http
          .meshWifiUpdate({
            ...this.form,
            bands: this.combineBands[this.band]
          })
          .then(res => {
            if (res.status === 200) {
              this.reboot = true;
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/home' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/unconnect' });
                }
              });
            }
          })
          .catch(err => {
            if (err && err.error) {
              this.$toast(this.$t(err.error.code));
            } else {
              this.$router.push({ path: '/unconnect' });
            }
          });
      }
    }
  },
  mounted() {
    this.getMeshMeta();
  }
};
</script>
<style lang="scss" scoped>
.setting-wifi-container {
  flex: auto;
  padding: 0 2%;
  display: flex;
  .ssid-hidden {
    margin-bottom: 30px;
  }
  position: relative;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
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

      .btn-info {
        margin-top: 30px;
      }
      .check-info {
        display: flex;
        align-items: center;
        position: relative;
        label {
          margin-right: 2px;
          font-size: 14px;
          color: #333333;
        }
        .tool {
          position: relative;
          width: 30px;
          img {
            position: relative;
            top: -8px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-wifi-container {
    padding: 20px 16px;
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
            margin-right: 2px;
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

