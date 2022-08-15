<template>
  <div class="page led">
    <div class="page-header">
      {{$t('trans0962')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item">
          <m-switch label="WI-FI Switch"
                    v-model="enabled"
                    @click="enabled=!enabled"
                    @change="updateWifiStatus" />
        </m-form-item>
      </m-form>
    </div>
  </div>
</template>
<script>
import { throttle } from '../../../../../base/src/util/util';


export default {
  data() {
    return {
      enabled: true
    };
  },
  mounted() {
    this.getWifiStatus();
  },
  methods: {
    getWifiStatus() {
      this.$loading.open();
      this.$http
        .getMeshWifiStatus()
        .then(res => {
          this.wifiStatus = res.data.result.enabled;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    // eslint-disable-next-line func-names
    updateWifiStatus: throttle(function () {
      this.$loading.open();
      this.$http.updateMeshWifiStatus({ enabled: this.enabled })
        .then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    }, 1000)
  },

};
</script>

<style lang="scss" scoped>
.page.led {
  .page-content {
    .form {
      width: 340px;
    }
  }
}
</style>
