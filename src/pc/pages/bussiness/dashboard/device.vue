<template>
  <div class="device-container">
    <div v-if="reboot">
      <m-progress :label="$t('trans0322')"></m-progress>
    </div>
    <div class="device-wrapper">
      <div class="title">{{$t('trans0235')}}</div>
      <div class="table-inner">
        <div class="table-head">
          <ul>
            <li class="column-name">
              <div class="column-icon"></div>
              {{$t('trans0005')}}
            </li>
            <li class="column-ip">{{$t('trans0151')}}</li>
            <li class="column-mac">{{$t('trans0188')}}</li>
            <li class="column-real-time">{{$t('trans0367')}}</li>
            <li class="column-band">{{$t('trans0015')}}</li>
            <li class="column-limit">{{$t('trans0368')}}</li>
            <li class="column-black-list">{{$t('trans0020')}}</li>
          </ul>
        </div>
        <div class="table-body">
          <ul v-for="(row,i) in devices" :key='i'>
            <li class="column-name">
              <div class="column-icon">
                <div class="icon-inner">
                  <i class="band" v-if="row.online_info.band==='wired'"><img src="../../../assets/images/ic_device_cable@2x.png" alt=""></i>
                  <i class="band" v-else><img src="../../../assets/images/ic_equipment.png" alt=""></i>
                </div>
              </div>
              <div class="name-wrap">
                <div class="name-inner">
                  <a @click='()=>nameModalOpen(row)'>
                    <span> {{row.alias||row.name}}</span>
                    <img src="../../../assets/images/ic_edit.png" alt="">
                  </a>
                </div>
                <div class="des-inner">
                  <span> {{bandMap[`${row.online_info.band}`]}}</span>
                  <span> {{transformDate(row.online_info.online_duration)}}</span>
                </div>
              </div>
            </li>
            <li class="column-ip">{{row.ip}}</li>
            <li class="column-mac">{{row.mac}}</li>
            <li class="column-real-time">
              <div class="speed-inner">
                <div class="speed-wrap">
                  <img class='icon' src="../../../assets/images/ic_device_upload.png" alt="">
                  <label class="text-inner">
                    <span> {{formatSpeed(row.online_info.realtime_speed.up).value}}</span>
                    <span> {{formatSpeed(row.online_info.realtime_speed.up).unit}}/s</span>
                  </label>
                </div>
                <div class="speed-wrap">
                  <img class='icon' src="../../../assets/images/ic_device_download.png" alt="">
                  <label class="text-inner">
                    <span>{{formatSpeed(row.online_info.realtime_speed.down).value}}</span>
                    <span>{{formatSpeed(row.online_info.realtime_speed.down).unit}}/s</span>
                  </label>
                </div>
              </div>
            </li>
            <li class="column-band">
              {{formatBandWidth(row.online_info.traffic.ul+row.online_info.traffic.dl).value}} {{formatBandWidth(row.online_info.traffic.ul+row.online_info.traffic.dl).unit}}

            </li>
            <li class="column-limit">
              <div class="limit-inner">
                <div class="item">
                  <span :class="{'time-active':isTimeLimit(row.limit_flags)}"> {{$t('trans0075')}}</span>
                  <img v-show='isTimeLimit(row.limit_flags)' class='icon' src="../../../assets/images/ic_limit_time.png" alt="">
                </div>
                <div class="item">
                  <span :class="{'speed-active':isSpeedLimit(row.limit_flags)}"> {{$t('trans0014')}}</span>
                  <img v-show='isSpeedLimit(row.limit_flags)' class='icon' src="../../../assets/images/ic_limit_speed.png" alt="">
                </div>
                <div class="item">
                  <span :class="{'black-active':isBlackLimit(row.limit_flags)}"> {{$t('trans0076')}}</span>
                  <img v-show='isBlackLimit(row.limit_flags)' class='icon' src="../../../assets/images/ic_blacklist_limit.png" alt="">
                </div>
              </div>
            </li>
            <li class="column-black-list">
              <span class="black-btn" @click="()=>addToBlackList(row.mac)">
                {{$t('trans0016')}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="edit-name-modal" v-if="modalShow">
      <div class="opcity"></div>
      <div class="content">
        <div class="select-wrapper">
          <label class='title'>{{$t('修改设备名称')}}</label>
          <input v-model='name' type="text" :placeholder="`${$t('请输入名称')}`">
        </div>
        <div class="btn-inner">
          <button @click="()=>modalShow=false" class="btn btn-default">{{$t('trans0025')}}</button>
          <button @click="updateDeviceName" class="btn">{{$t('trans0024')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import layout from '../../../layout.vue';
import TimePicker from '../../../component/timePicker/index.vue';
import DatePicker from '../../../component/datePicker/index.vue';
import MEditSelect from '../../../component/editableSelect/index.vue';
import MProgress from '../../../component/progress/index.vue';
import MInput from '../../../component/input/input.vue';
import MForm from '../../../component/form/index.vue';
import MFormItem from '../../../component/formItem/index.vue';
import { getStringByte, passwordRule } from '../../../../util/util';

export default {
  components: {
    MInput,
    MForm,
    MFormItem,
    MEditSelect,
    layout,
    MProgress,
    'm-time-picker': TimePicker,
    'm-date-picker': DatePicker
  },
  data() {
    return {
      reboot: false,
      modalShow: false,
      row: {},
      devices: [],
      anme: '',
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      }
    };
  },
  mounted() {
    this.getDeviceList();
  },
  methods: {
    getDeviceList() {
      this.$http
        .meshDeviceGet()
        .then(res => {
          if (res.data.result && res.data.result.length > 0) {
            this.devices = res.data.result.sort(
              (a, b) =>
                a.online_info.online_duration - b.online_info.online_duration
            );
          }
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
    },
    updateDeviceName() {
      if (this.name) {
        const params = {
          device: {
            alias: this.name,
            mac: this.row.mac
          }
        };
        this.$http
          .meshDeviceUpdate({ ...params })
          .then(() => {
            this.getDeviceList();
            this.modalShow = false;
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
    },
    addToBlackList(mac) {
      const params = {
        macs: [mac]
      };
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0036'),
        callback: {
          ok: () => {
            this.$http
              .addToblackList({
                ...params
              })
              .then(() => {
                this.reboot = true;
                this.$reconnect({
                  onsuccess: () => {
                    this.$router.push({ path: '/dashboard' });
                  },
                  ontimeout: () => {
                    this.$router.push({ path: '/unconnect' });
                  }
                });
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
      });
    },
    nameModalOpen(row) {
      this.modalShow = true;
      this.row = row;
    },
    isSpeedLimit(flags) {
      if (flags) {
        return flags.some(v => v === 'speed_limit');
      }
      return false;
    },
    isTimeLimit(flags) {
      if (flags) {
        return flags.some(v => v === 'time_limit');
      }
      return false;
    },
    isBlackLimit(flags) {
      if (flags) {
        return flags.some(v => v === 'blacklist');
      }
      return false;
    },
    transformDate(date) {
      date *= 1000;
      const now = new Date().getTime();
      if (date === 0) {
        return '--';
      } else if (date <= 5) {
        return this.$t('trans0010');
      } else if (date <= 60000 && date > 5) {
        return `${this.$t('trans0011').replace(
          '%d',
          parseInt(date / 1000, 10)
        )}`;
      } else if (date <= 3600000 && date > 60000) {
        return `${this.$t('trans0012').replace(
          '%d',
          parseInt(date / 60000, 10)
        )}`;
      } else if (date <= 3600000 * 24 && date > 3600000) {
        return `${this.$t('trans0013').replace(
          '%d',
          parseInt(date / 3600000, 10)
        )}`;
      }
      return this.moment(now - date).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>
<style lang="scss" scoped>
.device-container {
  .edit-name-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    .opcity {
      width: 100%;
      height: 100%;
      position: fixed;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      z-index: -1;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 330px;
      height: 218px;
      border-radius: 5px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
      background-color: #ffffff;
      border: solid 1px #f1f1f1;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        color: #333333;
      }
      .select-wrapper {
        input {
          width: 290px;
          height: 36px;
          border-radius: 4px;
          background-color: #ffffff;
          border: solid 1px #e6e6e6;
          outline: none;
          line-height: 36px;
          padding-left: 10px;
          margin-top: 10px;
        }
      }
      .btn-inner {
        display: flex;
        justify-content: center;
        .btn {
          width: 120px;
          height: 42px;
          &:last-child {
            margin-left: 30px;
          }
        }
      }
    }
  }
  flex: auto;
  background: white;
  padding: 0 20px;
  .device-wrapper {
    flex: 1;
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
    }
    .table-inner {
      margin-top: 30px;
      ul,
      li {
        text-decoration: none;
        list-style: none;
        // flex: auto;
        display: flex;
        color: #333333;
        font-size: 14px;
        overflow: hidden;
      }
      .table-head {
        ul {
          height: 50px;
          padding: 0 10px;
        }
      }
      .table-body {
        ul {
          border-bottom: 1px solid #f1f1f1;
          padding: 15px 10px;
        }
      }
      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .column-icon {
        width: 50px;
        display: flex;
        align-items: center;
      }
      .column-name {
        width: 210px;
      }
      .column-ip {
        width: 150px;
      }
      .column-mac {
        width: 150px;
      }
      .column-real-time {
        width: 200px;
      }
      .column-band {
        width: 100px;
      }
      .column-limit {
        width: 100px;
      }
      .column-black-list {
        width: 150px;
      }

      .table-head {
        height: 50px;
        background: #f1f1f1;
        width: 100%;
      }
      .icon-inner {
        display: flex;
        align-items: center;
        .band {
          display: flex;
          align-items: center;
        }
        .band > img {
          width: 22px;
          height: 22px;
        }
      }
      .des-inner {
        margin-top: 10px;
        span {
          margin-right: 10px;
        }
      }
      .name-inner {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        a {
          flex: 1;
          text-align: left;
          display: flex;
          cursor: pointer;
          align-items: center;

          &:hover {
            text-decoration: underline;
          }
          span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 130px;
          }
          img {
            width: 14px;
            margin-left: 5px;
          }
        }
      }
      .speed-inner {
        .speed-wrap {
          display: flex;
          align-items: center;

          &:last-child {
            margin-top: 10px;
          }
          .icon {
            width: 13px;
            margin-right: 6px;
          }
          .text-inner {
            font-size: 14px;
          }
        }
      }
      .limit-inner {
        .item {
          text-align: left;
          span {
            text-align: left;
            cursor: pointer;
            color: #999999;
            &:hover {
              color: #333333;
              text-decoration: underline;
            }
          }
          .icon {
            width: 11px;
          }
        }
        .item:nth-child(1) {
          .time-active {
            color: #20a0ff;
            &:hover {
              color: #20a0ff;
            }
          }
        }
        .item:nth-child(2) {
          .speed-active {
            color: #00c057;
            &:hover {
              color: #00c057;
            }
          }
          margin-top: 10px;
        }
        .item:nth-child(3) {
          .black-active {
            color: #e3ab29;
            &:hover {
              color: #e3ab29;
            }
          }
          margin-top: 10px;
        }
      }
      .black-btn {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .device-container {
    background: transparent;
    padding: 0;
    .edit-name-modal {
      .opcity {
      }

      .content {
        .title {
        }
        .select-wrapper {
          input {
          }
        }
        .btn-inner {
          .btn {
            &:last-child {
            }
          }
        }
      }
    }

    .device-wrapper {
      .title {
        border: none;
      }
      .table-inner {
        background: transparent;
        .table-head {
          display: none;
        }
        .table-body {
          ul {
            flex-direction: column;
          }
        }
        ul {
        }
        .column-icon {
        }
        .column-name {
        }
        .column-ip {
        }
        .column-mac {
        }
        .column-real-time {
        }
        .column-band {
        }
        .column-limit {
        }
        .column-black-list {
        }

        .table-head {
        }
        .icon-inner {
          .band {
          }
          .band > img {
          }
        }
        .des-inner {
          span {
          }
        }
        .name-inner {
          a {
            &:hover {
            }
            span {
            }
            img {
            }
          }
        }
        .speed-inner {
          .speed-wrap {
            &:last-child {
            }
            .icon {
            }
            .text-inner {
            }
          }
        }
        .limit-inner {
          .item {
            span {
              &:hover {
              }
            }
            .icon {
            }
          }
          .item:nth-child(1) {
            .time-active {
              &:hover {
              }
            }
          }
          .item:nth-child(2) {
            .speed-active {
              &:hover {
              }
            }
          }
          .item:nth-child(3) {
            .black-active {
              &:hover {
              }
            }
          }
        }
        .black-btn {
          cursor: pointer;
          &:hover {
          }
        }
      }
    }
  }
}
</style>
