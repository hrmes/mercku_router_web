<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{ $t('trans0142') }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="seccess-info card">
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
          <div class="form__vlan card" style="display: none;">
            <m-form-item :class="{last:!vlan.enabled}">
              <m-switch :label="$t('trans0683')"
                        v-model="vlan.enabled"></m-switch>
              <div class="des-tips">{{$t('trans0682')}}</div>
            </m-form-item>
            <!-- Internet VLAN ID -->
            <m-form v-if="vlan.enabled"
                    :model="vlan"
                    ref="vlanForm">
              <m-form-item prop="id"
                           :rules="vlanIdRules"
                           ref="vlanId">
                <m-input :label="$t('trans0684')"
                         type="text"
                         placeholder="2-4094"
                         v-model="vlan.id"></m-input>
              </m-form-item>
              <m-form-item>
                <m-select :label="$t('trans0686')"
                          v-model="vlan.priority"
                          :options="priorities"></m-select>
              </m-form-item>
              <m-form-item>
                <m-checkbox :text="$t('trans0685')"
                            :rect='false'
                            style="margin-right:10px"
                            v-model="vlan.ports[0].tagged"></m-checkbox>
              </m-form-item>
            </m-form>
            <template v-if="vlan.enabled">
              <!-- IP-Phone VLAN ID -->
              <m-form :model="ipPhoneVlan"
                      ref="ipPhoneVlanForm">
                <m-form-item>
                  <m-switch v-model="ipPhoneVlan.enabled"
                            label="IP-Phone VLAN ID"></m-switch>
                </m-form-item>
                <template v-if="ipPhoneVlan.enabled">
                  <m-form-item prop="id"
                               :rules="ipPhoneVlanIdRules"
                               ref="ipPhoneVlanId">
                    <m-input type="text"
                             placeholder="2-4094"
                             v-model="ipPhoneVlan.id">
                    </m-input>
                  </m-form-item>
                  <m-form-item class="form__item">
                    <m-select :label="$t('trans0686')"
                              v-model="ipPhoneVlan.priority"
                              :popupTop="!iptvVlan.enabled"
                              :options="priorities"></m-select>
                  </m-form-item>
                </template>
              </m-form>
              <!-- IPTV VLAN ID -->
              <m-form :model="iptvVlan"
                      ref="iptvVlanForm">
                <m-form-item :class="{'last':!iptvVlan.enabled}">
                  <m-switch v-model="iptvVlan.enabled"
                            label="IPTV VLAN ID"></m-switch>
                </m-form-item>
                <template v-if="iptvVlan.enabled">
                  <m-form-item prop="id"
                               :rules="iptvVlanIdRules"
                               ref="iptvVlanId">
                    <m-input type="text"
                             placeholder="2-4094"
                             v-model="iptvVlan.id">
                    </m-input>
                  </m-form-item>
                  <m-form-item class="last">
                    <m-select :label="$t('trans0686')"
                              v-model="iptvVlan.priority"
                              :popupTop="true"
                              :options="priorities"></m-select>
                  </m-form-item>
                </template>
              </m-form>
            </template>
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
import * as CONSTANTS from 'base/util/constant';
import { cloneDeep } from 'lodash';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}

