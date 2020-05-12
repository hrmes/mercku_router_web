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
                    v-model="form.smart_connect" />
        </div>
        <div class="smart-connect__tip">{{$t('trans0398')}}</div>
      </div>

      <m-form class="form"
              ref="b24gForm"
              :model="form"
              :rules='rules'>
        <div class="form-header"
             v-if="!form.smart_connect">
          <img class="form-header__img"
               src="@/assets/images/icon/ic_wifi@2x.png"
               alt="">
          <span class="form-header__title">{{$t('trans0677')}}</span>
        </div>
        <m-form-item class="item"
                     prop='b24g.ssid'>
          <m-input v-model="form.b24g.ssid"
                   :label="$t('trans0168')"
                   type='text'
                   :placeholder="`${$t('trans0321')}`"></m-input>
        </m-form-item>

        <m-form-item class="item">
          <m-select :label="$t('trans0522')"
                    v-model="form.b24g.encrypt"
                    :options="options"></m-select>
        </m-form-item>

        <m-form-item v-if="!isOpen('b24g')"
                     class="item"
                     prop='b24g.password'>
          <m-input v-model="form.b24g.password"
                   :label="$t('trans0172')"
                   type='password'
                   :placeholder="`${$t('trans0321')}`"></m-input>
        </m-form-item>

        <m-form-item class="form__item">
          <m-select :label="$t('trans0680')"
                    :height="300"
                    v-model="form.b24g.channel.number"
                    :options="channels.b24g"></m-select>
        </m-form-item>
        <m-form-item class="form__item"
                     v-if="form.smart_connect">
          <m-select :label="$t('trans0681')"
                    :height="300"
                    v-model="form.b5g.channel.number"
                    :options="channels.b5g"></m-select>
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

      </m-form>

      <m-form v-if="!form.smart_connect"
              class="form"
              ref="b5gForm"
              :model="form"
              :rules='rules'>
        <div class="form-header">
          <img class="form-header__img"
               src="@/assets/images/icon/ic_wifi@2x.png"
               alt="">
          <span class="form-header__title">{{$t('trans0679')}}</span>
        </div>
        <m-form-item class="item"
                     prop='b5g.ssid'>
          <m-input v-model="form.b5g.ssid"
                   :label="$t('trans0168')"
                   type='text'
                   :placeholder="`${$t('trans0321')}`"></m-input>
        </m-form-item>

        <m-form-item class="item">
          <m-select :label="$t('trans0522')"
                    v-model="form.b5g.encrypt"
                    :options="options"></m-select>
        </m-form-item>

        <m-form-item v-if="!isOpen('b5g')"
                     class="item"
                     prop='b5g.password'>
          <m-input v-model="form.b5g.password"
                   :label="$t('trans0172')"
                   type='password'
                   :placeholder="`${$t('trans0321')}`"></m-input>
        </m-form-item>

        <m-form-item class="form__item"
                     v-if="!form.smart_connect">
          <m-select :label="$t('trans0681')"
                    :height="300"
                    v-model="form.b5g.channel.number"
                    :options="channels.b5g"></m-select>
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
          <m-switch v-model="form.b5g.hidden" />
        </div>

      </m-form>
      <div class="form-button">
        <button class="btn"
                v-defaultbutton
                @click='submit()'>{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getStringByte, passwordRule } from 'util/util';

const Bands = {
  b24g: '2.4G',
  b5g: '5G'
};

export default {
  data() {
    return {
      form: {
        smart_connect: true,
        b24g: {
          ssid: '',
          password: '',
          hidden: false,
          encrypt: 'wpawpa2',
          channel: {
            number: 0
          }
        },
        b5g: {
          ssid: '',
          password: '',
          hidden: false,
          encrypt: 'wpawpa2',
          channel: {
            number: 0
          }
        }
      },
      options: [
        {
          value: 'open',
          text: this.$t('trans0554')
        },
        {
          value: 'wpawpa2',
          text: this.$t('trans0557')
        },
        {
          value: 'wpa2',
          text: this.$t('trans0556')
        },
        {
          value: 'wpa',
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
      }
    };
  },
  methods: {
    isOpen(band) {
      return this.form[band].encrypt === 'open';
    },
    submit() {
      let validResult1 = true;
      let validResult2 = true;
      validResult1 = this.$refs.b24gForm.validate();
      if (!this.form.smart_connect) {
        validResult2 = this.$refs.b5gForm.validate();
      }
      if (validResult1 && validResult2) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              const wifi = {
                smart_connect: this.form.smart_connect,
                bands: {
                  [Bands.b24g]: {
                    hidden: this.form.b24g.hidden,
                    ssid: this.form.b24g.ssid,
                    password: this.form.b24g.password,
                    encrypt: this.form.b24g.encrypt,
                    channel: {
                      number: this.form.b24g.channel.number
                    }
                  },
                  [Bands.b5g]: {
                    hidden: this.form.b5g.hidden,
                    ssid: this.form.b5g.ssid,
                    password: this.form.b5g.password,
                    encrypt: this.form.b5g.encrypt,
                    channel: {
                      number: this.form.b5g.channel.number
                    }
                  }
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
      }
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
          this.channels.b5g = channels[Bands.b5g].numbers.map(number => ({
            value: number,
            text: number
          }));

          // 2.4G
          const b24g = wifi.bands[Bands.b24g];
          this.form.b24g.ssid = b24g.ssid;
          this.form.b24g.encrypt = b24g.encrypt;
          this.form.b24g.password = b24g.password;
          this.form.b24g.hidden = b24g.hidden;
          this.form.b24g.channel.number = b24g.channel.number;

          // 5G
          const b5g = wifi.bands[Bands.b5g];
          this.form.b5g.ssid = b5g.ssid;
          this.form.b5g.encrypt = b5g.encrypt;
          this.form.b5g.password = b5g.password;
          this.form.b5g.hidden = b5g.hidden;
          this.form.b5g.channel.number = b5g.channel.number;

          // smart_connect
          this.form.smart_connect = wifi.smart_connect;

          this.$loading.close();
        })
        .catch(err => {
          console.log(err);

          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getInitData();
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

  .form-header {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .form-header__img {
      width: 16px;
      margin-right: 10px;
    }
    .form-header__title {
      color: #999;
    }
  }
  + .form {
    padding-top: 20px;
    margin-top: 0;
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
