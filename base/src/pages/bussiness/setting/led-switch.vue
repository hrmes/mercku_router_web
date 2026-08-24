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
    updateLEDStatus() {
      this.$loading.open();
      this.$http
        .updateMeshLEDStatus({ enabled: this.enabled })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 2000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
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
