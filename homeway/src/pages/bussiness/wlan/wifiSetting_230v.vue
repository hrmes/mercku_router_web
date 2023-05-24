<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :option="stepOption"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item step-item1"
           v-if="stepOption.current===0">
        <m-form ref="upperApForm"
                class="upper-form"
                :model="upperApForm"
                :rules="upperApFormRules">
          <m-form-item class="form-item"
                       prop="upperApForm.ssid">
            <m-loadingSelect label="SSID"
                             :placeholder="$t('trans1069')"
                             type='text'
                             v-model="upperApForm.ssid"
                             @change="selectedChange"
                             @scanApclient="startApclientScan"
                             :options="processedUpperApList"
                             :loading="selectIsLoading"
                             :loadingText="loadingText" />
          </m-form-item>
          <m-form-item v-show="!pwdDisabled"
                       class="form-item"
                       prop="upperApForm.password">
            <m-input :label="$t('trans0003')"
                     type="password"
                     :placeholder="$t('trans0321')"
                     v-model="upperApForm.password" />
          </m-form-item>
          <div class="button-container">
            <button @click="connectUpperAp('initialization')"
                    :disabled="saveDisable"
                    class="btn">{{$t('trans0969')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item step-item2"
           v-if="stepOption.current===1">
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
            <button v-if="isLoading"
                    class="btn disabled">
              <m-loading :color="'#fff'"
                         :size="24"></m-loading>
            </button>
            <button v-else
                    @click="step3()"
                    class="btn">{{$t('trans0055')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item step-item3"
           v-if="stepOption.current===2">
        <m-loading :color="loadingColor"
                   :size="36"></m-loading>
        <p class="cutdown">{{$t('trans0294')}}{{countdown}}s</p>
        <div class="tip"
             style="margin-top:5px;">{{$t('trans0171')}}</div>
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
import {
  getStringByte,
  isFieldHasComma,
  isFieldHasSpaces,
  isValidPassword
} from 'base/util/util';
import { Bands, WanNetStatus } from 'base/util/constant';
import wifiIcon from '@/assets/images/icon/ic_wifi@2x.png';
import SettingUpperAp from '@/mixins/setting-upperAp';

// Homeway_230v有两种工作模式，可以切换，所在初始化的时候，根据用户需求要做对应设置，要做区分等
// 插入网线有线桥模式才可用，同时我们会检测是否有外网来提示用户是否进行有线桥模式切换
// 如果出现了有线桥可用弹窗，用户点击设置为有线桥，初始化走有线桥模式，如果用户点击了不设置为有线桥，则初始化流程就走无线桥模式

const HomewayWorkModel = {
  wirelessBridge: 'wireless_bridge',
  bridge: 'bridge'
};

export default {
  mixins: [SettingUpperAp],
  data() {
    return {
      wifiIcon,
      isLoading: false,
      meshMode: HomewayWorkModel.wirelessBridge,
      stepOption: {
        current: 0,
        steps: [
          { text: this.$t('trans1052'), success: true },
          { text: this.$t('trans0103'), success: false },
          { text: this.$t('trans0018'), success: false }
        ]
      },
      current: 0,
      countdown: 120,
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
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
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
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isValidPassword(value),
            message: this.$t('trans0169')
          }
        ]
      },
      config: null,
    };
  },
  computed: {
    tipsText() {
      return this.wifiForm.smart_connect ? this.$t('trans0922') : this.$t('trans0921');
    }
  },
  mounted() {
    this.$http
      .login({ password: '' }, { hideToast: true })
      .then(() => {
        this.getWanStatus();
        this.getMeshMeta();
      })
      .catch(() => {
        // // password is not empty, go to login page
        this.$router.push({ path: '/login' });
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
    getMeshMeta() {
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
    skipSetUpper() {
      this.meshMode = HomewayWorkModel.bridge;
      this.stepOption.current = 1;
      this.stepOption.steps[1].success = true;
    },
    getWanStatus() {
      this.$http
        .getWanStatus()
        .then(res => {
          console.log(res);
          const { status } = res.data.result;
          if (status !== WanNetStatus.unlinked) {
            // 如果插入了网线，就弹窗提示，可跳过上级设置
            this.$dialog.confirm({
              okText: this.$t('trans0163'),
              cancelText: this.$t('trans1055'),
              message: [this.$t('trans1053'), this.$t('trans1054')],
              callback: {
                ok: () => {
                  this.skipSetUpper();
                },
                cancel: () => {
                  this.meshMode = HomewayWorkModel.wirelessBridge;
                }
              }
            });
          }
        })
        .catch(() => {
          this.startApclientScan();
        });
    },
    step3() {
      if (this.$refs.wifiForm.validate()) {
        this.isLoading = true;
        if (this.wifiForm.smart_connect) {
          this.wifiForm.password5g = this.wifiForm.password24g;
        }
        this.config = {
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
          admin: { password: this.wifiForm.password24g },
          mode: this.meshMode,
        };
        console.log('MeshMode is', this.meshMode);
        console.log('Config is', this.config);
        // 提交表单;
        this.$http.updateMeshConfig({ config: this.config })
          .then(() => {
            this.stepOption.current = 2;
            this.stepOption.steps[2].success = true;
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
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
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
      &.step-item2 {
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
          .loading-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              margin-left: 5px;
            }
          }
        }
      }
      &.step-item3 {
        .cutdown {
          color: $primaryColor;
          font-size: 16px;
          margin: 10px 0;
        }
        .tip {
          font-size: 12px;
          &.tip-setting {
            margin-top: 15px;
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
          margin-top: 15px;
          &.info-pw {
            margin-top: 20px;
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
  .upper-form {
    height: 300px;
  }
}
@media screen and(max-width: 768px) {
  .wlan-container {
    position: static;
    overflow: hidden;
    padding: 20px 16px;
    .step {
      width: 95%;
      margin-top: 25px;
    }
    .step-content {
      margin: 65px auto 0 auto;
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
