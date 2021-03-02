<template>
  <div class="page">
    <div class="page-header">
      {{ $t('trans0419') }}
    </div>
    <div class="page-content">
      <m-form class="form"
              :model="form"
              ref="form"
              :rules="rules">
        <m-form-item>
          <m-select v-model="job_type"
                    :label="$t('trans0070')"
                    :options="jobs"></m-select>
        </m-form-item>
        <m-form-item prop="host">
          <m-input v-model="form.host"
                   :label="label"
                   :placeholder="$t('trans0321')"></m-input>
        </m-form-item>
      </m-form>
      <div class="form-button">
        <button class="btn btn-primary"
                v-defaultbutton
                @click="start">
          {{ $t('trans0467') }}
        </button>
      </div>
      <div class="log-container"
           v-show="output">
        <pre>{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import { isValidFieldLength } from 'base/util/util';

const TaskStatus = {
  done: 'done'
};
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
      rules: {
        host: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => isValidFieldLength(value),
            message: this.$t('trans0712')
          }
        ]
      },
      job_type: 'ping',
      form: {
        host: ''
      },
      output: '',
      label: this.$t('trans0463')
    };
  },
  watch: {
    job_type(v) {
      if (v === this.jobs[0].value || v === this.jobs[1].value) {
        this.label = this.$t('trans0463');
      } else {
        this.label = this.$t('trans0436');
      }
    }
  },
  methods: {
    diagnosis() {
      this.$loading.open();
      this.$http
        .diagnosis({
          job_type: this.job_type,
          job_params: {
            host: this.form.host
          }
        })
        .then(res => {
          if (res.data.result.status === TaskStatus.done) {
            this.$loading.close();
            this.output = res.data.result.output;
          } else {
            setTimeout(this.diagnosis, 3000);
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    start() {
      if (this.$refs.form.validate()) {
        this.diagnosis();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start !important;
  flex: 1;
  .log-container {
    margin-top: 30px;
    width: 100%;
    flex: 1;
    border: solid 1px #bdbdbd;
    border-radius: 4px;
    overflow: auto;
    position: relative;
    padding: 10px;
    pre {
      margin: 0;
      max-height: 600px;
      font-family: 'Courier New', Courier, monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
@media screen and(max-width:768px) {
  .page-content {
    .log-container {
      min-height: 300px;
      pre {
        position: relative;
      }
    }
  }
}
</style>
