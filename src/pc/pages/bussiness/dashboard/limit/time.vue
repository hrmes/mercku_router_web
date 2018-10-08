<template>
  <layout>
    <div class="device-time-container">
      <div class="content">
        <div class='w-header'>
          {{$t('trans0075')}}
        </div>
        <div class='table'>
          <div class="table-head">
            <div class="column-date-stop">{{$t('trans0084')}}</div>
            <div class="column-date-start">{{$t('trans0085')}}</div>
            <div class="column-repeat">{{$t('trans0082')}}</div>
            <div class="column-handle">{{$t('trans0370')}}</div>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="(row,index) in timeLimitList" :key='index'>
              <div class="column-date-stop">
                <span>{{row.time_begin}}</span>
                <span class="mobile-start">&nbsp;-&nbsp;</span>
                <span class="mobile-start">{{row.time_end}}</span>
              </div>
              <div class="column-date-start">{{row.time_end}}</div>
              <div class="column-repeat">{{formatSchedulText(row.schedule)}}</div>
              <div class="column-handle">
                <div class="check-wrap">
                  <m-switch :onChange="(v)=>changehandle(v,row)" v-model="row.enabled" />
                </div>
                <a @click="modalOpen('edit',row)">{{$t('trans0034')}}</a>
                <a @click="delRow(row)">{{$t('trans0033')}}</a>
              </div>
            </div>
          </div>
          <div class="btn-warp">
            <button class="btn" @click="modalOpen('add')">{{$t('trans0035')}}</button>
          </div>
        </div>
      </div>
      <div class="modal" v-if='modalShow'>
        <div class="opcity"></div>
        <div class="modal-content">
          <div class="modal-form">
            <div class="item">
              <label for="">{{$t('trans0075')}}</label>
              <m-switch v-model="form.enabled" />
            </div>
            <div class="item">
              <label for="">{{$t('trans0084')}}</label>
              <m-time-picker v-model="form.time_begin" />
            </div>
            <div class="item">
              <label for="">{{$t('trans0085')}}</label>
              <m-time-picker v-model="form.time_end" />
            </div>
            <div class="item">
              <label for="">{{$t('trans0082')}}</label>
              <div class="date-wrap">
                <div class='check-inner' v-for="(item,i) in schedules" :key='i'>
                  <m-checkbox v-model='item.checked' :text='item.label'></m-checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="message"><span v-show='msgShow'>{{$t('trans0388')}}</span></div>
          <div class="btn-info">
            <button class="btn btn-default" @click="()=>modalShow=false">{{$t('trans0025')}}</button>
            <button v-if="modalStatus==='add'" class="btn" @click="submit">{{$t('trans0035')}}</button>
            <button v-if="modalStatus==='edit'" class="btn" @click="updateSubmit">{{$t('trans0081')}}</button>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Switch from '../../../../component/switch/index.vue';
import MTimePicker from '../../../../component/timePicker/index.vue';
import MCheckbox from '../../../../component/checkbox/index.vue';
import layout from '../../../../layout.vue';

