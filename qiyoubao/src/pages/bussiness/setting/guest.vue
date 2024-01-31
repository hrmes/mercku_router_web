<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0538')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <m-form class="form"
                ref="form"
                :model="form"
                :rules='rules'>
          <div class="row-1">
            <div class="card">
              <m-form-item class="last card__switch">
                <m-switch v-model="form.enabled"
                          :label="$t('trans0538')"
                          @change="guestEnabledChange" />
                <p class="des-tips">{{$t('trans0540')}}</p>
              </m-form-item>
            </div>
          </div>
          <div class="setting"
               v-if="form.enabled&&showSettingPage">
            <div class="row-2">
              <div class="card">
                <m-form-item class="last"
                             prop='duration'>
                  <m-select v-model="form.duration"
                            :label="$t('trans0521')"
                            :options='checkOps'></m-select>
                </m-form-item>
              </div>
            </div>
            <div class="row-3">
              <div class="card">
                <m-form-item class="last"
                             prop="smart_connect">
                  <m-switch v-model="form.smart_connect"
                            :label="$t('trans0397')"
                            @change="changeSmartConnect"></m-switch>
                  <!-- <p class="des-tips">{{$t('trans0398')}}</p> -->
                </m-form-item>
              </div>
            </div>
            <div class="row-4">
              <div class="card">
                <div class="form-header"
                     v-show="!form.smart_connect">
                  <span class="form-header__title">{{ $t('trans0677') }}</span>
                </div>
                <m-form-item prop='b24g.ssid'>
                  <m-input v-model="form.b24g.ssid"
                           :label="$t('trans0168')"
                           type='text'
                           :placeholder="`${$t('trans0321')}`"></m-input>
                </m-form-item>
                <m-form-item :class="{last:form.b24g.encrypt === EncryptMethod.open}">
                  <m-select :label="$t('trans0522')"
                            v-model="form.b24g.encrypt"
                            :popupTop="true"
                            @change="(nv, ov) => onEncryptChange('b24g', nv, ov)"
                            :options="encryptMethods"></m-select>
                </m-form-item>
                <m-form-item prop='b24g.password'
                             class="last"
                             :errorMsgIsStatic="true"
                             v-if="form.b24g.encrypt!== EncryptMethod.open">
                  <m-input v-model="form.b24g.password"
                           :label="$t('trans0172')"
                           type='password'
                           :placeholder="`${$t('trans0321')}`"></m-input>
                </m-form-item>
              </div>
              <div class="card"
                   v-show="!form.smart_connect">
                <div class="form-header">
                  <span class="form-header__title">{{ $t('trans0679') }}</span>
                </div>
                <m-form-item prop='b5g.ssid'>
                  <m-input v-model="form.b5g.ssid"
                           :label="$t('trans0168')"
                           type='text'
                           :placeholder="`${$t('trans0321')}`"></m-input>
                </m-form-item>
                <m-form-item :class="{last:form.b5g.encrypt === EncryptMethod.open}">
                  <m-select :label="$t('trans0522')"
                            v-model="form.b5g.encrypt"
                            :popupTop="true"
                            @change="(nv, ov) => onEncryptChange('b5g', nv, ov)"
                            :options="encryptMethods"></m-select>
                </m-form-item>
                <m-form-item prop='b5g.password'
                             class="last"
                             :errorMsgIsStatic="true"
                             v-if="form.b5g.encrypt!== EncryptMethod.open">
                  <m-input v-model="form.b5g.password"
                           :label="$t('trans0172')"
                           type='password'
                           :placeholder="`${$t('trans0321')}`"></m-input>
                </m-form-item>
              </div>
            </div>
          </div>
          <div class="info"
               v-if="form.enabled&&showStatusPage">
            <div class="row-2">
              <div class="card">
                <div class="setting-ssid-info">
                  <p>
                    <label class="title with-colon">
                      {{
                        guest.smart_connect
                        ? $t('trans0168')
                        : $t('trans0923')
                      }}:
                    </label>
                    <span class="value"
                          :title="guest.bands[Bands.b24g].ssid">
                      {{guest.bands[Bands.b24g].ssid}}
                    </span>
                  </p>
                  <p v-if="!guest.smart_connect">
                    <label class="title with-colon">{{$t('trans0924')}}:</label>
                    <span class="value"
                          :title="guest.bands[Bands.b5g].ssid">
                      {{guest.bands[Bands.b5g].ssid}}
                    </span>
                  </p>
                </div>
                <div class="remaining-time">
                  <label class="title with-colon">{{$t('trans0524')}}:</label>
                  <div class="time value">
                    {{formatTime(guest.remaining_duration)}}
                  </div>
                </div>
                <div class="online-device">
                  <label class="title with-colon">{{$t('trans0235')}}:</label>
                  <span class="value">{{devicesCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </m-form>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper"
             v-show="showBtn"
             :class="{'cancel':setupAndStart}">
          <button class="btn btn-default btn-cancel btn-setting"
                  style="margin-right:20px"
                  v-if="setupAndStart&&showCancelBtn"
                  @click='cancel'>{{$t('trans0025')}}</button>
          <button v-if="showStatusPage"
                  class="btn"
                  @click='toSetting'>{{$t('trans0019')}}</button>
          <button v-else
                  class="btn btn-setting"
                  @click='submit()'>{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import encryptMix from 'base/mixins/encrypt-methods';
import { EncryptMethod } from 'base/util/constant';
import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
  isFieldHasSpaces
} from 'base/util/util';

const Bands = {
  b24g: '2.4G',
  b5g: '5G'
};
export default {
  mixins: [encryptMix],
  data() {
    return {
      Bands,
      EncryptMethod,
      showBtn: true,
      showSettingPage: false,
      showStatusPage: false,
      showCancelBtn: false,
      setupAndStart: false,
      devicesCount: 0,
      guest: {},
      timer: null,
      checkOps: [
        {
          text: this.$t('trans0530'),
          value: -1
        },
        {
          text: this.$t('trans0449'),
          value: 24 * 60 * 60
        },
        {
          text: this.$t('trans0527').replaceAll('%d', 8),
          value: 8 * 60 * 60
        },
        {
          text: this.$t('trans0527').replaceAll('%d', 3),
          value: 3 * 60 * 60
        }
      ],
      form: {
        id: '',
        enabled: false,
        duration: -1,
        smart_connect: true,
        b24g: {
          ssid: 'Mercku Guest',
          encrypt: EncryptMethod.open
        },
        b5g: {
          ssid: this.ssid_5g,
          encrypt: EncryptMethod.open
        }
      },
      rules: {
        'b24g.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value.trim()) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          }
        ],
        'b24g.password': [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => isValidPassword(value),
            message: this.$t('trans0169')
          }
        ],
        'b5g.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value.trim()) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          }
          // {
          //   rule: value => {
          //     if (!this.form.smart_connect) {
          //       return value.trim() !== this.form.b24g.ssid.trim();
          //     }
          //     return true;
          //   },
          //   message: this.$t('trans0660')
          // }
        ],
        'b5g.password': [
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0452')
          },
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
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
    ssid_5g() {
      return `${this.form.b24g.ssid?.trim()}_5G`;
    },
    hasStatus() {
      return this.setupAndStart;
    },
    formParams() {
      let params = {};
      // 新建guest wifi
      if (this.form.enabled) {
        params = {
          id: this.form.id,
          enabled: this.form.enabled,
          duration: this.form.duration,
          smart_connect: this.form.smart_connect,
          bands: {
            '2.4G': {
              ssid: this.form.b24g.ssid?.trim(),
              password: this.form.b24g.password,
              encrypt: this.form.b24g.encrypt
            },
            '5G': {
              ssid: this.form.smart_connect
                ? this.form.b24g.ssid?.trim()
                : this.form.b5g.ssid?.trim(),
              password: this.form.smart_connect
                ? this.form.b24g.password
                : this.form.b5g.password,
              encrypt: this.form.smart_connect
                ? this.form.b24g.encrypt
                : this.form.b5g.encrypt
            }
          }
        };
      } else {
        // 关闭guest wifi
        params = {
          id: '1',
          enabled: this.form.enabled
        };
      }
      return params;
    }
  },
  methods: {
    onEncryptChange(path, nv, ov) {
      if (nv === EncryptMethod.wpa3) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0692'),
          callback: {
            cancel: () => {
              this.form[path].encrypt = ov;
              console.log('cancel', ov);
            }
          }
        });
      }
    },
    cancel() {
      this.showStatusPage = true;
      this.showSettingPage = false;
      this.showCancelBtn = false;
    },
    toSetting() {
      this.showCancelBtn = true;
      this.showStatusPage = false;
      this.showSettingPage = true;
    },
    guestEnabledChange(enabled) {
      if (enabled) {
        // 由关闭状态切换到启用状态
        this.showSettingPage = true;
        this.showBtn = true;
      } else if (!enabled) {
        // 由启用状态切换到关闭状态
        if (this.setupAndStart) {
          // 编辑当前正在运行的访客wifi
          this.showBtn = false;
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0559'),
            callback: {
              ok: () => {
                this.updateGuestWIFIStatus(false);
                this.showBtn = true;
              },
              cancel: () => {
                this.form.enabled = !enabled;
                this.showBtn = true;
              }
            }
          });
        } else {
          // 新建一个访客wifi
          this.showSettingPage = false;
        }
      }
    },
    formatTime(time) {
      if (time === -1) {
        return this.$t('trans0530');
      }
      const arr = [60, 60, 24];
      const temp = ['00', '00', '00'];
      let index = 0;
      let a = time;
      let b = 0;
      const topArr = [];
      while (index <= arr.length && a > 0) {
        if (index === arr.length) {
          b = a;
        } else {
          b = a % arr[index];
        }
        a = parseInt(a / arr[index], 10);
        if (b < 10) {
          b = `0${b}`;
        }
        topArr.push(b);
        index += 1;
      }
      const topStr = temp
        .map((n, j) => {
          if (topArr[j]) {
            return topArr[j];
          }
          return n;
        })
        .reverse()
        .join(' : ');
      return topStr;
    },
    getDevicesCount() {
      this.$http
        .getDeviceCount({ filters: [{ type: 'guest', status: ['online'] }] })
        .then(res => {
          this.devicesCount = res.data.result.count;
        });
    },
    getGuestWIFI() {
      this.$loading.open();
      this.$http.meshGuestGet().then(res => {
        [this.guest] = res.data.result;
        this.form = {
          id: this.guest.id,
          enabled: this.guest.enabled,
          duration: this.guest.duration,
          b24g: this.guest.bands[Bands.b24g],
          b5g: this.guest.bands[Bands.b5g],
          smart_connect: this.guest.smart_connect
        };
        this.setGuestWIFIStatus(this.guest.enabled);
        this.showBtn = this.guest.enabled;
      });
    },
    setGuestWIFIStatus(enabled) {
      // 清理定时器
      this.clearIntervalTask();
      if (enabled) {
        this.getDevicesCount();
        if (this.guest.remaining_duration > 0 || this.guest.duration === -1) {
          this.setupAndStart = true;
          this.showStatusPage = true;
          this.showSettingPage = false;
          this.createIntervalTask();
        }
      } else {
        this.setupAndStart = false;
        this.showStatusPage = false;
        this.showCancelBtn = false;
      }
      this.$loading.close();
    },
    createIntervalTask() {
      if (this.guest.remaining_duration > 0) {
        this.clearIntervalTask();
        this.guest.remaining_duration -= 1; // 倒计时应该少1s
        this.timer = setInterval(() => {
          this.guest.remaining_duration -= 1;
          if (this.guest.remaining_duration === 0) {
            this.clearIntervalTask();
            this.setupAndStart = false;
            this.showSettingPage = false;
            this.showStatusPage = false;
            this.showCancelBtn = false;
            this.form.enabled = false;
          }
        }, 1000);
      }
    },
    clearIntervalTask() {
      clearInterval(this.timer);
      this.timer = null;
    },
    updateGuestWIFIStatus(enabled) {
      this.$loading.open();
      this.$http
        .meshGuestUpdate(this.formParams)
        .then(() => {
          this.$loading.close();
          this.$reconnect({
            onsuccess: () => {
              if (enabled) {
                this.guest = {
                  ...this.formParams,
                  remaining_duration: this.formParams.duration
                };
                this.showStatusPage = true;
                this.showSettingPage = false;
                this.showCancelBtn = false;
              }
              this.setGuestWIFIStatus(enabled);
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            },
            timeout: 60
          });
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (!this.form.smart_connect && this.form.b24g.ssid.trim() === this.form.b5g.ssid.trim()) {
        this.$toast(this.$t('trans0660'), 3000, 'error');
        return;
      }
      if (this.$refs.form.validate()) {
        if (!this.form.enabled) this.showBtn = false;
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.showBtn = true;
              this.updateGuestWIFIStatus(true);
            },
            cancel: () => {
              this.showBtn = true;
            }
          }
        });
      }
    },
    changeSmartConnect(val) {
      this.form.b5g = Object.assign({}, this.form.b24g);
      if (!val) {
        this.form.b5g.ssid = `${this.form.b24g.ssid}_5G`;
      }
    }
  },
  beforeDestroy() {
    this.clearIntervalTask();
  },
  mounted() {
    this.getGuestWIFI();
  }
};
</script>
<style lang="scss" scoped>
.page-content__main {
  .row-3,
  .row-4 {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 360px);
    gap: 15px;
  }
  .info {
    .card {
      background: transparent;
    }
    .setting-ssid-info {
      p {
        margin: 10px 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .remaining-time,
    .online-device {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      margin: 10px 0;
    }
    .remaining-time {
      .value {
        color: var(--mobile_menu_selected-color);
      }
    }
    .title {
      color: var(--common_gery-color);
    }
    .value {
      display: flex;
      align-items: center;
      font-weight: 700;
      max-width: 165px;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;
      word-break: break-all;
    }
  }
}
.page-content__bottom {
  .cancel {
    .btn-setting {
      width: 240px;
    }
  }
}
@media screen and (max-width: 768px) {
  .page-content__main {
    max-width: 100vw;
    .row-3,
    .row-4 {
      margin-top: 0;
    }
    .row-3 {
      grid-template-columns: 100%;
      grid-template-rows: 100%;
    }
    .row-4 {
      grid-template-columns: 100%;
      grid-template-rows: repeat(auto-fill, 1fr);
      gap: 0;
    }
    .info {
      .setting-ssid-info {
        p {
          grid-template-columns: 100%;
          grid-template-rows: repeat(2, 1fr);
          margin: 15px 0;
          &:first-child {
            margin-top: 0;
          }
        }
      }
      .remaining-time,
      .online-device {
        grid-template-columns: 100%;
        grid-template-rows: repeat(2, 1fr);
        margin: 15px 0;
      }
      .online-device {
        margin-bottom: 0;
      }
    }
  }
  .page-content__bottom {
    .cancel {
      .btn-setting {
        width: 50%;
      }
    }
  }
}
</style>
