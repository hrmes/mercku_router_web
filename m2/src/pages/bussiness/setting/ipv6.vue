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
            <div class="info__item info__item--img">
              <img src="../../../assets/images/img_internet_normal.png"
                   alt="">
              <span>{{$t('trans0318')}}</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0375')}}：</label>
              <span>{{networkArr[netInfo.type]}}</span>
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
                           :placeholder="`${$t('trans0321')}`"
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
              <m-checkbox v-model="pppoeForm.isUseIPv4"
                          :onChange="useIPv4EnabledChange"
                          :text="$t('trans0625')"
                          class="pppoe-form__item__checkbox"></m-checkbox>
              <div class="pppoe-form__item__note">{{$t('trans0154')}}</div>
              <m-form-item class="item"
                           prop='account'>
                <m-input :label="$t('trans0155')"
                         type="text"
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.account"></m-input>
              </m-form-item>
              <m-form-item class="item"
                           prop='password'>
                <m-input :label="$t('trans0156')"
                         type='password'
                         :placeholder="`${$t('trans0321')}`"
                         v-model="pppoeForm.password" />
              </m-form-item>
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
                           :placeholder="$t('trans0321')"
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

const defaultPrefixLength = 64;

export default {
  data() {
    return {
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
        isUseIPv4: false, // 是否使用IPv4>PPPoE的账号和密码
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
            rule: value => {
              const val = parseInt(value, 10);
              return val > 0 && val < 129;
            },
            message: this.$t('trans0231')
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
    this.getMeshInfoWanNetIpv6();
  },
  methods: {
    getMeshInfoWanNetIpv6() {
      this.$loading.open();
      this.$http
        .getMeshInfoWanNetIpv6()
        .then(res => {
          this.$loading.close();
          const { result } = res.data;
          this.enabled = result.enabled;
          if (!this.enabled) {
            return;
          }
          this.netType = result.type;
          const { netinfo } = result;
          this.netInfo = {
            type: result.type || '-',
            ip: netinfo.address.length ? netinfo.address[0].ip : '-',
            gateway: netinfo.gateway.ip || '-',
            dns: netinfo.dns.length ? netinfo.dns[0].ip : '-'
          };
          if (this.isAuto) {
            const dnsArr = result.auto.dns;
            if (dnsArr.length) {
              // 手动获取dns
              this.autodns = false;
              this.autoForm.dns = dnsArr[0].ip;
            } else {
              // 自动获取dns
              this.autodns = true;
            }
          }
          if (this.isPppoe) {
            const pppoeInfo = result.pppoe;
            this.pppoeForm.isUseIPv4 = pppoeInfo.share_ipv4_credentials;
            this.pppoeForm.account = pppoeInfo.account;
            this.pppoeForm.password = pppoeInfo.password;
            this.pppoeForm.dns = pppoeInfo.dns[0].ip;
            if (pppoeInfo.dns.length) {
              // 手动获取dns
              this.autodns = false;
              this.pppoeForm.dns = pppoeInfo.dns[0].ip;
            } else {
              // 自动获取dns
              this.autodns = true;
            }
          }
          if (this.isStatic) {
            const staticInfo = result.static.netinfo;
            this.staticForm.ip = staticInfo.address[0].ip;
            this.staticForm.prefixLength = staticInfo.address[0].prefix_length;
            this.staticForm.gateway = staticInfo.gateway.ip;
            this.staticForm.dns = staticInfo.dns[0].ip;
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
              this.$router.push({ path: '/setting/ipv6' });
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
      } else {
        // 由启用状态切换到关闭状态
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.updateMeshConfigWanNetIpv6({ enabled });
            },
            cancel: () => {
              this.enabled = !enabled;
            }
          }
        });
      }
    },
    useIPv4EnabledChange(checked) {
      this.pppoeForm.isUseIPv4 = checked;
      if (checked) {
        // 选中
        this.getWanNetInfo();
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
            message: this.$t('trans0577')
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
          dns: [
            {
              ip: this.pppoeForm.dns,
              prefix_length: defaultPrefixLength
            }
          ]
        };
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
              prefix_length: this.staticForm.prefixLength
            },
            dns: [
              {
                ip: this.staticForm.dns1,
                prefix_length: this.staticForm.prefixLength
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
    .info__item--img {
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      img {
        width: 160px;
      }
      span {
        font-weight: bold;
        font-size: 14px;
        color: #333;
      }
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
        color: #333333;
        font-size: 14px;
        flex: 1;
      }
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
  .ipv6-page__internet-content--config {
    .radio-group {
      margin-bottom: 30px;
    }
    .form-button {
      margin-top: 50px !important;
      margin-bottom: 90px;
    }
    .auto-form,
    .static-form {
      margin-top: 30px;
    }
    .pppoe-form {
      margin-top: 30px;
      .pppoe-form__item__note {
        font-size: 14px;
        color: #999999;
      }
    }
    .static-form {
      margin-top: 30px;
      .static-form__item__note {
        font-size: 14px;
        color: #999999;
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
      // .info__item--img {
      //   align-items: flex-start;
      // }
    }
    .ipv6-page__internet-content {
      width: 100%;
    }
  }
}
</style>
