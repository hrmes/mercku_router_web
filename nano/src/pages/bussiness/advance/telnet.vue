<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0497')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-switch :label="$t('trans0462')"
                  v-model="telnet"
                  @change="updateTelnet"></m-switch>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      telnet: false
    };
  },
  mounted() {
    this.getTelnet();
  },
  methods: {
    getTelnet() {
      this.$http.getTelnetEnabled().then(res => {
        this.telnet = res.data.result.enabled;
      });
    },
    updateTelnet(v) {
      this.$loading.open();
      this.$http
        .setTelnetEnabled({
          enabled: v
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 2000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.telnet = !v;
        });
    }
  }
};
</script>
