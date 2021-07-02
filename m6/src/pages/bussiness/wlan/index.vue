<template>
  <div class="wlan-container">

    <div class="title">{{$t('trans0136')}}</div>
    <div class="description">{{$t('trans0222')}}</div>
    <div class="step">
      <m-step :option="stepOption"></m-step>
    </div>
    <div class="step-content">
      <div class="step-item step-item1"
           v-show="stepOption.current===0">
        <m-form ref="wifiForm"
                :model="wifiForm"
                :rules="wifiFormRules">
          <m-form-item class="form-item"
                       prop="smart_connect">
            <m-switch :label="$t('trans0397')"
                      @change="changeSmartConnect"
                      v-model="wifiForm.smart_connect" />
          </m-form-item>
          <m-form-item class="form-item"
                       prop="ssid24g">
            <m-input :label="$t('trans0168')"
                     :placeholder="$t('trans0321')"
                     v-model="wifiForm.ssid24g" />
          </m-form-item>
          <m-form-item class="form-item"
                       prop="password24g">
            <m-input :label="$t('trans0172')"
                     type="password"
                     :placeholder="$t('trans0321')"
                     v-model="wifiForm.password24g" />
          </m-form-item>
          <template v-if="!wifiForm.smart_connect">
            <m-form-item class="form-item"
                         prop="ssid5g">
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
      <div class="step-item step-item3"
           v-show="stepOption.current===1">
        <m-loading :color="loadingColor"
                   :size="36"></m-loading>
        <p class="cutdown">{{countdown}}s</p>
        <div class="tip"
             style="margin-top:5px;">{{$t('trans0171')}}</div>
        <div class="wifi-info">
          <div class="wifi-info-inner">
            <div>
              <span class="title">{{$t('trans0168')}}</span>:
              <span class="value">{{wifiForm.ssid24g}}</span>
            </div>
            <div>
              <span class="title">{{$t('trans0172')}}</span>:
              <span class="value">{{wifiForm.password24g}}</span>
            </div>
            <div>
              <span class="title">{{$t('trans0067')}}</span>:
              <span class="value">{{wifiForm.password24g}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import { getStringByte, isValidPassword, isFieldHasComma } from 'base/util/util';
import { Bands } from 'base/util/constant';

export default {
  data() {
    return {
      stepOption: {
        current: 0,
        steps: [
          { text: '', success: true },
          { text: '', success: false }
        ]
      },
      current: 0,
      countdown: 60,
      wifiForm: {
        smart_connect: false,
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
  mounted() {
    // this.$http
    //   .login(
    //     { password: '' },
    //     {
    //       hideToast: true
    //     }
    //   )
    //   .catch(() => {
    //     // password is not empty, go to login page
    //     this.$router.push({ path: '/login' });
    //   });
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
  methods: {
    changeSmartConnect(v) {
      // 开关变化后
      if (v) {
        this.wifiForm.ssid5g = this.wifiForm.ssid24g;
        this.wifiForm.password5g = this.wifiForm.password24g;
      } else {
        this.wifiForm.ssid5g = `${this.wifiForm.ssid24g}_5G`;
        this.wifiForm.password5g = this.wifiForm.password24g;
      }
    },
    step0() {
      this.stepOption.current = 0;
      this.stepOption.steps[0].success = true;
    },
    step1() {
      if (this.$refs.wifiForm.validate()) {
        this.stepOption.current = 1;
        this.stepOption.steps[1].success = true;
        const timer = setInterval(() => {
          this.countdown -= 1;
          if (this.countdown === 0) {
            clearInterval(timer);
            this.$router.push({ path: '/unconnect' });
          }
        }, 1000);

        // 提交表单
        this.$http
          .updateMeshConfig({
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
                }
              },
              admin: { password: this.wifiForm.password24g }
            }
          })
          .then(() => {
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
  .title {
    text-align: center;
    font-weight: bold;
    font-size: 21px;
    color: #333;
  }
  .description {
    text-align: center;
    margin-top: 5px;
    font-size: 16px;
    color: #333;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: '';
      display: block;
      height: 1px;
      width: 10px;
      background: #333;
      margin-right: 8px;
    }
    &::after {
      content: '';
      display: block;
      height: 1px;
      width: 10px;
      background: #333;
      margin-left: 8px;
    }
  }
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
        }
        .wifi-info {
          margin-top: 30px;
          display: flex;
          .wifi-info-inner {
            display: inline-block;
            margin: 0 auto;
            text-align: left;
            > div {
              margin-top: 10px;
              &:first-child {
                margin-top: 0;
              }
            }
            .title {
              color: #333;
              font-weight: bold;
              font-size: 14px;
            }
            .value {
              color: #333;
              font-size: 14px;
              margin-left: 5px;
            }
          }
        }
      }
      img {
        display: block;
        margin: 0 auto;
        width: 220px;
      }
      .form-item {
        text-align: left;
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
