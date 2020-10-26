<template>
  <div class="page ipv6-page">
    <div class='page-header'>
      {{$t('trans0620')}}
    </div>
    <div class="ipv6-page__content">
      <div class="ipv6-page__switch-wrap">
        <div class="ipv6-page__switch">
          <label for="">{{$t('trans0620')}}</label>
          <m-switch v-model="enabled"
                    :onChange="ipv6EnabledChange" />
        </div>
      </div>
      <template v-if="enabled">
        <div class="ipv6-page__internet-wrap">
          <div class="ipv6-page__internet-title">{{$t('trans0622')}}</div>
          <div class="ipv6-page__internet-content ipv6-page__internet-content--info">
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0375')}}：</label>
              <span class="info__item--text">{{networkArr[netInfo.type]}}</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0151')}}：</label>
              <span>{{netInfo.ip}}</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0153')}}：</label>
              <span>{{netInfo.gateway}}</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0236')}}：</label>
              <span>{{netInfo.dns}}</span>
            </div>
          </div>
        </div>
        <div class="ipv6-page__internet-wrap">
          <div class="ipv6-page__internet-title">{{$t('trans0623')}}</div>
          <div class="ipv6-page__internet-content ipv6-page__internet-content--config">
            <div class="form-warn"
                 v-if="!isPppoe">
              {{$t('trans0735')}}
            </div>
            <m-select :label="$t('trans0317')"
                      v-model="netType"
                      :options="wanTypeOptions"></m-select>
            <!-- auto -->
            <m-form key="auto-form"
                    v-if="isAuto"
                    ref="autoForm"
                    :model="autoForm"
                    :rules="autoRules"
                    class="auto-form">
              <m-form-item class="item">
                <m-radio-group class="radio-group"
                               direction="vertical"
                               v-model="autodns"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <template v-if="!autodns">
                <m-form-item class="item"
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
              <div class="pppoe-form__item__note">{{$t('trans0154')}}</div>
              <m-form-item class="item"
                           prop='account'>
                <m-input :label="$t('trans0155')"
                         type="text"
                         :disabled="pppoeDisabled"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.account"></m-input>
              </m-form-item>
              <m-form-item class="item"
                           prop='password'>
                <m-input :label="$t('trans0156')"
                         type='password'
                         :disabled="pppoeDisabled"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.password" />
              </m-form-item>
              <m-checkbox v-model="pppoeForm.isUseIPv4"
                          :text="$t('trans0733')"
                          disabled
                          class="pppoe-form__item__checkbox"></m-checkbox>
              <m-form-item class="item">
                <m-radio-group class="radio-group"
                               direction="vertical"
                               v-model="autodns"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <template v-if="!autodns">
                <m-form-item class="item"
                             prop='dns'
                             ref="dns">
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
              <div class="static-form__item__note">{{$t('trans0150')}}</div>
              <m-form-item class="item"
                           prop="ip"
                           ref="ip">
                <m-input :label="$t('trans0151')"
                         type="text"
                         :placeholder="IPv6DefaultPlaceholder"
                         v-model="staticForm.ip" />
              </m-form-item>
              <m-form-item class="item"
                           prop='prefixLength'
                           ref="prefixLength">
                <m-input :label="$t('trans0694')"
                         type="text"
                         placeholder="1-128"
                         v-model="staticForm.prefixLength" />
              </m-form-item>
              <m-form-item class="item"
                           prop='gateway'
                           ref="gateway">
                <m-input :label="$t('trans0153')"
                         type="text"
                         :placeholder="IPv6DefaultPlaceholder"
                         v-model="staticForm.gateway" />
              </m-form-item>
              <m-form-item class="item"
                           prop='dns'
                           ref="dns">
                <m-input :label="$t('trans0236')"
                         type="text"
                         :placeholder="IPv6DefaultPlaceholder"
                         v-model="staticForm.dns" />
              </m-form-item>
            </m-form>
            <div class="form-button">
              <button class="btn"
                      v-defaultbutton
                      @click="submit()">{{$t('trans0081')}}</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import * as CONSTANTS from '@/util/constant';
import is from 'is_js';
import { isValidInteger } from '@/util/util';

const defaultPrefixLength = 64;

