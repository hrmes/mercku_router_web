<template>
  <div class="timelimit">
    <div class='timelimit-table'
         :class="{'table--empty':!sortList.length}">
      <div class="table-head">
        <div class="column-switch">{{$t('trans0190')}}</div>
        <div class="column-date-stop"
             v-if="!isMobile">{{$t('trans0084')}}</div>
        <div class="column-date-start"
             v-if="!isMobile">{{$t('trans0085')}}</div>
        <div class="column-repeat"
             v-if="!isMobile">{{$t('trans0082')}}</div>
        <div class="column-handle">
          <button class="btn btn-small"
                  @click.stop="modalOpen('add')">{{$t('trans0035')}}</button>
        </div>
      </div>
      <div class="table-body">
        <div v-for="(row,index) in sortList"
             :key='index'
             class="table-row">
          <div class="column-switch check-wrap">
            <m-switch @change="(v)=>changehandle(v,row)"
                      v-model="row.enabled" />
          </div>
          <div class="column-date-stop">
            <span>{{row.time_begin}}</span>
            <span class="mobile-start"
                  v-if="isMobile">&nbsp;-&nbsp;</span>
            <span class="mobile-start"
                  v-if="isMobile">{{row.time_end}}</span>
          </div>
          <div class="column-date-start"
               v-if="!isMobile">
            {{row.time_end}}
          </div>
          <div class="column-repeat">{{formatSchedulText(row.schedule)}}</div>
          <div class="column-handle">
            <span class="limit-icon"
                  @click.stop="modalOpen('edit',row)">
              <i class=" iconfont  ic_settings"></i>
              <span class="hover-popover">{{$t('trans0034')}}</span>
            </span>
            <span class="limit-icon"
                  @click.stop="delRow(row)">
              <i class=" iconfont  ic_trash"></i>
              <span class="hover-popover">{{$t('trans0033')}}</span>
            </span>
          </div>
        </div>
        <div class="empty"
             v-if="isEmpty">
          <img src="@/assets/images/img_default_empty.png"
               alt="">
          <p class="empty-text">{{$t('trans0278')}}</p>
        </div>
      </div>
    </div>
    <m-modal class="modal"
             :visible.sync="modalShow"
             :type="'confirm'">
      <div class="modal-content">
        <div class="modal-form">
          <div class="item left-right">
            <m-switch v-model="form.enabled"
                      :label="$t('trans0075')"
                      class="switch" />
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
    if (this.limit && this.limit.time_limit) {
      this.timeLimitList = this.limit.time_limit;
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
        if (this.limit && this.limit.time_limit) {
          this.limit.time_limit = this.timeLimitList;
        }
      });
    },
    changehandle(v, row) {
      console.log(v);
      console.log(row);
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
          this.$toast(this.$t('trans0040'), 1500, 'success');
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
            this.isSameTimezoneOffset().then(result => {
              if (result.same || !result.redirect) {
                this.$toast(this.$t('trans0040'), 2000, 'success');
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
  .message {
    font-size: 12px;
    color: #ff0001;
    display: inline-block;
    height: 14px;
  }
  .btn-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 20px;
    justify-content: center;
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
    .btn-default {
      background-image: linear-gradient(
          to right,
          var(--modal-content-background),
          var(--modal-content-background)
        ),
        var(--common-btn_default-bgimg) !important;
    }
  }
}
.timelimit {
  width: 100%;
  .timelimit-table {
    width: 100%;
    .table-head {
      display: grid;
      grid-template-rows: 100%;
      grid-template-columns: 120px 180px 200px 1fr 120px;
      color: var(--table-header-text-color);
      background-color: var(--common-sub_card-bgc);
      padding: 5px 5px 5px 30px;
      margin-bottom: 5px;
      border-radius: 8px;
      font-size: 13px;
      div {
        display: flex;
        align-items: center;
        &:last-child {
          justify-content: flex-end;
        }
      }
    }
    .table-body {
      .table-row {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 120px 180px 200px 1fr 120px;
        height: 60px;
        padding: 5px 5px 5px 30px;
        margin-bottom: 5px;
        background-color: var(--common-sub_card-bgc);
        border-radius: 10px;
        > div {
          display: flex;
          align-items: center;
          &:last-child {
            justify-content: flex-end;
            padding-right: 5px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
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
  .timelimit {
    .timelimit-table {
      margin: 0;
      position: relative;
      .table-head {
        grid-template-columns: 1fr 100px;
        padding: 5px 5px 5px 15px;
      }
      .table-body {
        .table-row {
          position: relative;
          grid-template-columns: 100%;
          grid-template-rows: 30px auto 30px;
          height: fit-content;
          padding: 10px 15px;
          position: relative;
          .column-date-stop {
            grid-row: 1;
            margin-bottom: 5px;
          }
          .column-repeat {
            grid-row: 2;
            margin-bottom: 5px;
          }
          .column-switch {
            grid-column: 1;
            grid-row: 3;
          }
          .column-handle {
            grid-column: 1;
            grid-row: 3;
          }
        }
      }
    }
  }
}
</style>
