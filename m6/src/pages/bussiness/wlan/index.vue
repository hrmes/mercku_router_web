<template>
  <div class="wlan">
    <div class="step-content">
      <div class="row-1">
        <div class="col-1"
             v-if="!isMobile">
          <img :src="WlanImg">
        </div>
        <div class="col-2">
          <div class="step-item step-item1"
               v-if="stepOption.current===0">
            <m-form ref="wifiForm"
                    :model="wifiForm"
                    :rules="wifiFormRules">
              <p class="step-tips">{{$t('trans0167').toUpperCase()}}</p>
              <div class="card-wrapper">
                <m-form-item prop="smart_connect">
                  <m-switch :label="$t('trans0397')"
                            @change="changeSmartConnect"
                            v-model="wifiForm.smart_connect" />
                  <div class="tip-label">{{$t('trans0398')}}</div>
                </m-form-item>
              </div>
              <div class="card-wrapper">
                <div class="form-header">
                  <span class="form-header__title">
                    {{ wifiForm.smart_connect?'Wi-Fi':$t('trans0677')}}
                  </span>
                </div>
                <div class="form-content">
                  <m-form-item prop="ssid24g">
                    <m-input :label="$t('trans0168')"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.ssid24g"
                             :onBlur="onSsid24gChange" />
                  </m-form-item>
                  <m-form-item prop="password24g">
                    <m-input :label="$t('trans0172')"
                             type="password"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.password24g" />
                  </m-form-item>
                </div>
              </div>
              <transition name="fade">
                <template v-if="!wifiForm.smart_connect">
                  <div class="card-wrapper">
                    <div class="form-header">
                      <span class="form-header__title">{{$t('trans0679')}}</span>
                    </div>
                    <div class="form-content">
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
                    </div>

                  </div>
                </template>
              </transition>
            </m-form>
          </div>
          <div class="step-item step-item2"
               v-if="stepOption.current===1">
            <m-lottie-loading class="configing-loading"
                              :size="160"
                              id="config-loading" />
            <p class="cutdown">{{$t('trans0294')}}{{countdown}}s</p>
            <div class="tip"
                 style="margin-top:5px;">
              {{$t('trans0171')}}
            </div>
            <div class="info-container">
              <div class="info info-pw">
                <div class="info__row">
                  <div class="info__title">{{$t('trans0561')}}:</div>
                  <div class="info__value">{{wifiForm.password24g}}</div>
                </div>
              </div>
            </div>
            <div class="tip tip-setting">{{tipsText}}</div>
            <div class="info-container wifi-24g">
              <div class="form-header"
                   v-if="wifiForm.smart_connect">
                <span class="form-header__title">{{$t('trans0168')}}:</span>
              </div>
              <div class="info">
                <div class="info__row">
                  <div v-if="!wifiForm.smart_connect"
                       class="info__title">{{$t('trans0923')}}:</div>
                  <div class="info__value">{{wifiForm.ssid24g}}</div>
                </div>
                <div class="info__row">
                  <div class="info__title">{{$t('trans0172')}}:</div>
                  <div class="info__value">{{wifiForm.password24g}}</div>
                </div>
              </div>
            </div>
            <div v-if="!wifiForm.smart_connect"
                 class="info-container wifi-5g">
              <div class="info">
                <div class="info__row">
                  <div class="info__title">{{$t('trans0924')}}:</div>
                  <div class="info__value">{{wifiForm.ssid5g}}</div>
                </div>
                <div class="info__row">
                  <div class="info__title">{{$t('trans0172')}}:</div>
                  <div class="info__value">{{wifiForm.password5g}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="button-container"
             v-if="stepOption.current===0">
          <div v-if="isLoading">
            <m-loading :size="28"
                       id="btnLoading"></m-loading>
          </div>
          <button v-else
                  @click="step1()"
                  class="btn">{{ $t('trans0055')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Bands } from 'base/util/constant';
import { WlanImg } from 'base/assets/images/base64-img/img.js';
import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
} from 'base/util/util';

export default {
  data() {
    return {
      WlanImg,
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
      isLoading: false,
      wifiFormRules: {
        ssid24g: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: () => this.validateSsid5G(),
            message: this.$t('trans0660')
          }
        ],
        password24g: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
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
            message: this.$t('trans0232')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: () => this.validateSsid5G(),
            message: this.$t('trans0660')
          }
        ],
        password5g: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
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
      }
    };
  },
  computed: {
    tipsText() {
      return this.wifiForm.smart_connect
        ? this.$t('trans0922')
        : this.$t('trans0921');
    },
    isMobile() {
      return this.$store.state.isMobile;
    }
  },
  mounted() {
    this.authorize();
  },
  methods: {
    authorize() {
      this.$loading.open();
      this.$http
        .login(
          { password: '' },
          {
            hideToast: true
          }
        )
        .then(() => {
          this.getMesh();
        })
        .catch(() => {
          // password is not empty, go to login page
          this.$router.push({ path: '/login' });
          this.$loading.close();
        });
    },
    getMesh() {
      this.$http
        .getMeshMeta()
        .then(res => {
          const wifi = res.data.result;
          const b24g = wifi.bands[Bands.b24g];
          const b5g = wifi.bands[Bands.b5g];
          this.wifiForm.ssid24g = b24g.ssid;
          this.wifiForm.password24g = b24g.password;
          this.wifiForm.ssid5g = b5g.ssid;
          this.wifiForm.password5g = b5g.password;
          this.wifiForm.smart_connect = wifi.smart_connect;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    onSsid24gChange() {
      if (this.$refs.ssid5g && this.wifiForm.ssid5g) {
        this.$refs.ssid5g.extraValidate(
          this.validateSsid5G,
          this.$t('trans0660')
        );
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
      } else {
        this.wifiForm.ssid5g = `${this.wifiForm.ssid24g}_5G`;
      }
      this.wifiForm.password5g = this.wifiForm.password24g;
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
        this.isLoading = true;
        // 提交表单
        this.$http
          .updateRouterInitialize({
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
              admin: { password: this.wifiForm.password24g },
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
          .finally(() => {
            this.isLoading = false;
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wlan {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 940px;
  padding: 70px 30px 70px;
  .step-content {
    display: grid;
    grid-template-rows: 1fr 10%;
    grid-template-columns: 100%;
    width: 100%;
    height: 100%;
    text-align: center;
    background: var(--common_card-bgc);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--common_card-boxshadow);
    .row-1 {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 1fr 1.05fr;
      .col-1 {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10% 0 25%;
        > img {
          width: 100%;
          aspect-ratio: 1;
        }
      }
      .col-2 {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5% 3% 1% 0;
      }
    }
    .row-2 {
      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-top: 1px solid var(--wlan_hr-color);
        > button {
          width: 240px;
        }
      }
    }
    .step-item {
      height: 100%;
      &.step-item1 {
        width: 100%;
        text-align: center;
        padding-left: 3%;
        .mk-form {
          width: 100%;
          max-width: 700px;
          min-width: 530px;
          margin: 0 auto;
        }
        .tip-label {
          font-size: 12px;
          color: var(--text_gery-color);
          margin-top: 10px;
        }
        .form-item {
          text-align: left;
          margin-bottom: 0px;
        }
        .is-smart-connect {
          margin-bottom: 40px;
        }
        .form-header {
          &::before {
            content: '';
            display: block;
            width: 6px;
            height: 24px;
            background: #808080;
            margin-right: 10px;
          }
        }
        .form-content {
          display: grid;
          grid-template-rows: 100%;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 10px;
          width: 100%;
          height: fit-content;
          margin-bottom: 18px;
          .input-container {
            width: 100%;
          }
        }
        .region-grid {
          display: grid;
          grid-template-rows: 100%;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 10px;
          width: 100%;
          .select-container {
            width: inherit;
          }
        }
      }
      &.step-item2 {
        width: 355px;
        .configing-loading {
          margin: 0 auto;
        }
        .cutdown {
          color: var(--primary-color);
          font-size: 16px;
          margin: 10px 0;
        }
        .tip {
          font-size: 12px;
          word-break: keep-all;
          &.tip-setting {
            margin: 10px 0 15px;
            text-align: left;
            color: var(--wlan_tips-color);
          }
        }
        .info-container {
          border-radius: 7px;
          padding: 10px 15px;
          margin-top: 20px;
          background: var(--common_sub_card-bgc);
        }
        .info {
          font-size: 14px;
          border-radius: 5px;
          margin-top: 7px;
          .info__row {
            text-align: left;
            & + .info__row {
              margin-top: 10px;
            }
          }
          .info__title {
            font-size: 12px;
            margin-bottom: 5px;
            color: var(--text_gery-color);
          }
          .info__value {
            font-size: 14px;
            font-weight: 600;
            // white-space: pre;
          }
        }
        .form-header {
          padding-bottom: 0;
          margin-bottom: 0;
          .form-header__title {
            font-size: 12px;
            font-weight: 400;
          }
        }
        .wifi-24g,
        .wifi-5g {
          .form-header__title {
            color: var(--text_gery-color);
          }
          .info {
            > :first-child {
              padding-bottom: 5px;
              border-bottom: 1px solid var(--darker_hr-color);
            }
          }
        }
        .wifi-5g {
          margin-top: 5px;
        }
      }
    }
    .card-wrapper {
      display: flex;
      flex-direction: column;
      padding: 15px;
      background: var(--common_sub_card-bgc);
      margin-bottom: 15px;
      border-radius: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .form-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 15px;
      .form-header__title {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .step-tips {
      text-align: left;
      font-weight: 600;
      font-size: 18px;
      margin: 0 0 15px;
    }
  }
}
@media screen and(max-width: 768px) {
  .wlan {
    flex: 1;
    min-width: auto;
    min-height: auto;
    padding: 0;
    .step-content {
      display: flex;
      flex-direction: column;
      border-radius: 0;
      .row-1 {
        display: block;
        min-height: calc(100vh - 65px - 60px);
        .col-2 {
          padding: 20px 15px;
        }
      }
      .row-2 {
        .button-container {
          padding: 15px;
          .btn {
            padding: 0;
            width: 100%;
          }
        }
      }
      .step-item {
        &.step-item1 {
          padding: 0;
          .mk-form {
            min-width: auto;
            max-width: auto;
          }
          .region-grid {
            display: block;
          }
          .form-content {
            display: flex;
            flex-direction: column;
            margin-bottom: 0;
            .form-item {
              margin-bottom: 30px;
            }
          }
        }
        &.step-item2 {
          width: 100%;
        }
      }
    }
  }
}
</style>
