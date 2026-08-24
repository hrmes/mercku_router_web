<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class='page-header'>{{$t('trans0417')}}</div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form class="form"
                    ref="form"
                    :model="form"
                    :rules='rules'>
              <m-form-item prop='ip'
                           ref="ip">
                <m-input :label="$t('trans0439')"
                         type="text"
                         :placeholder="curIp"
                         v-model="form.ip" />
              </m-form-item>
              <m-form-item prop='mask'
                           ref="mask">
                <m-input :label="$t('trans0152')"
                         type="text"
                         :placeholder="$t('trans0321')"
                         v-model="form.mask"
                         :onBlur="maskChange" />
              </m-form-item>
              <div class="item">
                <div>
                  <m-form-item prop='ip_start'
                               ref='ip_start'>
                    <m-input type="text"
                             :label="$t('trans0483')"
                             :placeholder="$t('trans0441')"
                             v-model="form.ip_start"
                             :onBlur='ipStartChange' />
                  </m-form-item>
                  <m-form-item prop='ip_end'
                               ref='ip_end'>
                    <m-input type="text"
                             :placeholder="$t('trans0442')"
                             v-model="form.ip_end" />
                  </m-form-item>
                </div>
              </div>
              <m-form-item class="last"
                           prop='lease'>
                <m-select :label="$t('trans0443')"
                          v-model="form.lease"
                          :popupTop="true"
                          :options="leases"></m-select>
              </m-form-item>
              <label class="tip"
                     v-if="lanipChanged">{{$t('trans0476')}}</label>
            </m-form>
          </div>
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
import {
  ipReg,
  privateIpReg,
  getIpBefore,
  getIpAfter,
  isPrivateIP,
  isValidGatewayIP,
  getSubNetwork,
  ip2int,
  isValidMask,
  isNetworkIP,
  isBoardcastIP
} from 'base/util/util';

const isSameSubNetwork = (ip, lanip, mask) =>
  getSubNetwork(ip, mask) === getSubNetwork(lanip, mask);

export default {
  data() {
    return {
      lanipChanged: false,
      privateIpReg,
      getIpBefore,
      getIpAfter,
      curIp: '',
      leases: [
        {
          value: 1 * 60 * 60,
          text: this.$t('trans0445')
        },
        {
          value: 1 * 60 * 60 * 4,
          text: this.$t('trans0446')
        },
        {
          value: 1 * 60 * 60 * 8,
          text: this.$t('trans0447')
        },
        {
          value: 1 * 60 * 60 * 12,
          text: this.$t('trans0448')
        },
        {
          value: 1 * 60 * 60 * 24,
          text: this.$t('trans0449')
        },
        {
          value: 1 * 60 * 60 * 24 * 7,
          text: this.$t('trans0450')
        }
      ],
      lanInfo: {},
      form: {
        ip: '',
        mask: '',
        ip_start: '',
        ip_end: '',
        lease: 1 * 60 * 60
      },
      rules: {
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value) && isPrivateIP(value),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isNetworkIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isBoardcastIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value => isValidGatewayIP(value, this.form.mask),
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
        ip_start: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isNetworkIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isBoardcastIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value =>
              isSameSubNetwork(value, this.form.ip, this.form.mask),
            message: this.$t('trans0231')
          }
        ],
        ip_end: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },

          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isNetworkIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value => !isBoardcastIP(value, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value =>
              isSameSubNetwork(value, this.form.ip, this.form.mask),
            message: this.$t('trans0231')
          },
          {
            rule: value => {
              if (this.form.ip_start) {
                return ip2int(this.form.ip_start) < ip2int(value);
              }
              return true;
            },
            message: this.$t('trans0472')
          }
        ]
      }
    };
  },
  computed: {
    formType() {
      return this.$route.params.id ? 'update' : 'add';
    },
    formParams() {
      return {
        type: 'dhcp_server',
        dhcp_server: {
          ip_start: this.form.ip_start,
          ip_end: this.form.ip_end,
          lease: this.form.lease,
          // domain: 'mercku',
          netinfo: { ip: this.form.ip, mask: this.form.mask }
        }
      };
    }
  },
  mounted() {
    this.getLanInfo();
  },
  methods: {
    ipStartChange() {
      this.$refs.ip_end.extraValidate(() => {
        const start = this.form.ip_start;
        const end = this.form.ip_end;
        if (ipReg.test(start)) {
          if (start && end) {
            return ip2int(end) > ip2int(start);
          }
          return true;
        }
        return true;
      }, this.$t('trans0472'));
    },
    maskChange() {
      this.$refs.ip.extraValidate(
        () => isValidGatewayIP(this.form.ip, this.form.mask),
        this.$t('trans0231')
      );
    },
    getLanInfo() {
      this.$loading.open();
      this.$http
        .meshInfolanNetGet()
        .then(res => {
          this.$loading.close();
          this.lanInfo = res.data.result;
          this.curIp = this.lanInfo.netinfo.ip;
          this.form = {
            ip: this.lanInfo.netinfo.ip,
            mask: this.lanInfo.netinfo.mask,
            ip_start: this.lanInfo.dhcp_server.ip_start,
            ip_end: this.lanInfo.dhcp_server.ip_end,
            lease: this.lanInfo.dhcp_server.lease
          };
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0229'),
          callback: {
            ok: () => {
              this.$loading.open();
              this.$http
                .meshLanUpdate(this.formParams)
                .then(() => {
                  this.$loading.close();
                  this.$reconnect({
                    timeout: 30,
                    onsuccess: () => {
                      this.$toast(this.$t('trans0040'), 2000, 'success');
                      this.$router.push({ path: '/dashboard' });
                    },
                    ontimeout: () => {
                      this.$router.push({ path: '/unconnect' });
                    }
                  });
                })
                .catch(() => {
                  this.$loading.close();
                });
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
}
</style>
