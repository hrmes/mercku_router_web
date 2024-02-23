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
            <div v-if="isStaticWisp">
              <label class="with-colon">{{ $t('trans1291') }}:</label>
              <span>{{wispStatus[wispRepeaterStatus]}}</span>
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
              <div v-if="isWisp"
                   class="des-tips"
                   style="margin-top:0px">{{ $t('trans1211') }}</div>
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
            <m-form key="wisp-form"
                    v-if="isWisp"
                    ref="upperApForm"
                    :model="upperApForm"
                    :rules="upperApFormRules">
              <div class="card-wrapper">
                <div class="form-content">
                  <m-form-item prop="upperApForm.ssid"
                               class="scan-upper">
                    <qiyou-scan-upper-select :label="$t('trans0168')"
                                             :placeholder="$t('trans1182')"
                                             type='text'
                                             ref='loadingSelect'
                                             @change="selectedChange"
                                             @scanApclient="startApclientScan"
                                             popupTop
                                             :bssid="upperApForm.bssid"
                                             :ssid="upperApForm.ssid"
                                             :options="processedUpperApList"
                                             :loading="selectIsLoading"
                                             :loadingText="loadingText"
                                             v-model="upperApForm.ssid" />
                    <span @click.stop="()=>modalShow=true"
                          class="btn-icon">
                      <button class="btn btn-default btn-small">
                        <span class="add-icon"></span>
                      </button>
                      <span class="icon-hover-popover">{{$t('trans1250')}}</span>
                    </span>
                  </m-form-item>
                  <transition name=fade>
                    <m-form-item v-show="!pwdDisabled"
                                 prop="upperApForm.password">
                      <m-input :label="$t('trans0003')"
                               type="password"
                               :placeholder="$t('trans0321')"
                               v-model="upperApForm.password" />
                    </m-form-item>
                  </transition>
                </div>
              </div>
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
    <m-modal :visible.sync="modalShow"
             :type="'confirm'"
             class="add-upper-manual-modal">
      <div class="content">
        <div class="content-header">
          {{$t('trans1253')}}
        </div>
        <div class="content-form">
          <m-form ref="manualWispForm"
                  :model="manualWispForm"
                  :rules='manualWispRules'>
            <m-form-item prop="ssid">
              <m-input :label="$t('trans0168')"
                       type="text"
                       :placeholder="$t('trans0321')"
                       v-model="manualWispForm.ssid" />
            </m-form-item>
            <m-form-item prop="security">
              <m-select :label="$t('trans0522')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.security"
                        :options="encryptMethods"
                        @change="(nv, ov) => onEncryptChange(nv, ov)" />
            </m-form-item>
            <m-form-item prop="band">
              <m-select :label="$t('trans0111')"
                        :placeholder="$t('trans1182')"
                        v-model="manualWispForm.band"
                        :options="bandOptions" />
            </m-form-item>
            <m-form-item v-if="!upperEncryptIsOpen"
                         prop="password">
              <m-input :label="$t('trans0003')"
                       type="password"
                       :placeholder="$t('trans0321')"
                       v-model="manualWispForm.password" />
            </m-form-item>
          </m-form>
        </div>
        <div class="btn-inner">
          <button @click.stop="hiddenModalShow"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button class="btn"
                  @click="submitManualUpperForm">{{$t('trans0018')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import {
  ipRule,
  isMulticast,
  isLoopback,
  isValidMask,
  ipReg,
  getStringByte,
  isValidPassword
} from 'base/util/util';
import { WanType, EncryptMethod, RepeaterStatus } from 'base/util/constant';
import wispSettingUpper from '@/mixins/wisp_setting_upper';
import scanUpperSelect from '@/component/scanUpperSelect';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}

export default {
  mixins: [wispSettingUpper],
  components: {
    'qiyou-scan-upper-select': scanUpperSelect
  },
  data() {
    return {
      netNote: {
        dhcp: this.$t('trans0147'),
        static: this.$t('trans0150'),
        pppoe: this.$t('trans0154'),
        wisp: this.$t('trans1249')
      },
      networkArr: {
        '-': '-',
        dhcp: this.$t('trans0146'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144'),
        wisp: this.$t('trans1242')
      },
      autodns: {
        pppoe: true,
        dhcp: true
      },
      dnsOptions: [
        { value: true, text: this.$t('trans0399') },
        { value: false, text: this.$t('trans0400') }
      ],
      options: [
        {
          value: WanType.dhcp,
          text: this.$t('trans0146')
        },
        {
          value: WanType.pppoe,
          text: this.$t('trans0144')
        },
        {
          value: WanType.static,
          text: this.$t('trans0148')
        },
        {
          value: WanType.wisp,
          text: this.$t('trans1242')
        },
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
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 120,
            message: this.$t('trans1174')
          },
        ],
        password: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidPassword(value, 1, 120),
            message: this.$t('trans1174')
          },
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
      wispStatus: {
        connected: this.$t('trans1293'),
        connecting: this.$t('trans1295'),
        failed: this.$t('trans1294'),
        checking: this.$t('trans0564')
      },
      wanInfoTimer: null,
      wispRepeaterStatus: RepeaterStatus.checking,
      wispRepeaterStatsTimer: null,
      pageActive: true
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
    this.getWanNetInfo(true);
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
    isStaticWisp() {
      return this.netInfo.type === WanType.wisp;
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
        if (this.isStaticWisp &&
          this.wispRepeaterStatus !== RepeaterStatus.connected) {
          return local;
        }
        local.netinfo.ip = this.netInfo.netinfo.ip || '-';
        local.netinfo.mask = this.netInfo.netinfo.mask || '-';
        local.netinfo.gateway = this.netInfo.netinfo.gateway || '-';
        local.netinfo.dns = this.netInfo.netinfo.dns;
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
    getWanNetInfo(firstFlag = false) {
      if (this.isFirstEntry) {
        this.$loading.open();
        this.isFirstEntry = false;
      }
      this.$http
        .getWanNetInfo()
        .then(res => {
          if (res.data.result) {
            this.netInfo = res.data.result;
            this.netType = this.netInfo.type;
            this.$store.state.wanType = this.netInfo.type;
            localStorage.setItem('wanType', this.netInfo.type);
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
            if (this.isWisp) {
              this.createIntervalTask(firstFlag);
              this.upperApForm = this.netInfo.wisp.apclient;
              this.pwdDisabled =
                this.netInfo.wisp.apclient.security === EncryptMethod.OPEN ||
                this.netInfo.wisp.apclient.security === EncryptMethod.open;
            }
          }
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    save(params) {
      console.log('save', params);
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http.meshWanUpdate(params).then(() => {
              this.$store.state.wanType = params.type;
              localStorage.setItem('wanType', params.type);
              this.clearIntervalTask();
              this.$reconnect({
                onsuccess: () => {
                  this.$router.push({ path: '/login' });
                },
                ontimeout: () => {
                  this.$router.push({ path: '/unconnect' });
                },
                timeout: this.isWisp ? 60 : 30
              });
            }).finally(() => {
              this.$loading.close();
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
        case WanType.wisp:
          if (!this.$refs.upperApForm.validate()) {
            return;
          }
          form.wisp = {
            apclient: this.upperApForm
          };
          this.save(form);
          break;
        default:
          break;
      }
    },
    submitManualUpperForm() {
      if (this.$refs.manualWispForm.validate()) {
        const form = { type: this.netType, vlan: [] };
        form.wisp = {
          apclient: this.manualWispForm
        };
        this.save(form);
      }
    },
    createIntervalTask(firstFlag = false) {
      if (firstFlag) {
        this.getMeshRepeaterStatus();
      }
      clearTimeout(this.wanInfoTimer);
      this.wanInfoTimer = null;
      if (this.pageActive) {
        this.wanInfoTimer = setTimeout(() => {
          this.getWanNetInfo();
        }, 10000);
      }
    },
    getMeshRepeaterStatus() {
      clearTimeout(this.wispRepeaterStatsTimer);
      this.wispRepeaterStatsTimer = null;
      this.$http
        .getMeshRepeaterStatus(undefined, { hideToast: true })
        .then(res => {
          if (this.pageActive) {
            const {
              data: {
                result: { status }
              }
            } = res;
            this.wispRepeaterStatus = status;
            this.wispRepeaterStatsTimer = setTimeout(() => {
              this.getMeshRepeaterStatus();
            }, 10000);
          }
        })
        .catch(() => {
          this.wispRepeaterStatus = RepeaterStatus.checking;
          if (this.pageActive) {
            this.wispRepeaterStatsTimer = setTimeout(() => {
              this.getMeshRepeaterStatus();
            }, 10000);
          }
        });
    },
    clearIntervalTask() {
      clearTimeout(this.wanInfoTimer);
      this.wanInfoTimer = null;
      clearTimeout(this.wispRepeaterStatsTimer);
      this.wispRepeaterStatsTimer = null;
    }
  },
  beforeDestroy() {
    this.pageActive = false;
    this.clearIntervalTask();
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
.net-type {
  .form-item {
    &.scan-upper {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .qiyou-select-container {
        width: 250px;
        ::v-deep .select-popup {
          width: 330px;
        }
      }
      .btn-icon {
        width: auto;
        height: auto;
      }
      .btn-small {
        width: 70px;
        height: 48px;
        min-width: auto;
        padding: 0;
        opacity: 1;
      }
      .add-icon {
        position: relative;
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          height: 2.5px;
          border-radius: 2px;
          width: 15px;
          background-color: var(--primary-color);
          transform: translate(-50%, -50%) rotate(0deg);
        }
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          height: 2.5px;
          border-radius: 2px;
          width: 15px;
          background-color: var(--primary-color);
          transform: translate(-50%, -50%) rotate(90deg);
        }
      }
    }
  }
}
.add-upper-manual-modal {
  .content {
    display: flex;
    flex-direction: column;
    .content-header {
      margin-bottom: 15px;
      font-size: 16px;
      color: var(--text_default-color);
    }
    .content-form {
      .form-item {
        margin-bottom: 20px;
      }
    }
    .btn-inner {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .btn {
        flex: 1;
        height: 42px;
        &:last-child {
          margin-left: 30px;
        }
      }
      .btn-default {
        background-image: linear-gradient(
            to right,
            var(--modal_content-bgc),
            var(--modal_content-bgc)
          ),
          var(--common_btn_default-bgimg) !important;
      }
    }
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
