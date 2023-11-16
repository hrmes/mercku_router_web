<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0511')}}
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="wwa"
              :model="wwa"
              :rules="wwaRules">
        <m-form-item prop="port">
          <m-input :label="$t('trans0495')"
                   v-model="wwa.port"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
        <m-form-item prop="allowed_ip">
          <m-input :label="`${$t('trans0575')} ${$t('trans0411')}`"
                   v-model="wwa.allowed_ip"
                   :placeholder="$t('trans0492')"></m-input>
        </m-form-item>
        <div class="form-item">
          <m-checkbox :text="$t('trans0462')"
                      :rect="false"
                      :bold="true"
                      v-model="wwa.enabled"></m-checkbox>
        </div>
      </m-form>
      <div class="form-button">
        <button class="btn btn-primary"
                @click="updateWWA">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { portReg, isIP } from 'base/util/util';

export default {
  data() {
    return {
      wwa: {
        port: '',
        enabled: false,
        allowed_ip: ''
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
        ],
        allowed_ip: [
          {
            rule: value => !value || (value && isIP(value)),
            message: this.$t('trans0238')
          }
        ]
      }
    };
  },
  mounted() {
    this.$http.getWWA().then(res => {
      const { result } = res.data;
      this.wwa = {
        enabled: result.enabled,
        port: result.port,
        allowed_ip: result.allowed_ip[0]
      };
    });
  },
  methods: {
    updateWWA() {
      if (this.$refs.wwa.validate()) {
        this.$loading.open();
        const data = {
          ...this.wwa,
          port: Number(this.wwa.port),
          allowed_ip: this.wwa.allowed_ip ? [this.wwa.allowed_ip] : []
        };
        this.$http
          .updateWWA(data)
          .then(() => {
            this.$loading.close();
            this.$toast(this.$t('trans0040'), 3000, 'success');
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
.page {
  .page-header {
    display: flex;
    justify-content: space-between;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    .form-button {
      margin-top: 0;
      padding-top: 25px;
      border-top: 1px solid var(--hr-color);
    }
  }
}
</style>
