<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-switch :label="$t('trans0462')" v-model="enabled" :onChange="updateEnabled"></m-switch>

        </div>
        <div class="form-item" v-if="enabled">
          <button class="btn btn-primary" @click="getSyslog">{{'trans0481'}}</button>
        </div>
        <div class="log-container">
          <pre>{{output}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enabled: false,
      output: ''
    };
  },
  mounted() {
    this.getSyslogEnabled();
  },
  methods: {
    updateEnabled() {
      this.$loading.open();
      this.$http
        .updateSyslogEnabled({
          enabled: this.enabled
        })
        .then(() => {
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getSyslog() {
      this.$http.getSyslogEnabled().then(() => {
        this.$http.getSysLog().then(res => {
          this.output = res.data;
        });
      });
    },
    getSyslogEnabled() {
      this.$loading.open();
      this.$http
        .getSyslogEnabled()
        .then(res => {
          this.$loading.close();
          this.enabled = res.data.result.enabled;
          if (this.enabled) {
            this.getSyslog();
          }
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
  .btn {
    width: 100px;
    height: 27px;
    margin-left: 0;
  }
  .log-container {
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
    overflow: auto;
    padding: 10px;
    position: relative;
    pre {
      margin: 0;
      font-family: inherit;
      position: absolute;
    }
  }
}
</style>
