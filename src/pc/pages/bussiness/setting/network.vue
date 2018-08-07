<template>
  <layout>
    <div class="setting-network-container">
      <div v-if="reboot">
        <m-proress :label="$t('trans0322')"></m-proress>
      </div>
      <div class="content">
        <div class="network-info">
          <div class="w-header">
            {{$t('trans0316')}}
          </div>
          <div class="status">
            <div v-if="isTesting">
              <img src="../../../assets/images/img_test_internet.png" alt="">
              <p>{{$t('trans0298')}}...</p>
            </div>
            <div v-if="isUnlinked||isLinked">
              <img src="../../../assets/images/img_no_network_access.png" alt="">
              <p>{{$t('trans0319')}}</p>
            </div>
            <div v-if="isConnected">
              <img src="../../../assets/images/img_internet_normal.png" alt="">
              <p>{{$t('trans0318')}}</p>
              <div class="seccess-info">
                <div>
                  <label for="">{{$t('trans0317')}}：</label>
                  <span>
                    {{networkArr[localNetInfo.type]}}
                  </span>
                </div>
                <div>
                  <label for="">{{$t('trans0151')}}：</label>
                  <span> {{localNetInfo.netinfo.ip}}</span>
                </div>
                <div>
                  <label for="">{{$t('trans0152')}}：</label>
                  <span> {{localNetInfo.netinfo.mask }} </span>
                </div>
                <div>
                  <label for="">{{$t('trans0153')}}：</label>
                  <span>
                    {{localNetInfo.netinfo.gateway}}
                  </span>
                </div>
                <div>
                  <label for="">{{$t('trans0236')}}：</label>
                  <span>
                    {{localNetInfo.netinfo.dns.length>0?localNetInfo.netinfo.dns.join('/') :'-'}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="network-setting" v-if="!isTesting">
          <div class="w-header">
            {{$t('trans0142')}}
          </div>
          <div class="setting-info">
            <div class='form'>
              <div class="item">
                <m-select :label="$t('trans0317')" v-model="netType" :options="options"></m-select>
                <div class="note">{{netNote[netType]}}</div>
              </div>
              <m-form v-show="isPppoe" ref="pppoeForm" :model="pppoeForm" :rules='pppoeRules'>
                <m-form-item class="item" prop='account'>
                  <m-input :label="$t('trans0155')" type="text" :placeholder="`${$t('trans0321')}`" v-model="pppoeForm.account"></m-input>
                </m-form-item>
                <m-form-item class="item" prop='password'>
                  <m-input :label="$t('trans0156')" type='password' :placeholder="`${$t('trans0321')}`" v-model="pppoeForm.password" />
                </m-form-item>
              </m-form>
              <m-form v-show="isStatic" ref="staticForm" :model="staticForm" :rules='staticRules'>
                <m-form-item class="item" prop='ip' ref="ip">
                  <m-input :label="$t('trans0151')" type="text" placeholder="0.0.0.0" v-model="staticForm.ip" :onBlur="ipChange" />
                </m-form-item>
                <m-form-item class="item" prop='mask' ref="mast">
                  <m-input :label="$t('trans0152')" type="text" placeholder="0.0.0.0" v-model="staticForm.mask" :onBlur="maskChange" />
                </m-form-item>
                <m-form-item class="item" prop='gateway' ref="gateway">
                  <m-input :label="$t('trans0153')" type="text" placeholder="0.0.0.0" v-model="staticForm.gateway" :onBlur="getwayChange" />
                </m-form-item>
                <m-form-item class="item" prop='dns1' ref="dns">
                  <m-input :label="$t('trans0236')" type="text" placeholder="0.0.0.0" v-model="staticForm.dns1" />
                </m-form-item>
                <m-form-item class="item" prop='dns2' ref="backupdns">
                  <m-input :label="$t('trans0320')" type="text" placeholder="0.0.0.0" v-model="staticForm.dns2" />
                </m-form-item>
              </m-form>
              <div class="btn-info">
                <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </layout>
</template>
<script>
import mSelect from '../../../component/select/index.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Input from '../../../component/input/input.vue';
import Progress from '../../../component/progress/index.vue';
import layout from '../../../layout.vue';
import {
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask
} from '../../../../util/util';
import * as CONSTANTS from '../../../../util/constant';

export default {
  components: {
    'm-input': Input,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-select': mSelect,
    'm-proress': Progress,
    layout
  },
  data() {
    const pattern = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
    function expRules(v) {
      return v === undefined || v === '' || v === null ? true : pattern.test(v);
    }
    return {
      CONSTANTS: { ...CONSTANTS },
      netNote: {
        dhcp: this.$t('trans0147'),
        static: this.$t('trans0150'),
        pppoe: this.$t('trans0154')
      },
      networkArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144')
      },
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      netType: CONSTANTS.WanType.dhcp,
      reboot: false,
      netInfo: {},
      staticForm: {
        ip: '',
        mask: '',
        gateway: '',
        dns1: '',
        dns2: ''
      },
      pppoeForm: {
        account: '',
        password: ''
      },
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ],
        password: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ]
      },
      staticRules: {
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        mask: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          },
          {
            rule: value => isValidMask(value),
            message: this.$t('trans0231')
          }
        ],
        gateway: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns1: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: expRules,
            message: this.$t('trans0231')
          }
        ]
      },
      options: [
        {
          value: 'dhcp',
          text: this.$t('trans0146')
        },
        {
          value: 'pppoe',
          text: this.$t('trans0144')
        },
        {
          value: 'static',
          text: this.$t('trans0148')
        }
      ]
    };
  },
  mounted() {
    this.getWanStatus();
    this.getWanNetInfo();
  },
  computed: {
    isTesting() {
      return this.netStatus === CONSTANTS.WanNetStatus.testing;
    },
    isConnected() {
      return this.netStatus === CONSTANTS.WanNetStatus.connected;
    },
    isLinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.linked;
    },
    isUnlinked() {
      return this.netStatus === CONSTANTS.WanNetStatus.unlinked;
    },
    isPppoe() {
      return this.netType === CONSTANTS.WanType.pppoe;
    },
    isStatic() {
      return this.netType === CONSTANTS.WanType.static;
    },
    isDhcp() {
      return this.netType === CONSTANTS.WanType.dhcp;
    },
    localNetInfo() {
      const local = {
        type: '-',
        netinfo: {
          ip: '-',
          mask: '-',
          gateway: '-', // 可选
          dns: []
        }
      };
      if (this.netInfo && this.netInfo.netinfo) {
        return { ...local, ...this.netInfo };
      }
      return local;
    }
  },
  methods: {
    DNSChange() {
      this.$refs.dns.extraValidate(
        (...arg) => !isMulticast(...arg),
        this.$t('trans0231'),
        this.staticForm.dns1
      );
      this.$refs.dns.extraValidate(
        (...arg) => !isLoopback(arg),
        this.$t('trans0231'),
        this.staticForm.dns1
      );
    },
    backupDNSChange() {
      this.$refs.backupdns.extraValidate(
        (...arg) => !isMulticast(...arg),
        this.$t('trans0231'),
        this.staticForm.dns2
      );
      this.$refs.backupdns.extraValidate(
        (...arg) => !isLoopback(arg),
        this.$t('trans0231'),
        this.staticForm.dns2
      );
    },
    ipChange() {
      this.$refs.ip.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.ip,
        this.staticForm.mask
      );
    },
    getwayChange() {},
    maskChange() {
      this.$refs.ip.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.ip,
        this.staticForm.mask
      );
      this.$refs.gateway.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.gateway,
        this.staticForm.mask
      );
    },
    getWanStatus() {
      this.netStatus = CONSTANTS.WanNetStatus.testing;
      this.$http
        .getWanStatus()
        .then(res => {
          this.netStatus = res.data.result.status;
        })
        .catch(() => {
          this.netStatus = CONSTANTS.WanNetStatus.unlinked;
        });
    },
    getWanNetInfo() {
      this.$http.getWanNetInfo().then(res => {
        if (res.data.result) {
          this.netInfo = res.data.result;
          this.netType = this.netInfo.type;
          if (this.isPppoe) {
            this.pppoeForm.account = this.netInfo.pppoe.account;
            this.pppoeForm.password = this.netInfo.pppoe.password;
          }
          if (this.isStatic) {
            this.staticForm = {
              ip: this.netInfo.static.netinfo.ip,
              mask: this.netInfo.static.netinfo.mask,
              gateway: this.netInfo.static.netinfo.gateway,
              dns1: this.netInfo.static.netinfo.dns[0],
              dns2: this.netInfo.static.netinfo.dns[1] || ''
            };
          }
        }
      });
    },
    save(form) {
      this.$http
        .meshWanUpdate({ ...form })
        .then(() => {
          this.reboot = true;
          this.$reconnect({
            onsuccess: () => {
              this.$router.push({ path: '/home' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    submit() {
      let form = { type: this.netType };
      if (this.netType === CONSTANTS.WanType.dhcp) {
        this.save(form);
        return;
      }
      if (
        this.netType === CONSTANTS.WanType.pppoe &&
        this.$refs.pppoeForm.validate()
      ) {
        form = { ...form, pppoe: { ...this.pppoeForm } };
        this.save(form);
        return;
      }
      if (
        this.netType === CONSTANTS.WanType.static &&
        this.$refs.staticForm.validate()
      ) {
        const params = {
          ip: this.staticForm.ip,
          mask: this.staticForm.mask,
          gateway: this.staticForm.gateway,
          dns: [this.staticForm.dns1]
        };
        if (this.staticForm.dns2) {
          params.dns.push(this.staticForm.dns2);
        }
        form = { ...form, static: { netinfo: { ...params } } };
        this.save(form);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-network-container {
  position: relative;
  padding: 0 2%;
  flex: auto;
  display: flex;
  .content {
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .network-info {
      border-radius: 8px;
      padding: 0 20px;
      background: white;
      min-height: 400px;
      .status {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #333333;
        text-align: center;
        padding: 20px 0;
        img {
          width: 200px;
        }
        p {
          margin: 0;
          padding: 0;
        }
        .seccess-info {
          text-align: left;
          margin: 30px;
          div {
            margin-top: 10px;
          }
          label {
            display: inline-block;
            font-size: 14px;
            color: #999999;
          }
          span {
            color: #333333;
            font-size: 14px;
          }
        }
      }
    }
    .network-setting {
      margin-top: 20px;
      min-height: 400px;
      border-radius: 8px;
      padding: 0 20px;
      background: white;
      .setting-info {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .form {
          padding: 20px 0;
          .item {
            // margin-bottom: 20px;
          }
          .note {
            font-size: 12px;
            color: #999999;
            padding: 5px 0;
          }
          .title {
            display: inline-block;
            font-size: 14px;
            color: #333333;
            line-height: 1;
            margin-top: 30px;
            height: 30px;
          }
          .btn-info {
            margin-top: 30px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-network-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      .network-info {
        min-height: 300px !important;
        img {
          width: 185px;
        }
      }
      min-height: 510px;
      .form {
        width: 100%;

        .title {
          margin-top: 20px !important;
          margin-bottom: 10px;
          height: auto !important;
        }
        .check-info {
          display: flex;
          align-items: center;
          margin-top: 20px;
          label {
            margin-right: 10px;
            font-size: 16px;
            color: #333333;
          }
        }
        .btn-info {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

