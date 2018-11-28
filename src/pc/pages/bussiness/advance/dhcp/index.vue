<template>
  <div class="page">
    <div class='page-header'>{{$t('trans0417')}}</div>
    <div class="page-content">
      <m-form class="form" ref="form" :model="form" :rules='rules'>
        <m-form-item class="item" prop='ip'>
          <m-input :label="$t('trans0439')" type="text" :onBlur="blur" :placeholder="`${$t('trans0440')} ${curIp}`" v-model="form.ip" />
        </m-form-item>
        <div class="item">
          <label for="">{{$t('trans0483')}}</label>
          <div>
            <m-form-item class="ext-item" prop='ip_start' ref='ip_start'>
              <m-input class="ext-input" :addOnBefore="ipBefore" type="text" :placeholder="$t('trans0441')" v-model="form.ip_start" :onBlur='ipStartChange' />

            </m-form-item>
            <m-form-item class="ext-item" prop='ip_end' ref='ip_end'>
              <m-input class="ext-input" :addOnBefore="ipBefore" type="text" :placeholder="$t('trans0442')" v-model="form.ip_end" />
            </m-form-item>
          </div>
        </div>
        <m-form-item class="item" prop='lease'>
          <m-select :label="$t('trans0443')" v-model="form.lease" :options="leases"></m-select>
        </m-form-item>
        <label class="tip" v-if="lanipChanged">{{$t('trans0476')}}</label>
      </m-form>

      <div class="btn-info form-button">
        <button class="btn" @click="submit()">{{$t('trans0081')}}</button>
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
          },
          {
            rule: value => {
              if (this.form.ip_start) {
                return Number(this.form.ip_start) < Number(value);
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
  mounted() {
    this.getLanInfo();
  },
  methods: {
    ipStartChange() {
      this.$refs.ip_end.extraValidate(() => {
        const start = this.form.ip_start;
        const end = this.form.ip_end;
        if (start && end) {
          return Number(end) > Number(start);
        }
        return true;
      }, this.$t('trans0472'));
    },
    blur() {
      const v = this.form.ip;
      if (ipReg.test(v) && this.privateIpReg(v)) {
        this.ipBefore = this.getIpBefore(v);
      }
      if (v !== this.curIp) {
        this.lanipChanged = true;
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
          this.curIp = this.lanInfo.netinfo.ip;
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
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0473'),
          callback: {
            ok: () => {
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
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .form{
    .tip{
      color:red;
      width: 350px;
      display: block;
    }
  }
}
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
@media screen and (max-width: 768px){
  .page-content{
    .form{
      .tip{
        width:100%;
      }
    }
  }
}
</style>

