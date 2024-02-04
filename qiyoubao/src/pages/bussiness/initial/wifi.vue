<template>
  <div class="wifi-initial">
    <div class="step-content">
      <div class="row-1">
        <div class="col-1"
             v-if="!isMobile">
          <img :src="InitialImg">
        </div>
        <div class="col-2">
          <div class="step-item step-item1"
               v-if="stepOption.current===0">
            <m-form ref="wifiForm"
                    :model="wifiForm"
                    :rules="wifiFormRules">
              <p class="step-tips">{{$t('trans0167').toUpperCase()}}</p>
              <div class="card-wrapper">
                <m-form-item prop="smart_connect"
                             class="no-validate">
                  <m-switch :label="$t('trans0397')"
                            v-model="wifiForm.smart_connect" />
                  <!-- <div class="tip-label">{{$t('trans0398')}}</div> -->
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
                    <m-switch :label="$t('trans1257')"
                              v-model="copyB24gPwd"
                              @change="customizedAdminPwd" />
                  </m-form-item>
                  <transition name="fade">
                    <template v-if="!copyB24gPwd">
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
                  <span class="form-header__title">{{$t('trans1260')}}</span>
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
          </div>
          <div class="step-item step-item2"
               v-if="stepOption.current===1">
            <m-lottie-loading class="configing-loading"
                              :size="160"
                              id="configLoading" />
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
                    {{this.copyB24gPwd ? this.wifiForm.password24g : this.wifiForm.passwordAdmin}}
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
            <div class="info-container wifi-game">
              <div class="info">
                <div class="info__row">
                  <div class="info__title">{{$t('trans1296')}}:</div>
                  <div class="info__value">{{wifiForm.ssidGame}}</div>
                </div>
                <div class="info__row">
                  <div class="info__title">{{$t('trans0172')}}:</div>
                  <div class="info__value">{{wifiForm.passwordGame}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-2"
           v-if="stepOption.current===0">

        <div v-if="isLoading">
          <m-loading :color="loadingColor"
                     :size="28"
                     id="btnLoading"></m-loading>
        </div>
        <div class="button-container"
             v-else>
          <button class="btn btn-default"
                  @click="back2WanInitial">{{$t('trans1259')}}</button>
          <button @click="step1()"
                  class="btn">{{ $t('trans0055')}}</button>
        </div>

      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { Bands } from 'base/util/constant';
import { InitialImg } from '@/assets/images/v3/base64-img/img.js';
import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
  isFieldHasSpaces
} from 'base/util/util';

