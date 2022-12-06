<template>
  <div class="timelimit">
    <div class='table'
         :class="{'table--empty':!sortList.length}">
      <div class="table-head">
        <div class="column-date-stop">{{$t('trans0084')}}</div>
        <div class="column-date-start">{{$t('trans0085')}}</div>
        <div class="column-repeat">{{$t('trans0082')}}</div>
        <div class="column-switch"></div>
        <div class="column-handle">
          <button class="btn btn-small"
                  @click.stop="modalOpen('add')">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class="table-body">
        <div v-for="(row,index) in sortList"
             :key='index'
             class="table-row"
             :class="{'open':row.expand}"
             @click="openCollapse(row)">
          <div class="column-date-stop">
            <span>{{row.time_begin}}</span>
            <span class="mobile-start">&nbsp;-&nbsp;</span>
            <span class="mobile-start">{{row.time_end}}</span>
          </div>
          <div class="column-date-start">{{row.time_end}}</div>
          <div class="column-repeat">{{formatSchedulText(row.schedule)}}</div>
          <div class="column-switch check-wrap">
            <m-switch @change="(v)=>changehandle(v,row)"
                      v-model="row.enabled" />
          </div>
          <div class="column-handle">
            <span class="btn-icon"
                  @click.stop="modalOpen('edit',row)">
              <i class="add-to-block iconfont icon-ic_settings_normal"></i>
              <span class="icon-hover-popover"> {{$t('trans0034')}}</span>
            </span>
            <span v-if="isMobile"
                  class="label"
                  @click.stop="modalOpen('edit',row)">
              {{$t('trans0034')}}
            </span>
            <span class="btn-icon"
                  @click="delRow(row)">
              <i class="settings iconfont icon-ic_trash_normal"></i>
              <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
            </span>
            <span v-if="isMobile"
                  class="label"
                  @click="delRow(row)">
              {{$t('trans0033')}}
            </span>
          </div>
        </div>
        <div class="empty"
             v-if="isEmpty">
          <img src="../../../../assets/images/img_default_empty.png"
               alt="">
          <p class="empty-text">{{$t('trans0278')}}</p>
        </div>
        <div v-if="isMobile"
             @click.stop="modalOpen('add')"
             class="mobile-add-btn-wrap">
          <button class="btn">{{$t('trans0035')}}</button>
        </div>
      </div>
    </div>
    <m-modal class="modal"
             :visible.sync="modalShow">
      <div class="modal-content">
        <div class="modal-form">
          <div class="item left-right">
            <m-switch v-model="form.enabled"
                      class="switch" />
            <label for="">{{$t('trans0075')}}</label>
          </div>
          <div class="item top-bottom">
            <label for="">{{$t('trans0084')}}</label>
            <m-time-picker class="time-picker"
                           v-model="form.time_begin" />
          </div>
          <div class="item top-bottom">
            <label for="">{{$t('trans0085')}}</label>
            <m-time-picker class="time-picker"
                           v-model="form.time_end" />
          </div>
          <div class="item top-bottom">
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

const formatTime = t => {
  const s = new Date(`2018-01-01 ${t}:00`).getTime();
  return s;
};

export default {
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
  mounted() {
    this.form.mac = this.$route.params.mac;
    const limit = this.$store.modules.limits[this.form.mac];
    console.log(limit);
    if (limit && limit.time_limit) {
      this.timeLimitList = limit.time_limit;
    } else {
      this.getList();
    }
    console.log(this.timeLimitList);
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
    isMobile() {
      return this.$store.isMobile;
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
        this.timeLimitList = res.data.result.map(v => ({ ...v, expand: false }));
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
            this.$toast(this.$t('trans0040'), 3000, 'success');
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
            this.$toast(this.$t('trans0040'), 3000, 'success');
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
<style lang="scss" scoped>
.modal {
  .message {
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
    .item {
      display: flex;
      margin-top: 20px;
      &:first-child {
        margin: 0;
      }
      &:last-child {
        align-items: flex-start;
      }
      &.left-right {
        .switch {
          margin-right: 10px;
        }
        label {
          color: var(--text-default-color);
        }
      }
      &.top-bottom {
        flex-direction: column;
        label {
          margin-bottom: 10px;
        }
      }
      label {
        width: 120px;
        font-weight: 600;
        font-size: 14px;
        color: var(--text-gery-color);
        overflow: hidden;
        flex-shrink: 0;
      }
      .date-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 320px;
        .check-inner {
          width: 105px;
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
      width: 190px;
    }
    .column-switch {
      min-width: 150px;
      flex: 1;
    }
    .column-handle {
      width: 150px;
      justify-content: flex-end;
    }
    .table-head {
      height: 50px;
      color: var(--table-header-text-color);
      background-color: var(--table-row-background-color);
      display: flex;
      padding: 0 30px;
      margin-bottom: 5px;
      border-radius: 10px;
      div {
        display: flex;
        height: 50px;
        align-items: center;
      }
    }
    .table-body {
      border-radius: 10px;

      .table-row {
        display: flex;
        padding: 20px 30px;
        border-radius: 10px;
        margin-bottom: 5px;
        background-color: var(--table-row-background-color);
        > div {
          display: flex;
          align-items: center;
        }
        .column-handle {
          display: flex;
          align-items: center;
          a {
            width: 30px;
            height: 30px;
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
      }
      .table-body {
        .table-row {
          flex-direction: column;
          padding: 15px 10px;
          position: relative;
          &.open {
            &::after {
              transform: rotate(0);
            }
            .column-handle {
              display: block;
            }
          }
          .column-date-stop {
            display: flex;
            width: 100%;
            font-size: 14px;
            color: var(--text-default-color);
            .mobile-start {
              display: block;
            }
          }
          .column-date-start {
            display: none !important;
            width: auto;
          }
          .column-repeat {
            width: auto;
            max-width: 70%;
            margin: 5px 0 0 0;
            color: var(--text-gery-color);
            font-size: 12px;
          }
          .column-switch {
            position: absolute;
            right: 45px;
            top: 12px;
            min-width: 0;
          }
          .column-handle {
            display: none;
            width: 100%;
            justify-content: flex-start;
            margin-top: 10px;
            padding-top: 10px;
            color: var(--text-gery-color);
            border-top: 1px solid var(--table-body-hr-color);
            a {
              margin-left: 30px !important;
            }
            .check-wrap {
              position: absolute;
              right: 0;
              top: 20px;
            }
          }
          &::after {
            content: '\e65b';
            font-family: 'iconfont';
            position: absolute;
            right: 18px;
            top: 16px;
            font-size: 10px;
            transform: rotate(-90deg);
            transition: all 0.3s;
          }
        }
        .mobile-add-btn-wrap {
          margin-top: 20px;
        }
      }
      .table-head {
        display: none;
      }
    }
  }
  .modal {
    .modal-content {
      .item {
        .date-wrap {
          width: 100%;
          .check-inner {
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
