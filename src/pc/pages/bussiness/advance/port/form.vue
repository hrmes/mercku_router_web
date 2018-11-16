<template>
  <div class="page">
    <div class='page-header'>
      {{formType==='update'?$t('trans0034'):$t('trans0035')}}{{$t('trans0422')}}
    </div>
    <div class="page-content">

      <div class="form">
        <m-form ref="form" :model="form" :rules='rules'>
          <div class="radio-wrap">
            <span> {{$t('trans0408')}}</span>
            <m-radio-group class="radio-group" v-model="form.protocol" :options="protocolOptions"></m-radio-group>
          </div>
          <m-form-item class="item" prop='name' ref="name">
            <m-input :label="$t('trans0108')" type="text" :placeholder="$t('trans0321')" v-model="form.name" />
          </m-form-item>
          <m-form-item class="item" prop='remoteIp' ref="remoteIp">
            <m-input :label="`${$t('trans0425')}${$t('trans0411')}`" type="text" :placeholder="$t('trans0321')" v-model="form.remoteIp" />
          </m-form-item>
          <div class="item">
            <label for="">{{$t('trans0426')}}</label>
            <div class="port-wrap">
              <m-form-item class="ext-item" prop='remotePortFrom' ref="remotePortFrom">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.remotePortFrom" />
              </m-form-item>
              <i></i>
              <m-form-item class="ext-item" prop='remotePortTo' ref="remotePortTo">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.remotePortTo" />
              </m-form-item>
            </div>
          </div>
          <m-form-item class="item" prop='localIp' ref="localIp">
            <m-input :label="$t('trans0427')" type="text" :placeholder="$t('trans0321')" v-model="form.localIp" />
          </m-form-item>
          <div class="item">
            <label for="">{{$t('trans0428')}}</label>
            <div class="port-wrap">
              <m-form-item class="ext-item" prop='localPortFrom' ref="localPortFrom">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.localPortFrom" :onBlur="localFormChange" />
              </m-form-item>
              <i></i>
              <m-form-item class="ext-item" prop='localPortTo' ref="localPortTo">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.localPortTo" :onBlur="localToChange" />
              </m-form-item>
            </div>
          </div>
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
      protocolOptions: [
        {
          value: 'TCPUDP',
          text: 'TCP&UDP'
        },
        {
          value: 'TCP',
          text: 'TCP'
        },
        {
          value: 'UDP',
          text: 'UDP'
        }
      ],
      form: {
        id: '',
        name: '',
        enabled: false,
        localIp: '',
        localPortFrom: '',
        localPortTo: '',
        remoteIp: '',
        remotePortFrom: '',
        remotePortTo: '',
        protocol: 'TCPUDP' // TCPUDP, TCP, UDP
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
          // {
          //   rule: value => {
          //     if (this.form.remotePortTo && value) {
          //       return Number(this.form.remotePortTo) > Number(value);
          //     }
          //     return true;
          //   },
          //   message: this.$t('trans0471')
          // }
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
          // {
          //   rule: value => {
          //     if (this.form.remotePortFrom && value) {
          //       return Number(this.form.remotePortFrom) < Number(value);
          //     }
          //     return true;
          //   },
          //   message: this.$t('trans0471')
          // }
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
          // {
          //   rule: value => {
          //     if (this.form.localPortTo && value) {
          //       return Number(this.form.localPortTo) < Number(value);
          //     }
          //     return true;
          //   },
          //   message: this.$t('trans0471')
          // }
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
          // {
          //   rule: () => this.portRangeReg(),
          //   message: this.$t('trans0429')
          // },
          // {
          //   rule: value => {
          //     if (this.form.localPortFrom && value) {
          //       return Number(this.form.localPortFrom) > Number(value);
          //     }
          //     return true;
          //   },
          //   message: this.$t('trans0471')
          // }
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
    portRangeReg() {
      const hasValues = [
        'localPortFrom',
        'localPortTo',
        'remotePortFrom',
        'remotePortTo'
      ]
        .map(v => !!this.form[v])
        .some(n => !n);
      if (hasValues) {
        return true;
      }
      if (
        !hasValues &&
        Number(this.form.localPortTo) - Number(this.form.localPortFrom) ===
          Number(this.form.remotePortTo) - Number(this.form.remotePortFrom)
      ) {
        return true;
      }
      return false;
    },
    localFormChange() {
      const rule = () => () => {
        if (this.form.localPortTo) {
          console.log(this.form.localPortTo > Number(this.form.localPortFrom));
          return (
            Number(this.form.localPortTo) > Number(this.form.localPortFrom)
          );
        }
        return true;
      };
      this.$refs.localPortFrom.extraValidate(rule(), this.$t('trans0471'));
      this.$refs.localPortTo.extraValidate(rule(), this.$t('trans0471'));
    },
    localToChange() {
      const rule = () => () => {
        if (this.form.localPortFrom) {
          console.log(this.form.localPortTo > Number(this.form.localPortFrom));
          return (
            Number(this.form.localPortTo) > Number(this.form.localPortFrom)
          );
        }
        return true;
      };
      this.$refs.localPortFrom.extraValidate(rule(), this.$t('trans0471'));
      this.$refs.localPortTo.extraValidate(rule(), this.$t('trans0471'));
    },
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
.form {
  padding-bottom: 50px;
  .btn-info {
    margin-top: 30px;
  }
  width: 400px;
  margin: 0 auto;
  margin-top: 30px;
  .ext-item {
    margin-bottom: 0;
  }
  .item {
    width: 350px;
    margin-top: 30px;
    .port-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .ext-input {
        width: 140px;
      }
      i {
        width: 30px;
        height: 1px;
        background: #999999;
      }
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
@media screen and (max-width: 768px) {
  .form {
    padding-bottom: 50px;
    .btn-info {
      margin-top: 30px;
    }
    width: 100%;
    margin: 0 auto;
    .ext-item {
      margin-bottom: 0;
    }
    .item {
      width: 100%;
      margin-top: 30px;
      .port-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ext-input {
          width: auto;
        }
        i {
          width: 30px;
          height: 1px;
          background: #999999;
          margin: 0 10px;
        }
      }
    }
    .radio-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      span {
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
</style>

