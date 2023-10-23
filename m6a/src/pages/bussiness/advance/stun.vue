<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      STUN
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="stun"
              :model="stun"
              :rules="rules">
        <div class="section-title">{{$t('trans1204')}}</div>
        <m-form-item prop="server_address">
          <m-input :label="$t('trans1205')"
                   v-model="stun.server_address"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="server_port">
          <m-input :label="$t('trans1206')"
                   v-model="stun.server_port"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.username">
          <m-input :label="$t('trans0155')"
                   v-model="stun.username"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.password">
          <m-input :label="$t('trans0156')"
                   type="password"
                   v-model="stun.password"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="min_keepalive">
          <m-input :label="$t('trans1207')"
                   v-model="stun.min_keepalive"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="max_keepalive">
          <m-input :label="$t('trans1208')"
                   v-model="stun.max_keepalive"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <div class="form-item">
          <m-checkbox :text="$t('trans0462')"
                      :rect="false"
                      :bold="true"
                      v-model="stunEnabled"></m-checkbox>
        </div>
      </m-form>
      <div class="form-button">
        <button class="btn btn-primary"
                @click="updateRouterStunConfig">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { isIP } from 'base/util/util';

const DomainRegex = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d{1,5})?(\/([\w-]+)?(\.\w+)?)*$/;
const NumberReg = /^((http|https)?:\/\/)?[0-9.]+$/;

export default {
  data() {
    return {
      stunEnabled: false,
      stun: {
        server_address: '',
        server_port: '',
        username: '',
        password: '',
        max_keepalive: null,
        min_keepalive: null
      },
      rules: {
        server_address: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => {
              if (value && !DomainRegex.test(value)) {
                return false;
              }
              if (NumberReg.test(value)) {
                if (value && !isIP(value)) {
                  return false;
                }
              }
              return true;
            },
            message: this.$t('trans0231')
          },
        ],
        server_port: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0478')
          },
          {
            rule: value => (value ? value >= 1 && value <= 65535 : true),
            message: this.$t('trans0478')
          }
        ],
        max_keepalive: [
          {
            rule: value => (/^[0-9]+$/.test(value)),
            message: this.$t('trans1158')
              .replace('%d', 1)
              .replace('%d', 999999999)
          },
          {
            rule: value => (value >= 1 && value <= 999999999),
            message: this.$t('trans1158')
              .replace('%d', 1)
              .replace('%d', 999999999)
          }
        ],
        min_keepalive: [
          {
            rule: value => (/^[0-9]+$/.test(value)),
            message: this.$t('trans1158')
              .replace('%d', 1)
              .replace('%d', 999999999)
          },
          {
            rule: value => (value >= 1 && value <= 999999999),
            message: this.$t('trans1158')
              .replace('%d', 1)
              .replace('%d', 999999999)
          }
        ]
      }
    };
  },
  computed: {
    paramsStun() {
      const { username, password } = this.stun;
      const result = {
        server_address: this.stun.server_address,
        server_port: this.stun.server_port,
        max_keepalive: this.stun.max_keepalive,
        min_keepalive: this.stun.min_keepalive
      };
      if (username) {
        result.username = username;
      }
      if (password) {
        result.password = password;
      }
      return result;
    }
  },
  mounted() {
    this.getRouterStunConfig();
  },
  methods: {
    getRouterStunConfig() {
      this.$loading.open();
      this.$http.getStunConfig()
        .then(res => {
          this.stunEnabled = res.data.result.enabled;
          this.stun = res.data.result.stun;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    updateRouterStunConfig() {
      if (this.$refs.stun.validate()) {
        this.$loading.open();
        this.$http.updateStunConfig({
          enabled: this.stunEnabled,
          stun: this.paramsStun
        })
          .then(() => {
            this.$toast(this.$t('trans0040'), 3000, 'success');
          })
          .finally(() => {
            this.$loading.close();
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  .page-content {
    @media screen and (min-width: 768px) {
      .form {
        width: 340px;
      }
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-bottom: 20px;
    }
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}
</style>
