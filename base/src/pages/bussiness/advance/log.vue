<template>
  <div class="page page__log">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="form">
          <div class="form-item">
            <m-switch :label="$t('trans0462')"
                      v-model="enabled"
                      @change="updateEnabled"></m-switch>
            <div class="btn-wrap"
                 v-if="enabled">
              <button class="btn btn-small"
                      @click="getSyslog">{{$t('trans0481')}}</button>
            </div>
          </div>
          <div class="log-container"
               v-show="enabled">
            <pre>{{previous}}</pre>
            <pre class="increase"
                 :class="{'not-empty':increase}">{{increase}}</pre>
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
    scrollTo(el, x = 0, y = 0) {
      if (el.scrollTo) {
        el.scrollTo(x, y);
      } else {
        el.scrollLeft = x;
        el.scrollTop = y;
      }
    },
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
        const el = this.$el.querySelector('.increase');
        const wrap = this.$el.querySelector('.log-container');
        const offset = el.offsetTop;
        this.scrollTo(wrap, 0, offset);
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
<style lang="scss">
.page__log {
  .form {
    .mk-switch__label {
      margin-right: 10px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  .page-content {
    .page-content__main {
      padding-bottom: 20px;
    }
  }
}

.form {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form-item {
    display: flex;
    justify-content: space-between;
    height: 30px;
  }
  .log-container {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    flex: 1;
    padding: 10px;
    position: relative;
    max-height: 80vh;
    overflow-x: hidden;
    pre {
      width: 75vw;
      margin: 0;
      font-family: 'Courier New', Courier, monospace;
      color: var(--text-defalut-color);
      white-space: pre-wrap;
      word-wrap: break-word;
      font-weight: 600;
      @media screen and(min-width:1441px) {
        width: 100%;
      }
      &:first-child {
        color: var(--text-gery-color);
      }
    }
  }
}
@media screen and(max-width:768px) {
  .page-content {
    .form {
      .log-container {
        max-height: 67vh;
      }
      pre {
        position: relative;
      }
    }
  }
}
</style>
