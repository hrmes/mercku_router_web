<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{ $t('trans0103') }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <!-- smart_connect -->
          <div class="smart-connect card">
            <div class="smart-connect__inner">
              <m-switch class="smart-connect__switch"
                        @change="changeSmartConnect"
                        v-model="form.smart_connect"
                        :label="$t('trans0397')" />
            </div>
            <div class="des-tips">{{ $t('trans0398') }}</div>
          </div>
          <!-- compatible with wifi5 -->
          <div class="smart-connect card">
            <div class="smart-connect__inner">
              <m-switch class="smart-connect__switch"
                        v-model="form.compatibility_mode"
                        :label="$t('trans0877')" />
            </div>
            <div class="des-tips">{{ $t('trans0878') }}</div>
          </div>
        </div>
        <div class="row-2">
          <!-- wifi 2.4g -->
          <m-form class="form card"
                  ref="b24gForm"
                  key="b24gform"
                  :model="form"
                  :rules="rules">
            <m-form-item key="b24genabled"
                         prop="b24g.enabled">
              <m-switch v-model="form.b24g.enabled"
                        disabled
                        :label="form.smart_connect?'Wi-Fi':$t('trans0677')"></m-switch>
            </m-form-item>
            <m-form-item key="b24gssid"
                         prop="b24g.ssid">
              <m-input v-model="form.b24g.ssid"
                       :label="$t('trans0168')"
                       type="text"
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item key="b24gencrypt">
              <m-select :label="$t('trans0522')"
                        v-model="form.b24g.encrypt"
                        @change="(nv, ov) => onEncryptChange('b24g', nv, ov)"
                        :options="encryptMethods"></m-select>
            </m-form-item>
            <m-form-item key="b24gpassword"
                         v-if="!isOpen('b24g')"
                         prop="b24g.password">
              <m-input v-model="form.b24g.password"
                       :label="$t('trans0172')"
                       type="password"
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item class="check-info">
              <m-checkbox v-model="form.b24g.hidden"
                          :rect='false'
                          :text="$t('trans0110')"
                          :bold='true'
                          style="margin-right:10px" />
              <div class="tool">
                <m-popover position="bottom left"
                           :title="this.$t('trans0110')"
                           :content="this.$t('trans0325')">
                  <i class="iconfont ic_help"
                     style="font-size:14px"></i>
                </m-popover>
              </div>
            </m-form-item>
          </m-form>
          <!-- wifi 5g -->
          <m-form v-show="!form.smart_connect"
                  class="form card"
                  ref="b5gForm"
                  key="b5gform"
                  :model="form"
                  :rules="rules">
            <m-form-item key="b5genabled"
                         prop="b5g.enabled">
              <m-switch v-model="form.b5g.enabled"
                        disabled
                        :label="$t('trans0679')"></m-switch>
            </m-form-item>
            <m-form-item key="b5gssid"
                         prop="b5g.ssid">
              <m-input v-model="form.b5g.ssid"
                       :label="$t('trans0168')"
                       type="text"
                       :placeholder="`${$t('trans0321')}`"></m-input>
            </m-form-item>
            <m-form-item key="b5gencrypt">
              <m-select :label="$t('trans0522')"
                        v-model="form.b5g.encrypt"
                        @change="(nv, ov) => onEncryptChange('b5g', nv, ov)"
                        :options="encryptMethods"></m-select>
            </m-form-item>

            <m-form-item v-if="!isOpen('b5g')"
                         key="b5gpassword"
                         prop="b5g.password">
              <m-input v-model="form.b5g.password"
                       :label="$t('trans0172')"
                       type="password"
                       :placeholder="$t('trans0321')"></m-input>
            </m-form-item>
            <m-form-item class="check-info">
              <m-checkbox v-model="form.b5g.hidden"
                          :rect='false'
                          :text="$t('trans0110')"
                          :bold='true'
                          style="margin-right:10px" />
              <div class="tool">
                <m-popover position="bottom left"
                           :title="$t('trans0110')"
                           :content="$t('trans0325')">
                  <i class="iconfont ic_help"
                     style="font-size:14px"></i>
                </m-popover>
              </div>
            </m-form-item>
          </m-form>
          <!-- channel -->
          <m-form class="form card"
                  ref="channelForm"
                  key="channelform"
                  :model="form">
            <div class="form-header">
              <span class="form-header__title">{{$t('trans0782')}}</span>
            </div>
            <m-form-item key="b24gchannelnumber">
              <m-select :label="$t('trans0680')"
                        :disabled="isAutoChannel"
                        v-model="form.channel.b24gChannel.number"
                        :options="channels.b24g"></m-select>
            </m-form-item>
            <m-form-item key="b5gchannelnumber">
              <m-select :label="$t('trans0681')"
                        :disabled="isAutoChannel"
                        v-model="form.channel.b5gChannel.number"
                        :options="channels.b5g"></m-select>
            </m-form-item>
            <!-- DFS -->
            <!-- <m-form-item key="dfs">
              <m-switch v-model="form.dfs"
                        :label="$t('trans1231')"
                        @change="onDFSChange" />
            </m-form-item> -->
            <!-- AUTO Channel -->
            <m-form-item key="autochannel"
                         class="check-info">
              <m-switch v-model="isAutoChannel"
                        :label="$t('trans0781')" />
            </m-form-item>
          </m-form>
          <!-- channel width -->
          <m-form class="form card"
                  ref="channelWdithForm"
                  key="channelWdithForm"
                  :model="form">
            <div class="form-header">
              <span class="form-header__title">{{$t('trans0632')}}</span>
            </div>
            <m-form-item key="b24gbandwidth">
              <m-select :label="$t('trans0783')"
                        v-model="form.channel.b24gChannel.bandwidth"
                        :options="bandwidths.b24g"></m-select>
            </m-form-item>
            <m-form-item key="b5gbandwidth-1"
                         class="last">
              <m-select :label="$t('trans0784')"
                        v-model="form.channel.b5gChannel.bandwidth"
                        :options="bandwidths.b5g"></m-select>
            </m-form-item>
          </m-form>
          <!-- Txpower -->
          <m-form class="form card"
                  ref="wifiTxPowerForm"
                  key="wifiTxPowerform"
                  :model="form">
            <div class="form-header">
              <span class="form-header__title">{{ $t('trans1088') }}</span>
            </div>
            <m-form-item key="wifiTxPower"
                         class="last">
              <m-select v-model="form.wifiTxPower"
                        :options="wifi_TxPowerList"></m-select>
            </m-form-item>
          </m-form>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">
            {{ $t('trans0081') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
  isFieldHasSpaces
} from 'base/util/util';
import { EncryptMethod, Bands, ChannelMode } from 'base/util/constant';
import encryptMix from 'base/mixins/encrypt-methods';

export default {
  mixins: [encryptMix],
  data() {
    return {
      form: {
        smart_connect: true,
        compatibility_mode: false,
        // dfs: true,
        b24g: {
          ssid: '',
          password: '',
          enabled: true,
          hidden: false,
          encrypt: EncryptMethod.wpa2
        },
        b5g: {
          ssid: '',
          password: '',
          enabled: true,
          hidden: false,
          encrypt: EncryptMethod.wpa2
        },
        channel: {
          b24gChannel: {
            number: '1',
            bandwidth: '20'
          },
          b5gChannel: {
            number: '1',
            bandwidth: '80'
          }
        },
        tx_power: ''
      },
      rules: {
        'b24g.ssid': [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          },
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          },
          {
            rule: value => getStringByte(value.trim()) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: () => this.validateSsid5G(),
            message: this.$t('trans0660')
          }
        ],
        'b24g.password': [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => !/^\s*$/g.test(value.trim()),
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
        'b5g.ssid': [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1021')
          },
          {
            rule: value => !/^\s*$/g.test(value.trim()),
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
        'b5g.password': [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => !/^\s*$/g.test(value.trim()),
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
      },
      channels: {
        b24g: [],
        b5g: []
      },
      wifi_TxPowerList: [
        { value: 'high', text: this.$t('trans1089') },
        { value: 'medium', text: this.$t('trans1090') },
        { value: 'low', text: this.$t('trans1091') }
      ],
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
      },
      encryptMethods: [
        {
          value: EncryptMethod.open,
          text: this.$t('trans0554')
        },
        {
          value: EncryptMethod.wpa2,
          text: this.$t('trans0556')
        },
        {
          value: EncryptMethod.wpa3,
          text: this.$t('trans0572')
        }
      ],
      isAutoChannel: false
    };
  },
  mounted() {
    this.getInitData();
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
    validateSsid5G() {
      if (!this.form.smart_connect && this.form.b24g.ssid) {
        return this.form.b24g.ssid !== this.form.b5g.ssid;
      }
      return true;
    },
    changeSmartConnect() {
      const { form } = this;
      form.b5g.enabled = form.b24g.enabled;
      form.b5g.hidden = form.b24g.hidden;
      form.b5g.ssid = form.smart_connect
        ? form.b24g.ssid
        : `${form.b24g.ssid}_5G`;
      form.b5g.password = form.b24g.password;
      form.b5g.encrypt = form.b24g.encrypt;
    },
    isOpen(band) {
      return this.form[band].encrypt === EncryptMethod.open;
    },
    submit() {
      let validResult1 = true;
      let validResult2 = true;

      validResult1 = this.$refs.b24gForm.validate();
      if (!this.form.smart_connect) {
        // 表单验证通过且ssid不一致
        validResult2 = this.$refs.b5gForm.validate();
        if (this.form.b24g.ssid === this.form.b5g.ssid) {
          this.$toast(this.$t('trans0660'), 2000, 'error');
          return;
        }
      }

      if (!validResult1 || !validResult2) {
        return;
      }

      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();

            const b24g = this.mapBandData(
              this.form.b24g,
              this.form.channel.b24gChannel
            );

            const b5gBandInfo = this.form.smart_connect
              ? this.form.b24g
              : this.form.b5g;
            const b5g = this.mapBandData(
              b5gBandInfo,
              this.form.channel.b5gChannel
            );

            const wifi = {
              smart_connect: this.form.smart_connect,
              compatibility_mode: this.form.compatibility_mode,
              tx_power: this.form.wifiTxPower,
              // dfs: this.form.dfs,
              bands: { [Bands.b24g]: b24g, [Bands.b5g]: b5g }
            };
            console.log(wifi);

            this.$http
              .meshWifiUpdate(wifi)
              .then(() => {
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
    getInitData() {
      this.$loading.open();
      Promise.all([this.$http.getMeshMeta(), this.$http.getSupportChannel()])
        .then(([wifiResult, channelsResult]) => {
          const wifi = wifiResult.data.result;
          const channels = channelsResult.data.result;

          this.channels.b24g = this.mapChannelNumbers(
            channels[Bands.b24g].numbers
          );
          this.channels.b5g = this.mapChannelNumbers(
            channels[Bands.b5g].numbers
          );

          // 2.4G
          const b24g = wifi.bands[Bands.b24g];
          this.form.b24g.ssid = b24g.ssid;
          this.form.b24g.encrypt = b24g.encrypt;
          this.form.b24g.password = b24g.password;
          this.form.b24g.enabled = b24g.enabled;
          this.form.b24g.hidden = b24g.hidden;

          // 5G
          const b5g = wifi.bands[Bands.b5g];
          this.form.b5g.ssid = b5g.ssid;
          this.form.b5g.encrypt = b5g.encrypt;
          this.form.b5g.password = b5g.password;
          this.form.b5g.enabled = b5g.enabled;
          this.form.b5g.hidden = b5g.hidden;

          // channel
          this.form.channel.b24gChannel.number = b24g.channel.number;
          this.form.channel.b24gChannel.bandwidth = b24g.channel.bandwidth;
          this.form.channel.b5gChannel.number = b5g.channel.number;
          this.form.channel.b5gChannel.bandwidth = b5g.channel.bandwidth;
          if (
            b24g.channel.mode === ChannelMode.auto &&
            b5g.channel.mode === ChannelMode.auto
          ) {
            this.isAutoChannel = true;
          }

          // smart_connect
          this.form.smart_connect = wifi.smart_connect;
          this.form.compatibility_mode = wifi.compatibility_mode;
          // DFS
          // this.form.dfs = wifi.dfs || true;

          // wifi Tx_power
          this.form.wifiTxPower = wifi.tx_power || 'high';
        });
    },
    mapBandData(formBand, channel) {
      return {
        enabled: formBand.enabled,
        hidden: formBand.hidden,
        ssid: formBand.ssid,
        password: formBand.password,
        encrypt: formBand.encrypt,
        channel: {
          mode: this.isAutoChannel ? ChannelMode.auto : ChannelMode.manual,
          number: channel.number,
          bandwidth: channel.bandwidth
        }
      };
    },
    mapChannelNumbers(numbers) {
      return numbers.map(number => ({
        value: number,
        text: number
      }));
    },
    // onDFSChange(val) {
    //   if (!val) {
    //     this.$dialog.confirm({
    //       okText: this.$t('trans0024'),
    //       cancelText: this.$t('trans0025'),
    //       title: this.$t('trans1233'),
    //       message: this.$t('trans1234'),
    //       callback: {
    //         ok: () => {
    //           this.form.dfs = false;
    //         },
    //         cancel: () => {
    //           this.form.dfs = true;
    //         }
    //       }
    //     });
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.smart-connect {
  flex-direction: column;
  width: 360px;
  .smart-connect__inner {
    display: flex;
  }
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
@media screen and (max-width: 768px) {
  .smart-connect {
    width: 100%;
    padding-bottom: 30px;
  }
}
</style>
