<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{ $t('trans0142') }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="wan-info card">
            <div>
              <label class="with-colon">{{$t('trans0317')}}:</label>
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
        <div class="row-2">
          <div class="net-type card">
            <m-form-item>
              <m-select :label="$t('trans0317')"
                        v-model="netType"
                        :options="options"></m-select>
              <div class="des-tips">{{ netNote[netType] }}</div>
            </m-form-item>
            <m-form key="dhcp-form"
                    v-if="isDhcp"
                    ref="dhcpForm"
                    :model="dhcpForm"
                    :rules="dhcpRules">
              <m-form-item :class="{last:autodns.dhcp}">
                <m-select :label="$t('trans0401')"
                          v-model="autodns.dhcp"
                          :options="dnsOptions"></m-select>
              </m-form-item>
              <div class="form__dns"
                   v-if="!autodns.dhcp">
                <m-form-item prop="dns1"
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="dhcpForm.dns1" />
                </m-form-item>
                <m-form-item class="last"
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
              <m-form-item prop="account">
                <m-input :label="$t('trans0155')"
                         type="text"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.account"></m-input>
              </m-form-item>
              <m-form-item prop="password">
                <m-input :label="$t('trans0156')"
                         type="password"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.password" />
              </m-form-item>
              <m-form-item :class="{'last':autodns.pppoe}">
                <m-select :label="$t('trans0401')"
                          v-model="autodns.pppoe"
                          :options="dnsOptions"></m-select>
              </m-form-item>
              <div class="form__dns"
                   v-if="!autodns.pppoe">
                <m-form-item prop="dns1"
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="pppoeForm.dns1" />
                </m-form-item>
                <m-form-item prop="dns2"
                             ref="backupdns"
                             class="last">
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
              <m-form-item prop="ip"
                           ref="ip">
                <m-input :label="$t('trans0151')"
                         type="text"
                         placeholder="0.0.0.0"
                         v-model="staticForm.ip"
                         :onBlur="ipChange" />
              </m-form-item>
              <m-form-item prop="mask"
                           ref="mask">
                <m-input :label="$t('trans0152')"
                         type="text"
                         placeholder="0.0.0.0"
                         v-model="staticForm.mask"
                         :onBlur="maskChange" />
              </m-form-item>
              <m-form-item prop="gateway"
                           ref="gateway">
                <m-input :label="$t('trans0153')"
                         type="text"
                         placeholder="0.0.0.0"
                         v-model="staticForm.gateway" />
              </m-form-item>
              <m-form-item prop="dns1"
                           ref="dns">
                <m-input :label="$t('trans0236')"
                         type="text"
                         placeholder="0.0.0.0"
                         v-model="staticForm.dns1" />
              </m-form-item>
              <m-form-item class="last"
                           prop="dns2"
                           ref="backupdns">
                <m-input :label="$t('trans0320')"
                         type="text"
                         placeholder="0.0.0.0"
                         v-model="staticForm.dns2" />
              </m-form-item>
            </m-form>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
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
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,
  isValidInteger
} from 'base/util/util';
import { WanType } from 'base/util/constant';


function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}

export default {
  data() {
    return {
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
      netType: WanType.dhcp,
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
          rule: value => !/^\s*$/g.test(value),
          message: this.$t('trans0232')
        },
        {
          rule: value => isValidInteger(value, 2, 4094),
          message: this.$t('trans0687').format('%d', 2, 4094)
        }
      ],
      ipPhoneVlanIdRules: [
        {
          rule: value => {
            if (!this.ipPhoneVlan.enabled) {
              return false;
            }
            return !/^\s*$/g.test(value);
          },
          message: this.$t('trans0232')
        },
        {
          rule: value => isValidInteger(value, 2, 4094),
          message: this.$t('trans0687').format('%d', 2, 4094)
        }
      ],
      iptvVlanIdRules: [
        {
          rule: value => {
            if (!this.iptvVlan.enabled) {
              return false;
            }
            return !/^\s*$/g.test(value);
          },
          message: this.$t('trans0232')
        },
        {
          rule: value => isValidInteger(value, 2, 4094),
          message: this.$t('trans0687').format('%d', 2, 4094)
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
    this.getWanNetInfo();
  },
  computed: {
    isPppoe() {
      return this.netType === WanType.pppoe;
    },
    isStatic() {
      return this.netType === WanType.static;
    },
    isDhcp() {
      return this.netType === WanType.dhcp;
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
        local.type = this.netInfo.type || '-';
        local.netinfo.ip = this.netInfo.netinfo.ip || '-';
        local.netinfo.mask = this.netInfo.netinfo.mask || '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway || '-';
        local.netinfo.dns = this.netInfo.netinfo.dns || [];
      }
      return local;
    },
    dnsText() {
      return this.localNetInfo.netinfo.dns.length
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
    getWanNetInfo() {
      this.$loading.open();
      this.$http
        .getWanNetInfo()
        .then(res => {
          if (res.data.result) {
            this.netInfo = res.data.result;
            this.netType = this.netInfo.type;
            if (this.isDhcp) {
              if (this.netInfo.dhcp && this.netInfo.dhcp.dns.length) {
                this.autodns.dhcp = false;
                [this.dhcpForm.dns1] = this.netInfo.dhcp.dns;
                this.dhcpForm.dns2 = this.netInfo.dhcp.dns[1] || '';
              }
            }
            if (this.isPppoe) {
              this.pppoeForm.account = this.netInfo.pppoe.account;
              this.pppoeForm.password = this.netInfo.pppoe.password;
              if (this.netInfo.pppoe.dns.length) {
                this.autodns.pppoe = false;
                [this.pppoeForm.dns1] = this.netInfo.pppoe.dns;
                this.pppoeForm.dns2 = this.netInfo.pppoe.dns[1] || '';
              }
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
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    save(params) {
      console.log(params);
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
                timeout: 30
              });
            });
          }
        }
      });
    },
    submit() {
      const form = { type: this.netType, vlan: [] };

      switch (this.netType) {
        case WanType.dhcp:
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
        case WanType.pppoe:
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
        case WanType.static:
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
.wan-info {
  display: flex;
  flex-direction: column;
  width: 360px;
  text-align: left;
  padding: 15px;
  div {
    display: flex;
    align-items: flex-start;
    padding: 5px 0;
    font-size: 14px;
  }
  label {
    font-weight: bold;
    text-align: left;
    flex: 1;
  }
  span {
    display: inline-block;
    width: 160px;
    word-wrap: break-word;
  }
}
@media screen and(max-width:768px) {
  .wan-info {
    width: 100%;
    padding: 0;
    padding-bottom: 30px;
  }
}
</style>
