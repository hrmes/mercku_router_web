<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0167')}}
    </div>
    <div class="page-content">
      <div class='form'>
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
        <div class="form-item">
          <button class="btn" @click='submit()'>{{$t('trans0081')}}</button>
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
        smart_connect: false,
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
        .catch(() => {
          this.$loading.close();
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
                .then(() => {
                  this.$reconnect({
                    onsuccess: () => {
                      this.$router.push({ path: '/dashboard' });
                    },
                    ontimeout: () => {
                      this.$router.push({ path: '/unconnect' });
                    }
                  });
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
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
@media screen and (max-width: 768px) {
  .form {
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
  }
}
</style>