const VlanName = {
  internet: 'internet',
  ipPhone: 'ip-phone',
  iptv: 'iptv'
};
const VlanDefault = {
  enabled: false,
  id: 2,
  ports: [
    {
      port: {
        id: 4,
        name: 'wan',
        type: 'wan'
      },
      tagged: false
    }
  ],
  priority: 0,
  is_bridged: false,
  name: VlanName.internet
};
const IpPhoneVlanDefault = {
  enabled: false,
  id: '',
  ports: [
    {
      port: {
        id: 4,
        name: 'wan',
        type: 'wan'
      },
      tagged: true
    },
    {
      port: {
        id: 0,
        name: 'lan1',
        type: 'lan'
      },
      tagged: true
    },
    {
      port: {
        id: 1,
        name: 'lan2',
        type: 'lan'
      },
      tagged: true
    }
  ],
  priority: 0,
  is_bridged: false,
  name: VlanName.ipPhone
};
const IptvVlanDefault = {
  enabled: false,
  id: '',
  ports: [
    {
      port: {
        id: 4,
        name: 'wan',
        type: 'wan'
      },
      tagged: true
    },
    {
      port: {
        id: 0,
        name: 'lan1',
        type: 'lan'
      },
      tagged: true
    },
    {
      port: {
        id: 1,
        name: 'lan2',
        type: 'lan'
      },
      tagged: true
    }
  ],
  priority: 0,
  is_bridged: false,
  name: VlanName.iptv
};
export default {
  data() {
    return {
      IPv6NetType: '',
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
      netType: CONSTANTS.WanType.dhcp,
      netInfo: {},
      vlan: cloneDeep(VlanDefault),
      ipPhoneVlan: cloneDeep(IpPhoneVlanDefault),
      iptvVlan: cloneDeep(IptvVlanDefault),
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
    // this.getIPv6WanNetInfo();
  },
  computed: {
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
        local.type = this.netInfo.type ? this.netInfo.type : '-';
        local.netinfo.ip = this.netInfo.netinfo.ip
          ? this.netInfo.netinfo.ip
          : '-';
        local.netinfo.mask = this.netInfo.netinfo.mask
          ? this.netInfo.netinfo.mask
          : '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway
          ? this.netInfo.netinfo.gateway
          : '-';
        local.netinfo.dns = this.netInfo.netinfo.dns;
        return local;
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
    getIPv6WanNetInfo() {
      this.$http.getMeshInfoWanNetIpv6().then(res => {
        const { result } = res.data;
        const pppoeData = result.pppoe;
        this.IPv6NetType = result.type;
        if (this.IPv6NetType === CONSTANTS.WanType.pppoe) {
          this.pppoeForm.account = pppoeData.account;
          this.pppoeForm.password = pppoeData.password;
        }
      });
    },
    getWanNetInfo() {
      this.$loading.open();
      this.$http
        .getWanNetInfo()
        .then(res => {
          if (res.data.result) {
            this.netInfo = res.data.result;
            this.netType = this.netInfo.type;
            if (this.netInfo?.vlan?.length) {
              this.vlan =
                this.netInfo.vlan.find(
                  item => item.name === VlanName.internet
                ) || cloneDeep(VlanDefault);
              this.ipPhoneVlan =
                this.netInfo.vlan.find(
                  item => item.name === VlanName.ipPhone
                ) || cloneDeep(IpPhoneVlanDefault);
              this.iptvVlan =
                this.netInfo.vlan.find(item => item.name === VlanName.iptv) ||
                cloneDeep(IptvVlanDefault);
            }
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
      if (this.vlan.enabled) {
        if (
          !this.$refs.vlanForm.validate() ||
          !this.$refs.ipPhoneVlanForm.validate() ||
          !this.$refs.iptvVlanForm.validate()
        ) {
          return;
        }
        // 经过上面的判断，到这里已经可以确定如果有值的话必定是数字，所以可以用部分等于
        if (
          (this.ipPhoneVlan.id == this.vlan.id && this.ipPhoneVlan.enabled) ||
          (this.iptvVlan.id == this.vlan.id && this.iptvVlan.enabled) ||
          (this.ipPhoneVlan.id == this.iptvVlan.id &&
            this.ipPhoneVlan.enabled &&
            this.iptvVlan.enabled)
        ) {
          this.$toast(this.$t('trans1051'), 2000, 'error');
          return;
        }
      }
      const form = { type: this.netType, vlan: [] };
      if (this.vlan.enabled) {
        form.vlan.push({
          ...this.vlan,
          id: Number(this.vlan.id)
        });
        if (this.ipPhoneVlan.enabled) {
          form.vlan.push({
            ...this.ipPhoneVlan,
            id: Number(this.ipPhoneVlan.id)
          });
        }
        if (this.iptvVlan.enabled) {
          form.vlan.push({
            ...this.iptvVlan,
            id: Number(this.iptvVlan.id)
          });
        }
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
.seccess-info {
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
  .seccess-info {
    width: 100%;
    padding: 0;
    padding-bottom: 30px;
  }
}
</style>