export default {
  data() {
    return {
      isSetup: false, // 是否已经设置了
      enabled: false, // 是否启用IPv6
      IPv6DefaultPlaceholder: CONSTANTS.IPv6DefaultPlaceholder,
      netType: CONSTANTS.WanType.auto,
      netStatus: CONSTANTS.WanNetStatus.unlinked, // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      wanTypeOptions: [
        {
          value: CONSTANTS.WanType.auto,
          text: this.$t('trans0696')
        },
        {
          value: CONSTANTS.WanType.pppoe,
          text: this.$t('trans0144')
        },
        {
          value: CONSTANTS.WanType.static,
          text: this.$t('trans0148')
        }
      ],
      networkArr: {
        auto: this.$t('trans0696'),
        static: this.$t('trans0148'),
        pppoe: this.$t('trans0144')
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
      pppoeDisabled: false,
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
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => is.ipv6(value),
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
        gateway: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => is.ipv6(value),
            message: this.$t('trans0231')
          }
        ],
        dns: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => is.ipv6(value),
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
              rule: value => is.ipv6(value),
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
    this.getIpv6NetInfo();
  },
  methods: {
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
            this.pppoeDisabled = this.pppoeForm.isUseIPv4;
            this.pppoeForm.account = pppoeInfo.account;
            this.pppoeForm.password = pppoeInfo.password;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip;
            this.autodns = !pppoeInfo.dns?.length;
            this.pppoeForm.dns = pppoeInfo.dns?.[0]?.ip ?? '';
          }
          if (this.isStatic) {
            const staticInfo = result.static.netinfo;
            this.staticForm.ip = staticInfo.address?.[0]?.ip ?? '';
            this.staticForm.prefixLength =
              staticInfo.address?.[0]?.prefix_length ?? '';
            this.staticForm.gateway = staticInfo.gateway.ip;
            this.staticForm.dns = staticInfo.dns?.[0]?.ip ?? '';
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
            timeout: 60
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
        this.enabled = enabled;
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
            this.pppoeDisabled = true;
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
    submit() {
      const form = { type: this.netType };
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
                prefix_length: this.staticForm.prefixLength
              }
            ],
            gateway: {
              ip: this.staticForm.gateway,
              prefix_length: defaultPrefixLength
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

<style lang="scss">
.ipv6-page {
  .pppoe-form__item__checkbox {
    label {
      align-items: stretch !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.ipv6-page {
  .ipv6-page__content {
    padding: 30px 20px;
  }
  .ipv6-page__switch-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .ipv6-page__switch {
    display: flex;
    width: 340px;
    label {
      width: auto;
      font-weight: bold;
      padding-right: 20px;
    }
  }
  .ipv6-page__internet-title {
    font-size: 14px;
    color: #999;
    border-bottom: 1px solid #f1f1f1;
    height: 50px;
    line-height: 50px;
  }
  .ipv6-page__internet-content {
    width: 340px;
    margin: 30px auto 50px auto;
  }
  .ipv6-page__internet-content--info {
    width: 340px;
    .info__item {
      display: flex;
    }
    .info__item--text {
      label {
        display: inline-block;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        text-align: left;
        width: 150px;
      }
      span {
        display: inline-block;
        color: #333333;
        font-size: 14px;
        width: calc(100% - 150px);
      }
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
  .ipv6-page__internet-content--config {
    .form-warn {
      font-size: 16px;
      font-weight: 500;
      text-align: justify;
      color: #d6001c;
      margin-bottom: 30px;
    }
    .radio-group {
      margin-bottom: 30px;
    }
    .form-button {
      margin-top: 50px !important;
      margin-bottom: 90px;
    }
    .auto-form {
      margin-top: 30px;
    }
    .pppoe-form,
    .static-form {
      margin-top: 10px;
    }
    .pppoe-form {
      .pppoe-form__item__note {
        font-size: 14px;
        color: #999999;
        margin-bottom: 30px;
      }
      .pppoe-form__item__checkbox {
        height: auto;
        margin-bottom: 10px;
        width: 100%;
      }
    }
    .static-form {
      .static-form__item__note {
        font-size: 14px;
        color: #999999;
        margin-bottom: 30px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .ipv6-page {
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
    }
    .ipv6-page__internet-content--info {
      .info__item {
        flex-direction: column;
      }
      .info__item--text {
        label {
          width: 100%;
        }
        span {
          width: 100%;
        }
      }
    }
  }
}
</style>
