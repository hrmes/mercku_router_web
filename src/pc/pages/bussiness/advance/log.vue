<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-switch :label="$t('trans0462')" v-model="log.enabled" :onChange="updateEnabled"></m-switch>
        </div>
        <pre class="log-container">
          {{log.output}}
        </pre>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      log: {
        enabled: false,
        output: ''
      }
    };
  },
  mounted() {
    this.getSyslog();
  },
  methods: {
    updateEnabled() {
      this.$loading.open();
      this.$http
        .updateSyslogEnabled({
          enabled: this.log.enabled
        })
        .then(() => {
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getSyslog() {
      this.$loading.open();
      this.$http
        .getSyslog()
        .then(res => {
          this.$loading.close();
          this.log = res.data.result;
        })
        .catch(() => {
          this.$loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
}
.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .log-container {
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
    overflow: auto;
    padding: 10px;
    font-family: inherit;
  }
}
</style>
