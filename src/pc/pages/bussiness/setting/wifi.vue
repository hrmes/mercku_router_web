<template>
  <div class="setting-wifi-container">
    <div v-if="reboot">
      <m-progress :label="$t('trans0315')"></m-progress>
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
          <!-- <div class="item" style="margin-bottom:30px;">
              <m-select :label="$t('trans0111')" v-model="band" :options="options"></m-select>
            </div> -->
          <div class="check-info smart-connect">
            <div class="switch-container">
              <label for=""> {{$t('trans0397')}} </label>
              <div class="tool">
                <m-popover v-model='smartTipVisible' :title="this.$t('trans0397')" :content="this.$t('trans0398')" />
                <img width="14" src="../../../assets/images/ic_wifi_setting_question.png" alt="" @click="smartTipVisible=!smartTipVisible">
              </div>
              <m-switch v-model="form.smart_connect" />
            </div>
            <div class="ssid" v-if="!form.smart_connect">
              <div><span class="ssid-label">{{$t('trans0255')}}：</span><span class="ssid-name">{{form.ssid}}</span></div>
              <div><span class="ssid-label">{{$t('trans0256')}}：</span><span class="ssid-name">{{form.ssid}}_5G</span></div>
            </div>
          </div>
          <div class="check-info">
            <label for=""> {{$t('trans0110')}} </label>
            <div class="tool">
              <m-popover v-model='hideTipVisible' :title="this.$t('trans0110')" :content="this.$t('trans0325')" />
              <img width="14" src="../../../assets/images/ic_wifi_setting_question.png" alt="" @click="hideTipVisible=!hideTipVisible">
            </div>
            <m-switch v-model="form.hidden" />
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
import { getStringByte, passwordRule } from '../../../../util/util';

export default {
  data() {
    return {
      band: '2.4G5G',
      hideTipVisible: false,
      smartTipVisible: false,
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
        smart_connect: true,
        bands: {
          '2.4G': { enabled: true },
          '5G': { enabled: true }
        }
      },
      rules: {
        ssid: [
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          }
        ],
        password: [
          {
            rule: value => passwordRule.test(value),
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
            this.form.smart_connect = this.meshData.smart_connect;
          }
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
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
                        this.$router.push({ path: '/dashboard' });
                      },
                      ontimeout: () => {
                        this.$router.push({ path: '/unconnect' });
                      }
                    });
                  }
                })
                .catch(err => {
                  if (err.upgrading) {
                    return;
                  }
                  if (err && err.error) {
                    this.$toast(this.$t(err.error.code));
                  } else {
                    this.$router.push({ path: '/unconnect' });
                  }
                });
            }
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
      font-weight: bold;
    }
    .form {
      display: flex;
      justify-content: center;
      padding: 30px 0;
      .check-info {
        display: flex;
        align-items: center;
        position: relative;
        margin-bottom: 30px;
        &.smart-connect {
          flex-direction: column;
          align-items: flex-start;
          .ssid {
            width: 100%;
            margin-top: 20px;
            background-color: #fafafa;
            padding: 0 20px;
            div {
              padding: 10px 0;
              .ssid-label {
                width: 50px;
                display: inline-block;
              }
              &:first-child {
                border-bottom: 1px solid #f1f1f1;
              }
            }
          }
        }
        .switch-container {
          display: flex;
        }
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

