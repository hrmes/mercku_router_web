<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>
      {{$t('trans0620')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-switch v-model="enabled"
                        :label="$t('trans0620')"
                        @change="ipv6EnabledChange" />
            </m-form-item>
          </div>
          <div class="card" v-if="enabled">
            <span>{{ $t('trans1311') }}</span>
            </div>
        </div>
        <div class="row-2">
          <template v-if="enabled">
            <div class="form card">
              <div class="form-header">
                <span class="form-header__title">{{ $t('trans0622') }}</span>
              </div>
              <div class="form-content">
                <div>
                  <label class="with-colon">{{$t('trans0375')}}:</label>
                  <span>{{networkArr[netInfo.type] || '-'}}</span>
                </div>
                <div>
                  <label class="with-colon">{{$t('trans0151')}}:</label>
                  <span>{{netInfo.ip || '-'}}</span>
                </div>
                <div>
                  <label class="with-colon">{{$t('trans0236')}}:</label>
                  <span>{{netInfo.dns || '-'}}</span>
                </div>
                <div>
                  <label class="with-colon">{{$t('trans0153')}}:</label>
                  <span>{{netInfo.gateway || '-'}}</span>
                </div>
              </div>
            </div>
            <div class=" form card">
              <div class="form-header">
                <span class="form-header__title">{{ $t('trans0623') }}</span>
              </div>
              <div>
                <div class="form-warn"
                     v-if="false">
                  {{$t('trans0735')}}
                </div>
                <m-form-item>
                  <m-select :label="$t('trans0317')"
                            v-model="netType"
                            :options="wanTypeOptions"></m-select>
                  <div class="des-tips"
                       v-if="isPppoe||isStatic">{{isPppoe?$t('trans0154'):$t('trans0150')}}</div>
                </m-form-item>

                <!-- auto -->
                <m-form key="auto-form"
                        v-if="isAuto"
                        ref="autoForm"
                        :model="autoForm"
                        :rules="autoRules"
                        class="auto-form">
                  <m-form-item :class="{last:autodns}">
                    <m-select :label="$t('trans0401')"
                              v-model="autodns"
                              :options="dnsOptions"></m-select>
                  </m-form-item>
                  <template v-if="!autodns">
                    <m-form-item class="last"
                                 prop='dns'
                                 ref="dns">
                      <m-input :label="$t('trans0236')"
                               type="text"
                               :placeholder="IPv6DefaultPlaceholder"
                               v-model="autoForm.dns" />
                    </m-form-item>
                  </template>
                </m-form>
                <!-- pppoe -->
                <m-form key="pppoe-form"
                        v-else-if="isPppoe"
                        ref="pppoeForm"
                        :model="pppoeForm"
                        :rules='pppoeRules'
                        class="pppoe-form">
                  <m-form-item prop='account'>
                    <m-input :label="$t('trans0155')"
                             type="text"
                             :placeholder="`${$t('trans0321')}`"
                             v-model="pppoeForm.account"></m-input>
                  </m-form-item>
                  <m-form-item prop='password'>
                    <m-input :label="$t('trans0156')"
                             type='password'
                             :placeholder="`${$t('trans0321')}`"
                             v-model="pppoeForm.password" />
                  </m-form-item>
                  <m-form-item>
                    <m-checkbox v-model="pppoeForm.isUseIPv4"
                                :text="$t('trans0733')"
                                :rect="false"
                                disabled
                                class="pppoe-form__item__checkbox"></m-checkbox>
                  </m-form-item>
                  <m-form-item :class="{last:autodns}">
                    <m-select :label="$t('trans0401')"
                              v-model="autodns"
                              :options="dnsOptions"></m-select>
                  </m-form-item>
                  <template v-if="!autodns">
                    <m-form-item prop='dns'
                                 ref="dns"
                                 class="last">
                      <m-input :label="$t('trans0236')"
                               type="text"
                               :placeholder="IPv6DefaultPlaceholder"
                               v-model="pppoeForm.dns" />
                    </m-form-item>
                  </template>
                </m-form>
                <!-- static -->
                <m-form key="static-form"
                        v-else-if="isStatic"
                        ref="staticForm"
                        :model="staticForm"
                        :rules='staticRules'
                        class="static-form">
                  <m-form-item prop="ip"
                               ref="ip">
                    <m-input :label="$t('trans0151')"
                             type="text"
                             :placeholder="IPv6DefaultPlaceholder"
                             v-model="staticForm.ip" />
                  </m-form-item>
                  <m-form-item prop='prefixLength'
                               ref="prefixLength">
                    <m-input :label="$t('trans0694')"
                             type="text"
                             placeholder="1-128"
                             v-model="staticForm.prefixLength" />
                  </m-form-item>
                  <m-form-item prop='gateway'
                               ref="gateway">
                    <m-input :label="$t('trans0153')"
                             type="text"
                             :placeholder="IPv6DefaultPlaceholder"
                             v-model="staticForm.gateway" />
                  </m-form-item>
                  <m-form-item
                               prop='dns'
                               ref="dns">
                    <m-input :label="$t('trans0236')"
                             type="text"
                             :placeholder="IPv6DefaultPlaceholder"
                             v-model="staticForm.dns" />
                  </m-form-item>
                  <div class="form-header">
                    <span class="form-header__title">{{ $t('trans1309') }}</span>
                  </div>
                  <m-form-item prop="lanPrefix" ref="lanPrefix">
                    <m-input :label="$t('trans1310')"
                             type="text"
                             :placeholder="IPv6DefaultPlaceholder"
                             v-model="staticForm.lanPrefix" />
                  </m-form-item>
                  <m-form-item prop="lanPrefixLen" ref="lanPrefixLen">
                    <m-input :label="$t('trans0694')"
                    class="last"
                             type="text"
                             placeholder="16-64"
                             v-model="staticForm.lanPrefixLen" />
                  </m-form-item>
                </m-form>
              </div>
            </div>
          </template>
        </div>

      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn"
                  v-defaultbutton
                  @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as CONSTANTS from 'base/util/constant';
import { isValidInteger, isIP } from 'base/util/util';
import { Models } from 'base/util/constant';

const defaultPrefixLength = 64;
const { IPv6 } = CONSTANTS.IP;
const NoPPPoeList = [Models.m6s, Models.m6s_nano, Models.x1_pro];
export default {
  data() {
    return {
      IPv4NetType: '', // IPv4的网络状态
      isSetup: false, // 是否已经设置了
      enabled: false, // 是否启用IPv6
      IPv6DefaultPlaceholder: CONSTANTS.IPv6DefaultPlaceholder,
      netType: CONSTANTS.WanType.auto,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      networkArr: {
        auto: this.$t('trans0696'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144'),
        relay: this.$t('trans1308')
      },
      dnsOptions: [
        { value: true, text: this.$t('trans0399') },
        { value: false, text: this.$t('trans0400') }
      ],
      autodns: true,
      autoForm: { dns: '' },
      pppoeForm: {
        isUseIPv4: true, // 是否使用IPv4>PPPoE的账号和密码
        account: '',
        password: '',
        dns: ''
      },
      staticForm: {
        ip: '',
        prefixLength: '',
        gateway: '',
        dns: ''
      },
      autoRules: {},
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
            rule: value => {
              console.log("ip value is ", value);
              !/^\s*$/g.test(value)
            },
            message: this.$t('trans0232')
          },
          {
            rule: value => isIP(value, IPv6),
            message: this.$t('trans0231')
          }
        ],
        lanPrefix:[
          {
            rule: value => {
              console.log("lanPrefix value is ", value);
              !/^\s*$/g.test(value)
            },
            message: this.$t('trans0232')
          },
          {
            rule: value => isIP(value, IPv6),
            message: this.$t('trans0231')
          }
        ], 
        prefixLength: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidInteger(value, 1, 128),
            message: this.$t('trans0647')
          }
        ],
        lanPrefixLen: [
          {
            rule: value => {
              console.log("value is ", value);
              !/^\s*$/g.test(value)
            },
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidInteger(value, 16, 64),
            message: this.$t('trans1312')
          }
        ],
        gateway: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isIP(value, IPv6),
            message: this.$t('trans0231')
          }
        ],
        dns: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => isIP(value, IPv6),
            message: this.$t('trans0231')
          }
        ]
      },
      netInfo: {
        type: '-',
        ip: '-',
        gateway: '-',
        dns: '-'
      }
    };
  },
  computed: {
    isAuto() {
      return this.netType === CONSTANTS.WanType.auto;
    },
    isPppoe() {
      return this.netType === CONSTANTS.WanType.pppoe;
    },
    isStatic() {
      return this.netType === CONSTANTS.WanType.static;
    },
    isShowWarn() {
      return this.IPv4NetType === CONSTANTS.WanType.pppoe && !this.isPppoe;
    },
    wanTypeOptions() {
      if (NoPPPoeList.includes(process.env.MODEL_CONFIG.id)) {
        return [
          {
            value: CONSTANTS.WanType.auto,
            text: this.$t('trans0696')
          },
          {
            value: CONSTANTS.WanType.relay,
            text: this.$t('trans1308')
          },
          {
            value: CONSTANTS.WanType.static,
            text: this.$t('trans0148')
          }
        ];
      }
      return [
        {
          value: CONSTANTS.WanType.auto,
          text: this.$t('trans0696')
        },
        {
            value: CONSTANTS.WanType.relay,
            text: this.$t('trans1308')
        },
        {
          value: CONSTANTS.WanType.pppoe,
          text: this.$t('trans0144')
        },
        {
          value: CONSTANTS.WanType.static,
          text: this.$t('trans0148')
        }
      ];
    }
  },
  watch: {
    autodns: function autoWatcher(val) {
      if (!val) {
        this[`${this.netType}Rules`] = {
          ...this[`${this.netType}Rules`],
          dns: [
            {
              rule: value => !/^\s*$/g.test(value),
              message: this.$t('trans0232')
            },
            {
              rule: value => isIP(value, IPv6),
              message: this.$t('trans0231')
            }
          ]
        };
      } else {
        delete this[`${this.netType}Rules`].dns;
      }
    }
  },
  mounted() {
    // this.getIPv4WanNetInfo();
    // this.getIpv6NetInfo();
    this.getInitNetInfo();
  },
  methods: {
    getInitNetInfo() {
      this.$loading.open();
      Promise.all([this.$http.getMeshInfoWanNetIpv6(), this.$http.getWanNetInfo()])
        .then(
        ([ipv6Res, ipv4Res]) => {
          this.$loading.close();
          const { result: ipv4Result } = ipv4Res.data;
          this.IPv4NetType = ipv4Result.type;
          const dftIpv6NetType = this.IPv4NetType === CONSTANTS.WanType.dhcp || this.IPv4NetType == CONSTANTS.WanType.wisp ? CONSTANTS.WanType.relay : CONSTANTS.WanType.auto;
          console.log("ipv4NetType is ", this.IPv4NetType);
          console.log("dftIpv6NetType is ", dftIpv6NetType);
          const { result } = ipv6Res.data;
          this.enabled = result.enabled;
          this.isSetup = this.enabled;
          this.netType = result.enabled ? (result.type ?? dftIpv6NetType) : dftIpv6NetType;
          if (!this.enabled) {
            return;
          }
          const { netinfo } = result;
          this.netInfo.type = result.type ?? '-';
          this.netInfo.ip = netinfo.address?.[0]?.ip ?? '-';
          this.netInfo.gateway = netinfo.gateway?.ip ?? '-';
          this.netInfo.dns = netinfo.dns?.[0]?.ip ?? '-';
          if (this.isAuto) {
            const dnsArr = result.auto.dns;
            this.autodns = !dnsArr?.length;
            this.autoForm.dns = dnsArr?.[0]?.ip ?? '';
          }
          if (this.isPppoe) {
            const pppoeInfo = result.pppoe;
            this.pppoeForm.isUseIPv4 = pppoeInfo.share_ipv4_credentials;
            this.pppoeForm.account = pppoeInfo.account;
            this.pppoeForm.password = pppoeInfo.password;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip;
            this.autodns = !pppoeInfo.dns?.length;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip ?? '';
          }
          if (this.isStatic) {
            // result.static.netinfo.subprefix = {
            //   ip: "2001:db8:0:1::",
            //   prefix_length: 64
            // };
            const staticInfo = result.static.netinfo;
            this.staticForm.ip = staticInfo.address?.[0]?.ip ?? '';
            this.staticForm.prefixLength = staticInfo.address?.[0]?.prefix_length ?? '';
            this.staticForm.gateway = staticInfo.gateway.ip;
            this.staticForm.dns = staticInfo.dns?.[0]?.ip ?? '';
            this.staticForm.lanPrefix = staticInfo.subprefix?.ip ?? '';
            this.staticForm.lanPrefixLen = staticInfo.subprefix?.prefix_length;
          }
        }
      ).catch(() => {
        this.$loading.close();
      });
    },
    getIpv6NetInfo() {
      this.$loading.open();
      this.$http
        .getMeshInfoWanNetIpv6()
        .then(res => {
          this.$loading.close();
          const { result } = res.data;
          this.enabled = result.enabled;
          this.isSetup = this.enabled;
          if (!this.enabled) {
            return;
          }
          this.netType = result.type;
          const { netinfo } = result;
          this.netInfo.type = result.type ?? '-';
          this.netInfo.ip = netinfo.address?.[0]?.ip ?? '-';
          this.netInfo.gateway = netinfo.gateway?.ip ?? '-';
          this.netInfo.dns = netinfo.dns?.[0]?.ip ?? '-';
          if (this.isAuto) {
            const dnsArr = result.auto.dns;
            this.autodns = !dnsArr?.length;
            this.autoForm.dns = dnsArr?.[0]?.ip ?? '';
          }
          if (this.isPppoe) {
            const pppoeInfo = result.pppoe;
            this.pppoeForm.isUseIPv4 = pppoeInfo.share_ipv4_credentials;
            this.pppoeForm.account = pppoeInfo.account;
            this.pppoeForm.password = pppoeInfo.password;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip;
            this.autodns = !pppoeInfo.dns?.length;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip ?? '';
          }
          if (this.isStatic) {
            // result.static.netinfo.subprefix = {
            //   ip: "2001:db8:0:1::",
            //   prefix_length: 64
            // };
            const staticInfo = result.static.netinfo;
            this.staticForm.ip = staticInfo.address?.[0]?.ip ?? '';
            this.staticForm.prefixLength = staticInfo.address?.[0]?.prefix_length ?? '';
            this.staticForm.gateway = staticInfo.gateway.ip;
            this.staticForm.dns = staticInfo.dns?.[0]?.ip ?? '';
            this.staticForm.lanPrefix = staticInfo.subprefix?.ip ?? '';
            this.staticForm.lanPrefixLen = staticInfo.subprefix?.prefix_length;
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    updateMeshConfigWanNetIpv6(params) {
      this.$http.updateMeshConfigWanNetIpv6(params).then(res => {
        const { result } = res.data;
        if (result.status) {
          this.$reconnect({
            onsuccess: () => {
              this.$router.push({ path: '/dashboard' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            },
            timeout: 30
          });
        } else {
          this.$dialog.info({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0077')
          });
        }
      });
    },
    ipv6EnabledChange(enabled) {
      if (enabled) {
        // 由关闭状态切换到启用状态
        this.$dialog.confirm({
          okText: this.$t('trans1306'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans1305'),
          callback: {
            ok: () => {
              this.enabled = enabled;
            },
            cancel: () => {
              this.enabled = !enabled;
            }
          }
        });
      } else if (this.isSetup) {
        // 由启用状态切换到关闭状态
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.isSetup = false;
              this.updateMeshConfigWanNetIpv6({ enabled });
            },
            cancel: () => {
              this.enabled = !enabled;
            }
          }
        });
      }
    },
    getWanNetInfo() {
      this.$http
        .getWanNetInfo()
        .then(res => {
          const { type } = res.data.result;
          if (type !== CONSTANTS.WanType.pppoe) {
            this.$dialog.info({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              message: this.$t('trans0695')
            });
            this.pppoeForm.isUseIPv4 = false;
          } else {
            const { pppoe } = res.data.result;
            this.pppoeForm.account = pppoe.account;
            this.pppoeForm.password = pppoe.password;
          }
        })
        .catch(() => {
          this.$dialog.info({
            okText: this.$t('trans0024'),
            cancelText: this.$t('trans0025'),
            message: this.$t('trans0577'),
            callback: {
              ok: () => {
                this.pppoeForm.isUseIPv4 = false;
              }
            }
          });
        });
    },
    getIPv4WanNetInfo() {
      this.$http.getWanNetInfo().then(res => {
        if (res.data.result) {
          const { result } = res.data;
          const pppoeData = result.pppoe;
          this.IPv4NetType = result.type;
          if (this.IPv4NetType === CONSTANTS.WanType.pppoe) {
            this.pppoeForm.account = pppoeData.account;
            this.pppoeForm.password = pppoeData.password;
          }
        }
      });
    },
    submit() {
      const form = { type: this.netType };
      if (this.enabled) {
        if (this.isAuto) {
          if (!this.$refs.autoForm.validate()) {
            return;
          }
          form.auto = {
            dns: []
          };
          if (!this.autodns) {
            form.auto.dns.push({
              ip: this.autoForm.dns,
              prefix_length: defaultPrefixLength
            });
          }
        }
        if (this.isPppoe) {
          if (!this.$refs.pppoeForm.validate()) {
            return;
          }
          form.pppoe = {
            share_ipv4_credentials: this.pppoeForm.isUseIPv4,
            account: this.pppoeForm.account,
            password: this.pppoeForm.password,
            dns: []
          };
          if (!this.autodns) {
            form.pppoe.dns.push({
              ip: this.pppoeForm.dns,
              prefix_length: defaultPrefixLength
            });
          }
        }
        if (this.isStatic) {
          if (!this.$refs.staticForm.validate()) {
            return;
          }
          form.static = {
            netinfo: {
              family: 'ipv6',
              address: [
                {
                  ip: this.staticForm.ip,
                  prefix_length: Number(this.staticForm.prefixLength)
                }
              ],
              gateway: {
                ip: this.staticForm.gateway,
                prefix_length: defaultPrefixLength
              },
              subprefix: {
                ip: this.staticForm.lanPrefix,
                prefix_length: Number(this.staticForm.lanPrefixLen)
              },
              dns: [
                {
                  ip: this.staticForm.dns,
                  prefix_length: defaultPrefixLength
                }
              ]
            }
          };
        }
      }
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0229'),
        callback: {
          ok: () => {
            this.isSetup = true;
            this.updateMeshConfigWanNetIpv6({
              enabled: true,
              ...form
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.form-content {
  > div {
    display: flex;
    align-items: flex-start;
    padding: 5px 0;
    font-size: 14px;
    label {
      font-weight: bold;
      text-align: left;
      flex: 1;
    }
    span {
      display: inline-block;
      width: 175px;
      word-wrap: break-word;
    }
  }
}
@media screen and(max-width: 768px) {
  .ipv6-page {
    width: 100vw;
    .ipv6-page__content {
      padding: 20px;
    }
    .ipv6-page__switch-wrap {
      justify-content: flex-start;
    }
    .ipv6-page__internet-info {
      width: 100%;
    }
    .ipv6-page__internet-content {
      width: 100%;
      .info__item {
        flex-direction: column;
      }
    }
  }
}
</style>
