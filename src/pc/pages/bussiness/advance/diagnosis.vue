<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0419')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-select v-model="job_type" :label="$t('trans0068')" :options="jobs"></m-select>
        </div>
        <div class="form-item">
          <m-input v-model="host" :label="$t('trans0463')" :placeholder="$t('trans0321')"></m-input>
        </div>
        <div class="form-item">
          <button class="btn btn-primary" @click="start">{{$t('trans0467')}}</button>
        </div>
      </div>
      <pre class="log-container">{{output}}</pre>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      jobs: [
        {
          value: 'ping',
          text: 'ping'
        },
        {
          value: 'traceroute',
          text: 'traceroute'
        },
        {
          value: 'nslookup',
          text: 'nslookup'
        }
      ],
      job_type: 'ping',
      host: '',
      output: ''
    };
  },
  watch: {
    job_type() {
      this.host = '';
    }
  },
  methods: {
    start() {
      this.$loading.open();
      this.$http
        .diagnosis({
          job_type: this.job_type,
          job_params: {
            host: this.host
          }
        })
        .then(res => {
          this.$loading.close();
          this.output = res.data.result.output;
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
  align-items: center;
  justify-content: flex-start;
  .log-container {
    margin-top: 30px;
    width: 100%;
    flex: 1;
    border: solid 1px #bdbdbd;
    border-radius: 4px;
    overflow: auto;
    padding: 10px;
  }
}
</style>
