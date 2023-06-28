<template>
  <div class="page page__log">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <m-form class="form"
              ref="form"
              :model="logSetting"
              :rules="rules">
        <m-form-item>
          <p class="des">{{$t('trans1137')}}</p>
        </m-form-item>
        <m-form-item class="item"
                     prop="level">
          <m-select :label="$t('trans1143')"
                    v-model="logSetting.level"
                    :options="logLevel"></m-select>
          <span class="form__tips">{{$t('trans1152')}}</span>
        </m-form-item>
        <m-form-item class="item"
                     prop="capacity">
          <m-input :label="$t('trans1156')"
                   v-model="logSetting.capacity"
                   type="number"
                   :placeholder="`${$t('trans1154')}`"></m-input>
          <span class="form__tips">{{$t('trans1154')}}</span>
        </m-form-item>
        <m-form-item key="save"
                     class="item">
          <button class="btn"
                  v-defaultbutton
                  @click="updateSetting()">
            {{ $t('trans0081') }}
          </button>
        </m-form-item>
      </m-form>
      <div v-if="showLogWrapper"
           class="log__wrapper">
        <div class="log__wrapper-bar">
          <div class="left log__type">
            <div v-for="tab in tabs"
                 :key="tab.id"
                 @click="tabChange(tab.id)"
                 class="log__type-item"
                 :class="{'active':tabID===tab.id}">{{tab.text}}</div>
          </div>
          <div class="right tool">
            <button v-if="tabID === 'system'"
                    class="btn btn-middle refresh"
                    @click="getlogs">{{$t('trans0481')}}</button>
            <button class="btn btn-middle"
                    @click="exportLog">{{$t('trans1139')}}</button>
          </div>
        </div>
        <div class="log-container">
          <pre>{{previous}}</pre>
          <pre class="increase"
               :class="{'not-empty':increase}">{{increase}}</pre>
        </div>
        <div class="mobile tool">
          <button v-if="tabID === 'system'"
                  class="btn btn-middle refresh"
                  @click="getlogs">{{$t('trans0481')}}</button>
          <button class="btn btn-middle">{{$t('trans1139')}}</button>
        </div>
      </div>
      <a href=""
         id="exportLog"></a>
    </div>
  </div>
</template>
<script>
const LogType = {
  system: 'system',
  kernel: 'kernel'
};
const Action = {
  refresh: 'refresh',
  export: 'export'
};
const DisableLogLevel = 8;
export default {
  data() {
    return {
      DisableLogLevel,
      logLevel: [
        { value: 1, text: `1. ${this.$t('trans1144')}` },
        { value: 2, text: `2. ${this.$t('trans1145')}` },
        { value: 3, text: `3. ${this.$t('trans1146')}` },
        { value: 4, text: `4. ${this.$t('trans1147')}` },
        { value: 5, text: `5. ${this.$t('trans1148')}` },
        { value: 6, text: `6. ${this.$t('trans1149')}` },
        { value: 7, text: `7. ${this.$t('trans1150')}` },
        { value: 8, text: `8. ${this.$t('trans1151')}` },
      ],
      showLogWrapper: false,
      logSetting: {
        level: 8,
        capacity: 64
      },
      previousArray: [],
      increaseArray: [],
      scrollbarOption: {
        stopPropagation: true
      },
      rules: {
        capacity: [
          {
            rule: value => value,
            message: this.$t('trans0232')
          },
          {
            rule: value => value >= 16 && value <= 1024,
            message: this.$t('trans1158').replace('%d', 16).replace('%d', 1024)
          },
           {
            rule: value => (value ? /^[0-9]+$/.test(value) : true),
            message: this.$t('trans1158').replace('%d', 16).replace('%d', 1024)
          },
        ],
      },
      tabID: LogType.system,
      tabs: [
        { id: LogType.system,
          text: this.$t('trans1138') },
        { id: LogType.kernel,
          text: this.$t('trans1140') }
      ]
    };
  },
  computed: {
    previous() {
      return this.previousArray.join('\n');
    },
    increase() {
      return this.increaseArray.join('\n');
    },
    isCurrentTab(tab) {
      return tab.id === this.tabID;
    },
  },
  mounted() {
    this.getMeshLogsSetting();
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
    getlogs(target) {
        let method;
        let fileName;
        switch (this.tabID) {
          case LogType.system:
            method = this.$http.getSysLog;
            fileName = 'syslog.txt';
          break;
          case LogType.kernel:
            method = this.$http.getKernelLog;
            fileName = 'syslog_k.txt';
          break;
          default:
          break;
        }
        method()
        .then(res => {
          if (target === Action.export) {
            this.downloadTxtFile(res.data, fileName);
          } else {
            const preArray = [...this.previousArray, ...this.increaseArray];
            const nowStr = res.data;
            this.getIncremental(preArray, nowStr);
          }
        })
        .finally(() => {
          this.showLogWrapper = true;
          this.$loading.close();
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
    getMeshLogsSetting() {
      this.$loading.open();
      this.$http
        .getMeshLogsSetting()
        .then(res => {
          this.logSetting = res.data.result;
          if (this.logSetting.level === DisableLogLevel) {
            this.previousArray = [];
            this.increaseArray = [];
          } else {
            this.getlogs();
          }
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    updateSetting() {
      if (this.$refs.form.validate()) {
        const params = this.logSetting;

        this.$loading.open();
        this.$http.updateMeshLogsSetting(params)
        .then(() => {
          if (params.level === DisableLogLevel) {
            this.showLogWrapper = false;
            this.previousArray = [];
            this.increaseArray = [];
            this.$loading.close();
          } else {
            this.getlogs();
          }
        })
        .catch(() => {
          this.$loading.close();
        });
      }
    },
    tabChange(id) {
      this.tabID = id;
      this.getlogs();
    },
    downloadTxtFile(content, fileName) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.getElementById('exportLog');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    },
    exportLog() {
      this.$loading.open();
      this.getlogs(Action.export);
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
.page-content {
  flex-direction: column;
  flex: 1;
  justify-content: start;
}
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  .des {
    font-size: 14px;
    color: var(--text-defalut-color);
    padding: 0;
    margin: 0;
  }
  .item {
    position: relative;
    .form__tips {
      position: absolute;
      top: 50%;
      left: 350px;
      transform: translateY(-50%);
    }
  }
}
.log__wrapper {
  border-top: 1px solid var(--hr-color);
  padding-top: 20px;
}
.log__wrapper-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .log__type {
    display: flex;
    .log__type-item {
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: 500;
      color: var(--text-default-color);
      background: var(--logout-btn-bgc);
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
      }
      &.active {
        background: var(--text-default-color);
        color: var(--primaryBackgroundColor);
      }
    }
  }
}
.tool {
  display: flex;
  align-items: center;
  &.mobile {
    display: none;
  }
  > button {
    &.refresh {
      margin-right: 20px;
    }
  }
}
.log-container {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: solid 1px #bdbdbd;
  flex: 1;
  padding: 10px;
  position: relative;
  max-height: 500px;
  overflow-x: hidden;
  pre {
    width: 67vw;
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
#exportLog {
  display: none;
}
@media screen and(max-width:768px) {
  .page-content {
    .form {
      pre {
        position: relative;
      }
      .form__tips {
        position: static;
      }
    }
    .tool {
      &.right {
        display: none;
      }
      &.mobile {
        display: flex;
        margin-top: 20px;
      }
    }
    .log-container {
      max-height: 400px;
    }
  }
}
</style>
