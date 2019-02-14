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
          <label for=""> {{$t('trans0538')}}
          </label>
          <div class="tool">
            <m-popover v-model='hideTipVisible'
                       :title="$t('trans0538')"
                       :content="$t('trans0540')" />
            <img width="14"
                 src="../../../assets/images/ic_question.png"
                 alt=""
                 @click="hideTipVisible=!hideTipVisible">
          </div>
          <m-switch v-model="form.enabled"
                    :onChange="guestEnabledChange" />
        </div>
        <div v-if="form.enabled&&showSettingPage">
          <label for=""> {{$t('trans0521')}} </label>
          <div class="check-box-wrap">
            <m-radio-group v-model="form.duration"
                           :options='checkOps'></m-radio-group>
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
                      :options="options"></m-select>
          </m-form-item>
          <m-form-item class="item"
                       prop='password'
                       v-if="form.encrypt!=='open'">
            <m-input v-model="form.password"
                     :label="$t('trans0172')"
                     type='password'
                     :placeholder="`${$t('trans0321')}`"></m-input>
          </m-form-item>
          <div class="switch-wrap">
            <label for=""> {{$t('trans0397')}} </label>
            <m-switch v-model="form.smart_connect" />
          </div>
          <div v-if="!form.smart_connect"
               class="ssid">
            <div><span class="ssid-label">{{$t('trans0255')}}：</span><span
                    class="ssid-name">{{form.ssid}}</span></div>
            <div><span class="ssid-label">{{$t('trans0256')}}：</span><span
                    class="ssid-name">{{ssid_5g}}</span></div>
          </div>
          <div class="form-button"
               style="margin-top:50px"
               :class="{'cancel':setupAndStart}">
            <button class="btn"
                    @click='submit()'>{{$t('trans0081')}}</button>
            <button class="btn btn-default btn-cancel"
                    style="margin-left:50px"
                    v-if="setupAndStart&&showCancelBtn"
                    @click='cancel'>{{$t('trans0025')}}</button>
          </div>
        </div>
        <div v-if="form.enabled&&showStatusPage">
          <div class="setting-ssid-info">
            <div class="title">
              {{$t('trans0168')}}
            </div>
            <div v-if="guest.smart_connect">
              <p class='name'>{{form.ssid}}</p>
            </div>
            <div v-else>
              <p><span>2.4G：</span>{{form.ssid}}</p>
              <p><span>5G：</span>{{ssid_5g}}</p>
            </div>
          </div>
          <div class="remaining-time">
            <div class="title">{{$t('trans0524')}}</div>
            <div class="time">
              {{formatTime(guest.remaining_duration)}}
            </div>
          </div>
          <div class="online-device">
            <div class="title">{{$t('trans0235')}}： <span>{{devicesCount}}</span>
            </div>
          </div>
          <div class="form-button">
            <button class="btn"
                    @click='toSetting'>{{$t('trans0019')}}</button>
          </div>
        </div>
      </m-form>
    </div>
  </div>
</template>
<script>
import { getStringByte, passwordRule } from 'util/util';

export default {
  data() {
    return {
      hideTipVisible: false,
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

      form: {
        id: '',
        enabled: false,
        duration: -1,
        ssid: 'Mercku Guest',
        encrypt: 'open',
        smart_connect: true
      },
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
      return `${this.form.ssid}-5G`;
    },
    hasStatus() {
      return this.setupAndStart;
    },
    foramtParams() {
      let params = {};
      if (this.form.enabled) {
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
        params = {
          id: '1',
          enabled: this.form.enabled
        };
      }
      return params;
    }
  },
  methods: {
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
      if (
        (!enabled && this.setupAndStart && !this.showSettingPage)
        || (this.showSettingPage && this.showCancelBtn)
      ) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.$loading.open();
              this.$http
                .meshGuestUpdate({ ...this.foramtParams })
                .then(() => {
                  this.$loading.close();
                  this.clear();
                  this.$reconnect({
                    onsuccess: () => {
                      this.$router.push({ path: '/setting/guest' });
                      this.getGuest();
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
            cancel: () => {
              this.form.enabled = !enabled;
            }
          }
        });
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
      const params = {
        filters: [
          {
            type: 'guest',
            status: ['online']
          }
        ]
      };
      this.$http.getDeviceCount(params).then(res => {
        this.devicesCount = res.data.result.count;
      });
    },
    getGuest() {
      this.$http.meshGuestGet().then(res => {
        [this.guest] = res.data.result;
        this.form = {
          id: this.guest.id,
          enabled: this.guest.enabled,
          duration: this.guest.duration,
          ssid: this.guest.bands['2.4G'].ssid,
          encrypt: this.guest.bands['2.4G'].encrypt,
          password: this.guest.bands['2.4G'].password,
          smart_connect: this.guest.smart_connect
        };
        if (this.guest.remaining_duration > 0 || this.guest.duration === -1) {
          this.setupAndStart = true;
          if (this.guest.remaining_duration > 0) {
            this.timer = setInterval(() => {
              this.guest.remaining_duration -= 1;
              if (this.guest.remaining_duration === 0) {
                this.clear();
                this.getGuest();
              }
            }, 1000);
          }
        }
        if (!this.guest.enabled) {
          this.showSettingPage = true;
          this.showStatusPage = false;
          this.showCancelBtn = false;
        }
        if (this.setupAndStart && this.guest.enabled) {
          this.showStatusPage = true;
          this.showSettingPage = false;
        }
      });
    },
    clear() {
      clearInterval(this.timer);
      this.timer = null;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.$loading.open();
              this.$http
                .meshGuestUpdate(this.foramtParams)
                .then(() => {
                  this.$loading.close();
                  this.clear();
                  this.$reconnect({
                    onsuccess: () => {
                      this.getGuest();
                      this.$router.push({ path: '/setting/guest' });
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
            }
          }
        });
      }
    }
  },
  destroyed() {
    this.clear();
  },
  mounted() {
    this.getGuest();
    this.getDevicesCount();
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
  .btn-cancel {
    min-width: initial;
    margin-left: 10px !important;
    border: 1px solid #bdbdbd;
    color: #333333;
  }
  .ssid {
    margin-bottom: 50px;
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
  .online-device {
    margin-bottom: 50px;
    span {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .remaining-time {
    margin-bottom: 30px;
    .time {
      font-size: 24px;
      font-weight: bold;
    }
  }
  .setting-ssid-info {
    display: flex;
    .name {
      padding-left: 20px;
      // font-weight: bold
    }
    margin-bottom: 30px;
    p {
      margin: 0;
      padding: 0;
      margin-bottom: 10px;
      font-family: Helvetica;
      span {
        display: inline-block;
        width: 60px;
        text-align: right;
      }
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

    .tool {
      position: relative;
      margin-left: 5px;
      left: -20px;
      img {
        position: relative;
        top: -7px;
        cursor: pointer;
      }
    }
    label {
      padding-right: 20px;
    }
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media screen and (max-width: 768px) {
  .form {
    .form-button {
      &.cancel {
        display: flex;
        .btn {
          width: 50%;
        }
      }
    }
  }
}
</style>
