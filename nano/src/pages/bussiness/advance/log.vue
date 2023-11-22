<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0421')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <m-form class="form"
                ref="form"
                :model="logSetting"
                :rules="rules">
          <m-form-item>
            <p class="des">{{$t('trans1137')}}</p>
          </m-form-item>
          <div class="card">
            <m-form-item prop="level">
              <m-select :label="$t('trans1143')"
                        v-model="logSetting.level"
                        :options="logLevel"></m-select>
              <p class="des-tips">{{$t('trans1152')}}</p>
            </m-form-item>
            <m-form-item prop="capacity">
              <m-input :label="$t('trans1156')"
                       v-model="logSetting.capacity"
                       type="number"
                       :placeholder="`${$t('trans1154')}`"></m-input>
              <p class="des-tips">{{$t('trans1154')}}</p>
            </m-form-item>
            <m-form-item class="last">
              <button class="btn"
                      v-defaultbutton
                      @click="updateSetting()">
                {{ $t('trans0081') }}
              </button>
            </m-form-item>
          </div>
        </m-form>
        <transition name="fade">
          <div class="log__wrapper"
               v-if="showLogWrapper">
            <div class="log__wrapper-bar">
              <div class="left log__type">
                <div v-for="tab in tabs"
                     :key="tab.id"
                     @click="tabChange(tab.id)"
                     class="log__type-item"
                     :class="{'active':tabID===tab.id}">{{tab.text}}</div>
              </div>
              <div class="right tool">
                <button v-if="tabID === LogType.system"
                        class="btn btn-default btn-middle refresh"
                        @click="getlogs">{{$t('trans0481')}}</button>
                <button class="btn btn-default btn-middle"
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
                      class="btn btn-default btn-middle refresh"
                      @click="getlogs">{{$t('trans0481')}}</button>
              <button class="btn btn-default btn-middle">{{$t('trans1139')}}</button>
            </div>
          </div>
        </transition>

        <a href=""
           id="exportLog"></a>
      </div>
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
      LogType,
      DisableLogLevel,
      logLevel: [
        { value: 1, text: `1. ${this.$t('trans1144')}` },
        { value: 2, text: `2. ${this.$t('trans1145')}` },
        { value: 3, text: `3. ${this.$t('trans1146')}` },
        { value: 4, text: `4. ${this.$t('trans1147')}` },
        { value: 5, text: `5. ${this.$t('trans1148')}` },
        { value: 6, text: `6. ${this.$t('trans1149')}` },
        { value: 7, text: `7. ${this.$t('trans1150')}` },
        { value: 8, text: `8. ${this.$t('trans1151')}` }
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
          }
        ]
      },
      tabID: LogType.system,
      tabs: [
        { id: LogType.system, text: this.$t('trans1138') },
        { id: LogType.kernel, text: this.$t('trans1140') }
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
    }
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
          let { data } = res;
          if (res.data.startsWith('<!DOCTYPE html>')) {
            data = '';
          }
          if (target === Action.export) {
            this.downloadTxtFile(data, fileName);
          } else {
            const preArray = [...this.previousArray, ...this.increaseArray];
            const nowStr = data;
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
        if (el && wrap) {
          const offset = el.offsetTop;
          this.scrollTo(wrap, 0, offset);
        }
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
        this.logSetting.capacity = Number(this.logSetting.capacity);
        const params = this.logSetting;

        this.$loading.open();
        this.$http
          .updateMeshLogsSetting(params)
          .then(() => {
            if (params.level === DisableLogLevel) {
              this.showLogWrapper = false;
              this.previousArray = [];
              this.increaseArray = [];
            } else {
              this.getlogs();
            }
            this.$toast(this.$t('trans0040'), 2000, 'success');
            this.$loading.close();
          })
          .catch(() => {
            this.$loading.close();
          });
      }
    },
    tabChange(id) {
      this.previousArray = [];
      this.increaseArray = [];
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
<style lang="scss" scoped>
.page {
  .page-content {
    .page-content__main {
      padding: 20px;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
      .card {
        height: fit-content;
      }
    }
  }
}

.form {
  .des {
    font-size: 14px;
    color: var(--text_default-color);
    padding: 0;
    margin: 0;
  }
}
.log__wrapper {
  width: 100%;
  overflow: hidden;
}
.log__wrapper-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.log__type {
  display: flex;
  .log__type-item {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 500;
    color: var(--text_default-color);
    background: var(--logout_btn-bgc);
    cursor: pointer;
    &:first-child {
      margin-right: 10px;
    }
    &.active {
      background: var(--text_default-color);
      color: var(--primary-bgc);
    }
  }
}
.tool {
  display: flex;
  align-items: center;
  .btn-default {
    background-image: linear-gradient(
        to right,
        var(--common_card-bgc),
        var(--common_card-bgc)
      ),
      var(--common_btn_default-bgimg);
  }
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
  height: 75vh;
  overflow-y: auto;
  pre {
    width: 100%;
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    color: var(--text_default-color);
    white-space: pre-wrap;
    word-wrap: break-word;
    font-weight: 700;
    @media screen and(min-width:1441px) {
      width: 100%;
    }
    &:first-child {
      color: var(--text_gery-color);
      font-weight: 400;
    }
  }
}
#exportLog {
  display: none;
}
@media screen and(max-width:768px) {
  .page {
    width: 100%;
    .page-content {
      .page-content__main {
        grid-template-rows: repeat(auto-fill);
        grid-template-columns: 100%;
        gap: 0;
      }
    }
  }
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
    height: auto;
    min-height: 100px;
    max-height: 500px;
  }
}
</style>
