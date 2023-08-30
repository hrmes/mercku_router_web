<template>
  <div class="timelimit">
    <div class='table'
         :class="{'table--empty':!sortList.length}">
      <div class="tools">
        <button class="btn btn-small"
                @click.stop="modalOpen('add')">{{$t('trans0035')}}</button>
      </div>
      <div class="table-head">
        <div class="column-date-stop">{{$t('trans0084')}}</div>
        <div class="column-date-start">{{$t('trans0085')}}</div>
        <div class="column-repeat">{{$t('trans0082')}}</div>
        <div class="column-handle">{{$t('trans0370')}}</div>
      </div>
      <div class="table-body">
        <div class="table-row"
             v-for="(row,index) in sortList"
             :key='index'>
          <div class="column-date-stop">
            <span>{{row.time_begin}}</span>
            <span class="mobile-start">&nbsp;-&nbsp;</span>
            <span class="mobile-start">{{row.time_end}}</span>
          </div>
          <div class="column-date-start">{{row.time_end}}</div>
          <div class="column-repeat">{{formatSchedulText(row.schedule)}}</div>
          <div class="column-handle">
            <div class="check-wrap">
              <m-switch @change="(v)=>changehandle(v,row)"
                        v-model="row.enabled" />
            </div>
            <a class="btn-text"
               @click.stop="modalOpen('edit',row)">{{$t('trans0034')}}</a>
            <a class="btn-text text-primary"
               @click="delRow(row)">{{$t('trans0033')}}</a>
          </div>
        </div>
        <div class="empty"
             v-if="isEmpty">
          <img src="../../../../assets/images/img_default_empty.webp"
               alt="">
          <p class="empty-text">{{$t('trans0278')}}</p>
        </div>
      </div>
    </div>
    <m-modal class="modal"
             :visible.sync="modalShow">
      <div class="modal-content">
        <div class="modal-form">
          <div class="item">
            <label for="">{{$t('trans0075')}}</label>
            <m-switch v-model="form.enabled" />
          </div>
          <div class="item">
            <label for="">{{$t('trans0084')}}</label>
            <m-time-picker class="time-picker"
                           v-model="form.time_begin" />
          </div>
          <div class="item">
            <label for="">{{$t('trans0085')}}</label>
            <m-time-picker class="time-picker"
                           v-model="form.time_end" />
          </div>
          <div class="item">
            <label for="">{{$t('trans0082')}}</label>
            <div class="date-wrap">
              <div class='check-inner'
                   v-for="(item,i) in schedules"
                   :key='i'>
                <m-checkbox v-model='item.checked'
                            :text='item.label'></m-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="message"><span v-show='msgShow'>{{$t('trans0388')}}</span></div>
        <div class="btn-info">
          <button class="btn btn-default"
                  @click="closeModal">{{$t('trans0025')}}</button>
          <button v-if="modalStatus==='add'"
                  class="btn"
                  @click="submit">{{$t('trans0035')}}</button>
          <button v-if="modalStatus==='edit'"
                  class="btn"
                  @click="updateSubmit">{{$t('trans0081')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { Weeks } from 'base/util/constant';
import TimezoneOffset from 'base/mixins/timezone-offset';

const formatTime = t => {
  const s = new Date(`2018-01-01 ${t}:00`).getTime();
  return s;
};
export default {
  mixins: [TimezoneOffset],
  data() {
    return {
      modalStatus: 'add',
      isChoose: false,
      msgShow: false,
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
  mounted() {
    this.form.mac = this.$route.params.mac;
    const limit = this.$store.modules.limits[this.form.mac];
    if (limit && limit.time_limit) {
      this.timeLimitList = limit.time_limit;
    } else {
      this.getList();
    }
  },
  watch: {
    schedules: {
      handler: function temp() {
        this.isChoose = this.schedules.some(n => n.checked);
        if (this.isChoose) {
          this.msgShow = false;
        }
      },
      deep: true
    }
  },
  computed: {
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
    }
  },
  methods: {
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
        this.timeLimitList = res.data.result;
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
          this.$toast(this.$t('trans0040'), 2000, 'success');
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
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 2000, 'success');
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
            if (this.form.enabled) {
              this.isSameTimezoneOffset().then(result => {
                if (result.same || !result.redirect) {
                  this.$toast(this.$t('trans0040'), 2000, 'success');
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
            this.modalShow = false;
            if (this.form.enabled) {
              this.isSameTimezoneOffset().then(result => {
                if (result.same || !result.redirect) {
                  this.$toast(this.$t('trans0040'), 2000, 'success');
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
    }
  }
};
</script>
<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  .message {
    padding-left: 120px;
    font-size: 12px;
    color: #ff0001;
    display: inline-block;
    height: 14px;
  }
  .btn-info {
    display: flex;
    margin-top: 20px;
    justify-content: center;
    .btn {
      width: 120px;
      height: 42px;
      &:last-child {
        margin-left: 30px;
      }
    }
  }
  .modal-content {
    border-radius: 5px;
    background-color: #ffffff;
    .item {
      display: flex;
      align-items: center;
      margin-top: 30px;
      &:first-child {
        margin: 0;
      }
      &:last-child {
        align-items: flex-start;
      }
      label {
        width: 120px;
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        flex-shrink: 0;
      }
      .time-picker {
        width: 160px;
      }
      .date-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 320px;
        .check-inner {
          width: 160px;
          margin-bottom: 12px;
        }
      }
    }
  }
}
.timelimit {
  width: 100%;
  .table {
    width: 100%;
    .tools {
      margin-bottom: 20px;
    }
    .column-date-stop {
      width: 150px;
      .mobile-start {
        display: none;
      }
    }
    .column-date-start {
      width: 150px;
    }
    .column-repeat {
      min-width: 150px;
      flex: 1;
    }
    .column-handle {
      width: 250px;
    }
    .table-head {
      height: 50px;
      background-color: #f1f1f1;
      display: flex;
      padding: 0 30px;
      div {
        display: flex;
        height: 50px;
        align-items: center;
      }
    }
    .table-body {
      .table-row {
        display: flex;
        padding: 15px 30px;
        border-bottom: 1px solid #f1f1f1;
        &:nth-child(2n) {
          background: #f7f7f7;
          @media screen and(max-width:768px) {
            background: #fff;
          }
        }
        .column-handle {
          display: flex;
          align-items: center;
          a {
            margin-left: 50px;
            &:last-child {
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .timelimit {
    .content {
      .table {
        .column-date-stop,
        .column-date-start,
        .column-repeat,
        .column-handle {
          display: flex;
          align-items: center;
          .check-wrap {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .timelimit {
    .table {
      margin: 0;
      position: relative;
      &.table--empty {
        .tools {
          position: static;
          justify-content: center;
          border: 0;
          margin: 0;
          margin-top: 10px;
          .btn {
            min-width: 120px;
            height: 38px;
          }
        }
      }
      .tools {
        position: absolute;
        right: 0;
        top: 0;
        padding-bottom: 20px;
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        display: flex;
        justify-content: flex-end;
        .btn {
          margin: 0;
        }
      }
      .table-body {
        margin-top: 68px;
        .table-row {
          flex-direction: column;
          padding: 20px 0;
          position: relative;
          &:first-child {
            padding-top: 0;
          }
        }
      }
      .column-date-stop {
        display: flex;
        width: 100%;
        .mobile-start {
          display: block;
        }
      }
      .column-date-start {
        width: auto;
        display: none;
      }
      .column-repeat {
        width: 100%;
        margin-top: 5px;
        padding-right: 50px;
      }
      .column-handle {
        width: 100%;
        justify-content: flex-end;
        margin-top: 20px;
        a {
          margin-left: 30px !important;
        }
        .check-wrap {
          position: absolute;
          right: 0;
          top: 20px;
        }
      }
      .table-head {
        display: none;
      }
    }
  }
  .modal {
    .modal-content {
      border-radius: 5px;
      background-color: #ffffff;
      .btn-info {
        margin-top: 10px;
      }
      .item {
        display: flex;
        align-items: center;

        margin-top: 20px;
        &:first-child {
          margin: 0;
        }
        &:last-child {
          align-items: flex-start;
        }
        label {
          width: 110px;
          flex-shrink: 0;
          @media screen and (max-width: 320px) {
            flex-shrink: 0;
            width: 60px;
            margin-right: 5px;
          }
          font-size: 14px;
          color: #333333;
          overflow: hidden;
          margin-right: 12px;
        }
        .time-picker {
          width: 140px;
        }
        .date-wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 180px;
          .check-inner {
            width: 160px;
            margin-bottom: 12px;
          }
        }
      }
    }
  }
}
</style>
