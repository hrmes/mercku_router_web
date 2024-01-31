<template>
  <div class="initial">
    <div v-if="needCheck && isChecking"
         class="check-wan">
      <m-lottie-loading id="checkLoading"
                        :size="160"></m-lottie-loading>
      <p>正在检测上网方式，请稍后…</p>
    </div>
    <div v-else
         class="step-content">
      <div class="row-1">
        <div class="col-1"
             v-if="!isMobile">
          <img :src="InitialImg">
        </div>
        <div class="col-2">
          <!-- v-if="stepOption.current===0" -->
          <div class="step-item step-item1">
            <m-form>
              <p class="step-tips">请选择上网方式</p>
              <m-form-item>
                <qiyou-radio-card-group v-model="netType"
                                        :options="options"
                                        direction="vertical"></qiyou-radio-card-group>
              </m-form-item>
            </m-form>
            <!-- <m-form ref="wifiForm"
                    :model="wifiForm"
                    :rules="wifiFormRules">
              <p class="step-tips">{{$t('trans0167').toUpperCase()}}</p>
              <div class="card-wrapper">
                <m-form-item prop="smart_connect"
                             class="no-validate">
                  <m-switch :label="$t('trans0397')"
                            v-model="wifiForm.smart_connect" />
                  <div class="tip-label">{{$t('trans0398')}}</div>
                </m-form-item>
              </div>
              <div class="card-wrapper">
                <div class="form-content">
                  <m-form-item prop="ssid24g">
                    <m-input :label="$t('trans0168')"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.ssid24g" />
                  </m-form-item>
                  <m-form-item v-if="!wifiForm.smart_connect"
                               style="margin-bottom:10px">
                    <div class="tip-label">
                      <div class="title">{{`${$t('trans0255')} ${$t('trans0168')} :`}}</div>
                      <div class="value">{{wifiForm.ssid24g}}</div>
                    </div>
                    <div class="tip-label">
                      <div class="title"> {{`${$t('trans0256')} ${$t('trans0168')} :`}}</div>
                      <div class="value">{{ssid5g}}</div>
                    </div>
                  </m-form-item>
                  <m-form-item prop="password24g">
                    <m-input :label="$t('trans0172')"
                             type="password"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.password24g" />
                  </m-form-item>
                  <m-form-item style="margin-top:10px">
                    <m-switch label="将Wi-Fi密码作为路由器管理密码"
                              v-model="copyB24gSsid"
                              @change="customizedAdminPwd" />
                  </m-form-item>
                  <transition name="fade">
                    <template v-if="!copyB24gSsid">
                      <m-form-item prop="passwordAdmin">
                        <m-input :label="$t('trans0067')"
                                 type="password"
                                 :placeholder="$t('trans0321')"
                                 v-model="wifiForm.passwordAdmin" />
                      </m-form-item>
                    </template>
                  </transition>
                </div>
              </div>
              <div class="card-wrapper">
                <div class="form-header">
                  <span class="form-header__title">Game Wi-Fi</span>
                </div>
                <div class="form-content">
                  <m-form-item prop="ssidGame"
                               ref="ssidGame">
                    <m-input :label="$t('trans0168')"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.ssidGame" />
                  </m-form-item>
                  <m-form-item prop="passwordGame">
                    <m-input :label="$t('trans0172')"
                             type="password"
                             :placeholder="$t('trans0321')"
                             v-model="wifiForm.passwordGame" />
                  </m-form-item>
                </div>

              </div>
            </m-form>
            <m-form key="dhcp-form"
                    v-if="isDhcp"
                    ref="dhcpForm"
                    :model="dhcpForm"
                    :rules="dhcpRules">
              <m-form-item class="item">
                <m-radio-group class="radio-group"
                               direction="vertical"
                               v-model="autodns.dhcp"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <div class="form__dns"
                   v-if="!autodns.dhcp">
                <m-form-item class="item"
                             prop="dns1"
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="dhcpForm.dns1" />
                </m-form-item>
                <m-form-item class="item"
                             prop="dns2"
                             ref="backupdns">
                  <m-input :label="$t('trans0320')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="dhcpForm.dns2" />
                </m-form-item>
              </div>
            </m-form>
            <m-form key="pppoe-form"
                    v-else-if="isPppoe"
                    ref="pppoeForm"
                    :model="pppoeForm"
                    :rules="pppoeRules">
              <m-form-item class="item"
                           prop="account">
                <m-input :label="$t('trans0155')"
                         type="text"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.account"></m-input>
              </m-form-item>
              <m-form-item class="item"
                           prop="password">
                <m-input :label="$t('trans0156')"
                         type="password"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.password" />
              </m-form-item>
              <m-form-item class="item">
                <m-radio-group class="radio-group"
                               direction="vertical"
                               v-model="autodns.pppoe"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <div class="form__dns"
                   v-if="!autodns.pppoe">
                <m-form-item class="item"
                             prop="dns1"
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="pppoeForm.dns1" />
                </m-form-item>
                <m-form-item class="item"
                             prop="dns2"
                             ref="backupdns">
                  <m-input :label="$t('trans0320')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="pppoeForm.dns2" />
                </m-form-item>
              </div>
            </m-form>
            <m-form key="static-form"
                    v-else-if="isStatic"
                    ref="staticForm"
                    :model="staticForm"
                    :rules="staticRules">
              <div class="form__dns">
                <m-form-item class="item"
                             prop="ip"
                             ref="ip">
                  <m-input :label="$t('trans0151')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="staticForm.ip"
                           :onBlur="ipChange" />
                </m-form-item>
                <m-form-item class="item"
                             prop="mask"
                             ref="mask">
                  <m-input :label="$t('trans0152')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="staticForm.mask"
                           :onBlur="maskChange" />
                </m-form-item>
                <m-form-item class="item"
                             prop="gateway"
                             ref="gateway">
                  <m-input :label="$t('trans0153')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="staticForm.gateway" />
                </m-form-item>
                <m-form-item class="item"
                             prop="dns1"
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="staticForm.dns1" />
                </m-form-item>
                <m-form-item class="item"
                             prop="dns2"
                             ref="backupdns">
                  <m-input :label="$t('trans0320')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="staticForm.dns2" />
                </m-form-item>
              </div>
            </m-form> -->
          </div>
          <!-- <div class="step-item step-item2"
               v-if="stepOption.current===1">
            <m-lottie-loading class="configingLoading"
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
                  <div class="info__value">
                    {{this.copyB24gSsid ? this.wifiForm.password24g : this.wifiForm.passwordAdmin}}
                  </div>
                </div>
              </div>
            </div>
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
                  <div class="info__value">{{ssid5g}}</div>
                </div>
                <div class="info__row">
                  <div class="info__title">{{$t('trans0172')}}:</div>
                  <div class="info__value">{{password5g}}</div>
                </div>
              </div>
            </div>
            <div class="info-container wifi-5g">
              <div class="info">
                <div class="info__row">
                  <div class="info__title">{{$t('trans0924')}}:</div>
                  <div class="info__value">{{wifiForm.ssidGame}}</div>
                </div>
                <div class="info__row">
                  <div class="info__title">{{$t('trans0172')}}:</div>
                  <div class="info__value">{{wifiForm.passwordGame}}</div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- v-if="stepOption.current===0" -->
      <div class="row-2">
        <div class="button-container">
          <button class="btn btn-default"
                  @click="skipWanSetting">跳过</button>
          <button @click="next2WifiInitial"
                  class="btn">{{ $t('trans0055')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { WanNetStatus, WanType } from 'base/util/constant';
import {

  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,

} from 'base/util/util';
import { InitialImg } from '@/assets/images/v3/base64-img/img.js';
import radioCardGroup from '@/component/radioCardGroup';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}
export default {
  components: {
    'qiyou-radio-card-group': radioCardGroup
  },
  data() {
    return {
      InitialImg,
      isChecking: true,
      netType: WanType.dhcp,
      options: [
        {
          value: 'dhcp',
          text: this.$t('trans0146')
        },
        {
          value: 'static',
          text: this.$t('trans0148')
        },
        {
          value: 'pppoe',
          text: this.$t('trans0144')
        },
        {
          value: 'wireless_dhcp',
          text: '无线中继'
        }
      ],
      // stepOption: {
      //   current: 0,
      //   steps: [
      //     { text: this.$t('trans0019'), success: true },
      //     { text: this.$t('trans0018'), success: false }
      //   ]
      // },
      staticForm: {
        ip: '',
        mask: '',
        gateway: '',
        dns1: '',
        dns2: ''
      },
      pppoeForm: {
        account: '',
        password: '',
        dns1: '',
        dns2: ''
      },
      dhcpForm: {
        dns1: '',
        dns2: ''
      },
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ],
        password: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ]
      },
      staticRules: {
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        mask: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          },
          {
            rule: value => isValidMask(value),
            message: this.$t('trans0231')
          }
        ],
        gateway: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns1: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => checkDNS(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: value => (value ? checkDNS(value) : true),
            message: this.$t('trans0231')
          }
        ]
      },
    };
  },
  computed: {
    needCheck() {
      console.log(this.$route);
      return this.$route.params.needCheck;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    isPppoe() {
      return this.netType === WanType.pppoe;
    },
    isStatic() {
      return this.netType === WanType.static;
    },
    isDhcp() {
      return this.netType === WanType.dhcp;
    },
  },
  mounted() {
    this.checkInternetAccess();
  },
  methods: {
    checkInternetAccess() {
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
      if (this.needCheck) {
        setTimeout(() => {
          this.getWanStatus();
        }, 5000);
      } else {
        this.echoWanConfig();
      }
    },
    getWanStatus() {
      this.$http
        .getWanStatus()
        .then(res => {
          const {
            data: {
              result: { status: wanStatus }
            }
          } = res;
          switch (wanStatus) {
            case WanNetStatus.connected:
              this.$router.push({ path: '/initial/wifi' });
              break;
            default:
              this.isChecking = false;
              break;
          }
        })
        .catch(() => {
          this.isChecking = false;
        });
      return true;
    },
    echoWanConfig() {
      const wanConfig = localStorage.getItem('wanConfig');
    },
    skipWanSetting() {
      this.$router.replace({ path: '/initial/wifi' });
    },
    next2WifiInitial() {
      this.$router.push({ path: '/initial/wifi' });
    }
  }
};
</script>
<style lang="scss" scoped>
.initial {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  min-height: 940px;
  padding: 70px 30px 70px;
  .check-wan,
  .step-content {
    width: 100%;
    height: 100%;
    text-align: center;
    background: var(--common_card-bgc);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--common_card-boxshadow);
  }
  .check-wan {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .step-content {
    display: grid;
    grid-template-rows: 1fr 10%;
    grid-template-columns: 100%;
    // min-height: 940px;
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
        max-height: 720px;
        overflow-y: auto;
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
          &:first-child {
            margin-right: 30px;
          }
        }
      }
    }
    .step-item {
      padding-left: 3%;
      &.step-item1 {
        width: 100%;
        .mk-form {
          width: 400px;
          margin: 30px 0 10px 10%;
        }
        .tip-label {
          display: flex;
          font-size: 12px;
          color: var(--text_gery-color);
          margin-top: 10px;
          .title {
            width: 30%;
          }
          .value {
            flex: 1;
          }
        }
        .form-item {
          text-align: left;
          margin-bottom: 20px;
          &.no-validate {
            margin-bottom: 0;
          }
        }
        .form-content {
          display: grid;
          grid-template-rows: repeat(2, auto);
          grid-template-columns: 100%;
          grid-column-gap: 10px;
          width: 100%;
          height: fit-content;
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
        width: 400px;
        margin-left: 10%;
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
  .initial {
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
