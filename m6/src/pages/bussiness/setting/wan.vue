<template>
  <div class="page">
    <div class="page-header">
      {{ $t('trans0142') }}
    </div>
    <div class="page-content">
      <div class="wan-info">
        <div class="seccess-info">
          <div>
            <label class="with-colon">{{ $t('trans0317') }}:</label>
            <span>
              {{ networkArr[localNetInfo.type] }}
            </span>
          </div>
          <div>
            <label class="with-colon">{{ $t('trans0151') }}:</label>
            <span>{{ localNetInfo.netinfo.ip }}</span>
          </div>
          <div>
            <label class="with-colon">{{ $t('trans0152') }}:</label>
            <span> {{ localNetInfo.netinfo.mask }}</span>
          </div>
          <div>
            <label class="with-colon">{{ $t('trans0153') }}:</label>
            <span>
              {{ localNetInfo.netinfo.gateway }}
            </span>
          </div>
          <div>
            <label class="with-colon">{{ $t('trans0236') }}:</label>
            <span>
              {{ dnsText }}
            </span>
          </div>
        </div>
      </div>
      <div class="form"
           v-if="!isTesting">
        <div class="item net-type">
          <m-select :label="$t('trans0317')"
                    v-model="netType"
                    :options="options"></m-select>
          <div class="note">{{ netNote[netType] }}</div>
        </div>
        <m-form key="dhcp-form"
                v-if="isDhcp"
                ref="dhcpForm"
                :model="dhcpForm"
                :rules="dhcpRules">
          <m-form-item class="item">
            <m-radio-group class="radio-group"
                           direction="vertical"
                           v-model="autodns.dhcp"
                           :options="dnsOptions"></m-radio-group>
          </m-form-item>
          <div class="form__dns"
               v-if="!autodns.dhcp">
            <m-form-item class="item"
                         prop="dns1"
                         ref="dns">
              <m-input :label="$t('trans0236')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="dhcpForm.dns1" />
            </m-form-item>
            <m-form-item class="item"
                         prop="dns2"
                         ref="backupdns">
              <m-input :label="$t('trans0320')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="dhcpForm.dns2" />
            </m-form-item>
          </div>
        </m-form>
        <m-form key="pppoe-form"
                v-else-if="isPppoe"
                ref="pppoeForm"
                :model="pppoeForm"
                :rules="pppoeRules">
          <m-form-item class="item"
                       prop="account">
            <m-input :label="$t('trans0155')"
                     type="text"
                     :placeholder="`${$t('trans0321')}`"
                     v-model="pppoeForm.account"></m-input>
          </m-form-item>
          <m-form-item class="item"
                       prop="password">
            <m-input :label="$t('trans0156')"
                     type="password"
                     :placeholder="`${$t('trans0321')}`"
                     v-model="pppoeForm.password" />
          </m-form-item>
          <m-form-item class="item">
            <m-radio-group class="radio-group"
                           direction="vertical"
                           v-model="autodns.pppoe"
                           :options="dnsOptions"></m-radio-group>
          </m-form-item>
          <div class="form__dns"
               v-if="!autodns.pppoe">
            <m-form-item class="item"
                         prop="dns1"
                         ref="dns">
              <m-input :label="$t('trans0236')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="pppoeForm.dns1" />
            </m-form-item>
            <m-form-item class="item"
                         prop="dns2"
                         ref="backupdns">
              <m-input :label="$t('trans0320')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="pppoeForm.dns2" />
            </m-form-item>
          </div>
        </m-form>
        <m-form key="static-form"
                v-else-if="isStatic"
                ref="staticForm"
                :model="staticForm"
                :rules="staticRules">
          <div class="form__dns">
            <m-form-item class="item"
                         prop="ip"
                         ref="ip">
              <m-input :label="$t('trans0151')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="staticForm.ip"
                       :onBlur="ipChange" />
            </m-form-item>
            <m-form-item class="item"
                         prop="mask"
                         ref="mast">
              <m-input :label="$t('trans0152')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="staticForm.mask"
                       :onBlur="maskChange" />
            </m-form-item>
            <m-form-item class="item"
                         prop="gateway"
                         ref="gateway">
              <m-input :label="$t('trans0153')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="staticForm.gateway" />
            </m-form-item>
            <m-form-item class="item"
                         prop="dns1"
                         ref="dns">
              <m-input :label="$t('trans0236')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="staticForm.dns1" />
            </m-form-item>
            <m-form-item class="item"
                         prop="dns2"
                         ref="backupdns">
              <m-input :label="$t('trans0320')"
                       type="text"
                       placeholder="0.0.0.0"
                       v-model="staticForm.dns2" />
            </m-form-item>
          </div>
        </m-form>
        <div class="form__vlan">
          <div class="form__label">
            <m-checkbox :rect="false"
                        :text="$t('trans0683')"
                        v-model="vlan.enabled"></m-checkbox>
            <div class="tool"
                 style="width:14px;">
              <m-popover position="bottom left"
                         style="top:-7px;left:2px;"
                         :title="this.$t('trans0683')"
                         :content="this.$t('trans0682')">
                <img width="14"
                     src="../../../assets/images/icon/ic_question.png" />
              </m-popover>
            </div>
          </div>
          <m-form v-if="vlan.enabled"
                  class="form__inner"
                  :model="vlan">
            <m-form-item class="form__item"
                         prop="id"
                         :rules="vlanIdRules">
              <m-input :label="$t('trans0684')"
                       type="text"
                       placeholder="1-4094"
                       v-model.number="vlan.id"></m-input>
            </m-form-item>
            <m-form-item class="form__item">
              <m-select :label="$t('trans0686')"
                        v-model="vlan.priority"
                        :options="priorities"></m-select>
            </m-form-item>
            <m-form-item class="form__item">
              <m-switch :label="$t('trans0685')"
                        v-model="vlan.ports[0].tagged"></m-switch>
            </m-form-item>
          </m-form>
        </div>
        <div class="form__submit">
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
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg
} from 'base/util/util';
import * as CONSTANTS from 'base/util/constant';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}

