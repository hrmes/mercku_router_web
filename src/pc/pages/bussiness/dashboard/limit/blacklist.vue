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
              <div class="column-repeat">{{formatSchedules(row.schedule)}}</div>
              <div class="column-handle">
                <div class="check-wrap">
                  <m-switch :onChange="changehandle" v-model="row.enabled" />
                </div>
                <a>{{$t('编辑')}}</a>
                <a>{{$t('删除')}}</a>
              </div>
            </div>
          </div>
          <div class="btn-warp">
            <button class="btn" @click='()=>modalShow=!modalShow'>{{$t('trans0035')}}</button>
          </div>
        </div>
      </div>
      <div class="modal" v-if='modalShow'>
        <div class="opcity"></div>
        <div class="modal-content">
          <div class="modal-form">
            <div class="item">
              <label for="">{{$t('trans0075')}}</label>
              <m-switch :onChange="changehandle" />
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
          <div class="btn-info">
            <button class="btn btn-default" @click="()=>modalShow=false">{{$t('trans0025')}}</button>
            <button class="btn" @click="submit">{{$t('trans0035')}}</button>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Switch from '../../../../component/switch/index.vue';
import mSelect from '../../../../component/select/index.vue';
import MTimePicker from '../../../../component/timePicker/index.vue';
import MCheckbox from '../../../../component/checkbox/index.vue';
import layout from '../../../../layout.vue';
import { getStringByte, passwordRule } from '../../../../../util/util';

export default {
  components: {
    'm-switch': Switch,
    MTimePicker,
    MCheckbox,
    layout
  },
  data() {
    return {
      disabled: true,
      modalShow: false,
      timeLimitList: [],
      mac: '',
      form: {
        mac: '',
        time_begin: '00:00',
        time_end: '00:00',
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
  methods: {
    formatSchedules(arr) {
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
    getList() {
      this.$http.getTimeLimit({ mac: this.form.mac }).then(res => {
        this.timeLimitList = res.data.result;
      });
    },
    changehandle(v) {},
    submit() {
      this.schedules.forEach(item => {
        if (item.checked) {
          this.form.schedule.push(item.value);
        }
      });
      this.$http
        .addTimeLimit({
          ...this.form
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          if (err.upgrading) {
            return;
          }
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$router.push({ path: '/unconnect' });
          }
        });
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
    z-index: 99909;
    display: flex;
    justify-content: center;
    align-items: center;
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
      margin-top: 50px;
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
      width: 496px;
      height: 402px;
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
            width: 80px;
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

