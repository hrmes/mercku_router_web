<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="form">
        <div class="form-item">
          <m-switch :label="$t('trans0462')"
                    v-model="enabled"
                    :onChange="updateEnabled"></m-switch>
          <button v-if="enabled"
                  class="btn btn-small"
                  @click="getSyslog">{{$t('trans0481')}}</button>
        </div>
        <m-scrollbar class="log-container"
                     ref="scrollbar"
                     v-show="enabled"
                     :option="scrollbarOption">
          <pre>{{previous}}</pre>
          <pre class="increase"
               :class="{'not-empty':increase}">{{increase}}</pre>
        </m-scrollbar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      enabled: false,
      previousArray: [],
      increaseArray: [],
      scrollbarOption: {
        stopPropagation: true
      }
    };
  },
  computed: {
    previous() {
      return this.previousArray.join('\n');
    },
    increase() {
      return this.increaseArray.join('\n');
    }
  },
  mounted() {
    this.getSyslogEnabled();
  },
  methods: {
    updateEnabled() {
      this.$loading.open();
      this.$http
        .updateSyslogEnabled({ enabled: this.enabled })
        .then(() => {
          this.$loading.close();
          if (!this.enabled) {
            this.previousArray = [];
            this.increaseArray = [];
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
          const preArray = [...this.previousArray, ...this.increaseArray];
          const nowStr = res.data;
          this.getIncremental(preArray, nowStr);
        });
      });
    },
    getIncremental(preArray, nowStr) {
      const nowArray = nowStr.split('\n').filter(n => n !== '');
      if (!preArray.length) {
        this.previousArray = [];
        this.increaseArray = nowArray;
      } else {
        const preStart = preArray[0];
        const preEnd = preArray[preArray.length - 1];
        // 全包含
        if (nowArray.includes(preStart) && nowArray.includes(preEnd)) {
          this.previousArray = preArray;
          const index = nowArray.lastIndexOf(preEnd);
          this.increaseArray = nowArray.slice(index + 1);
        } else {
          // 部分包含,首先找到包含的起始位置
          const index = nowArray.lastIndexOf(preEnd);
          if (index === -1) {
            this.previousArray = preArray;
            this.increaseArray = nowArray;
          } else {
            this.previousArray = preArray;
            this.increaseArray = nowArray.slice(index + 1);
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.scrollbar.refresh();
        this.$refs.scrollbar.scrollToElement('.increase');
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
    margin-left: 30px;
  }
  .log-container {
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
    padding: 10px;
    position: relative;
    max-height: 600px;
    overflow-x: hidden;
    pre {
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
      &:first-child {
        color: #ccc;
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
