<template>
  <transition name="fade">
    <div class="time-limit__modal"
         v-if="visiable">
      <div class="main"
           key="main"
           v-if="visiable">
        <div class="main__title">
          <span>{{$t('trans0075')}}</span>
          <span class="close btn-icon"
                @click="()=>modalClose()">
            <i class="iconfont icon-ic_close"></i>
          </span>
        </div>
        <div class="main__content">
          <div class="table-head">
            <ul>
              <li class="status">Status</li>
              <li class="date-stop">{{$t('trans0084')}}</li>
              <li class="date-start">{{$t('trans0085')}}</li>
              <li class="repeat">{{$t('trans0082')}}</li>
              <li class="handler">
                <button class="btn btn-small">{{$t('trans0035')}}</button>
              </li>
            </ul>
          </div>
          <div class="table-body">
            <ul v-for="(row,index) in sortList"
                :key='index'
                class="table-row">
              <li class="status">
                <m-switch @change="(v)=>changehandle(v,row)"
                          v-model="row.enabled" />
              </li>
              <li class="date-stop">
                <span>{{row.time_begin}}</span>
                <span class="mobile-start">&nbsp;-&nbsp;</span>
                <span class="mobile-start">{{row.time_end}}</span>
              </li>
              <li class="date-start">{{row.time_end}}</li>
              <li class="repeat">{{formatSchedulText(row.schedule)}}</li>
              <li class="handler">
                <button class="btn btn-small">{{$t('trans0035')}}</button>
              </li>
            </ul>
            <ul>
              <li class="status">Status</li>
              <li class="date-stop">{{$t('trans0084')}}</li>
              <li class="date-start">{{$t('trans0085')}}</li>
              <li class="repeat">{{$t('trans0082')}}</li>
              <li class="handler">
                <button class="btn btn-small">{{$t('trans0035')}}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Weeks } from 'base/util/constant';
import TimezoneOffset from 'base/mixins/timezone-offset';

const formatTime = t => {
  const s = new Date(`2018-01-01 ${t}:00`).getTime();
  return s;
};