const formatTime = t => {
  const s = new Date(`2018-01-01 ${t}:00`).getTime();
  return s;
};
export default {
  components: {
    'm-switch': Switch,
    MTimePicker,
    MCheckbox,
    layout
  },
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
          value: 'Mon'
        },
        {
          label: this.$t('trans0087'),
          checked: false,
          value: 'Tue'
        },
        {
          label: this.$t('trans0088'),
          checked: false,
          value: 'Wed'
        },
        {
          label: this.$t('trans0089'),
          checked: false,
          value: 'Thu'
        },
        {
          label: this.$t('trans0090'),
          checked: false,
          value: 'Fri'
        },
        {
          label: this.$t('trans0091'),
          checked: false,
          value: 'Sat'
        },
        {
          label: this.$t('trans0092'),
          checked: false,
          value: 'Sun'
        }
      ]
    };
  },
  mounted() {
    this.form.mac = this.$route.params.mac;
    this.getList();
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
    sortList() {
      return this.timeLimitList.sort((a, b) => {
        if (a.time_begin || b.time_begin) {
          return formatTime(a.time_begin) - formatTime(b.time_begin);
        }
        if (a.time_end || b.time_end) {
          return formatTime(a.time_end) - formatTime(b.time_end);
        }
        return 0;
      });
    }
  },
  methods: {
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
      this.isChoose = true;
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
      // this.$loading.open();
      this.$http
        .getTimeLimit({ mac: this.form.mac })
        .then(res => {
          // this.$loading.close();
          this.timeLimitList = res.data.result;
        })
        .catch(err => {
          // this.$loading.close();
          if (err.upgrading) {
            return;
          }
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
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
        .timeLimitUpdate({
          ...params
        })
        .then(() => {
          this.$loading.close();
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.getList();
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
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
          // this.getList();
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
    },
    submit() {
      if (!this.isChoose) {
        this.msgShow = true;
        return false;
      }
      this.$loading.open();
      const arr = [];
      this.schedules.forEach(item => {
        if (item.checked) {
          arr.push(item.value);
        }
      });
      this.form.schedule = arr;
      this.$http
        .addTimeLimit({
          ...this.form
        })
        .then(() => {
          this.$loading.close();
          this.getList();
          // this.timeLimitList.push(this.form);
          this.modalShow = false;
          this.$toast(this.$t('trans0040'), 3000, 'success');
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
      return true;
    },
    updateSubmit() {
      if (!this.isChoose) {
        this.msgShow = true;
        return false;
      }
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
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          this.$loading.close();
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.device-time-container {
  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    .message {
      padding-left: 70px;
      font-size: 12px;
      color: #ff0001;
      display: inline-block;
      height: 14px;
    }
    .opcity {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      z-index: -1;
    }
    .btn-info {
      display: flex;
      margin-top: 20px;
      justify-content: center;
      // margin-bottom: 30px;
      .btn {
        width: 120px;
        height: 42px;
        &:last-child {
          margin-left: 30px;
        }
      }
    }
    .modal-content {
      width: 496px;
      height: 452px;
      border-radius: 5px;
      background-color: #ffffff;
      padding: 30px;
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
          width: 70px;
          font-size: 14px;
          color: #333333;
          overflow: hidden;
        }
        .date-wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          width: 320px;
          .check-inner {
            width: 140px;
            margin-bottom: 12px;
          }
        }
      }
    }
  }
  flex: auto;
  padding: 0 2%;
  display: flex;
  .ssid-hidden {
    margin-bottom: 30px;
  }
  position: relative;
  .content {
    border-radius: 8px;
    padding: 0 20px;
    background: white;
    position: relative;
    flex: 1;
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .table {
      .btn-warp {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        margin-bottom: 50px;
      }
      margin-top: 30px;
      .column-date-stop {
        width: 180px;
        .mobile-start {
          display: none;
        }
      }
      .column-date-start {
        width: 180px;
      }
      .column-repeat {
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
          padding: 30px 30px;
          border-bottom: 1px solid #f1f1f1;
          .column-handle {
            display: flex;
            align-items: center;
            a {
              margin-left: 50px;
              cursor: pointer;
              font-size: 14px;
              &:hover {
                text-decoration: underline;
              }
              &:last-child {
                color: #ff0001;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .device-time-container {
    padding: 20px 16px;
    .modal {
      .modal-content {
        overflow-y: auto;
        width: 300px;
        height: 480px;
        border-radius: 5px;
        background-color: #ffffff;
        padding: 10px 20px;
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
            width: 70px;
            font-size: 14px;
            color: #333333;
            overflow: hidden;
          }
          .date-wrap {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 180px;
            .check-inner {
              width: 140px;
              margin-bottom: 12px;
            }
          }
        }
      }
    }
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      min-height: 450px;
      .table {
        margin: 0;
        .table-body {
          .table-row {
            flex-direction: column;
            padding: 20px 0;
            position: relative;
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
  }
}
</style>