export default {
  data() {
    return {
      CONSTANTS,
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
      autodns: {
        pppoe: true,
        dhcp: true
      },
      dnsOptions: [
        { value: true, text: this.$t('trans0399') },
        { value: false, text: this.$t('trans0400') }
      ],
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      netType: CONSTANTS.WanType.dhcp,
      netInfo: {},
      vlan: {
        id: '',
        enabled: false,
        ports: [
          {
            port: {
              id: 0
            },
            tagged: true
          }
        ],
        priority: 0
      },
      staticForm: {
        ip: '',
        mask: '',
        gateway: '',
        dns1: '',
        dns2: ''
      },
      pppoeForm: {
        account: '',
        password: '',
        dns1: '',
        dns2: ''
      },
      dhcpForm: {
        dns1: '',
        dns2: ''
      },
      priorities: new Array(8).fill(0).map((item, index) => ({
        text: index,
        value: index
      })),
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans0261')
          }
        ],
        password: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidPassword(value, 1, 64),
            message: this.$t('trans0125')
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
            rule: value => checkDNS(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: value => (value ? checkDNS(value) : true),
            message: this.$t('trans0231')
          }
        ]
      },
      dhcpRules: {},
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
      ],
      vlanIdRules: [
        {
          rule: value => /^\d+$/.test(value),
          message: this.$t('trans0687')
        },
        {
          rule: value => value >= 1 && value <= 4094,
          message: this.$t('trans0687')
        }
      ]
    };
  },
  watch: {
    'autodns.pppoe': function pppoeWatcher(val) {
      if (!val) {
        this.pppoeRules = {
          ...this.pppoeRules,
          dns1: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            },
            {
              rule: value => checkDNS(value),
              message: this.$t('trans0231')
            }
          ],
          dns2: [
            {
              rule: value => (value ? checkDNS(value) : true),
              message: this.$t('trans0231')
            }
          ]
        };
      } else {
        delete this.pppoeRules.dns1;
        delete this.pppoeRules.dns2;
      }
    },
    'autodns.dhcp': function dhcpWatcher(val) {
      if (!val) {
        this.dhcpRules = {
          ...this.dhcpRules,
          dns1: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            },
            {
              rule: value => checkDNS(value),
              message: this.$t('trans0231')
            }
          ],
          dns2: [
            {
              rule: value => (value ? checkDNS(value) : true),
              message: this.$t('trans0231')
            }
          ]
        };
      } else {
        delete this.dhcpRules.dns1;
        delete this.dhcpRules.dns2;
      }
    }
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
    },
    dnsText() {
      return this.localNetInfo.netinfo.dns.length > 0
        ? this.localNetInfo.netinfo.dns.join('/')
        : '-';
    }
  },
  methods: {
    ipChange() {
      this.$refs.ip.extraValidate(
        ipRule,
        this.$t('trans0231'),
        this.staticForm.ip,
        this.staticForm.mask
      );
    },
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
      this.$loading.open();
      this.netStatus = CONSTANTS.WanNetStatus.testing;
      this.$http
        .getWanStatus()
        .then(res => {
          this.$loading.close();
          this.netStatus = res.data.result.status;
        })
        .catch(() => {
          this.$loading.close();
          this.netStatus = CONSTANTS.WanNetStatus.unlinked;
        });
    },
    getWanNetInfo() {
      this.$http.getWanNetInfo().then(res => {
        if (res.data.result) {
          this.netInfo = res.data.result;
          this.netType = this.netInfo.type;
          if (this.isDhcp) {
            this.autodns.dhcp = !this.netInfo.dhcp.dns?.length;
            this.dhcpForm.dns1 = this.netInfo.dhcp.dns?.[0] ?? '';
            this.dhcpForm.dns2 = this.netInfo.dhcp.dns?.[1] ?? '';
          }
          if (this.isPppoe) {
            this.pppoeForm.account = this.netInfo.pppoe.account;
            this.pppoeForm.password = this.netInfo.pppoe.password;
            this.autodns.pppoe = !this.netInfo.pppoe.dns?.length;
            this.pppoeForm.dns1 = this.netInfo.pppoe.dns?.[0] ?? '';
            this.pppoeForm.dns2 = this.netInfo.pppoe.dns?.[1] ?? '';
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
          if (this.netInfo?.vlan?.length) {
            [this.vlan] = this.netInfo.vlan;
          }
        }
      });
    },
    save(params) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$http.meshWanUpdate(params).then(() => {
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
    submit() {
      const form = { type: this.netType };
      if (this.vlan.enabled) {
        form.vlan = [this.vlan];
      }
      switch (this.netType) {
        case CONSTANTS.WanType.dhcp:
          if (!this.$refs.dhcpForm.validate()) {
            return;
          }
          if (!this.autodns.dhcp) {
            form.dhcp = { dns: [this.dhcpForm.dns1] };
            if (this.dhcpForm.dns2) {
              form.dhcp.dns.push(this.dhcpForm.dns2);
            }
          }
          this.save(form);
          break;
        case CONSTANTS.WanType.pppoe:
          if (!this.$refs.pppoeForm.validate()) {
            return;
          }
          form.pppoe = {
            account: this.pppoeForm.account,
            password: this.pppoeForm.password
          };
          if (!this.autodns.pppoe) {
            form.pppoe.dns = [this.pppoeForm.dns1];
            if (this.pppoeForm.dns2) {
              form.pppoe.dns.push(this.pppoeForm.dns2);
            }
          }
          this.save(form);
          break;
        case CONSTANTS.WanType.static:
          if (!this.$refs.staticForm.validate()) {
            return;
          }
          form.static = {
            netinfo: {
              ip: this.staticForm.ip,
              mask: this.staticForm.mask,
              gateway: this.staticForm.gateway,
              dns: [this.staticForm.dns1]
            }
          };
          if (this.staticForm.dns2) {
            form.static.netinfo.dns.push(this.staticForm.dns2);
          }
          this.save(form);
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  padding: 20px 0;
  @media screen and (min-width: 769px) {
    width: 340px;
  }
  .net-type {
    margin-bottom: 30px;
  }
  .note {
    font-size: 12px;
    color: #999999;
    padding-top: 10px;
  }
  .form__inner {
    margin-top: 30px;
  }
  .form__vlan {
    padding-top: 20px;
    border-top: 1px solid #e8e8e8;
  }
  .form__label {
    display: flex;
  }
  .form__item {
    margin-bottom: 30px;
  }
  .form__submit {
    margin-top: 50px !important;
    margin-bottom: 90px;
  }
}
.wan-info {
  display: flex;
  width: 340px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  color: #333333;
  text-align: center;
  padding-bottom: 30px;
  img {
    width: 150px;
  }
  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    text-align: left;
  }
  .seccess-info {
    width: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
    div {
      margin-top: 10px;
      display: flex;
    }
    label {
      display: inline-block;
      font-size: 14px;
      color: #333;
      font-weight: bold;
      text-align: left;
      width: 150px;
    }
    span {
      color: #333333;
      font-size: 14px;
      flex: 1;
    }
  }
}
@media screen and(max-width:768px) {
  .wan-info {
    flex-direction: column;
    width: 100%;
    .seccess-info {
      border: 0;
      padding-left: 0;
    }
  }
}
</style>
