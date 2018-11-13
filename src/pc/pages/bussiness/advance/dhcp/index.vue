<template>
  <div class="advance-dhcp-form-container">
    <div class="content">
      <div class='w-header'>{{$t('trans0417')}}</div>
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
.advance-dhcp-form-container {
  flex: auto;
  padding: 0 2%;
  display: flex;
  position: relative;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;

    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: bold;
    }

    .form {
      padding-bottom: 50px;
      .btn-info {
        margin-top: 30px;
      }
      width: 400px;
      margin: 0 auto;
      margin-top: 30px;

      .item {
        width: 350px;
        margin-top: 30px;
        .ext-input {
        }
      }
      .radio-wrap {
        display: flex;
        span {
          padding-right: 20px;
        }
      }
      .radio-group {
        min-width: 300px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .advance-dhcp-form-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .form {
        padding-bottom: 50px;
        .btn-info {
          margin-top: 30px;
        }
        width: 100%;
        margin: 0 auto;
        .item {
          width: 100%;
          margin-top: 30px;
          .port-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .ext-input {
              width: 100px;
            }
            i {
              width: 30px;
              height: 1px;
              background: #999999;
            }
          }
        }
        .radio-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          span {
            margin-top: 20px;
            margin-bottom: 10px;
          }
        }
        .radio-group {
          width: 100%;
          min-width: 100%;
          flex-direction: column;
        }
      }
    }
  }
}
</style>

