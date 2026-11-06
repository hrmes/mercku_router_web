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
          <div v-if="vlanEditable" class="card form__vlan"
               data-e2e="wan-vlan-card">
            <m-form-item :class="{ last: !vlan.enabled }">
              <m-switch
                :label="$t('trans0683')"
                data-e2e="wan-vlan-toggle"
                v-model="vlan.enabled"
              ></m-switch>
              <div class="des-tips">{{ $t('trans0682') }}</div>
            </m-form-item>
            <!-- Internet VLAN ID -->
            <m-form v-if="vlan.enabled"
                    data-e2e="wan-vlan-form"
                    :model="vlan"
                    ref="vlanForm">
              <m-form-item prop="id" :rules="vlanIdRules" ref="vlanId">
                <m-input
                  data-e2e="wan-vlan-id-input"
                  :label="$t('trans0684')"
                  type="text"
                  placeholder="2-4094"
                  v-model="vlan.id"
                ></m-input>
              </m-form-item>
              <m-form-item>
                <m-select
                  :label="$t('trans0686')"
                  data-e2e="wan-vlan-priority-select"
                  v-model="vlan.priority"
                  :options="priorities"
                ></m-select>
              </m-form-item>
              <m-form-item class="last">
                <m-checkbox
                  :text="$t('trans0685')"
                  :rect="false"
                  style="margin-right: 10px"
                  v-model="vlan.ports[0].tagged"
                ></m-checkbox>
              </m-form-item>
            </m-form>
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
import isEqual from 'lodash/isEqual';
import {
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,
  isValidInteger
} from 'base/util/util';
import {
  WanType,
} from 'base/util/constant';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}

// Ordinary WAN edits replace the entire VLAN table on legacy firmware.
// Validate the loaded wire before granting save authority: Gen1 ignores type
// on UPDATE and silently skips invalid rows/ports; CH requires names.
function canPreserveVlans(info) {
  const knownKeys = (value, keys) => value && typeof value === 'object' &&
    !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
  const validTable = table => Array.isArray(table) && table.every(row => {
    if (!knownKeys(row, ['enabled', 'id', 'priority', 'name', 'type', 'is_bridged', 'ports']) ||
      typeof row.enabled !== 'boolean' || !Number.isInteger(row.id) || row.id <= 0 ||
      !Number.isInteger(row.priority) || typeof row.is_bridged !== 'boolean' ||
      (row.name !== undefined && typeof row.name !== 'string') || !Array.isArray(row.ports)) return false;
    if (row.type === undefined) {
      // CH has no type; its existing contract always includes a name.
      if (row.is_bridged || typeof row.name !== 'string') return false;
    } else if (!['NAT', 'BRIDGE'].includes(row.type) ||
      row.is_bridged !== (row.type === 'BRIDGE') || row.ports.length === 0) return false;
    return row.ports.every(item => knownKeys(item, ['port', 'tagged']) &&
      typeof item.tagged === 'boolean' && knownKeys(item.port, ['id', 'name', 'type']) &&
      Number.isInteger(item.port.id) && item.port.id >= 0 &&
      (item.port.name === undefined || typeof item.port.name === 'string') &&
      (item.port.type === undefined || ['wan', 'lan'].includes(item.port.type)) &&
      (row.type !== undefined || (item.port.name === 'wan' && item.port.type === 'wan')));
  });
  if (!info || !validTable(info.vlan)) return false;
  // Gen1 GET reads the same store twice. A visible disagreement is not an
  // authoritative snapshot. Entirely omitted rows have no wire count/error
  // marker and remain a legacy firmware release HOLD.
  return info.pppoe?.vlan === undefined ||
    (validTable(info.pppoe.vlan) && isEqual(info.pppoe.vlan, info.vlan));
}

