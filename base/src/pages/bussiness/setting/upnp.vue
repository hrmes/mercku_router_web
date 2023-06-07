<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0644')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-switch class="form__switch"
                  v-model="form.enabled"
                  :label="$t('trans0644')"
                  @change="onEnabledChange" />
        <p class="form__tips">{{$t('trans0643')}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        enabled: true
      }
    };
  },
  methods: {
    onEnabledChange(newVal) {
      this.$loading.open();
      this.$http
        .setUPNPEnabled({
          enabled: newVal
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getUPNPEnabled() {
      this.$loading.open();
      this.$http
        .getUPNPEnabled()
        .then(res => {
          this.form.enabled = res.data.result.status;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  },
  mounted() {
    this.getUPNPEnabled();
  }
};
</script>

<style lang="scss" scoped>
</style>
