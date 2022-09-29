<template>
  <div class="page led">
    <div class="page-header">
      {{$t('trans0779')}}
    </div>
    <div class="page-content">
      <m-form class="form">
        <m-form-item class="form__item">
          <m-switch :label="$t('trans0779')"
                    v-model="enabled"
                    @click="enabled=!enabled"
                    @change="updateLEDStatus" />
        </m-form-item>
      </m-form>
    </div>
  </div>
</template>
<script>
import { throttle } from '../../../util/util';


export default {
  data() {
    return {
      enabled: true
    };
  },
  mounted() {
    this.getLEDStatus();
  },
  methods: {
    getLEDStatus() {
      this.$loading.open();
      this.$http
        .getMeshLEDStatus()
        .then(res => {
          this.enabled = res.data.result.enabled;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    // eslint-disable-next-line func-names
    updateLEDStatus: throttle(function () {
      this.$loading.open();
      this.$http
        .updateMeshLEDStatus({ enabled: this.enabled })
        .then(() => {
          this.$loading.close();
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