// The UI owns one unambiguous Internet row, never the entire table.
function internetDefault() {
  return { enabled: false, id: 2, priority: 0, ports: [{ port: { id: 4, name: 'wan', type: 'wan' }, tagged: false }] };
}
function internetIndex(table) {
  const safe = row => !row.is_bridged && row.ports.length === 1 &&
    row.ports[0].port.id === 4 && row.ports[0].port.type !== 'lan';
  const named = table.map((row, i) => (row.name === 'internet' ? i : -1)).filter(i => i >= 0);
  if (named.length) return named.length === 1 && safe(table[named[0]]) ? named[0] : -2;
  const unnamed = table.map((row, i) => (!row.name && row.type === 'NAT' && safe(row) ? i : -1)).filter(i => i >= 0);
  if (unnamed.length) return unnamed.length === 1 ? unnamed[0] : -2;
  // An unnamed non-bridge row may be Internet with an unsupported port layout.
  return table.some(row => !row.name && !row.is_bridged) ? -2 : -1;
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
      vlan: internetDefault(),
      vlanOriginal: internetDefault(),
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
    vlanEditable() {
      const model = this.$store.state._runtimeContext?.identity?.modelId;
      return this.$store.state.mode === 'router' && ['M8', 'M6R0', 'M11R1', 'M11R4', 'M16R0', 'GA630'].includes(model) &&
        canPreserveVlans(this.netInfo) && internetIndex(this.netInfo.vlan) !== -2;
    },
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
      // A pending/failed refresh must not authorize a save with stale VLANs.
      this.netInfo = {};
      this.$loading.open();
      return this.$http
        .getWanNetInfo()
        .then(res => {
          if (!canPreserveVlans(res.data?.result)) throw new Error('WAN configuration unavailable');
          if (res.data.result) {
            this.netInfo = res.data.result;
            const index = internetIndex(this.netInfo.vlan);
            this.vlan = index >= 0
              ? JSON.parse(JSON.stringify(this.netInfo.vlan[index])) : internetDefault();
            this.vlanOriginal = JSON.parse(JSON.stringify(this.vlan));
            this.netType = this.netInfo.type;
            if (this.isDhcp) {
              const dns = (this.netInfo.dhcp && this.netInfo.dhcp.dns) || [];
              if (dns.length) {
                this.autodns.dhcp = false;
                [this.dhcpForm.dns1] = dns;
                this.dhcpForm.dns2 = dns[1] || '';
              }
            }
            if (this.isPppoe) {
              const dns = (this.netInfo.pppoe && this.netInfo.pppoe.dns) || [];
              this.pppoeForm.account = this.netInfo.pppoe.account;
              this.pppoeForm.password = this.netInfo.pppoe.password;
              if (dns.length) {
                this.autodns.pppoe = false;
                [this.pppoeForm.dns1] = dns;
                this.pppoeForm.dns2 = dns[1] || '';
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
        .catch(() => {
          this.netInfo = {};
          this.$toast(this.$t('trans0688'));
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    save(params) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$http.meshWanUpdate(params).then(res => {
              this.$reconnect({
                operation: res && res.data && res.data.async,
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
      if (!canPreserveVlans(this.netInfo)) {
        this.$toast(this.$t('trans0688'));
        return;
      }
      const table = JSON.parse(JSON.stringify(this.netInfo.vlan));
      if (!isEqual(this.vlan, this.vlanOriginal)) {
        if (!this.vlanEditable || (this.vlan.enabled &&
          (!this.$refs.vlanForm.validate() || !isValidInteger(this.vlan.priority, 0, 7)))) {
          this.$toast(this.$t('trans0688'));
          return;
        }
        const index = internetIndex(table);
        if (!this.vlan.enabled) {
          if (index >= 0) table.splice(index, 1);
        } else if (index >= 0) {
          table[index].enabled = true;
          table[index].id = Number(this.vlan.id);
          table[index].priority = Number(this.vlan.priority);
          table[index].ports[0].tagged = this.vlan.ports[0].tagged;
        } else {
          const row = {
            ...internetDefault(),
            enabled: true,
            id: Number(this.vlan.id),
            priority: Number(this.vlan.priority),
            is_bridged: false,
            name: 'internet'
          };
          row.ports[0].tagged = this.vlan.ports[0].tagged;
          const model = this.$store.state._runtimeContext.identity.modelId;
          if (['M8', 'M6R0'].includes(model)) row.type = 'NAT';
          if (model === 'M6R0') delete row.name;
          table.push(row);
        }
        if (this.vlan.enabled) {
          const targetIndex = index >= 0 ? index : table.length - 1;
          if (table.some((row, i) => i !== targetIndex && row.enabled === true &&
            Number(row.id) === Number(table[targetIndex].id))) {
            this.$toast(this.$t('trans1051'), 2000, 'error');
            return;
          }
        }
      }
      const form = { type: this.netType, vlan: table };

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
          if (this.netInfo.pppoe?.vlan !== undefined) {
            form.pppoe.vlan = JSON.parse(JSON.stringify(table));
          }
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
