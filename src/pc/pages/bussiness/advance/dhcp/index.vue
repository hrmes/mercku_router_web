<template>
  <div class="page">
    <div class='page-header'>{{$t('trans0417')}}</div>
    <div class="page-content">
      <div class="form">
        <m-form ref="form" :model="form" :rules='rules'>
          <m-form-item class="item" prop='name' ref="name">
            <m-input :label="$t('trans0439')" type="text" :placeholder="$t('trans0440')" v-model="form.name" />
          </m-form-item>
          <div class="item">
            <label for="">{{$t('trans0151')}}</label>
            <div>
              <m-form-item class="ext-item" prop='remotePortFrom' ref="remotePortFrom">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0441')" v-model="form.remotePortFrom" />
              </m-form-item>
              <m-form-item class="ext-item" prop='remotePortTo' ref="remotePortTo">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0442')" v-model="form.remotePortTo" />
              </m-form-item>
            </div>
          </div>
          <m-form-item class="item" prop='localIp' ref="localIp">
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
import { ipReg, getStringByte, portReg } from '../../../../../util/util';

export default {
  data() {
    return {
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
      form: {
        ip_start: '192.168.1.100',
        ip_end: '192.168.1.200',
        lease: 1 * 60 * 60,
        domain: 'mercku',
        netinfo: {}
      },
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
        remoteIp: [
          {
            rule: value => (value ? ipReg.test(value) : value !== 0),
            message: this.$t('trans0231')
          }
        ],
        remotePortFrom: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        remotePortTo: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        localIp: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        localPortFrom: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        localPortTo: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0231')
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
        id: this.form.id,
        name: this.form.name,
        enabled: this.form.enabled,
        protocol: this.form.protocol,
        local: {
          ip: this.form.localIp,
          port: {
            from: this.form.localPortFrom
              ? Number(this.form.localPortFrom)
              : '',
            to: this.form.localPortTo ? Number(this.form.localPortTo) : ''
          }
        },
        remote: {
          ip: this.form.remoteIp,
          port: {
            from: this.form.remotePortFrom
              ? Number(this.form.remotePortFrom)
              : '',
            to: this.form.remotePortTo ? Number(this.form.remotePortTo) : ''
          }
        }
      };
    }
  },
  watch: {},
  mounted() {
    // 更新判断
    if (this.$route.params.id) {
      const { portfw } = this.$store.state;
      if (portfw.id) {
        this.form = {
          id: portfw.id,
          name: portfw.name,
          enabled: portfw.enabled,
          localIp: portfw.local.ip,
          localPortFrom: portfw.local.port.from,
          localPortTo: portfw.local.port.to,
          remoteIp: portfw.remote.ip,
          remotePortFrom: portfw.remote.port.from,
          remotePortTo: portfw.remote.port.to,
          protocol: portfw.protocol
        };
      } else {
        this.$router.push('/advance/portforwarding');
      }
    }
  },
  methods: {
    submit() {
      const fetchMethod =
        this.formType === 'update' ? 'meshPortfwUpdate' : 'meshPortfwAdd';
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http[fetchMethod](this.formParams)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
            this.$router.push('/advance/portforwarding');
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

