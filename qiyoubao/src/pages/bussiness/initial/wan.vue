<template>
  <div class="wan-initial">
    <div v-if="needCheck && isChecking"
         class="check-wan">
      <m-lottie-loading id="checkLoading"
                        :size="160"></m-lottie-loading>
      <p>{{$t('trans1239')}}</p>
    </div>
    <div v-else
         class="step-content">
      <div class="row-1">
        <div class="col-1"
             v-if="!isMobile">
          <img :src="InitialImg">
        </div>
        <div class="col-2">
          <div class="step-item step-item1">
            <m-form>
              <p class="step-tips">{{$t('trans1241')}}</p>
              <m-form-item>
                <qiyou-radio-card-group v-model="netType"
                                        :options="options"
                                        direction="vertical"></qiyou-radio-card-group>
              </m-form-item>
            </m-form>
            <m-form key="pppoe-form"
                    v-if="isPppoe"
                    ref="pppoeForm"
                    :model="pppoeForm"
                    :rules="pppoeRules">
              <div class="card-wrapper">
                <div class="form-content">
                  <m-form-item prop="account">
                    <m-input :label="$t('trans0155')"
                             type="text"
                             :placeholder="`${$t('trans0321')}`"
                             v-model="pppoeForm.account"></m-input>
                  </m-form-item>
                  <m-form-item prop="password">
                    <m-input :label="$t('trans0156')"
                             type="password"
                             :placeholder="`${$t('trans0321')}`"
                             v-model="pppoeForm.password" />
                  </m-form-item>
                </div>
              </div>
            </m-form>
            <m-form key="static-form"
                    v-if="isStatic"
                    ref="staticForm"
                    :model="staticForm"
                    :rules="staticRules">
              <div class="card-wrapper">
                <div class="form-content">
                  <m-form-item prop="ip"
                               ref="ip">
                    <m-input :label="$t('trans0151')"
                             type="text"
                             placeholder="0.0.0.0"
                             v-model="staticForm.ip"
                             :onBlur="ipChange" />
                  </m-form-item>
                  <m-form-item prop="mask"
                               ref="mask">
                    <m-input :label="$t('trans0152')"
                             type="text"
                             placeholder="0.0.0.0"
                             v-model="staticForm.mask"
                             :onBlur="maskChange" />
                  </m-form-item>
                  <m-form-item prop="gateway"
                               ref="gateway">
                    <m-input :label="$t('trans0153')"
                             type="text"
                             placeholder="0.0.0.0"
                             v-model="staticForm.gateway" />
                  </m-form-item>
                  <m-form-item prop="dns1"
                               ref="dns">
                    <m-input :label="$t('trans0236')"
                             type="text"
                             placeholder="0.0.0.0"
                             v-model="staticForm.dns1" />
                  </m-form-item>
                  <m-form-item prop="dns2"
                               ref="backupdns">
                    <m-input :label="$t('trans0320')"
                             type="text"
                             placeholder="0.0.0.0"
                             v-model="staticForm.dns2" />
                  </m-form-item>
                </div>

              </div>
            </m-form>
            <m-form key="wisp-form"
                    v-if="isWisp"
                    ref="upperApForm"
                    :model="upperApForm"
                    :rules="upperApFormRules">
              <div class="card-wrapper">
                <div class="form-content">
                  <m-form-item prop="upperApForm.ssid"
                               class="scan-upper">
                    <qiyou-scan-upper-select :label="$t('trans0168')"
                                             :placeholder="$t('trans1182')"
                                             type='text'
                                             ref='loadingSelect'
                                             @change="selectedChange"
                                             @scanApclient="startApclientScan"
                                             :popupTop='$store.state.isMobile'
                                             :bssid="upperApForm.bssid"
                                             :ssid="upperApForm.ssid"
                                             :options="processedUpperApList"
                                             :loading="selectIsLoading"
                                             :loadingText="loadingText"
                                             v-model="upperApForm.ssid" />
                    <span @click.stop="()=>modalShow=true"
                          class="btn-icon">
                      <button class="btn btn-default btn-small">
                        <span class="add-icon"></span>
                      </button>
                      <span class="icon-hover-popover">{{$t('trans1250')}}</span>
                    </span>
                  </m-form-item>
                  <m-form-item v-show="!pwdDisabled"
                               prop="upperApForm.password">
                    <m-input :label="$t('trans0003')"
                             type="password"
                             :placeholder="$t('trans0321')"
                             v-model="upperApForm.password" />
                  </m-form-item>
                </div>
              </div>
            </m-form>
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="button-container">
          <button class="btn btn-default"
                  @click="next2WifiInitial()">{{$t('trans0163')}}</button>
          <button @click="storeWanConfig"
                  class="btn">{{ $t('trans0055')}}</button>
        </div>
      </div>
    </div>
    <m-modal :visible.sync="modalShow"
             :type="'confirm'"
             class="add-upper-manual-modal">
      <div class="content">
        <div class="content-header">
          {{$t('trans1253')}}
        </div>
        <div class="content-form">
          <m-form ref="manualWispForm"
                  :model="manualWispForm"
                  :rules='manualWispRules'>
            <m-form-item prop="ssid">
              <m-input :label="$t('trans0168')"
                       type="text"
                       :placeholder="$t('trans0321')"
                       v-model="manualWispForm.ssid" />
            </m-form-item>
            <m-form-item prop="security">
              <m-select :label="$t('trans0522')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.security"
                        :options="encryptMethods"
                        @change="(nv, ov) => onEncryptChange(nv, ov)" />
            </m-form-item>
            <m-form-item v-if="upperEncryptIsOpen"
                         prop="crypt">
              <m-select :label="$t('trans1302')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.crypt"
                        :options="openEncryptProtocols" />
            </m-form-item>
            <m-form-item v-else
                         prop="crypt">
              <m-select :label="$t('trans1302')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.crypt"
                        :options="normalEncryptProtocols" />
            </m-form-item>
            <m-form-item prop="band">
              <m-select :label="$t('trans0111')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.band"
                        :options="bandOptions" />
            </m-form-item>
            <m-form-item v-if="!upperEncryptIsOpen"
                         prop="password">
              <m-input :label="$t('trans0003')"
                       type="password"
                       :placeholder="$t('trans0321')"
                       v-model="manualWispForm.password" />
            </m-form-item>
          </m-form>
        </div>
        <div class="btn-inner">
          <button @click.stop="hiddenModalShow"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button class="btn"
                  @click="submitManualUpperForm">{{$t('trans0018')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { InitialImg } from '@/assets/images/base64-img/img.js';
import { WanNetStatus, WanType, EncryptMethod } from 'base/util/constant';
import {
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,
  getStringByte,
} from 'base/util/util';
import wispSettingUpper from '@/mixins/wisp_setting_upper';

import radioCardGroup from '@/component/radioCardGroup';
import scanUpperSelect from '@/component/scanUpperSelect';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}
const DefaultConfig = JSON.stringify({ type: WanType.dhcp });

export default {
  mixins: [wispSettingUpper],
  components: {
    'qiyou-radio-card-group': radioCardGroup,
    'qiyou-scan-upper-select': scanUpperSelect
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
          value: 'pppoe',
          text: this.$t('trans0144')
        },
        {
          value: 'static',
          text: this.$t('trans0148')
        },
        {
          value: 'wisp',
          text: this.$t('trans1242')
        }
      ],
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
      },
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 128,
            message: this.$t('trans1252')
              .replace('%d', 1)
              .replace('%d', 128)
          },
        ],
        password: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 128,
            message: this.$t('trans1252')
              .replace('%d', 1)
              .replace('%d', 128)
          },
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
      return this.$route.params.needCheck || this.$route.params.needCheck === undefined;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    isDhcp() {
      return this.netType === WanType.dhcp;
    },
    isPppoe() {
      return this.netType === WanType.pppoe;
    },
    isStatic() {
      return this.netType === WanType.static;
    },
  },
  mounted() {
    this.checkInternetAccess();
  },
  methods: {
    ipChange() {
      this.$refs.ip.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.ip,
        this.staticForm.mask
      );
    },
    maskChange() {
      this.$refs.ip.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.ip,
        this.staticForm.mask
      );
      this.$refs.gateway.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.gateway,
        this.staticForm.mask
      );
    },
    checkInternetAccess() {
      if (this.needCheck) {
        localStorage.removeItem('wanConfig');
        setTimeout(() => {
          this.getWanStatus();
        }, 3000);
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
              localStorage.setItem('wanConfig', DefaultConfig);
              this.$router.replace({ path: '/initial/wifi' });
              break;
            default:
              this.$toast(this.$t('trans1240'), 5000, 'success');
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
      this.netInfo = JSON.parse(localStorage.getItem('wanConfig')) || { type: WanType.dhcp };
      this.netType = this.netInfo.type;
      if (this.isPppoe) {
        this.pppoeForm.account = this.netInfo.pppoe.account;
        this.pppoeForm.password = this.netInfo.pppoe.password;
      }
      if (this.isStatic) {
        this.staticForm = {
          ip: this.netInfo.static.netinfo.ip,
          mask: this.netInfo.static.netinfo.mask,
          gateway: this.netInfo.static.netinfo.gateway,
          dns1: this.netInfo.static.netinfo.dns[0],
          dns2: this.netInfo.static.netinfo.dns[1] || ''
        };
      }
      if (this.isWisp) {
        this.echoWisp(this.netInfo.wisp.apclient);
      }
    },
    storeWanConfig() {
      const form = { type: this.netType };
      switch (this.netType) {
        case WanType.dhcp:
          this.next2WifiInitial(form);
          break;
        case WanType.pppoe:
          if (this.$refs.pppoeForm.validate()) {
            form.pppoe = {
              account: this.pppoeForm.account,
              password: this.pppoeForm.password
            };
            this.next2WifiInitial(form);
          }

          break;
        case WanType.static:
          if (this.$refs.staticForm.validate()) {
            form.static = {
              netinfo: {
                ip: this.staticForm.ip,
                mask: this.staticForm.mask,
                gateway: this.staticForm.gateway,
                dns: [this.staticForm.dns1]
              }
            };
            if (this.staticForm.dns2) {
              form.static.netinfo.dns.push(this.staticForm.dns2);
            }
            this.next2WifiInitial(form);
          }

          break;
        case WanType.wisp:
          if (this.$refs.upperApForm.validate()) {
            form.wisp = {
              apclient: this.upperApForm
            };
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              message: this.$t('trans1249'),
              callback: {
                ok: () => {
                  this.next2WifiInitial(form);
                }
              }
            });
          }
          break;
        default:
          break;
      }
    },
    next2WifiInitial(config) {
      console.log(config);
      if (config) {
        localStorage.setItem('wanConfig', JSON.stringify(config));
      } else {
        localStorage.setItem('wanConfig', DefaultConfig);
      }
      this.$router.replace({ path: '/initial/wifi' });
    },
    echoWisp(option) {
      this.pwdDisabled =
        option.security.toLowerCase() === EncryptMethod.open;
      this.upperApForm = option;
    },
    submitManualUpperForm() {
      if (this.$refs.manualWispForm.validate()) {
        const form = { type: this.netType };
        form.wisp = {
          apclient: this.manualWispForm
        };
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans1249'),
          callback: {
            ok: () => {
              this.next2WifiInitial(form);
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wan-initial {
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
          &.scan-upper {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .btn-icon {
              width: auto;
              height: auto;
            }
            .btn-small {
              width: 90px;
              height: 48px;
              min-width: auto;
              padding: 0;
              opacity: 1;
            }
            .add-icon {
              position: relative;
              display: inline-block;
              width: 10px;
              height: 10px;
              margin-right: 5px;
              &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                height: 2.5px;
                border-radius: 2px;
                width: 15px;
                background-color: var(--primary-color);
                transform: translate(-50%, -50%) rotate(0deg);
              }
              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                height: 2.5px;
                border-radius: 2px;
                width: 15px;
                background-color: var(--primary-color);
                transform: translate(-50%, -50%) rotate(90deg);
              }
            }
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
.add-upper-manual-modal {
  .content {
    display: flex;
    flex-direction: column;
    .content-header {
      margin-bottom: 15px;
      font-size: 16px;
      color: var(--text_default-color);
    }
    .content-form {
      .form-item {
        margin-bottom: 20px;
      }
    }
    .btn-inner {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .btn {
        flex: 1;
        height: 42px;
        &:last-child {
          margin-left: 30px;
        }
      }
      .btn-default {
        background-image: linear-gradient(
            to right,
            var(--modal_content-bgc),
            var(--modal_content-bgc)
          ),
          var(--common_btn_default-bgimg) !important;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .wan-initial {
    flex: 1;
    min-width: auto;
    min-height: auto;
    padding: 0;
    .check-wan {
      height: calc(100vh - 65px - 60px);
      border-radius: 0;
    }
    .step-content {
      display: flex;
      flex-direction: column;
      border-radius: 0;
      min-height: calc(100vh - 65px - 60px);
      .row-1 {
        flex: 1;
        display: block;
        .col-2 {
          padding: 20px 15px;
          max-height: unset;
        }
      }
      .row-2 {
        height: 80px;
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
            margin: 0;
            width: unset;
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
      }
    }
  }
}
</style>
