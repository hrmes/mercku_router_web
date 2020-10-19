<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0103')}}
    </div>
    <div class="page-content wifi">
      <div class="smart-connect">
        <div class="smart-connect__inner">
          <label class="smart-connect__label">{{$t('trans0397')}}</label>
          <m-switch class="smart-connect__switch"
                    :onChange="changeSmartConnect"
                    v-model="form.smart_connect" />
        </div>
        <div class="smart-connect__tip">{{$t('trans0398')}}</div>
      </div>
      <!-- 双频合一 -->
      <template v-if="form.smart_connect">
        <m-form class="form"
                ref="smartForm"
                key="smartForm"
                :model="form"
                :rules='rules'>
          <m-form-item key="b24gssid"
                       class="item margin-bottom--small"
                       prop='b24g.ssid'>
            <m-input v-model="form.b24g.ssid"
                     :label="$t('trans0168')"
                     type='text'
                     :placeholder="`${$t('trans0321')}`"></m-input>
          </m-form-item>
          <div class="form-item check-info">
            <label for=""> {{$t('trans0110')}}
              <div class="tool">
                <m-popover position="bottom left"
                           style="top:-7px"
                           :title="this.$t('trans0110')"
                           :content="this.$t('trans0325')">
                  <img width="14"
                       src="../../../assets/images/icon/ic_question.png"
                       alt="">
                </m-popover>
              </div>
            </label>
            <m-switch v-model="form.b24g.hidden" />
          </div>
          <m-form-item key="b24gencrypt"
                       class="form__item">
            <m-select :label="$t('trans0522')"
                      v-model="form.b24g.encrypt"
                      :options="options"></m-select>
          </m-form-item>
          <m-form-item key="b24gpassword"
                       class="item"
                       prop='b24g.password'
                       v-show="isB24gShowPwdInput">
            <m-input v-model="form.b24g.password"
                     :label="$t('trans0172')"
                     type='password'
                     :placeholder="`${$t('trans0321')}`"></m-input>
          </m-form-item>
          <!-- 2.4g -->
          <div class="form-header">
            <label>{{$t('trans0677')}}</label>
            <m-switch :onChange="enabled => changeSwitch(enabled, Bands.b24g)"
                      v-model="form.b24g.enabled" />
          </div>
          <template v-if="isB24gSmartForm">
            <m-form-item key="b24gchannelnumber"
                         class="form__item">
              <m-select :label="$t('trans0680')"
                        v-model="form.b24g.channel.number"
                        :options="channels.b24g"></m-select>
            </m-form-item>
            <div class="form-item">
              <m-checkbox v-model="form.b24g.channel.auto_select"
                          :text="$t('trans0725')"></m-checkbox>
              <div class="form__tip">{{ $t('trans0726') }}</div>
            </div>
            <m-form-item key="b24gbandwidth"
                         class="form__item">
              <m-select :label="$t('trans0632')"
                        v-model="form.b24g.channel.bandwidth"
                        :options="bandwidths.b24g"></m-select>
            </m-form-item>
            <m-form-item key="b24gpower"
                         class="form__item">
              <m-select :label="$t('trans0728')"
                        v-model="form.b24g.power"
                        :options="signalIntensityList"></m-select>
              <div class="form__tip">{{ $t('trans0727') }}</div>
            </m-form-item>
          </template>
          <!-- 5g -->
          <div class="form-header">
            <label>{{$t('trans0679')}}</label>
            <m-switch :onChange="enabled => changeSwitch(enabled, Bands.b5g)"
                      v-model="form.b5g.enabled" />
          </div>
          <template v-if="isB5gSmartForm">
            <m-form-item key="b5gchannelnumber"
                         class="form__item">
              <m-select :label="$t('trans0681')"
                        v-model="form.b5g.channel.number"
                        :options="channels.b5g"></m-select>
            </m-form-item>
            <div class="form-item">
              <m-checkbox v-model="form.b5g.channel.auto_select"
                          :text="$t('trans0725')"></m-checkbox>
              <div class="form__tip">{{ $t('trans0726') }}</div>
            </div>
            <m-form-item key="b5gbandwidth"
                         class="form__item">
              <m-select :label="$t('trans0632')"
                        v-model="form.b5g.channel.bandwidth"
                        :options="bandwidths.b5g"></m-select>
            </m-form-item>
            <m-form-item key="b5gpower"
                         class="form__item">
              <m-select :label="$t('trans0728')"
                        v-model="form.b5g.power"
                        :options="signalIntensityList"></m-select>
              <div class="form__tip">{{ $t('trans0727') }}</div>
            </m-form-item>
          </template>
        </m-form>
      </template>
      <!-- 分开广播 -->
      <template v-if="!form.smart_connect">
        <m-form class="form"
                ref="form"
                key="form"
                :model="form"
                :rules='rules'>
          <!-- 2.4g -->
          <div class="form-header">
            <label>{{$t('trans0677')}}</label>
            <m-switch :onChange="enabled => changeSwitch(enabled, Bands.b24g)"
                      v-model="form.b24g.enabled" />
          </div>
          <template v-if="isB24gForm">
            <m-form-item key="b24gssid"
                         class="item margin-bottom--small"
                         prop='b24g.ssid'>
              <m-input v-model="form.b24g.ssid"
                       :label="$t('trans0168')"
                       type='text'
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <div class="form-item check-info">
              <label for=""> {{$t('trans0110')}}
                <div class="tool">
                  <m-popover position="bottom left"
                             style="top:-7px"
                             :title="this.$t('trans0110')"
                             :content="this.$t('trans0325')">
                    <img width="14"
                         src="../../../assets/images/icon/ic_question.png"
                         alt="">
                  </m-popover>
                </div>
              </label>
              <m-switch v-model="form.b24g.hidden" />
            </div>
            <m-form-item key="b24gencrypt"
                         class="form__item">
              <m-select :label="$t('trans0522')"
                        v-model="form.b24g.encrypt"
                        :options="options"></m-select>
            </m-form-item>
            <m-form-item key="b24gpassword"
                         class="form__item"
                         prop="b24g.password"
                         v-show="isB24gShowPwdInput">
              <m-input v-model="form.b24g.password"
                       :label="$t('trans0172')"
                       type='password'
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item key="b24gchannelnumber"
                         class="form__item margin-bottom--small">
              <m-select :label="$t('trans0680')"
                        v-model="form.b24g.channel.number"
                        :options="channels.b24g"></m-select>
            </m-form-item>
            <div class="form-item">
              <m-checkbox v-model="form.b24g.channel.auto_select"
                          :text="$t('trans0725')"></m-checkbox>
              <div class="form__tip">{{ $t('trans0726') }}</div>
            </div>
            <m-form-item key="b24gbandwidth"
                         class="form__item">
              <m-select :label="$t('trans0632')"
                        v-model="form.b24g.channel.bandwidth"
                        :options="bandwidths.b24g"></m-select>
            </m-form-item>
            <m-form-item key="b24gpower"
                         class="form__item">
              <m-select :label="$t('trans0728')"
                        v-model="form.b24g.power"
                        :options="signalIntensityList"></m-select>
              <div class="form__tip">{{ $t('trans0727') }}</div>
            </m-form-item>
          </template>
          <!-- 5g -->
          <div class="form-header">
            <label>{{$t('trans0679')}}</label>
            <m-switch :onChange="enabled => changeSwitch(enabled, Bands.b5g)"
                      v-model="form.b5g.enabled" />
          </div>
          <template v-if="isB5gForm">
            <m-form-item key="b5gssid"
                         class="item margin-bottom--small"
                         prop='b5g.ssid'>
              <m-input v-model="form.b5g.ssid"
                       :label="$t('trans0168')"
                       type='text'
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <div class="form-item check-info">
              <label for=""> {{$t('trans0110')}}
                <div class="tool">
                  <m-popover position="bottom left"
                             style="top:-7px"
                             :title="$t('trans0110')"
                             :content="$t('trans0325')">
                    <img width="14"
                         src="../../../assets/images/icon/ic_question.png"
                         alt="">
                  </m-popover>
                </div>
              </label>
              <m-switch v-model="form.b5g.hidden" />
            </div>
            <m-form-item key="b5gencrypt"
                         class="form__item">
              <m-select :label="$t('trans0522')"
                        v-model="form.b5g.encrypt"
                        :options="options"></m-select>
            </m-form-item>
            <m-form-item class="item"
                         key="b5gpassword"
                         prop="b5g.password"
                         v-show="isB5gShowPwdInput">
              <m-input v-model="form.b5g.password"
                       :label="$t('trans0172')"
                       type='password'
                       :placeholder="$t('trans0321')"></m-input>
            </m-form-item>
            <m-form-item class="form__item"
                         key="b5gchannelnumber">
              <m-select :label="$t('trans0681')"
                        v-model="form.b5g.channel.number"
                        :options="channels.b5g"></m-select>
            </m-form-item>
            <div class="form-item">
              <m-checkbox v-model="form.b5g.channel.auto_select"
                          :text="$t('trans0725')"></m-checkbox>
              <div class="form__tip">{{ $t('trans0726') }}</div>
            </div>
            <m-form-item key="b5gbandwidth"
                         class="form__item">
              <m-select :label="$t('trans0632')"
                        v-model="form.b5g.channel.bandwidth"
                        :options="bandwidths.b5g"></m-select>
            </m-form-item>
            <m-form-item key="b5gpower"
                         class="form__item">
              <m-select :label="$t('trans0728')"
                        v-model="form.b5g.power"
                        :options="signalIntensityList"></m-select>
              <div class="form__tip">{{ $t('trans0727') }}</div>
            </m-form-item>
          </template>
        </m-form>
      </template>
      <!-- 保存 -->
      <div class="form-button">
        <button class="btn"
                v-defaultbutton
                @click='submit()'>{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getStringByte, passwordRule } from '@/util/util';

