<template>
  <div class="setting-network-container">
    <div v-if="reboot">
      <m-progress :label="$t('trans0322')"></m-progress>
    </div>
    <div class="content network-info">
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

        </div>
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
    <div class="content network-setting" v-if="!isTesting">
      <div class="w-header">
        {{$t('trans0142')}}
      </div>
      <div class="setting-info">
        <div class='form'>
          <div class="item net-type">
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
          <div class="DNS-form" v-show="isPppoe || isDhcp">
            <m-radio-group class="radio-group" v-model="autodns" :options="dnsOptions"></m-radio-group>
            <m-form ref="dnsform" :model="dnsform" :rules="dnsRules" v-show="!autodns">
              <m-form-item class="item" prop='dns1' ref="dns">
                <m-input :label="$t('trans0236')" type="text" placeholder="0.0.0.0" v-model="dnsform.dns1" />
              </m-form-item>
              <m-form-item class="item" prop='dns2' ref="backupdns">
                <m-input :label="$t('trans0320')" type="text" placeholder="0.0.0.0" v-model="dnsform.dns2" />
              </m-form-item>
            </m-form>
          </div>
          <div class="btn-info">
            <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg
} from '../../../../util/util';
import * as CONSTANTS from '../../../../util/constant';

export default {
  data() {
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
      autodns: true,
      dnsOptions: [
        { value: true, text: this.$t('trans0399') },
        { value: false, text: this.$t('trans0400') }
      ],
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
      dnsform: {
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
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        mask: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
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
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns1: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: value => (value ? ipReg.test(value) : value !== 0),
            message: this.$t('trans0231')
          }
        ]
      },
      dnsRules: {
        dns1: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: value => (value ? ipReg.test(value) : value !== 0),
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
    save(params) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0037'),
        callback: {
          ok: () => {
            this.$http.meshWanUpdate(params).then(() => {
              this.reboot = true;
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/dashboard' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/unconnect' });
                }
              });
            });
          }
        }
      });
    },
    submit() {
      // let form = { type: this.netType };
      // TODO还没做
      // switch (this.netType) {
      //   case CONSTANTS.WanType.dhcp:
      //     if (!this.autodns) {
      //       if (this.$refs.dnsform.validate()) {
      //       } else {
      //         return;
      //       }
      //     }
      //     this.save(form);
      //     break;
      //   case CONSTANTS.WanType.pppoe:
      //     if (this.$refs.pppoeForm.validate()) {
      //       form = { ...form, pppoe: { ...this.pppoeForm } };
      //       this.save(form);
      //     }
      //     break;
      //   case CONSTANTS.WanType.static:
      //     if (this.$refs.staticForm.validate()) {
      //       const params = {
      //         ip: this.staticForm.ip,
      //         mask: this.staticForm.mask,
      //         gateway: this.staticForm.gateway,
      //         dns: [this.staticForm.dns1]
      //       };
      //       if (this.staticForm.dns2) {
      //         params.dns.push(this.staticForm.dns2);
      //       }
      //       form = { ...form, static: { netinfo: { ...params } } };
      //       this.save(form);
      //     }
      //     break;
      // }
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
  flex-direction: column;
  .content {
    flex: 1;
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
    }
    &.network-info {
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
          display: flex;
          width: 100%;
          flex-direction: column;
          div {
            margin-top: 10px;
            display: flex;
          }
          label {
            display: inline-block;
            font-size: 14px;
            color: #999999;
            font-weight: bold;
            width: 130px;
            text-align: right;
            flex: 1;
          }
          span {
            color: #333333;
            font-size: 14px;
            flex: 1;
          }
        }
      }
    }
    &.network-setting {
      .setting-info {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .form {
          padding: 20px 0;
          .net-type {
            margin-bottom: 10px;
          }
          .note {
            font-size: 12px;
            color: #999999;
            padding: 4px 0;
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
        .DNS-form {
          .radio-group {
            margin-bottom: 30px;
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

