<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{ pageTitle }}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <m-form class="form"
                    :model="form"
                    ref="form"
                    :rules="rules">
              <m-form-item v-if="showJobSelect">
                <m-select v-model="job_type"
                          :label="$t('trans0070')"
                          :options="jobs"></m-select>
              </m-form-item>
              <m-form-item class="last"
                           prop="host">
                <m-input v-model="form.host"
                         :label="label"
                         :placeholder="$t('trans0321')"></m-input>
              </m-form-item>
            </m-form>
          </div>
        </div>
        <div class="row-2"
             v-if="output">
          <div class="card">
            <div class="log-container">
              <pre>{{ output }}</pre>
            </div>
          </div>
        </div>
      </div>
      <div class="page-content__bottom">
        <div class="form-button__wrapper">
          <button class="btn btn-primary"
                  v-defaultbutton
                  @click="start">
            {{ $t('trans0467') }}
          </button>
        </div>
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
      label: this.$t('trans0463'),
      wanIfname: ''
    };
  },
  computed: {
    isWanPing() {
      return (
        this.$route &&
        this.$route.meta &&
        this.$route.meta.diagnosisMode === 'wanping'
      );
    },
    pageTitle() {
      return this.isWanPing ? this.$t('trans0434') : this.$t('trans0419');
    },
    showJobSelect() {
      return !this.isWanPing;
    }
  },
  watch: {
    job_type(v) {
      if (v === this.jobs[0].value || v === this.jobs[1].value) {
        this.label = this.$t('trans0463');
      } else {
        this.label = this.$t('trans0436');
      }
    },
    isWanPing: {
      handler(val) {
        if (val) {
          this.job_type = this.jobs[0].value;
          this.form.host = '';
          this.output = '';
        }
      },
      immediate: true
    }
  },
  methods: {
    getWanIfname() {
      return this.$http
        .getWanNetInfo()
        .then(res => {
          const ifname = res?.data?.result?.ifname || '';
          this.wanIfname = ifname;
          return ifname;
        })
        .catch(() => {
          this.wanIfname = '';
          return '';
        });
    },
    buildJobParams() {
      const params = {
        host: this.form.host
      };
      if (this.isWanPing && this.wanIfname) {
        params.wan_if = this.wanIfname;
      }
      return params;
    },
    diagnosis() {
      this.$loading.open();
      const init = this.isWanPing && !this.wanIfname
        ? this.getWanIfname()
        : Promise.resolve(this.wanIfname);
      init
        .then(() =>
          this.$http.diagnosis({
            job_type: this.job_type,
            job_params: this.buildJobParams()
          })
        )
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
.page {
  .page-content {
    .page-content__main {
      .row-2 {
        grid-template-columns: 100%;
      }
    }
  }
}
.log-container {
  width: 100%;
  max-height: 38vh;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  overflow: auto;
  position: relative;
  padding: 10px;
  pre {
    margin: 0;
    max-height: 600px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 700;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

@media screen and(max-width:768px) {
  .log-container {
    max-height: 50vh;
  }
}
</style>
