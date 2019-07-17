<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0103')}}
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="form"
              :model="form"
              :rules='rules'>
        <m-form-item class="item"
                     prop='ssid'>
          <m-input v-model="form.ssid"
                   :label="$t('trans0168')"
                   type='text'
                   :placeholder="`${$t('trans0321')}`"></m-input>
        </m-form-item>

        <m-form-item class="item">
          <m-select :label="$t('trans0522')"
                    v-model="form.encrypt"
                    :options="options"></m-select>
        </m-form-item>

        <m-form-item v-if="!isOpen"
                     class="item"
                     prop='password'>
          <m-input v-model="form.password"
                   :label="$t('trans0172')"
                   type='password'
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
                     src="../../../assets/images/ic_question.png"
                     alt="">
              </m-popover>

            </div>
          </label>

          <m-switch v-model="form.hidden" />
        </div>
        <div class="form-item check-info smart-connect">
          <div class="switch-container">
            <label for=""> {{$t('trans0397')}}
              <div class="tool">
                <m-popover position="bottom left"
                           style="top:-7px"
                           :title="this.$t('trans0397')"
                           :content="this.$t('trans0398')">
                  <img width="14"
                       src="../../../assets/images/ic_question.png"
                       alt="">
                </m-popover>

              </div>
            </label>

            <m-switch v-model="form.smart_connect" />
          </div>
          <div class="ssid"
               v-if="!form.smart_connect">
            <div><span class="ssid-label">{{$t('trans0255')}}：</span>
              <span class="ssid-name">{{form.ssid}}</span>
            </div>
            <div><span class="ssid-label">{{$t('trans0256')}}：</span>
              <span class="ssid-name">{{ssid_5g}}</span>
            </div>
          </div>
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

export default {
  data() {
    return {
      band: '2.4G5G',
      form: {
        ssid: '',
        password: '',
        hidden: false,
        smart_connect: false,
        encrypt: 'wpawpa2'
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
        ssid: [
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          },
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          }
        ],
        password: [
          {
            rule: value => passwordRule.test(value),
            message: this.$t('trans0169')
          }
        ]
      }
    };
  },
  computed: {
    ssid_5g() {
      if (!this.form.smart_connect) {
        return `${this.form.ssid}-5G`;
      }
      return this.form.ssid;
    },
    isOpen() {
      return this.form.encrypt === 'open';
    }
  },
  methods: {
    getMeshMeta() {
      this.$loading.open();
      this.$http
        .getMeshMeta()
        .then(res => {
          this.$loading.close();
          if (res.data.result) {
            const wifi = res.data.result;
            this.form.ssid = wifi.bands['2.4G'].ssid;
            this.form.encrypt = wifi.bands['2.4G'].encrypt;
            this.form.password = wifi.bands['2.4G'].password;
            this.form.hidden = wifi.bands['2.4G'].hidden;
            this.form.smart_connect = wifi.smart_connect;
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              const wifi = {
                smart_connect: this.form.smart_connect,
                bands: {
                  '2.4G': {
                    hidden: this.form.hidden,
                    ssid: this.form.ssid,
                    password: this.form.password,
                    encrypt: this.form.encrypt
                  },
                  '5G': {
                    hidden: this.form.hidden,
                    ssid: this.ssid_5g,
                    password: this.form.password,
                    encrypt: this.form.encrypt
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
    }
  },
  mounted() {
    this.getMeshMeta();
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .check-info {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    label {
      display: flex;
      width: 120px;
    }
    &.smart-connect {
      flex-direction: column;
      align-items: flex-start;
      .ssid {
        width: 100%;
        margin-top: 20px;
        background-color: #fafafa;
        padding: 0 20px;
        div {
          padding: 10px 0;
          .ssid-label {
            width: 50px;
            display: inline-block;
          }
          &:first-child {
            border-bottom: 1px solid #f1f1f1;
          }
        }
      }
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
        top: -7px;
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .form {
    .check-info {
      display: flex;
      align-items: center;
      margin-top: 20px;
      label {
        margin-right: 2px;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
</style>