export default {
  data() {
    return {
      InitialImg,
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
        ssidGame: '',
        passwordGame: '',
        passwordAdmin: ''
      },
      isLoading: false,
      wifiFormRules: {
        ssid24g: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
          {
            rule: value => {
              console.log('ssid24g Bytes is', getStringByte(value.trim()));
              return getStringByte(value.trim()) >= 3 && getStringByte(value.trim()) <= 31;
            },
            message: this.$t('trans1255')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          },
          {
            rule: value => value !== this.wifiForm.ssidGame,
            message: this.$t('trans1258')
          }
        ],
        password24g: [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => isValidPassword(value, 8, 31),
            message: this.$t('trans0169')
          }
        ],
        ssidGame: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value.trim()) >= 3 && getStringByte(value.trim()) <= 31,
            message: this.$t('trans1255')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          },
          {
            rule: value => this.wifiForm.ssid24g !== value &&
              this.ssid5g !== value,
            message: this.$t('trans1258')
          }
        ],
        passwordGame: [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => isValidPassword(value, 8, 31),
            message: this.$t('trans0169')
          }
        ],
        passwordAdmin: [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => isValidPassword(value, 8, 31),
            message: this.$t('trans0169')
          }
        ]
      },
      copyB24gPwd: true
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
    },
    ssid5g() {
      if (this.wifiForm.smart_connect) {
        return this.wifiForm.ssid24g.trim();
      }
      if (getStringByte(this.wifiForm.ssid24g.trim()) > 28) {
        return this.truncateAndAppend(this.wifiForm.ssid24g.trim());
      }
      return `${this.wifiForm.ssid24g.trim()}-5G`;
    },
    password5g() {
      return this.wifiForm.password24g;
    }
  },
  mounted() {
    this.$loading.open();
    this.$http
      .getMeshMeta()
      .then(res => {
        // const wifi = {
        //   bands: {
        //     '2.4G': {
        //       ssid: 'MERCKU-0F4C',
        //       password: '',
        //       encrypt: 'open',
        //       crypt: 'none',
        //       enabled: true,
        //       hidden: false,
        //       mode: 'ap',
        //       channel: {
        //         mode: 'manual',
        //         number: 11,
        //         bandwidth: 40
        //       }
        //     },
        //     '5G': {
        //       ssid: 'MERCKU-0F4C-5G',
        //       password: '',
        //       encrypt: 'open',
        //       crypt: 'none',
        //       enabled: true,
        //       hidden: false,
        //       mode: 'ap',
        //       channel: {
        //         mode: 'manual',
        //         number: 40,
        //         bandwidth: 80
        //       }
        //     },
        //     Game: {
        //       ssid: 'MERCKU-0F4C-Game',
        //       password: '',
        //       encrypt: 'open',
        //       crypt: 'none',
        //       enabled: true,
        //       hidden: false,
        //       mode: 'ap',
        //       channel: {
        //         mode: 'manual',
        //         number: 40,
        //         bandwidth: 80
        //       }
        //     }
        //   },
        //   smart_connect: false,
        //   compatibility_mode: false,
        //   tx_power: 'high'
        // };
        const wifi = res.data.result;
        const b24g = wifi.bands[Bands.b24g];
        const bGame = wifi.bands[Bands.bGame];
        this.wifiForm.ssid24g = b24g.ssid;
        this.wifiForm.password24g = b24g.password;
        this.wifiForm.ssidGame = bGame.ssid;
        this.wifiForm.passwordGame = bGame.password;
        this.wifiForm.smart_connect = wifi.smart_connect;
      })
      .finally(() => {
        this.$loading.close();
      });
  },
  methods: {
    truncateAndAppend(value) {
      if (getStringByte(value) > 28) {
        let truncatedValue = '';
        let currentByteCount = 0;

        // 遍历字符串，累计字节数，直到达到28字节为止
        // eslint-disable-next-line no-restricted-syntax
        for (const str of value) {
          const charByteCount = new TextEncoder().encode(str).length;

          // 检查是否超过字节限制
          if (currentByteCount + charByteCount > 28) {
            break;
          }

          truncatedValue += str;
          currentByteCount += charByteCount;
        }

        // 拼接上"-5G"
        const newValue = `${truncatedValue}-5G`;
        return newValue;
      }

      // 如果字节数不大于28，直接返回原值
      return value;
    },
    step1() {
      if (this.$refs.wifiForm.validate()) {
        const config = {
          wifi: {
            bands: {
              '2.4G': {
                ssid: this.wifiForm.ssid24g,
                password: this.wifiForm.password24g
              },
              '5G': {
                ssid: this.ssid5g,
                password: this.wifiForm.password24g
              },
              Game: {
                ssid: this.wifiForm.ssidGame,
                password: this.wifiForm.passwordGame
              }
            },
            smart_connect: this.wifiForm.smart_connect
          },
          admin: {
            username: 'admin',
            password: this.copyB24gPwd ? this.wifiForm.password24g : this.wifiForm.passwordAdmin
          },
          wan: JSON.parse(localStorage.getItem('wanConfig'))
        };
        console.log(config);
        this.stepOption.current = 1;
        this.stepOption.steps[1].success = true;
        this.isLoading = true;
        // 提交表单;
        this.$http
          .updateMeshConfig(config)
          .then(() => {
            this.stepOption.current = 1;
            this.stepOption.steps[1].success = true;
            localStorage.removeItem('wanConfig');
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
          });
      }
    },
    customizedAdminPwd(val) {
      if (val) {
        this.wifiForm.passwordAdmin = this.wifiForm.password24g;
      } else {
        this.wifiForm.passwordAdmin = '';
      }
    },
    back2WanInitial() {
      this.$router.replace({
        name: 'initial.wan',
        params: {
          needCheck: false
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wifi-initial {
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
        .wifi-5g,
        .wifi-game {
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
        .wifi-5g,
        .wifi-game {
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
  .wifi-initial {
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
          max-height: unset;
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
            margin: 0;
            width: unset;
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
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>
