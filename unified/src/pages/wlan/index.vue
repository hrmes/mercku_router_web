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
          <m-form-item class="form-item">
            <p class="step-tips">{{$t('trans0167')}}</p>
          </m-form-item>
          <m-form-item class="form-item"
                       prop="region_id">
            <m-select :label="$t('trans0639')"
                      v-model="wifiForm.region_id"
                      :options="regionsList" />
            <div class="tip-label">{{$t('trans0646')}}</div>
          </m-form-item>
          <m-form-item class="form-item"
                       prop="smart_connect">
            <m-switch :label="$t('trans0397')"
                      @change="changeSmartConnect"
                      v-model="wifiForm.smart_connect" />
            <div class="tip-label">{{$t('trans0398')}}</div>
          </m-form-item>
          <div class="form-header">
            <span class="form-header__title">
              {{ wifiForm.smart_connect ? 'Wi-Fi' : $t('trans0677') }}
            </span>
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
      <div class="step-item step-item2"
           v-show="stepOption.current===1">
        <m-loading :color="loadingColor"
                   :size="36"></m-loading>
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

        <div class="info-container wifi">
          <div class="form-header"
               v-if="wifiForm.smart_connect">
            <span class="form-header__title">{{$t('trans0168')}}</span>
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
             class="info-container wifi">
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
</template>
<script>
import { Bands } from 'base/util/constant';
import { getStringByte, isValidPassword, isFieldHasComma } from 'base/util/util';

export function resolveRegionCatalogue(locale, defaultLocale, loadCatalogue) {
  const locales = [locale, defaultLocale, 'en-US']
    .filter((item, index, list) => item && list.indexOf(item) === index);
  let lastError;

  for (let index = 0; index < locales.length; index += 1) {
    try {
      return loadCatalogue(locales[index]);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function toRegionOptions(catalogue) {
  return catalogue.map(region => ({
    text: region.name,
    value: parseInt(region.code, 10),
  }));
}

export function isValidRegion(regionId, options) {
  return options.some(option => option.value === regionId);
}

export function buildInitialConfig(wifiForm) {
  return {
    wifi: {
      bands: {
        '2.4G': {
          ssid: wifiForm.ssid24g,
          password: wifiForm.password24g
        },
        '5G': {
          ssid: wifiForm.ssid5g,
          password: wifiForm.password5g
        }
      },
      smart_connect: wifiForm.smart_connect
    },
    admin: { password: wifiForm.password24g },
    region_id: parseInt(wifiForm.region_id, 10)
  };
}

export default {
  data() {
    return {
      stepOption: {
        current: 0,
        steps: [
          { text: this.$t('trans0019'), success: true },
          { text: this.$t('trans0018'), success: false }
        ]
      },
      current: 0,
      countdown: 60,
      regionsList: [],
      wifiForm: {
        region_id: '',
        smart_connect: true,
        ssid24g: '',
        password24g: '',
        ssid5g: '',
        password5g: ''
      },
      wifiFormRules: {
        region_id: [
          {
            rule: value => isValidRegion(value, this.regionsList),
            message: this.$t('trans0237')
          }
        ],
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
    },
    loadingColor() {
      return this.$store.getters.branding.theme &&
        this.$store.getters.branding.theme['--brand-loading'];
    }
  },
  mounted() {
    this.$http
      .isinitial()
      .then(res => {
        if (!res.data.result.status) {
          // 已初始化，跳转到主界面
          return this.$router.push({ path: '/dashboard' });
        }
        // 未初始化，直接显示向导（无需登录，mesh.meta.get / mesh.config.update 已加入公开白名单）
        return Promise.all([
          this.$http.getMeshMeta(),
          this.loadRegion()
        ]).then(([metaRes]) => {
          const wifi = metaRes.data.result;
          const b24g = wifi.bands[Bands.b24g];
          const b5g = wifi.bands[Bands.b5g];
          this.wifiForm.ssid24g = b24g.ssid;
          this.wifiForm.password24g = b24g.password;
          this.wifiForm.ssid5g = b5g.ssid;
          this.wifiForm.password5g = b5g.password;
        });
      })
      .catch(() => {
        // isinitial 请求失败，按已初始化处理，跳转到登录页
        this.$router.push({ path: '/login' });
      });
  },
  methods: {
    loadRegionCatalogue() {
      const catalogue = resolveRegionCatalogue(
        this.$i18n.locale,
        this.$store.getters.branding.defaultLanguage,
        locale => require(`base/assets/regions/${locale}.json`)
      );
      this.regionsList = toRegionOptions(catalogue);
      return this.regionsList;
    },
    loadRegion() {
      const regionsList = this.loadRegionCatalogue();
      if (!regionsList.length) {
        throw new Error('Region catalogue is empty');
      }
      const fallbackRegionId = regionsList[0].value;

      return this.$http.getRegion()
        .then(res => {
          const region = res.data && res.data.result;
          if (!region) {
            this.wifiForm.region_id = fallbackRegionId;
            return;
          }
          const regionId = parseInt(region.ip_country_id || region.id, 10);
          this.wifiForm.region_id = isValidRegion(regionId, regionsList)
            ? regionId
            : fallbackRegionId;
        })
        .catch(() => {
          this.wifiForm.region_id = fallbackRegionId;
        });
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
        this.$loading.open();
        this.$http
          .updateMeshConfig({
            config: buildInitialConfig(this.wifiForm)
          })
          .then(() => {
            this.$loading.close();
            this.stepOption.current = 1;
            this.stepOption.steps[1].success = true;
            const timer = setInterval(() => {
              this.countdown -= 1;
              if (this.countdown === 0) {
                clearInterval(timer);
                this.$router.push({ path: '/unconnect' });
              }
            }, 1000);
            this.$reconnect({
              timeout: 60,
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
            this.$loading.close();
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
  padding: 20px 30px;
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
    margin: 50px 0;
    text-align: center;
    .step-item {
      display: inline-block;
      width: 340px;
      text-align: center;
      &.step-item1 {
        .tip-label {
          font-size: 12px;
          color: var(--text_gery-color);
          margin-top: 14px;
          max-width: 340px;
          border-bottom: 1px solid var(--hr-color);
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
      }
      &.step-item2 {
        .cutdown {
          color: var(--primary-color);
          font-size: 16px;
          margin: 10px 0;
        }
        .tip {
          font-size: 12px;
          &.tip-setting {
            margin: 10px 0 15px;
            text-align: left;
          }
        }
        .info-container {
          border-radius: 5px;
          padding: 15px 20px;
          margin-top: 20px;
          background: var(--grey-bgc);
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
        .wifi {
          &:last-child {
            margin-top: 5px;
          }
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
      padding-bottom: 10px;
      margin-bottom: 20px;
      .form-header__title {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .step-tips {
      font-weight: 600;
      font-size: 18px;
      margin: 0;
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
