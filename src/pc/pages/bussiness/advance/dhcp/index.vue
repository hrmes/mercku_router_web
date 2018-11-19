<template>
  <div class="page">
    <div class='page-header'>{{$t('trans0417')}}</div>
    <div class="page-content">
      <div class="form">
        <m-form ref="form" :model="form" :rules='rules'>
          <m-form-item class="item" prop='ip'>
            <m-input :label="$t('trans0439')" type="text" :onBlur="blur" :placeholder="$t('trans0440')" v-model="form.ip" />
          </m-form-item>
          <div class="item">
            <label for="">{{$t('trans0483')}}</label>
            <div>
              <m-form-item class="ext-item" prop='ip_start'>
                <m-input class="ext-input" :addOnBefore="ipBefore" type="text" :placeholder="$t('trans0441')" v-model="form.ip_start" />
              </m-form-item>
              <m-form-item class="ext-item" prop='ip_end'>
                <m-input class="ext-input" :addOnBefore="ipBefore" type="text" :placeholder="$t('trans0442')" v-model="form.ip_end" />
              </m-form-item>
            </div>
          </div>
          <m-form-item class="item" prop='lease'>
            <m-select :label="$t('trans0443')" v-model="form.lease" :options="leases"></m-select>
          </m-form-item>
        </m-form>
        <div class="btn-info">
          <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ipReg,
  getStringByte,
  privateIpReg,
  getIpBefore,
  getIpAfter
} from '../../../../../util/util';

export default {
  data() {
    return {
      privateIpReg,
      getIpBefore,
      getIpAfter,
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
        },
        {
          value: 1 * 60 * 60 * 24 * 7 * 30,
          text: this.$t('trans0451')
        },
        {
          value: 1 * 60 * 60 * 24 * 7 * 365,
          text: this.$t('trans0452')
        }
      ],
      lanInfo: {},
      form: {
        ip: '',
        ip_start: '',
        ip_end: '',
        lease: 1 * 60 * 60
      },
      ipBefore: '',
      rules: {
        name: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ],
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value) && privateIpReg(value),
            message: this.$t('trans0231')
          }
        ],
        ip_start: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value =>
              /^(25[0-4]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/.test(value),
            message: this.$t('trans0395')
          }
        ],
        ip_end: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value =>
              /^(25[0-4]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/.test(value),
            message: this.$t('trans0395')
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
          ip_start: `${this.ipBefore}${this.form.ip_start}`,
          ip_end: `${this.ipBefore}${this.form.ip_end}`,
          lease: this.form.lease,
          // domain: 'mercku',
          netinfo: {
            ip: this.form.ip
          }
        }
      };
    }
  },
  watch: {},
  mounted() {
    this.getLanInfo();
  },
  methods: {
    blur() {
      const v = this.form.ip;
      if (ipReg.test(v) && this.privateIpReg(v)) {
        this.ipBefore = this.getIpBefore(v);
      }
    },
    getLanInfo() {
      this.$loading.open();
      this.$http
        .meshInfolanNetGet()
        .then(res => {
          this.$loading.close();
          this.lanInfo = res.data.result;
          this.ipBefore = this.getIpBefore(this.lanInfo.netinfo.ip);
          this.form = {
            ip: this.lanInfo.netinfo.ip,
            ip_start: this.getIpAfter(this.lanInfo.dhcp_server.ip_start),
            ip_end: this.getIpAfter(this.lanInfo.dhcp_server.ip_end),
            lease: this.lanInfo.dhcp_server.lease
          };
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .meshLanUpdate(this.formParams)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.$reconnect({
              onsuccess: () => {
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
  }
};
</script>
<style lang="scss" scoped>
.ext-item {
  position: relative;
  .ext-input {
    input {
      padding-left: 100px;
    }
  }
  .ip {
    width: 120px;
    position: absolute;
    top: 20px;
  }
}
</style>

