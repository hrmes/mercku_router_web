<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
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
      <div class="form">
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
                         ref="mask">
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
          <div class="form__label form__split-line">
            <m-checkbox :rect="false"
                        :text="$t('trans0683')"
                        :bold='true'
                        v-model="vlan.enabled"></m-checkbox>
            <div class="tool">
              <m-popover position="bottom left"
                         style="left:12px"
                         :title="this.$t('trans0683')"
                         :content="this.$t('trans0682')">
                <i class="iconfont icon-ic_help"
                   style="font-size:14px"></i>
              </m-popover>
            </div>
          </div>
          <!-- Internet VLAN ID -->
          <m-form class="form__internet-vlan"
                  :model="vlan"
                  v-if="vlan.enabled"
                  ref="vlanForm">
            <m-form-item class="form__item"
                         prop="id"
                         :rules="vlanIdRules"
                         ref="vlanId">
              <m-input :label="$t('trans0684')"
                       type="text"
                       placeholder="2-4094"
                       v-model="vlan.id"></m-input>
            </m-form-item>
            <m-form-item class="form__item">
              <m-select :label="$t('trans0686')"
                        v-model="vlan.priority"
                        :options="priorities"></m-select>
            </m-form-item>
            <m-form-item class="form__item">
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
              <m-form-item class="form__item form__checkbox-wrap form__split-line"
                           :class="{
                'form__item--mb': ipPhoneVlan.enabled
              }">
                <m-checkbox v-model="ipPhoneVlan.enabled"
                            text="IP-Phone VLAN ID"></m-checkbox>
              </m-form-item>
              <template v-if="ipPhoneVlan.enabled">
                <m-form-item class="form__item"
                             :class="{
                'form__item--mt': ipPhoneVlan.enabled
              }"
                             prop="id"
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
                            :options="priorities"></m-select>
                </m-form-item>
              </template>
            </m-form>
            <!-- IPTV VLAN ID -->
            <m-form :model="iptvVlan"
                    ref="iptvVlanForm">
              <m-form-item class="form__item form__checkbox-wrap form__split-line"
                           :class="{
                'form__item--mb': iptvVlan.enabled
              }">
                <m-checkbox v-model="iptvVlan.enabled"
                            text="IPTV VLAN ID"></m-checkbox>
              </m-form-item>
              <template v-if="iptvVlan.enabled">
                <m-form-item class="form__item"
                             :class="{
                'form__item--mt': iptvVlan.enabled
              }"
                             prop="id"
                             :rules="iptvVlanIdRules"
                             ref="iptvVlanId">
                  <m-input type="text"
                           placeholder="2-4094"
                           v-model="iptvVlan.id">
                  </m-input>
                </m-form-item>
                <m-form-item class="form__item">
                  <m-select :label="$t('trans0686')"
                            v-model="iptvVlan.priority"
                            :options="priorities"></m-select>
                </m-form-item>
              </template>
            </m-form>
          </template>
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
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,
  isValidInteger
} from 'base/util/util';
import * as CONSTANTS from 'base/util/constant';
import { cloneDeep } from 'lodash';
import store from '@/store/index';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}
function checkPortNums(modelID) {
  let ports = null;
  switch (modelID) {
    case CONSTANTS.M6aRouterSnModelVersion.M6a:
      ports = [
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
      ];
      break;
    case CONSTANTS.M6aRouterSnModelVersion.M6a_Plus:
    case CONSTANTS.M6aRouterSnModelVersion.M6c:
      ports = [
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
        },
        {
          port: {
            id: 2,
            name: 'lan3',
            type: 'lan'
          },
          tagged: true
        },
        {
          port: {
            id: 3,
            name: 'lan4',
            type: 'lan'
          },
          tagged: true
        }
      ];
      break;
    default:
      break;
  }
  return ports;
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
  ports: checkPortNums(store.state.modelID),
  priority: 0,
  is_bridged: false,
  name: VlanName.ipPhone
};
const IptvVlanDefault = {
  enabled: false,
  id: '',
  ports: checkPortNums(store.state.modelID),
  priority: 0,
  is_bridged: false,
  name: VlanName.iptv
};
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
        local.netinfo.ip = this.netInfo.netinfo.ip ? this.netInfo.netinfo.ip : '-';
        local.netinfo.mask = this.netInfo.netinfo.mask ? this.netInfo.netinfo.mask : '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway ? this.netInfo.netinfo.gateway : '-';
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
                this.netInfo.vlan.find(item => item.name === VlanName.internet) ||
                cloneDeep(VlanDefault);
              this.ipPhoneVlan =
                this.netInfo.vlan.find(item => item.name === VlanName.ipPhone) ||
                cloneDeep(IpPhoneVlanDefault);
              this.iptvVlan =
                this.netInfo.vlan.find(item => item.name === VlanName.iptv) ||
                cloneDeep(IptvVlanDefault);
            }
            if (this.isDhcp) {
              if (this.netInfo.dhcp && this.netInfo.dhcp.dns) {
                this.autodns.dhcp = false;
                [this.dhcpForm.dns1] = this.netInfo.dhcp.dns;
                this.dhcpForm.dns2 = this.netInfo.dhcp.dns[1] || '';
              }
            }
            if (this.isPppoe) {
              this.pppoeForm.account = this.netInfo.pppoe.account;
              this.pppoeForm.password = this.netInfo.pppoe.password;
              if (this.netInfo.pppoe.dns) {
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
                timeout: 60
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
          this.$toast(this.$t('trans1051'), 3000, 'error');
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
.form {
  padding: 25px 0;
  .item {
    width: 340px;
  }
  // @media screen and (min-width: 769px) {
  //   width: 340px;
  // }
  .net-type {
    margin-bottom: 30px;
  }
  .note {
    font-size: 12px;
    padding-top: 10px;
    color: var(--text-gery-color);
  }
  .form__split-line {
    padding-top: 25px;
    border-top: 1px solid var(--hr-color);
  }
  .form__internet-vlan {
    margin-top: 25px;
  }
  .form__label {
    display: flex;
    align-items: center;
  }
  .form__item {
    margin-bottom: 25px;
    &.form__item--mb {
      margin-bottom: 0px;
    }
    &.form__item--mt {
      margin-top: 10px;
    }
  }
  .form__checkbox-wrap {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
    font-size: 14px;
  }
  .form__submit {
    margin-top: 25px !important;
    padding-top: 25px;
    border-top: 1px solid var(--hr-color);
  }
}
.wan-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 16px;
  text-align: center;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--hr-color);
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
    width: 340px;
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
      font-weight: bold;
      text-align: left;
      width: 150px;
    }
    span {
      font-size: 14px;
      flex: 1;
    }
  }
}
@media screen and(max-width:768px) {
  .page-content {
    width: 100vw;
    .wan-info {
      flex-direction: column;
      width: 100%;
      .seccess-info {
        border: 0;
        padding-left: 0;
      }
    }
    .form {
      .item {
        width: auto;
      }
    }
  }
}
</style>
