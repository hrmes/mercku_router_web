<template>
  <div>
    <div class="page">
      <div class="page-header">
        {{$t('trans0499')}}
      </div>
      <div class="page-content">
        <m-form ref="remote" class="form" :model="remote" :rules="remoateRules">
          <div class="title">{{$t('trans0491')}}</div>
          <m-form-item>
            <m-input :label="`${$t('trans0498')}`" v-model="remote.url"></m-input>
          </m-form-item>
          <m-form-item prop="username">
            <m-input :label="$t('trans0410')" v-model="remote.username"></m-input>
          </m-form-item>
          <m-form-item prop="password">
            <m-input :label="$t('trans0003')" v-model="remote.password"></m-input>
          </m-form-item>
          <m-form-item prop="interval">
            <m-input :label="$t('trans0490')" v-model="remote.interval"></m-input>
          </m-form-item>

        </m-form>
        <m-form ref="local" class="form" :model="local" :rules="localRules">
          <div class="title">{{$t('trans0493')}}</div>
          <m-form-item prop="port">
            <m-input :label="$t('trans0494')" v-model="local.path"></m-input>
          </m-form-item>
          <m-form-item prop="path">
            <m-input :label="$t('trans0495')" v-model="local.port"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0410')}${$t('trans0411')}`" v-model="local.username"></m-input>
          </m-form-item>
          <m-form-item>
            <m-input :label="`${$t('trans0003')}${$t('trans0411')}`" v-model="local.password"></m-input>
          </m-form-item>
          <div class="form-item">
            <m-checkbox :text="$t('trans0492')" v-model="enabled"></m-checkbox>
          </div>
          <div class="form-button">
            <button class="btn btn-primary" @click="updateTr069">{{$t('trans0081')}}</button>
          </div>
        </m-form>
      </div>
    </div>
    <div class="page">
      <div class="page-header">
        {{$t('trans0497')}}
      </div>
      <div class="page-content">
        <m-switch :label="$t('trans0496')" v-model="telnet" :onChange="updateTelnet"></m-switch>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
        username: [
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
        ],
        interval: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
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
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          }
        ],
        path: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
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
  },
  methods: {
    updateTr069() {
      if (this.$refs.remote.validate() && this.$refs.local.validate()) {
        this.$http
          .updateTr069({
            remote: {
              ...this.remote,
              interval: Number(this.port.interval)
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
