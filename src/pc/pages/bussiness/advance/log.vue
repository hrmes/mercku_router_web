<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-switch :label="$t('trans0462')" v-model="enabled" :onChange="updateEnabled"></m-switch>
          <button v-if="enabled" class="btn btn-primary" @click="getSyslog">{{$t('trans0481')}}</button>
        </div>
        <div class="log-container">
          <pre :class="{'not-empty':increase}">{{increase}}</pre>
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
      output: '',
      increase: ''
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
          if (!this.enabled) {
            this.output = '';
          } else {
            this.getSyslog();
          }
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getSyslog() {
      this.$http.getSyslogEnabled().then(() => {
        this.$http.getSysLog().then(res => {
          const pre = this.increase + this.output;
          const now = res.data;
          this.getIncremental(pre, now);
        });
      });
    },
    getIncremental(pre, now) {
      const preArray = pre.split('\n').filter(p => p !== '');
      const nowArray = now
        .split('\n')
        .reverse()
        .filter(n => n !== '');
      now = nowArray.join('\n');
      if (!pre) {
        this.output = '';
        this.increase = nowArray.join('\n');
        return;
      }
      // 全包含
      if (now.includes(pre)) {
        this.increase = now.replace(pre, '');
        this.output = pre;
      } else {
        // 部分包含,首先找到包含的起始位置
        const index = preArray.indexOf(nowArray[nowArray.length - 1]);
        if (index === -1) {
          this.output = pre;
          this.increase = now;
        } else {
          this.output = pre;
          nowArray.length -= index;
          this.increase = nowArray.join('\n');
        }
      }
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
  flex: 1;
}
.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form-item {
    display: flex;
    height: 30px;
  }
  .btn {
    width: auto;
    height: 27px;
    margin-left: 30px;
  }
  .log-container {
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
    overflow: auto;
    padding: 10px;
    position: relative;
    max-height: 600px;
    pre {
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
      color: #6e6e6e;
      &:first-child {
        color: #333;
        font-weight: bold;
        &.not-empty {
          // margin-bottom: 30px;
        }
      }
    }
  }
}
@media screen and(max-width:768px) {
  .page-content {
    .form {
      pre {
        position: relative;
      }
    }
  }
}
</style>
