<template>
  <div class="wlan-container">
    <div class="step">
      <m-step :option="stepOption"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item step-item1"
           v-show="stepOption.current===0">
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
                             @scanApclient="getMeshApclientScanList"
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
            <button @click="step2()"
                    :disabled="saveDisable"
                    class="btn">{{$t('trans0055')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item step-item2"
           v-show="stepOption.current===1">
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
            <button @click="step3()"
                    class="btn">{{$t('trans0055')}}</button>
          </div>
        </m-form>
      </div>
      <div class="step-item step-item3"
           v-show="stepOption.current===2">
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
import { Bands } from '../../../../../base/src/util/constant';
import wifiIcon from '../../../assets/images/icon/ic_wifi@2x.png';
import { getStringByte, isValidPassword, isFieldHasComma, isFieldHasSpaces } from '../../../../../base/src/util/util';

// Homeway_230v有两种工作模式，可以切换，所在初始化的时候，根据用户需求要做对应设置，要做区分等
// Homeway工作模式默认为有线桥模式，插入网线有线桥模式才可用，同时我们会检测是否插入网线来提示用户是否进行模式切换
// 提示为是否跳过上级设置，如用户点击跳过，则代表初始化时，不传递apClient字段，如果点击不跳过，则代表初始化要传递apClient字段
// 默认有线桥模式，路由器会根据我们是否传递apClient字段来判断与切换Homeway的工作模式,传递了apClient，无论插没插网线，都切换为无线桥，；没传递apClient的情况分 1.默认的有线桥 2.用户点击跳过了上级的设置

const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2
};

export default {
  data() {
    return {
      wifiIcon,
      meshMode: 'bridge',
      stepOption: {
        current: 0,
        steps: [
          { text: this.$t('trans1052'), success: true },
          { text: this.$t('trans0019'), success: false },
          { text: this.$t('trans0018'), success: false }
        ]
      },
      current: 0,
      countdown: 60,
      upperApForm: {
        ssid: '', // 必选
        password: '', // 可选
        bssid: '', // 必选
        channel: '', // 必选
        band: '', // 必选
        security: '', // 必选
        rssi: ''// 可选,上级无线信号的强度.获取APClient时必选,更新时可选
      },
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
      upperApFormRules: {
        'upperApForm.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
        ],
        'upperApForm.password': [
          {
            rule: value => isValidPassword(value, 1, 63),
            message: this.$t('trans1077')
          }
        ]
      },
      config: null,
      pwdDisabled: true,
      originalUpperList: [],
      processedUpperApList: [],
      saveDisable: true,
      selectIsLoading: LoadingStatus.empty,
      loadingText: `${this.$t('trans1070')}...`
    };
  },
  computed: {
    tipsText() {
      return this.wifiForm.smart_connect ? this.$t('trans0922') : this.$t('trans0921');
    }
  },
  watch: {
    // upperAp表单验证:由于密码是否验证是根据用户选择的上级是否有加密方式来决定的,所有制定两套验证规则
    pwdDisabled(nv) {
      if (nv === true) {
        this.upperApFormRules = {
          // 这一套只验证ssid是否为空
          'upperApForm.ssid': [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
          ],
        };
      } else {
        this.upperApFormRules = {
          // 这一套要验证ssid和密码
          'upperApForm.ssid': [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
          ],
          'upperApForm.password': [
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
        };
      }
    },
  },
  mounted() {
    this.getWanStatus();
    this.$http
      .login(
        { password: '' },
        {
          hideToast: true
        }
      ).then(() => {
        this.getMeshApclientScanList();
        this.getMeshMeta();
      })
      .catch(() => {
        // password is not empty, go to login page
        this.$router.push({ path: '/login' });
      });
  },
  methods: {
    skipSetUpper() {
      this.stepOption.current = 1;
      this.stepOption.steps[1].success = true;
      this.upperApForm = {
        ssid: '', // 必选
        password: '', // 可选
        bssid: '', // 必选
        channel: '', // 必选
        band: '', // 必选
        security: '', // 必选
        rssi: ''// 可选,上级无线信号的强度.获取APClient时必选,更新时可选};
      };
    },
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
    getWanStatus() {
      this.$http.getWanStatus()
        .then(res => {
          console.log(res);
          const { status } = res.data.result;
          if (status !== 'unlinked') { // 如果插入了网线，就弹窗提示，可跳过上级设置
            this.$dialog.confirm({
              okText: this.$t('trans0163'),
              cancelText: this.$t('trans1055'),
              message: [this.$t('trans1053'), this.$t('trans1054')],
              callback: {
                ok: () => {
                  this.skipSetUpper();
                },
                cancel: () => {
                  this.meshMode = 'wireless_bridge';
                }
              }
            });
          }
        });
    },
    getMeshApclientScanList() {
      this.selectIsLoading = LoadingStatus.loading;

      this.$http.getMeshApclientScanList()
        .then(res => {
          this.originalUpperList = [];
          this.processedUpperApList = [];
          const { result } = res.data;
          result.sort((a, b) => b.rssi - a.rssi);
          this.originalUpperList = result;
          result.map(i => this.processedUpperApList.push({
            value: i.ssid, text: `${i.ssid}  ${i.rssi}`, encrypt: i.security, rssi: i.rssi
          }));
        })
        .catch(() => {
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1078');
          this.selectIsLoading = LoadingStatus.failed;
        });
    },
    selectedChange(option) {
      this.pwdDisabled = option.encrypt === 'open';
      this.saveDisable = false;
      const { ssid, password, bssid, channel, band, security, rssi } = this.originalUpperList.find((i) => i.ssid === option.value);
      this.upperApForm = {
        ssid,
        password,
        bssid,
        channel,
        band,
        security,
        rssi
      };
    },
    step2() {
      if (this.$refs.upperApForm.validate()) {
        console.log('upperApInfo is', this.upperApForm);
        this.stepOption.current = 1;
        this.stepOption.steps[1].success = true;
      }
    },
    step3() {
      if (this.$refs.wifiForm.validate()) {
        if (this.wifiForm.smart_connect) {
          this.wifiForm.password5g = this.wifiForm.password24g;
        }
        if (this.meshMode === 'wireless_bridge') {
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
            mode: 'wireless_bridge',
            apclient: this.upperApForm
          };
        } else {
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
            mode: 'bridge'
          };
        }
        console.log('meshMode', this.meshMode);
        console.log('config#######', this.config);
        // 提交表单
        this.$http
          .updateMeshConfig({ config: this.config })
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
      width: 100%;
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