export default {
  props: {
    visiable: { type: Boolean, default: false }
  },
  mixins: [TimezoneOffset],
  data() {
    return {
      modalStatus: 'add',
      isChoose: false,
      msgShow: false,
      open: false,
      selectedRow: {},
      disabled: true,
      modalShow: false,
      timeLimitList: [],
      mac: '',
      form: {
        enabled: true,
        mac: '',
        time_begin: '00:00',
        time_end: '23:59',
        schedule: []
      },
      schedules: [
        {
          label: this.$t('trans0086'),
          checked: false,
          value: Weeks.mon
        },
        {
          label: this.$t('trans0087'),
          checked: false,
          value: Weeks.tue
        },
        {
          label: this.$t('trans0088'),
          checked: false,
          value: Weeks.wed
        },
        {
          label: this.$t('trans0089'),
          checked: false,
          value: Weeks.thu
        },
        {
          label: this.$t('trans0090'),
          checked: false,
          value: Weeks.fri
        },
        {
          label: this.$t('trans0091'),
          checked: false,
          value: Weeks.sat
        },
        {
          label: this.$t('trans0092'),
          checked: false,
          value: Weeks.sun
        }
      ]
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    isEmpty() {
      return !this.sortList.length;
    },
    sortList() {
      return this.timeLimitList.sort((a, b) => {
        if (a.time_begin || b.time_begin) {
          if (a.time_begin === b.time_begin) {
            if (b.time_end || a.time_end) {
              return formatTime(a.time_end) - formatTime(b.time_end);
            }
          }
          return formatTime(a.time_begin) - formatTime(b.time_begin);
        }
        return 0;
      });
    },
    limit() {
      return this.$store.state.modules.limits[this.form.mac];
    }
  },
  mounted() {
    this.form.mac = this.$route.params.mac;
    if (this.limit && this.limit.time_limit) {
      this.timeLimitList = this.limit.time_limit;
    } else {
      this.getList();
    }
  },
  methods: {
    modalClose() {
      this.$emit('timeLimitClose');
    },
    closeModal() {
      this.modalShow = false;
      this.msgShow = false;
    },
    formatSchedulText(arr) {
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const everyDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      if (arr.join('') === weekdays.join('')) {
        return this.$t('trans0080');
      }
      if (arr.join('') === everyDay.join('')) {
        return this.$t('trans0079');
      }
      const newArr = [];
      arr.forEach(s => {
        this.schedules.forEach(v => {
          if (s === v.value) {
            newArr.push(v.label);
          }
        });
      });
      return newArr.join(' / ');
    },
    clearForm() {
      this.schedules.forEach(v => {
        v.checked = false;
      });
      this.form = {
        ...this.form,
        enabled: true,
        time_begin: '00:00',
        time_end: '23:59',
        schedule: []
      };
    },
    modalOpen(type, row) {
      if (type === 'add') {
        if (this.timeLimitList.length === 5) {
          this.$toast(this.$t('trans0060'));
          return;
        }
      }
      this.modalStatus = type;
      this.selectedRow = row;
      this.clearForm();
      if (type === 'edit') {
        this.formInitSchedules(row.schedule);
        this.form = {
          ...this.form,
          enabled: row.enabled,
          time_begin: row.time_begin,
          time_end: row.time_end,
          schedule: row.schedule
        };
      }
      this.modalShow = true;
    },
    formInitSchedules(arr) {
      arr.forEach(s => {
        this.schedules.forEach(v => {
          if (s === v.value) {
            v.checked = true;
          }
        });
      });
    },
    getList() {
      this.$http.getTimeLimit({ mac: this.form.mac }).then(res => {
        this.timeLimitList = res.data.result.map(v => ({ ...v, expand: false }));
        if (this.limit && this.limit.time_limit) {
          this.limit.time_limit = this.timeLimitList;
        }
      });
    },
    changehandle(v, row) {
      this.$loading.open();
      const params = {
        mac: this.form.mac,
        id: row.id,
        enabled: row.enabled
      };
      this.$http
        .timeLimitUpdate({ ...params })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
          this.timeLimitList = this.timeLimitList.map(item => ({
            ...item,
            enabled: !row.enabled
          }));
        });
    },
    delRow(row) {
      this.$loading.open();
      this.$http
        .timeLimitDel({
          mac: this.form.mac,
          ids: [row.id]
        })
        .then(() => {
          this.timeLimitList = this.timeLimitList.filter(v => v.id !== row.id);
          if (this.limit && this.limit.time_limit) {
            this.limit.time_limit = this.timeLimitList;
          }
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    submit() {
      if (this.isChoose) {
        this.$loading.open();
        const arr = [];
        this.schedules.forEach(item => {
          if (item.checked) {
            arr.push(item.value);
          }
        });
        this.form.schedule = arr;
        this.$http
          .addTimeLimit({ ...this.form })
          .then(() => {
            this.$loading.close();
            this.getList();
            this.modalShow = false;
            this.isSameTimezoneOffset().then(result => {
              if (result.same || !result.redirect) {
                this.$toast(this.$t('trans0040'), 3000, 'success');
              }
            });
          })
          .catch(() => {
            this.$loading.close();
          });
      } else {
        this.msgShow = true;
      }
    },
    updateSubmit() {
      if (this.isChoose) {
        this.$loading.open();
        const arr = [];
        this.schedules.forEach(item => {
          if (item.checked) {
            arr.push(item.value);
          }
        });
        this.form.schedule = arr;
        this.$http
          .timeLimitUpdate({
            ...this.form,
            id: this.selectedRow.id
          })
          .then(() => {
            this.$loading.close();
            // this.getList();
            this.timeLimitList = this.timeLimitList.map(v => {
              if (v.id === this.selectedRow.id) {
                return { ...v, ...this.form };
              }
              return v;
            });
            if (this.limit && this.limit.time_limit) {
              this.limit.time_limit = this.timeLimitList;
            }

            this.modalShow = false;
            if (this.form.enabled) {
              this.isSameTimezoneOffset().then(result => {
                if (result.same || !result.redirect) {
                  this.$toast(this.$t('trans0040'), 3000, 'success');
                }
              });
            }
          })
          .catch(() => {
            this.$loading.close();
          });
      } else {
        this.msgShow = true;
      }
    },
    openCollapse(row) {
      console.log(row.expand);
      if (this.isMobile) {
        this.timeLimitList.forEach(v => {
          if (v.id === row.id) {
            v.expand = !v.expand;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.time-limit__modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.8);
  z-index: 6;
}
.main {
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 80vh;
  max-width: 800px;
  max-height: 815px;
  min-width: 600px;
  min-height: 500px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 50px 40px -20px rgba(0, 0, 0, 0.1);
  background-color: var(--modal-content-background);
  z-index: 7;
}
.main__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  .close {
    color: var(--text-default-color);
    background-color: var(--button-close-bgc);
    .iconfont {
      font-size: 12px;
      font-weight: 700;
    }
    &:hover {
      .iconfont {
        color: inherit;
      }
      opacity: 0.8;
    }
  }
}
.main__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: lightcoral;
}
.table-head {
  margin-bottom: 5px;
  padding: 5px 10px 5px 15px;
  border-radius: 10px;
  background-color: var(--common-sub_card-bgc);
  > ul {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 70px 120px 120px 1fr 100px;
    li {
      display: flex;
      align-items: center;
      &.handler {
        justify-content: flex-end;
      }
    }
  }
}
.table-body {
  flex: 1;
  > ul {
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 70px 120px 120px 1fr 100px;
    height: 60px;
    border-radius: 10px;
    background-color: var(--common-sub_card-bgc);
    padding: 10px 10px 10px 15px;
    margin-bottom: 5px;
    li {
      display: flex;
      align-items: center;
      &.handler {
        justify-content: flex-end;
      }
    }
  }
}
</style>
