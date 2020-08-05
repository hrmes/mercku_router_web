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
              <span>AUTO</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0151')}}：</label>
              <span>xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx/xx</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0153')}}：</label>
              <span>xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx</span>
            </div>
            <div class="info__item info__item--text">
              <label for="">{{$t('trans0236')}}：</label>
              <span>xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx</span>
            </div>
          </div>
        </div>
        <div class="ipv6-page__internet-wrap">
          <div class="ipv6-page__internet-title">{{$t('trans0623')}}</div>
          <div class="ipv6-page__internet-content ipv6-page__internet-content--config">
            <m-select :class="`select-margin-bottom--${isPppoe ? 'sm' : 'lg'}`"
                      :label="$t('trans0317')"
                      v-model="netType"
                      :options="wanTypeOptions"></m-select>
            <!-- auto -->
            <m-form key="auto-form"
                    v-if="isAuto"
                    ref="autoForm"
                    :model="autoForm"
                    :rules="autoRules">
              <m-form-item class="item">
                <m-radio-group class="radio-group"
                               direction="vertical"
                               v-model="autodns.auto"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <template v-if="!autodns.auto">
                <m-form-item class="item"
                             prop='dns1'
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           :placeholder="`${$t('trans0321')}`"
                           v-model="autoForm.dns1" />
                </m-form-item>
                <m-form-item class="item"
                             prop='dns2'
                             ref="backupdns">
                  <m-input :label="$t('trans0320')"
                           type="text"
                           :placeholder="`${$t('trans0321')}`"
                           v-model="autoForm.dns2" />
                </m-form-item>
              </template>
            </m-form>
            <!-- pppoe -->
            <m-form key="pppoe-form"
                    v-else-if="isPppoe"
                    ref="pppoeForm"
                    :model="pppoeForm"
                    :rules='pppoeRules'>
              <m-checkbox v-model="pppoeForm.isUseIPv4"
                          :text="$t('trans0625')"></m-checkbox>
              <div class="note">{{$t('trans0154')}}</div>
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
                               v-model="autodns.pppoe"
                               :options="dnsOptions"></m-radio-group>
              </m-form-item>
              <template v-if="!autodns.pppoe">
                <m-form-item class="item"
                             prop='dns1'
                             ref="dns">
                  <m-input :label="$t('trans0236')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="pppoeForm.dns1" />
                </m-form-item>
                <m-form-item class="item"
                             prop='dns2'
                             ref="backupdns">
                  <m-input :label="$t('trans0320')"
                           type="text"
                           placeholder="0.0.0.0"
                           v-model="pppoeForm.dns2" />
                </m-form-item>
              </template>
            </m-form>
            <!-- static -->
            <m-form key="static-form"
                    v-else-if="isStatic"
                    ref="staticForm"
                    :model="staticForm"
                    :rules='staticRules'>
              <div class="note">{{$t('trans0150')}}</div>
              <m-form-item class="item"
                           prop="ip"
                           ref="ip">
                <m-input :label="$t('trans0151')"
                         type="text"
                         placeholder="0000:0000:0000:0000:0000:0000:0000:0000"
                         v-model="staticForm.ip"
                         :onBlur="ipChange" />
              </m-form-item>
              <m-form-item class="item"
                           prop='prefixLength'
                           ref="prefixLength">
                <m-input :label="$t('trans0694')"
                         type="text"
                         placeholder="1-128"
                         v-model="staticForm.prefixLength"
                         :onBlur="prefixLengthChange" />
              </m-form-item>
              <m-form-item class="item"
                           prop='gateway'
                           ref="gateway">
                <m-input :label="$t('trans0153')"
                         type="text"
                         placeholder="0000:0000:0000:0000:0000:0000:0000:0000"
                         v-model="staticForm.gateway" />
              </m-form-item>
              <m-form-item class="item"
                           prop='dns1'
                           ref="dns">
                <m-input :label="$t('trans0236')"
                         type="text"
                         placeholder="0000:0000:0000:0000:0000:0000:0000:0000"
                         v-model="staticForm.dns1" />
              </m-form-item>
              <m-form-item class="item"
                           prop='dns2'
                           ref="backupdns">
                <m-input :label="$t('trans0320')"
                         type="text"
                         placeholder="0000:0000:0000:0000:0000:0000:0000:0000"
                         v-model="staticForm.dns2" />
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
import * as CONSTANTS from 'util/constant';
import { ipRule, isMulticast, isLoopback, isValidMask, ipReg } from 'util/util';

function checkDNS(value) {
  return ipReg.test(value) && !isMulticast(value) && !isLoopback(value);
}
export default {
  data() {
    return {
      enabled: false,
      netType: CONSTANTS.IPv6_WanType.auto,
      wanTypeOptions: [
        {
          value: 'auto',
          text: this.$t('trans0696')
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
      dnsOptions: [
        { value: true, text: this.$t('trans0399') },
        { value: false, text: this.$t('trans0400') }
      ],
      autodns: {
        auto: true,
        pppoe: true
      },
      autoForm: { dns1: '', dns2: '' },
      pppoeForm: {
        isUseIPv4: false,
        account: '',
        password: '',
        dns1: '',
        dns2: ''
      },
      staticForm: {
        ip: '',
        prefixLength: '',
        gateway: '',
        dns1: '',
        dns2: ''
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
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        prefixLength: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => /^\d{1,3}$/g.test(value),
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
      }
    };
  },
  computed: {
    isAuto() {
      return this.netType === CONSTANTS.IPv6_WanType.auto;
    },
    isPppoe() {
      return this.netType === CONSTANTS.IPv6_WanType.pppoe;
    },
    isStatic() {
      return this.netType === CONSTANTS.IPv6_WanType.static;
    }
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
    'autodns.auto': function dhcpWatcher(val) {
      if (!val) {
        this.autoRules = {
          ...this.autoRules,
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
        delete this.autoRules.dns1;
        delete this.autoRules.dns2;
      }
    }
  },
  methods: {
    ipv6EnabledChange(enabled) {
      this.enabled = enabled;
    },
    ipChange() {},
    prefixLengthChange() {},
    submit() {}
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
    margin: 0 auto;
  }
  .ipv6-page__internet-content--info {
    width: 340px;
    margin: 0 auto;
    .info__item {
      display: flex;
    }
    .info__item--img {
      flex-direction: column;
      align-items: center;
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
      margin-top: 10px;
      label {
        display: inline-block;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        text-align: left;
      }
      span {
        color: #333333;
        font-size: 14px;
        flex: 1;
      }
    }
  }
  .ipv6-page__internet-content--config {
    .select-margin-bottom--lg {
      margin-bottom: 30px;
    }
    .select-margin-bottom--sm {
      margin-bottom: 5px;
    }
    .radio-group {
      margin-bottom: 30px;
    }
    .note {
      font-size: 12px;
      color: #999999;
      padding-top: 10px;
      padding-bottom: 5px;
    }
    .form-button {
      margin-top: 50px !important;
      margin-bottom: 90px;
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
