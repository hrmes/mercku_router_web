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
            <li class="column-icon"></li>
            <li class="column-name">{{$t('trans0005')}}</li>
            <li class="column-ip">{{$t('trans0151')}}</li>
            <li class="column-mac">{{$t('trans0188')}}</li>
            <li class="column-real-time">{{$t('trans0367')}}</li>
            <li class="column-band">{{$t('trans0015')}}</li>
            <li class="column-limit">{{$t('trans0368')}}</li>
            <li class="column-black-list">{{$t('trans0020')}}</li>
          </ul>
        </div>
        <!-- <m-table :data="devices" stripe>
          <m-table-column align="left" width='50'>
            <template slot-scope="scope">
              <div class="name-inner">
                <i class="band" v-if="scope.row.online_info.band==='wired'"><img src="../../../assets/images/ic_device_cable@2x.png" alt=""></i>
                <i class="band" v-else><img src="../../../assets/images/ic_equipment.png" alt=""></i>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0005')" align="left" width='200'>
            <template slot-scope="scope">
              <div class="name-inner">
                <a @click='()=>nameModalOpen(scope.row)'>
                  <span> {{scope.row.name}}</span>
                  <img src="../../../assets/images/ic_edit.png" alt="">
                </a>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0375')" align="left" width='100'>
            <template slot-scope="scope">
              <div>
                {{bandMap[`${scope.row.online_info.band}`]}}
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0374')" align="left" width='150'>
            <template slot-scope="scope">
              <div>
                {{transformDate(scope.row.online_info.online_duration)}}
              </div>
            </template>
          </m-table-column>
          <m-table-column prop="ip" :label="$t('trans0151')" align="left" width='180'></m-table-column>
          <m-table-column prop="mac" :label="$t('trans0188')" align="left" width='180'></m-table-column>
          <m-table-column :label="$t('trans0367')" align="left" width='150'>
            <template slot-scope="scope">
              <div class="speed-inner">
                <div class="speed-wrap">
                  <img class='icon' src="../../../assets/images/ic_device_upload.png" alt="">
                  <label class="text-inner">
                    <span> {{formatSpeed(scope.row.online_info.realtime_speed.up).value}}</span>
                    <span> {{formatSpeed(scope.row.online_info.realtime_speed.up).unit}}/s</span>
                  </label>
                </div>
                <div class="speed-wrap">
                  <img class='icon' src="../../../assets/images/ic_device_download.png" alt="">
                  <label class="text-inner">
                    <span>{{formatSpeed(scope.row.online_info.realtime_speed.down).value}}</span>
                    <span>{{formatSpeed(scope.row.online_info.realtime_speed.down).unit}}/s</span>
                  </label>
                </div>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0015')" align="left" width='120'>
            <template slot-scope="scope">
              <div>
                {{formatBandWidth(scope.row.online_info.traffic.ul+scope.row.online_info.traffic.dl).value}} {{formatBandWidth(scope.row.online_info.traffic.ul+scope.row.online_info.traffic.dl).unit}}
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0368')" align="left" width='150'>
            <template slot-scope="scope">
              <div class="band-width-inner">
                <div class="item">
                  <span :class="{'time-active':isTimeLimit(scope.row.limit_flags)}"> {{$t('trans0075')}}</span>
                  <img v-show='isTimeLimit(scope.row.limit_flags)' class='icon' src="../../../assets/images/ic_limit_time.png" alt="">
                </div>
                <div class="item">
                  <span :class="{'speed-active':isSpeedLimit(scope.row.limit_flags)}"> {{$t('trans0014')}}</span>
                  <img v-show='isSpeedLimit(scope.row.limit_flags)' class='icon' src="../../../assets/images/ic_limit_speed.png" alt="">
                </div>
                <div class="item">
                  <span :class="{'black-active':isBlackLimit(scope.row.limit_flags)}"> {{$t('trans0076')}}</span>
                  <img v-show='isBlackLimit(scope.row.limit_flags)' class='icon' src="../../../assets/images/ic_blacklist_limit.png" alt="">
                </div>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0020')" align="left" width='160'>
            <template slot-scope="scope">
              <span class="black-btn" @click="()=>addToBlackList(scope.row.mac)">
                {{$t('trans0016')}}
              </span>
            </template>
          </m-table-column>
        </m-table> -->
      </div>
    </div>
    <div class="edit-name-modal" v-if="modalShow">
      <div class="opcity"></div>
      <div class="content">
        <div class="select-wrapper">
          <label class='title'>{{$t('修改设备名称')}}</label>
          <m-edit-select v-model='name' :options='alias' class="small" placeholder="请输入名称" />
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

export default {
  components: {
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
      alias: [
        '客厅',
        '主卧',
        '书房',
        '客房',
        '儿童房',
        '杂物间',
        '衣帽间',
        '游戏室',
        '厨房',
        '前厅',
        '门厅',
        '餐厅',
        '卫生间',
        '地下室',
        '车库'
      ],
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
            name: this.name,
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
      .column-icon {
        width: 50px;
      }
      .column-name {
        width: 200px;
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
        ul,
        li {
          text-decoration: none;
          list-style: none;
          // flex: auto;
        }
        ul {
          width: 100%;
          display: flex;
          height: 50px;
          justify-content: space-between;
          align-items: center;
        }
      }
      .name-inner {
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
        a {
          flex: 1;
          text-align: left;
          display: flex;
          cursor: pointer;
          align-items: center;
          &:hover {
            // text-decoration: underline;
          }
          span {
            display: inline-block;
            // width: 80px;
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
      .band-width-inner {
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
}
</style>
