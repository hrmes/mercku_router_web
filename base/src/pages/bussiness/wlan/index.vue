<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :option="stepOption"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item step-item1"
           v-show="stepOption.current===0">
        <m-form ref="wifiForm"
                :model="wifiForm"
                :rules="wifiFormRules">
          <m-form-item class="form-item"
                       prop="smart_connect">
            <m-switch :label="$t('trans0397')"
                      @change="changeSmartConnect"
                      v-model="wifiForm.smart_connect" />
            <div class="tip-label">{{$t('trans0398')}}</div>
          </m-form-item>
          <div class="form-header"
               v-if="!wifiForm.smart_connect">
            <img class="form-header__img"
                 :src="wifiIcon"
                 alt="">
            <span class="form-header__title">{{$t('trans0677')}}</span>
          </div>
          <m-form-item class="form-item"
                       prop="ssid24g">
            <m-input :label="$t('trans0168')"
                     :placeholder="$t('trans0321')"
                     v-model="wifiForm.ssid24g"
                     :onBlur="onSsid24gChange" />
          </m-form-item>
          <m-form-item class="form-item"
                       :class="{
            'is-smart-connect': !wifiForm.smart_connect
          }"
                       prop="password24g">
            <m-input :label="$t('trans0172')"
                     type="password"
                     :placeholder="$t('trans0321')"
                     v-model="wifiForm.password24g" />
          </m-form-item>
          <template v-if="!wifiForm.smart_connect">
            <div class="form-header">
              <img class="form-header__img"
                   :src="wifiIcon"
                   alt="">
              <span class="form-header__title">{{$t('trans0679')}}</span>
            </div>
            <m-form-item class="form-item"
                         prop="ssid5g"
                         ref="ssid5g">
              <m-input :label="$t('trans0168')"
                       :placeholder="$t('trans0321')"
                       v-model="wifiForm.ssid5g" />
            </m-form-item>
            <m-form-item class="form-item"
                         prop="password5g">
              <m-input :label="$t('trans0172')"
                       type="password"
                       :placeholder="$t('trans0321')"
                       v-model="wifiForm.password5g" />
            </m-form-item>
          </template>
          <div class="button-container">
            <button @click="step1()"
                    class="btn">{{$t('trans0055')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item step-item3"
           v-show="stepOption.current===1">
        <m-loading :color="loadingColor"
                   :size="36"></m-loading>
        <p class="cutdown">{{countdown}}s</p>
        <div class="tip"
             style="margin-top:5px;">{{$t('trans0294')}}</div>
        <div class="info info-pw">
          <div class="info__row">
            <span class="info__title">{{$t('trans0561')}}</span>:
            <span class="info__value">{{wifiForm.password24g}}</span>
          </div>
        </div>
        <div class="tip tip-setting">{{tipsText}}</div>
        <div class="form-header"
             v-if="!wifiForm.smart_connect">
          <img class="form-header__img"
               :src="wifiIcon"
               alt="">
          <span class="form-header__title">{{$t('trans0677')}}</span>
        </div>
        <div class="info">
          <div class="info__row">
            <span class="info__title">{{$t('trans0168')}}</span>:
            <span class="info__value">{{wifiForm.ssid24g}}</span>
          </div>
          <div class="info__row">
            <span class="info__title">{{$t('trans0172')}}</span>:
            <span class="info__value">{{wifiForm.password24g}}</span>
          </div>
        </div>
        <div class="form-header"
             v-if="!wifiForm.smart_connect">
          <img class="form-header__img"
               :src="wifiIcon"
               alt="">
          <span class="form-header__title">{{$t('trans0679')}}</span>
        </div>
        <div class="info"
             v-if="!wifiForm.smart_connect">
          <div class="info__row">
            <span class="info__title">{{$t('trans0168')}}</span>:
            <span class="info__value">{{wifiForm.ssid5g}}</span>
          </div>
          <div class="info__row">
            <span class="info__title">{{$t('trans0172')}}</span>:
            <span class="info__value">{{wifiForm.password5g}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Bands } from '../../../util/constant';
import wifiIcon from '../../../assets/images/icon/ic_wifi@2x.png';
import { getStringByte, isValidPassword, isFieldHasComma } from '../../../util/util';

export default {
  data() {
    return {
      wifiIcon,
      stepOption: {
        current: 0,
        steps: [
          { text: this.$t('trans0019'), success: true },
          { text: this.$t('trans0018'), success: false }
        ]
      },
      current: 0,
      countdown: 60,
      wifiForm: {
        smart_connect: true,
        ssid24g: '',
        password24g: '',
        ssid5g: '',
        password5g: ''
      },
      wifiFormRules: {
        ssid24g: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          }
        ],
        password24g: [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isValidPassword(value),
            message: this.$t('trans0169')
          }
        ],
        ssid5g: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: () => this.validateSsid5G(),
            message: this.$t('trans0660')
          }
        ],
        password5g: [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isValidPassword(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  computed: {
    tipsText() {
      return this.wifiForm.smart_connect ? this.$t('trans0922') : this.$t('trans0921');
    }
  },
  mounted() {
    this.$http
      .login(
        { password: '' },
        {
          hideToast: true
        }
      )
      .catch(() => {
        // password is not empty, go to login page
        this.$router.push({ path: '/login' });
      });
    this.$http.getMeshMeta().then(res => {
      const wifi = res.data.result;
      const b24g = wifi.bands[Bands.b24g];
      const b5g = wifi.bands[Bands.b5g];
      this.wifiForm.ssid24g = b24g.ssid;
      this.wifiForm.password24g = b24g.password;
      this.wifiForm.ssid5g = b5g.ssid;
      this.wifiForm.password5g = b5g.password;
      this.wifiForm.smart_connect = wifi.smart_connect;
    });
  },
  methods: {
    onSsid24gChange() {
      if (this.$refs.ssid5g && this.wifiForm.ssid5g) {
        this.$refs.ssid5g.extraValidate(this.validateSsid5G, this.$t('trans0660'));
      }
    },
    validateSsid5G() {
      if (!this.wifiForm.smart_connect && this.wifiForm.ssid24g) {
        return this.wifiForm.ssid24g !== this.wifiForm.ssid5g;
      }
      return true;
    },
    changeSmartConnect(v) {
      // 开关变化后
      if (v) {
        this.wifiForm.ssid5g = this.wifiForm.ssid24g;
        this.wifiForm.password24g = '';
        this.wifiForm.password5g = this.wifiForm.password24g;
      } else {
        this.wifiForm.ssid5g = `${this.wifiForm.ssid24g}_5G`;
        this.wifiForm.password24g = '';
        this.wifiForm.password5g = '';
      }
    },
    step0() {
      this.stepOption.current = 0;
      this.stepOption.steps[0].success = true;
    },
    step1() {
      if (this.$refs.wifiForm.validate()) {
        if (this.wifiForm.smart_connect) {
          this.wifiForm.password5g = this.wifiForm.password24g;
        }
        // 提交表单
        this.$http
          .updateMeshConfig({
            config: {
              wifi: {
                bands: {
                  '2.4G': {
                    ssid: this.wifiForm.ssid24g,
                    password: this.wifiForm.password24g
                  },
                  '5G': {
                    ssid: this.wifiForm.ssid5g,
                    password: this.wifiForm.password5g
                  }
                },
                smart_connect: this.wifiForm.smart_connect
              },
              admin: { password: this.wifiForm.password24g }
            }
          })
          .then(() => {
            this.stepOption.current = 1;
            this.stepOption.steps[1].success = true;
            const timer = setInterval(() => {
              this.countdown -= 1;
              if (this.countdown === 0) {
                clearInterval(timer);
                this.$router.push({ path: '/unconnect' });
              }
            }, 1000);
            // 尝试链接路由器
            this.$reconnect({
              onsuccess: () => {
                clearInterval(timer);
                this.$router.push({ path: '/login' });
              },
              ontimeout: () => {
                clearInterval(timer);
                this.$router.push({ path: '/unconnect' });
              },
              showLoading: false
            });
          })
          .catch(() => {
            this.stepOption = {
              current: 0,
              steps: [
                { text: this.$t('trans0019'), success: true },
                { text: this.$t('trans0018'), success: false }
              ]
            };
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wlan-container {
  width: 100%;
  flex: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .step {
    text-align: center;
    width: 340px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .step-content {
    margin: 80px 0;
    text-align: center;
    .step-item {
      display: inline-block;
      width: 340px;
      text-align: center;
      &.step-item1 {
        .tip-label {
          font-size: 12px;
          color: #999;
          margin-top: 14px;
          max-width: 340px;
          border-bottom: 1px solid #ebebeb;
          padding-bottom: 20px;
        }
        .form-item {
          text-align: left;
        }
        .is-smart-connect {
          margin-bottom: 40px;
        }
        .button-container {
          margin-top: 60px;
        }
      }
      &.step-item3 {
        .cutdown {
          color: $primaryColor;
          font-size: 24px;
          margin: 10px 0;
        }
        .tip {
          font-size: 12px;
          &.tip-setting {
            margin-top: 10px;
            text-align: left;
          }
        }
        .tip-setting {
        }
        .info {
          padding: 15px 20px;
          font-size: 14px;
          color: #333;
          border-radius: 5px;
          background-color: #f1f1f1;
          margin-top: 7px;
          &.info-pw {
            margin-top: 30px;
          }
          .info__row {
            text-align: left;
            & + .info__row {
              margin-top: 10px;
            }
          }
          .info__title {
            font-weight: bold;
          }
          .info__value {
            margin-left: 10px;
          }
        }
        .form-header {
          margin-top: 20px;
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }
      }
      .button-container {
        margin-top: 60px;
        display: flex;
        button {
          display: inline-block;
          flex: 1;
          margin-right: 20px;
          width: auto;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .form-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 10px;
      margin-bottom: 20px;
      .form-header__img {
        width: 16px;
        margin-right: 10px;
      }
      .form-header__title {
        color: #999;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .wlan-container {
    position: static;
    overflow: hidden;
    padding: 20px 16px;
    .step {
      width: 100%;
      margin-top: 40px;
    }
    .step-content {
      margin: 40px auto 0 auto;
      width: 100%;
      .step-item {
        display: block;
        width: 100%;
      }
    }
    .button-container {
      margin-top: 10px;
      button {
        &:last-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
