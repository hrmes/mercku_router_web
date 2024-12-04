<template>
  <div class="page">
    <div class='page-header'>
      {{$t('trans0538')}}
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="form"
              :model="form"
              :rules='rules'>
        <div class="switch-wrap">
          <label class="title"> {{$t('trans0538')}}
            <div class="tool">
              <m-popover position="bottom left"
                         style="top:-7px"
                         :title="$t('trans0538')"
                         :content="$t('trans0540')">
                <img width="14"
                     src="@/assets/images/icon/ic_question.png"
                     alt="">
              </m-popover>
            </div>
          </label>
          <m-switch v-model="form.enabled"
                    @change="guestEnabledChange" />
        </div>
        <div v-if="form.enabled&&showSettingPage">
          <label style="font-weight:bold;"> {{$t('trans0521')}} </label>
          <div class="check-box-wrap">
            <m-select v-model="form.duration"
                      :options='checkOps'></m-select>
          </div>
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
                      @change="onEncryptChange"
                      :options="encryptMethods"></m-select>
          </m-form-item>
          <m-form-item class="item"
                       prop='password'
                       v-if="form.encrypt!== EncryptMethod.open">
            <m-input v-model="form.password"
                     :label="$t('trans0172')"
                     type='password'
                     :placeholder="`${$t('trans0321')}`"></m-input>
          </m-form-item>
          <div class="switch-wrap">
            <label> {{$t('trans0397')}} </label>
            <m-switch v-model="form.smart_connect" />
          </div>
          <div v-if="!form.smart_connect"
               class="ssid">
            <div>
              <label class="ssid-label with-colon">{{$t('trans0255')}}:</label>
              <span class="ssid-name"
                    :title="form.ssid">{{form.ssid}}</span>
            </div>
            <div>
              <label class="ssid-label with-colon">{{$t('trans0256')}}:</label>
              <span class="ssid-name"
                    :title="ssid_5g">{{ssid_5g}}</span>
            </div>
          </div>
          <div class="form-button"
               style="margin-top:50px"
               :class="{'cancel':setupAndStart}">
            <button class="btn"
                    :class="{'btn-middle':showCancelBtn}"
                    @click.prevent='submit()'>{{$t('trans0081')}}</button>
            <button class="btn btn-default btn-cancel btn-middle"
                    style="margin-left:50px"
                    v-if="setupAndStart&&showCancelBtn"
                    @click.prevent='cancel'>{{$t('trans0025')}}</button>
          </div>
        </div>
        <div v-if="form.enabled&&showStatusPage">
          <div class="setting-ssid-info">
            <div>
              <label class="title with-colon">
                {{guest.smart_connect?$t('trans0168') :$t('trans0923')}}:
              </label>
              <p class='name'
                 :title="guest.bands[Bands.b24g].ssid">{{guest.bands[Bands.b24g].ssid}}</p>
            </div>
            <div v-if="!guest.smart_connect">
              <label class="title with-colon">{{$t('trans0924')}}:</label>
              <p class="name"
                 :title="guest.bands[Bands.b5g].ssid">{{guest.bands[Bands.b5g].ssid}}</p>
            </div>
          </div>
          <div class="remaining-time">
            <label class="title with-colon">{{$t('trans0524')}}:</label>
            <div class="time">
              {{formatTime(guest.remaining_duration)}}
            </div>
          </div>
          <div class="online-device">
            <label class="title with-colon">{{$t('trans0235')}}:</label>
            <span>{{devicesCount}}</span>
          </div>
          <div class="form-button">
            <button class="btn"
                    @click.prevent='toSetting'>{{$t('trans0019')}}</button>
          </div>
        </div>
      </m-form>
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
          text: this.$t('trans0447'),
          value: 8 * 60 * 60
        },
        {
          text: this.$t('trans0527'),
          value: 3 * 60 * 60
        }
      ],
      form: {
        id: '',
        enabled: false,
        duration: -1,
        ssid: 'Mercku Guest',
        encrypt: EncryptMethod.open,
        smart_connect: true
      },
      rules: {
        ssid: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 32,
            message: this.$t('trans0261')
          },
          {
            rule: value => isFieldHasComma(value),
            message: this.$t('trans0451')
          }
        ],
        password: [
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
    ssid_5g() {
      // this.form.ssid = this.form.ssid.trim();
      return `${this.form.ssid}_5G`;
    },
    hasStatus() {
      return this.setupAndStart;
    },
    formParams() {
      let params = {};
      // 新建guest wifi
      if (this.form.enabled) {
        // this.form.ssid = this.form.ssid.trim();
        params = {
          id: this.form.id,
          enabled: this.form.enabled,
          duration: this.form.duration,
          smart_connect: this.form.smart_connect,
          bands: {
            '2.4G': {
              ssid: this.form.ssid,
              password: this.form.password,
              encrypt: this.form.encrypt
            },
            '5G': {
              ssid: this.form.smart_connect ? this.form.ssid : this.ssid_5g,
              password: this.form.password,
              encrypt: this.form.encrypt
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
    onEncryptChange(nv, ov) {
      if (nv === EncryptMethod.wpa3) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0692'),
          callback: {
            cancel: () => {
              this.form.encrypt = ov;
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
      } else if (!enabled) {
        // 由启用状态切换到关闭状态
        if (this.setupAndStart) {
          // 编辑当前正在运行的访客wifi
          this.$dialog.confirm({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0559'),
            callback: {
              ok: () => {
                this.updateGuestWIFIStatus(false);
              },
              cancel: () => {
                this.form.enabled = !enabled;
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
      this.$http.getDeviceCount({ filters: [{ type: 'guest', status: ['online'] }] }).then(res => {
        this.devicesCount = res.data.result.count;
      });
    },
    getGuestWIFI() {
      this.$http.meshGuestGet().then(res => {
        [this.guest] = res.data.result;
        const band24g = this.guest.bands[Bands.b24g];
        this.form = {
          id: this.guest.id,
          enabled: this.guest.enabled,
          duration: this.guest.duration,
          ssid: band24g.ssid,
          encrypt: band24g.encrypt,
          password: band24g.password,
          smart_connect: this.guest.smart_connect
        };
        this.setGuestWIFIStatus(this.guest.enabled);
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
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              console.log(this.formParams);
              this.updateGuestWIFIStatus(true);
            }
          }
        });
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
.page-content {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.form {
  width: 340px;
  .form-button {
    &.cancel {
      display: flex;
      .btn {
        width: 50%;
      }
    }
  }
  .btn-cancel {
    margin-left: 10px !important;
  }
  .ssid {
    margin-bottom: 50px;
    width: 100%;
    margin-top: 20px;
    background-color: #fafafa;
    padding: 0 20px;
    div {
      width: 100%;
      overflow: hidden;
      display: flex;
      padding: 10px 0;
      .ssid-label {
        width: 40px;
        display: inline-block;
      }
      .ssid-name {
        display: inline-block;
        width: calc(100% - 40px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
      }
      &:first-child {
        border-bottom: 1px solid #f1f1f1;
      }
    }
  }
  .online-device {
    margin-bottom: 50px;
    display: flex;
    span {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .title {
    font-weight: bold;
    width: 125px;
  }
  .remaining-time {
    display: flex;
    margin-bottom: 30px;
    .time {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .setting-ssid-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    > div {
      display: flex;
      &:last-of-type {
        margin-top: 30px;
      }
    }
    margin-bottom: 30px;
    p {
      flex: 1;
      width: calc(100% - 130px);
      margin: 0;
      padding: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
      font-family: Helvetica;
    }
  }
  .check-box-wrap {
    display: flex;
    margin-bottom: 30px;
    margin-top: 5px;
    .item {
      margin-right: 30px;
    }
  }
  .switch-wrap {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    width: 340px;
    .title {
      width: auto;
    }
    .tool {
      position: relative;

      display: inline-block;
      img {
        position: relative;
        cursor: pointer;
      }
    }
    label {
      font-weight: bold;
      padding-right: 20px;
    }
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
