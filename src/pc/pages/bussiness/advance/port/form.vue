<template>
  <div class="advance-port-form-container">
    <div class="content">
      <div class='w-header'>
        {{$t('trans0035')}}{{$t('trans0422')}}
      </div>
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
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.localPortFrom" />
              </m-form-item>
              <i></i>
              <m-form-item class="ext-item" prop='localPortTo' ref="localPortTo">
                <m-input class="ext-input" type="text" :placeholder="$t('trans0321')" v-model="form.localPortTo" />
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
    console.log(this.$route.params.id);
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$loading.open();
        this.$http
          .meshPortfwAdd(this.formParams)
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
.advance-port-form-container {
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
    .empty {
      padding-top: 30px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 0;
        margin-bottom: 60px;
      }
      img {
        width: 200px;
      }
    }
    .form {
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
  }
}
@media screen and (max-width: 768px) {
  .advance-port-form-container {
    padding: 20px 16px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .handle {
        display: flex;
        align-items: center;
        margin-top: 20px;
        label {
          padding: 0 30px 0 0px;
        }
      }
    }
  }
}
</style>