const Bands = {
  b24g: '2.4G',
  b5g: '5G'
};
const SignalIntensity = {
  low: 'low',
  mid: 'mid',
  high: 'high'
};
const ModeType = {
  auto: 'auto',
  manual: 'manual'
};
const EncryptType = {
  open: 'open',
  wpawpa2: 'wpawpa2',
  wpa2: 'wpa2',
  wpa: 'wpa'
};

export default {
  data() {
    return {
      Bands,
      form: {
        smart_connect: true,
        b24g: {
          ssid: '',
          password: '',
          hidden: false,
          encrypt: SignalIntensity.open,
          enabled: false, // 是否使用
          power: SignalIntensity.high,
          channel: {
            mode: ModeType.manual,
            number: 11, // 信道号
            bandwidth: 20, // 频宽
            auto_select: false // 动态信道选择
          }
        },
        b5g: {
          ssid: '',
          password: '',
          hidden: false,
          encrypt: SignalIntensity.open,
          enabled: false,
          power: SignalIntensity.high,
          channel: {
            mode: ModeType.manual,
            number: 40,
            bandwidth: 80,
            auto_select: false
          }
        }
      },
      signalIntensityList: [
        {
          value: SignalIntensity.low,
          text: this.$t('trans0731')
        },
        {
          value: SignalIntensity.mid,
          text: this.$t('trans0730')
        },
        {
          value: SignalIntensity.high,
          text: this.$t('trans0729')
        }
      ],
      options: [
        {
          value: EncryptType.open,
          text: this.$t('trans0554')
        },
        {
          value: EncryptType.wpawpa2,
          text: this.$t('trans0557')
        },
        {
          value: EncryptType.wpa2,
          text: this.$t('trans0556')
        },
        {
          value: EncryptType.wpa,
          text: this.$t('trans0555')
        }
      ],
      rules: {
        'b24g.ssid': [
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          }
        ],
        'b24g.password': [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ],
        'b5g.ssid': [
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          }
        ],
        'b5g.password': [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ]
      },
      channels: {
        b24g: [],
        b5g: []
      },
      bandwidths: {
        b24g: new Array(2).fill(0).map((_, i) => {
          const v = Math.pow(2, i) * 20;
          return {
            text: v,
            value: v
          };
        }),
        b5g: new Array(3).fill(0).map((_, i) => {
          const v = Math.pow(2, i) * 20;
          return {
            text: v,
            value: v
          };
        })
      }
    };
  },
  computed: {
    isB24gForm() {
      return !this.form.smart_connect && this.form.b24g.enabled;
    },
    isB5gForm() {
      return !this.form.smart_connect && this.form.b5g.enabled;
    },
    isB24gSmartForm() {
      return this.form.smart_connect && this.form.b24g.enabled;
    },
    isB5gSmartForm() {
      return this.form.smart_connect && this.form.b5g.enabled;
    },
    isB24gShowPwdInput() {
      if (this.form.b24g.encrypt === EncryptType.open) {
        this.form.b24g.password = '';
        this.rules['b24g.password'] = [];
      } else {
        this.rules['b24g.password'] = [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ];
      }
      return this.form.b24g.encrypt !== EncryptType.open;
    },
    isB5gShowPwdInput() {
      if (this.form.b5g.encrypt === EncryptType.open) {
        this.form.b5g.password = '';
        this.rules['b24g.password'] = [];
      } else {
        this.rules['b5g.password'] = [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ];
      }
      return this.form.b5g.encrypt !== EncryptType.open;
    }
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    changeSmartConnect() {
      // 开关变化后，始终保持5G的参数和2.4G的一致
      this.form.b5g.ssid = this.form.b24g.ssid;
      this.form.b5g.hidden = this.form.b24g.hidden;
      this.form.b5g.encrypt = this.form.b24g.encrypt;
      this.form.b5g.password = this.form.b24g.password;
    },
    changeSwitch(enabled, type) {
      if (enabled) {
        // 由关闭状态切换到启用状态
        this.checkSwitchStatus(enabled, type);
      } else {
        // 由启用状态切换到关闭状态
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0724'),
          callback: {
            ok: () => {
              this.checkSwitchStatus(enabled, type);
            },
            cancel: () => {
              this.checkSwitchStatus(true, type);
            }
          }
        });
      }
    },
    checkSwitchStatus(enabled, type) {
      switch (type) {
        case Bands.b24g:
          this.form.b24g.enabled = enabled;
          break;
        case Bands.b5g:
          this.form.b5g.enabled = enabled;
          break;
        default:
          console.log('error');
      }
    },
    submit() {
      if (this.form.smart_connect) {
        if (!this.$refs.smartForm.validate()) {
          return;
        }
        this.submitFormData();
      } else {
        if (!this.$refs.form.validate()) {
          return;
        }
        // 表单验证通过且ssid不一致
        if (this.form.b24g.ssid === this.form.b5g.ssid) {
          this.$toast(this.$t('trans0660'), 3000, 'error');
          return;
        }
        this.submitFormData();
      }
    },
    submitFormData() {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            const b24g = this.getFormData('b24g');
            const b5g = this.getFormData('b5g');
            const wifi = {
              smart_connect: this.form.smart_connect,
              bands: {
                [Bands.b24g]: b24g,
                [Bands.b5g]: b5g
              }
            };
            this.$http.meshWifiUpdate(wifi).then(() => {
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/dashboard' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/unconnect' });
                },
                timeout: 60
              });
            });
          }
        }
      });
    },
    getFormData(type) {
      const channel = {
        bandwidth: this.form[type].channel.bandwidth,
        auto_select: this.form[type].channel.auto_select
      };
      const number = `${this.form[type].channel.number}`;
      if (number === ModeType.auto || number.indexOf('(') > -1) {
        channel.mode = ModeType.auto;
        delete channel.number;
      } else {
        channel.mode = ModeType.manual;
        channel.number = this.form[type].channel.number;
      }
      return {
        hidden: this.form[type].hidden,
        ssid: this.form[type].ssid,
        password: this.form[type].password,
        encrypt: this.form[type].encrypt,
        enabled: this.form[type].enabled,
        power: this.form[type].power,
        channel
      };
    },
    getInitData() {
      this.$loading.open();

      Promise.all([this.$http.getMeshMeta(), this.$http.getSupportChannel()])
        .then(resultArr => {
          const wifi = resultArr[0].data.result;
          const channels = resultArr[1].data.result;
          this.channels.b24g = channels[Bands.b24g].numbers.map(number => ({
            value: number,
            text: number
          }));
          this.channels.b24g.unshift({
            value: ModeType.auto,
            text: this.$t('trans0455')
          });
          this.channels.b5g = channels[Bands.b5g].numbers.map(number => ({
            value: number,
            text: number
          }));
          this.channels.b5g.unshift({
            value: ModeType.auto,
            text: this.$t('trans0455')
          });

          // 2.4G
          const b24g = wifi.bands[Bands.b24g];
          this.form.b24g.ssid = b24g.ssid;
          this.form.b24g.encrypt = b24g.encrypt;
          this.form.b24g.password = b24g.password;
          this.form.b24g.hidden = b24g.hidden;
          this.form.b24g.enabled = b24g.enabled;
          this.form.b24g.power = b24g.power;
          this.form.b24g.channel.bandwidth = b24g.channel.bandwidth;
          this.form.b24g.channel.auto_select = b24g.channel.auto_select;
          this.form.b24g.channel.mode = b24g.channel.mode;
          if (this.form.b24g.channel.mode === ModeType.auto) {
            this.form.b24g.channel.number = `${ModeType.auto}(${b24g.channel.number})`;
          } else {
            this.form.b24g.channel.number = b24g.channel.number;
          }

          // 5G
          const b5g = wifi.bands[Bands.b5g];
          this.form.b5g.ssid = b5g.ssid;
          this.form.b5g.encrypt = b5g.encrypt;
          this.form.b5g.password = b5g.password;
          this.form.b5g.hidden = b5g.hidden;
          this.form.b5g.enabled = b5g.enabled;
          this.form.b5g.power = b5g.power;
          this.form.b5g.channel.bandwidth = b5g.channel.bandwidth;
          this.form.b5g.channel.auto_select = b5g.channel.auto_select;
          this.form.b5g.channel.mode = b5g.channel.mode;
          if (this.form.b5g.channel.mode === ModeType.auto) {
            this.form.b5g.channel.number = `${this.$t('trans0455')}(${
              b5g.channel.number
            })`;
          } else {
            this.form.b5g.channel.number = b5g.channel.number;
          }

          // smart_connect
          this.form.smart_connect = wifi.smart_connect;

          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.smart-connect {
  flex-direction: column;
  width: 340px;
  padding-bottom: 20px;

  .smart-connect__inner {
    display: flex;
  }
  .smart-connect__label {
    font-weight: bold;
    color: #333;
  }
  .smart-connect__switch {
    margin-left: 15px;
  }
  .smart-connect__tip {
    font-size: 12px;
    color: #999;
    margin-top: 14px;
  }
}
.form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 340px;
  .form-header {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .form-header__img {
      width: 16px;
      margin-right: 10px;
    }
    .form-header__title {
      color: #999;
    }
  }
  .margin-bottom--small {
    margin-bottom: 15px !important;
  }
  .check-info {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    // margin-top: 0;
    label {
      display: flex;
      width: 120px;
      font-weight: bold;
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
      margin-left: 5px;
      img {
        position: relative;
        cursor: pointer;
      }
    }
  }
  .form__tip {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
  + .form {
    padding-top: 20px;
    margin-top: 0;
  }
}
.form-button {
  margin-bottom: 150px;
}
@media screen and (max-width: 768px) {
  .smart-connect {
    width: 100%;
  }
  .form {
    .check-info {
      display: flex;
      align-items: center;
      label {
        margin-right: 2px;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
</style>
