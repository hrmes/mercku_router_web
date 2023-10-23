<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      STUN
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="stun"
              :model="form"
              :rules="rules">
        <div class="section-title">STUN Server Settings</div>
        <m-form-item prop="stun.server_address">
          <m-input label="STUN Server Address"
                   v-model="form.stun.server_address"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.server_port">
          <m-input label="STUN Server Port (optional)"
                   v-model="form.stun.server_port"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.username">
          <m-input label="STUN Server Username"
                   v-model="form.stun.username"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.password">
          <m-input label="STUN Server Password"
                   type="password"
                   v-model="form.stun.password"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.min_keepalive">
          <m-input label="Min Keepalive Interval (s)"
                   v-model="form.stun.min_keepalive"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="stun.max_keepalive">
          <m-input label="Max Keepalive Interval (s)"
                   v-model="form.stun.max_keepalive"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <div class="form-item">
          <m-checkbox :text="$t('trans0462')"
                      :rect="false"
                      :bold="true"
                      v-model="form.enabled"></m-checkbox>
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
import { getStringByte, isValidPassword, isFieldHasSpaces } from 'base/util/util';

export default {
  data() {
    return {
      form: {
        enabled: false,
        stun: {
          server_address: '',
          server_port: '',
          username: '',
          password: '',
          max_keepalive: null,
          min_keepalive: null
        }
      },
      rules: {
        'stun.server_address': [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
        ],
        'stun.server_port': [
          {
            rule: value => (value ? /^[0-9]+$/.test(value) : true),
            message: this.$t('trans0031')
          },
          {
            rule: value => (value ? value >= 1 && value <= 65535 : true),
            message: this.$t('trans0478')
          }
        ],
        'stun.username': [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans1174')
          }
        ],
        'stun.password': [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => {
              if (!value) {
                return true;
              }
              return isValidPassword(value, 1, 64);
            },
            message: this.$t('trans0169').format(1, 64)
          }
        ],
        'stun.max_keepalive': [
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
        'stun.min_keepalive': [
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
  methods: {
    getRouterStunConfig() {
      this.$loading.open();
      this.$http.getStunConfig()
        .then(res => {
          this.form.enabled = res.data.result.enabled;
          this.form.stun = res.data.result.stun;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    updateRouterStunConfig() {
      if (this.$refs.stun.validate()) {
        this.$loading.open();
        this.$http.updateStunConfig(this.form)
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
