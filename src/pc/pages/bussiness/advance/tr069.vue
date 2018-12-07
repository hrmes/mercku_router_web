<template>
  <div>

    <div class="page">
      <div class="page-header">
        {{$t('trans0499')}}
      </div>
      <div class="page-content">
        <m-form ref="remote" class="form" :model="remote" :rules="remoateRules">
          <div class="title">{{$t('trans0491')}}</div>
          <m-form-item prop="url">
            <m-input :label="`${$t('trans0498')}`" v-model="remote.url" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="username">
            <m-input :label="$t('trans0410')" v-model="remote.username" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="password">
            <m-input :label="$t('trans0003')" v-model="remote.password" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="interval">
            <m-input :label="$t('trans0490')" v-model="remote.interval" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>

        </m-form>
        <m-form ref="local" class="form" :model="local" :rules="localRules">
          <div class="title">{{$t('trans0493')}}</div>
          <m-form-item prop="path">
            <m-input :label="$t('trans0494')" v-model="local.path" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="port">
            <m-input :label="$t('trans0495')" v-model="local.port" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0410')}${$t('trans0411')}`" v-model="local.username" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0003')}${$t('trans0411')}`" v-model="local.password" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')" v-model="enabled"></m-checkbox>
          </div>
          <div class="form-button">
            <button class="btn btn-primary" @click="updateTr069">{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
    </div>
    <div class="page">
      <div class="page-header">
        {{$t('trans0503')}}
      </div>
      <div class="page-content">
        <m-form class="form" :model="tftp" :rules="tftpRules" ref="tftp">
          <m-form-item prop="server">
            <m-input :label="$t('trans0409')" v-model="tftp.server" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <m-form-item prop="filename">
            <m-input :label="$t('trans0502')" v-model="tftp.filename" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary" @click="updateTFTP">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="page-header">
        {{$t('trans0497')}}
      </div>
      <div class="page-content">
        <div class="form">
          <m-switch :label="$t('trans0462')" v-model="telnet" :onChange="updateTelnet"></m-switch>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="page-header">
        {{$t('trans0511')}}
      </div>
      <div class="page-content">
        <m-form class="form" ref="wwa" :model="wwa" :rules="wwaRules">
          <m-form-item prop="port">
            <m-input :label="$t('trans0495')" v-model="wwa.port" :placeholder="$t('trans0321')"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0462')" v-model="wwa.enabled"></m-checkbox>
          </div>
        </m-form>
        <div class="form-button">
          <button class="btn btn-primary" @click="updateWWA">{{$t('trans0081')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg } from 'util/util';

export default {
  data() {
    return {
      tftp: {
        server: '',
        filename: ''
      },
      tftpRules: {
        server: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        filename: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ]
      },
      enabled: true,
      remote: {
        username: '',
        password: '',
        interval: '',
        url: ''
      },
      local: {
        port: '',
        path: '',
        username: '',
        password: ''
      },
      telnet: false,
      remoateRules: {
        url: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        username: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        password: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ],
        interval: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => /^\d*$/g.test(value),
            message: this.$t('trans0500')
          },
          {
            rule: value => {
              const v = parseInt(value, 10);
              if (isNaN(v)) {
                return false;
              }
              if (v <= 0 || v > 999999999) {
                return false;
              }
              return true;
            },
            message: this.$t('trans0500')
          }
        ]
      },
      localRules: {
        port: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ],
        path: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          }
        ]
      },
      wwa: {
        port: '',
        enabled: false
      },
      wwaRules: {
        port: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => portReg.test(value),
            message: this.$t('trans0478')
          }
        ]
      }
    };
  },
  mounted() {
    this.$http.getTelnetEnabled().then(res => {
      this.telnet = res.data.result.enabled;
    });
    this.$http.getTr069().then(res => {
      this.remote = res.data.result.remote;
      this.local = res.data.result.local;
      this.enabled = res.data.result.enabled;
    });
    this.$http.getTFTP().then(res => {
      this.tftp = res.data.result;
    });
    this.$http.getWWA().then(res => {
      this.wwa = res.data.result;
    });
  },
  methods: {
    updateTr069() {
      if (this.$refs.remote.validate() && this.$refs.local.validate()) {
        this.$http
          .updateTr069({
            remote: {
              ...this.remote,
              interval: Number(this.remote.interval)
            },
            local: {
              ...this.local,
              port: Number(this.local.port)
            },
            enabled: this.enabled
          })
          .then(() => {
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$toast(this.$t('trans0077'));
          });
      }
    },
    updateTelnet(v) {
      this.$http
        .setTelnetEnabled({
          enabled: v
        })
        .then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$toast(this.$t('trans0077'));
          this.telnet = !v;
        });
    },
    updateTFTP() {
      if (this.$refs.tftp.validate()) {
        this.$http
          .updateTFTP(this.tftp)
          .then(() => {
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$toast(this.$t('trans0077'));
          });
      }
    },
    updateWWA() {
      if (this.$refs.wwa.validate()) {
        this.$http
          .updateWWA({
            ...this.wwa,
            port: Number(this.wwa.port)
          })
          .then(() => {
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .catch(() => {
            this.$toast(this.$t('trans0077'));
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .form {
    .title {
      font-size: 14px;
      color: #333;
      margin-bottom: 30px;
      font-weight: bold;
    }
  }
}
@media screen and (max-width: 768px) {
  .page {
    &:last-child {
      margin-bottom: 30px;
    }
  }
}
</style>
