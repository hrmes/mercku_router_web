<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0779')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form-item class="last">
              <m-switch :label="$t('trans0779')"
                        class="smart-connect__switch"
                        v-model="enabled"
                        @change="updateLEDStatus" />
              <div class="des-tips">{{$t('trans0777')}}</div>
            </m-form-item>
          </div>
        </div>
      </div>
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
