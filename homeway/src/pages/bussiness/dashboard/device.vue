<template>
  <div class="device-container">
    <div class="device-wrapper">
      <div class="table-inner">
        <!-- 表头开始 -->
        <div class="table-head">
          <ul class="reset-ul">

            <!-- 在线显示的表头 -->
            <!-- 设备名称device列 -->
            <li class="column-name">{{$t('trans0005')}}</li>

            <!-- 实时速率realtime speed列 -->
            <li class="column-real-time">{{$t('trans0367')}}</li>

            <!-- 设备吞吐量列throughput -->
            <li class="column-band">{{$t('trans0015')}}</li>

            <!-- RSSI -->
            <li class="column-rssi">{{$t('trans1057')}}</li>

            <!-- 在线时长 -->
            <li class="column-online-duration">{{$t('trans0631')}}</li>

            <!-- IP地址/mac地址 -->
            <li class="column-ip">{{$t('trans0151')}} /
              {{$t('trans0188')}}</li>
          </ul>
        </div>
        <!-- 表头结束 -->

        <!-- 表格数据开始 -->
        <div class="table-body small-device-body">
          <div class="loading-container"
               v-if="showLoading">
            <m-loading :color="loadingColor"></m-loading>
          </div>
          <div v-else>
            <ul v-for="(row,i) in devicesMap[id]"
                :key='i'
                :class="{'expand':row.expand}"
                class="reset-ul">

              <!-- 设备名称列数据 -->
              <li class="column-name"
                  @click.stop="expandTable(row)">
                <div class="name-wrap">

                  <div class="name-inner">
                    <a class="name_inner_a">
                      <img v-if='row.local'
                           src="../../../assets/images/icon/ic_user.png"
                           alt=""
                           class="current_visit_icon">
                      <span class="device-name"
                            :title='row.name'>{{row.name}}</span>
                      <img style="cursor:pointer"
                           class="btn-text icon-btn"
                           :title="$t('trans0034')"
                           @click.stop='()=>nameModalOpen(row)'
                           v-if='isMobileRow(row.expand)'
                           src="../../../assets/images/icon/ic_edit.png"
                           alt="">
                    </a>
                    <div class="mobile-icon">
                      <img :class="{'i-collapse':row.expand,'i-expand':!row.expand}"
                           src="../../../assets/images/icon/ic_side_bar_pick_up.png"
                           alt="">
                    </div>
                  </div>
                  <!-- <div class="des-inner"
                       v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                    <span class="row">
                      <span class="label">{{$t('trans0375')}}</span>
                      <span class="value">{{bandMap[`${row.online_info.band}`]}}</span>
                    </span>
                    <span class="row"
                          v-if="!isWired(row)">
                      <span class="label">{{$t('trans0374')}}</span>
                      <span class="value">{{transformDate(row.online_info.online_duration)}}</span>
                    </span>
                  </div> -->
                </div>
              </li>
              <!-- 实时速率列数据 -->
              <li class="column-real-time"
                  v-if='isMobileRow(row.expand)'>
                <span class="label">{{$t('trans0367')}}</span>
                <div class="speed-inner">
                  <div class="speed-wrap">
                    <img class='icon'
                         src="../../../assets/images/icon/ic_device_upload.png"
                         alt="">
                    <label class="text-inner">
                      <span>{{formatSpeed(row.online_info.realtime_speed.up).value}}</span>
                      <span>{{formatSpeed(row.online_info.realtime_speed.up).unit}}/s</span>
                    </label>
                  </div>
                  <div class="speed-wrap">
                    <img class='icon'
                         src="../../../assets/images/icon/ic_device_download.png"
                         alt="">
                    <label class="text-inner">
                      <span>{{formatSpeed(row.online_info.realtime_speed.down).value}}</span>
                      <span>{{formatSpeed(row.online_info.realtime_speed.down).unit}}/s</span>
                    </label>
                  </div>
                </div>
              </li>
              <!-- 设备吞吐量列数据 -->
              <li class="column-band"
                  v-if='isMobileRow(row.expand)'>
                <span class="label">{{$t('trans0015')}}</span>
                <span class="value">
                  <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).value}}</span>
                  <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).unit}}</span>
                </span>
              </li>
              <!-- RSSI列数据 -->
              <li class="column-rssi"
                  v-if='isMobileRow(row.expand)'>
                <span v-show="isMobile">{{$t('trans1057')}}</span>
                <div class="rssi-inner">
                  <div class="item device-item">
                    <span
                          class="rssi-icon connection-method">{{bandMap[row.online_info.band]}}</span>
                  </div>
                  <div class="item device-item"
                       :class="{'hidden':row.online_info.band==='wired'}">
                    <span class="rssi-icon signal-strength"
                          :class="[row.online_info.rssi>-60?'good':row.online_info.rssi>-75? 'normal':'bad']"></span>
                  </div>
                  <div class="item device-item"
                       :class="{'hidden':row.online_info.band ==='wired'}">
                    <span class="rssi-icon rssi-value">{{row.online_info.rssi+'dBm'}}</span>
                  </div>
                </div>
              </li>
              <!-- 在线时长 -->
              <li class="column-online-duration device-item"
                  v-if='isMobileRow(row.expand)'>
                <span>{{$t('trans0631')}}</span>
                <span> {{transformDuration(row.online_info.online_duration)}} </span>
              </li>
              <!-- ip地址/mac地址 -->
              <li class="column-ip device-item"
                  v-if='isMobileRow(row.expand)'>
                <span>{{$t('trans0151')}}</span>
                <span> {{row.ip}} <br /><span class="pc-mac">{{formatMac(row.mac)}}</span></span>
              </li>
              <!-- 手机模式下显示的mac行 -->
              <li class="column-mac device-item"
                  v-if='isMobileRow(row.expand)'>
                <span>{{$t('trans0188')}}</span>
                <span>{{formatMac(row.mac)}}</span>
              </li>
            </ul>

            <div class='table-empty'
                 v-if="!devicesMap[id]||(devicesMap[id]&&devicesMap[id].length===0)">
              <img src="../../../assets/images/img_default_empty.png"
                   alt="">
              <span>{{$t('trans0278')}}</span>
            </div>
          </div>
        </div>
        <!-- 表格数据结束 -->
      </div>
    </div>

    <m-modal :visible.sync="modalShow"
             class="edit-name-modal">
      <div class="content">
        <div class="select-wrapper">
          <m-form ref="form"
                  class='form'
                  :model="form"
                  :rules='rules'>
            <m-form-item class="item"
                         prop='name'>
              <m-input class='small'
                       :label="$t('trans0005')"
                       type='text'
                       :placeholder="`${$t('trans0321')}`"
                       v-model="form.name"></m-input>
            </m-form-item>
          </m-form>
        </div>
        <div class="btn-inner">
          <button @click="()=>modalShow=false"
                  class="btn btn-default">{{$t('trans0025')}}</button>
          <button @click="updateDeviceName"
                  class="btn">{{$t('trans0024')}}</button>
        </div>
      </div>
    </m-modal>
  </div>
</template>
<script>
import { formatMac, getStringByte, formatDate, formatDuration } from '../../../../../base/src/util/util';
import { BlacklistMode } from '../../../../../base/src/util/constant';

export default {
  data() {
    return {
      showLoading: false,
      BlacklistMode,
      formatMac,
      checkAll: false,
      isMobile: false,
      modalShow: false,
      row: {},
      devicesMap: {},
      localDeviceIP: '',
      timer: null,
      form: { name: '' },
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      },
      rules: {
        name: [
          {
            rule: value => !value.trim().match(/^\s*$/),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value.trim()) <= 20,
            message: this.$t('trans0261')
          }
        ]
      },
      pageActive: true
    };
  },
  computed: {
    offlineCheckedMacs() {
      const macs = [];
      if (this.devicesMap[this.id] && this.devicesMap[this.id].length > 0) {
        this.devicesMap[this.id].forEach(v => {
          if (v.checked) macs.push(v.mac);
        });
        return macs;
      }
      return macs;
    },
    id() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    const that = this;
    this.getIsMobile(that);
    window.addEventListener('resize', () => {
      const w = that.windowWidth();
      if (w <= 768) {
        that.isMobile = true;
      } else {
        that.isMobile = false;
      }
    });
    const selfInfo = await this.$http.getLocalDevice();
    this.localDeviceIP = selfInfo.data.result.ip;
    this.getDeviceList(true);
  },
  beforeDestroy() {
    this.pageActive = false;
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    accessNodeName(row) {
      return row?.access_node?.name ?? '-';
    },
    isWired(row) {
      return row.online_info.band === 'wired';
    },
    isCurrentTab(tab) {
      return tab.id === this.id;
    },
    devicesParams() {
      let params = { filters: [{ type: 'primary', status: ['online'] }] };
      if (this.id === 'primary') {
        params = { filters: [{ type: 'primary', status: ['online'] }] };
      }
      if (this.id === 'guest') {
        params = { filters: [{ type: 'guest', status: ['online'] }] };
      }
      if (this.id === 'offline') {
        params = {
          filters: [
            { type: 'guest', status: ['offline'] },
            { type: 'primary', status: ['offline'] }
          ]
        };
      }
      return params;
    },
    delOfflineDevices(macs) {
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0553'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .meshDevicesOfflineDel({ macs })
              .then(() => {
                this.$loading.close();
                this.$toast(this.$t('trans0040'), 3000, 'success');
                this.getDeviceList();
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
    },
    sortOfflineDevices(arr) {
      return arr.sort((a, b) => b.offline_time - a.offline_time);
    },
    sortDevices(arr) {
      return (
        arr
          // 附件一个是否是本机的属性
          .map(v => ({ ...v, local: v.ip === this.localDeviceIP }))
          .sort((a, b) => {
            // 本机放在最上面
            if (a.local || b.local) {
              if (a.local) {
                return -1;
              }
              if (b.local) {
                return 1;
              }
              return 0;
            }
            const wired = 'wired';
            if (a.online_info.band === wired || b.online_info.band === wired) {
              if (a.online_info.band === wired && b.online_info.band === wired) {
                return a.name > b.name;
              }
              if (a.online_info.band === wired) {
                return 1;
              }
              if (b.online_info.band === wired) {
                return -1;
              }
              return 0;
            }
            return a.online_info.online_duration - b.online_info.online_duration;
          })
      );
    },
    offCheckChange(v) {
      this.devicesMap[this.id].forEach(item => {
        if (v) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    tabChange(id) {
      clearTimeout(this.timer);
      this.timer = null;
      if (id !== this.id) {
        this.$router.push(`/dashboard/device/${id}`);
        this.getDeviceList(true);
      }
    },
    isMobileRow(expand) {
      return this.isMobile ? expand : true;
    },
    expandTable(row) {
      if (this.isMobile) {
        this.devicesMap[this.id].forEach(v => {
          if (v.mac === row.mac) {
            v.expand = !v.expand;
          }
        });
      }
    },
    windowWidth() {
      if (window.innerWidth) return window.innerWidth;
      if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      return 0;
    },
    getIsMobile(that) {
      const w = that.windowWidth();
      if (w <= 768) {
        that.isMobile = true;
      } else {
        that.isMobile = false;
      }
    },
    async getDeviceList(showLoading) {
      if (showLoading) {
        this.showLoading = showLoading;
      }
      const params = this.devicesParams();
      if (!this.devicesMap[this.id]) this.devicesMap[this.id] = [];
      try {
        const curId = this.id;
        const devicesInfo = await this.$http.getDeviceList(params);
        this.showLoading = false;
        if (curId === this.id) {
          if (this.pageActive) {
            this.timer = setTimeout(() => {
              this.getDeviceList();
            }, 15 * 1000);
          }
          const res = devicesInfo.data.result;
          const result = res.map(v => ({
            ...v,
            expand: false,
            checked: false
          }));
          const originDevices = this.devicesMap[this.id];
          // 维持设备之前的附加属性
          if (originDevices.length > 0) {
            originDevices.forEach(n => {
              const device = result.find(r => r.mac === n.mac);
              if (device) {
                device.expand = n.expand;
                device.checked = n.checked;
              }
            });
          }
          this.devicesMap = {
            ...this.devicesMap,
            [curId]:
              curId === 'offline' ? this.sortOfflineDevices(result) : this.sortDevices(result)
          };
          console.log(this.devicesMap);
        }
      } catch (err) {
        clearTimeout(this.timer);
        this.timer = null;
        this.timer = setTimeout(() => {
          this.getDeviceList();
        }, 15 * 1000);
        this.showLoading = false;
      }
    },
    updateDeviceName() {
      if (this.$refs.form.validate()) {
        this.form.name = this.form.name.trim();
        const params = {
          device: {
            name: this.form.name,
            mac: this.row.mac
          }
        };
        this.$http.meshDeviceUpdate({ ...params }).then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.devicesMap[this.id] = this.devicesMap[this.id].map(v => {
            if (v.mac === this.row.mac) {
              return { ...v, name: this.form.name };
            }
            return v;
          });
          this.modalShow = false;
        });
      }
    },
    addToBlackList(row) {
      if (row.local) {
        this.$toast(this.$t('trans0047'));
        return false;
      }
      const params = { devices: [{ mac: row.mac, name: row.name }] };
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0036'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .addToblackList({ ...params })
              .then(() => {
                this.devicesMap[this.id] = this.devicesMap[this.id].filter(v => v.mac !== row.mac);
                this.$toast(this.$t('trans0040'), 3000, 'success');
                this.$loading.close();
              })
              .catch(() => {
                this.$loading.close();
              });
          }
        }
      });
      return true;
    },
    nameModalOpen(row) {
      if (!(this.isMobile && !row.expand)) {
        this.modalShow = true;
        this.row = row;
        this.form.name = row.name;
      }
    },
    transformOfflineDate(date) {
      const now = new Date().getTime();
      const differ = now - date;
      const split = [3600 * 24 * 1000, 3600 * 1000, 60 * 1000, 5 * 1000, 1000];
      if (date === 0) {
        return `${this.$t('trans0560')}`;
      }
      if (differ > split[0]) {
        return formatDate(date);
      }
      if (differ <= split[0] && differ > split[1]) {
        return `${this.$t('trans0013').replace('%d', parseInt(differ / split[1], 10))}`;
      }
      if (differ <= split[1] && differ > split[2]) {
        return `${this.$t('trans0012').replace('%d', parseInt(differ / split[2], 10))}`;
      }
      if (differ <= split[2] && differ > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(differ / split[4], 10))}`;
      }
      return '-';
    },
    transformDate(date) {
      if (date < 0) {
        return '-';
      }
      const split = [3600 * 24, 3600, 60, 5];
      // 大于1天
      if (date > split[0]) {
        const now = new Date().getTime();
        return formatDate(now - date * 1000);
      }
      // 小于1天大于1小时
      if (date <= split[0] && date > split[1]) {
        return `${this.$t('trans0013').replace('%d', parseInt(date / split[1], 10))}`;
      }
      // 小于1小时大于1分钟
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace('%d', parseInt(date / split[2], 10))}`;
      }
      // 小于1分钟大于5秒
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(date, 10))}`;
      }
      return `${this.$t('trans0010')}`;
    },
    transformDuration(zone) {
      if (!zone || window.isNaN(zone) || parseInt(zone, 10) < 0 || !Number.isInteger(zone)) {
        return '-';
      }
      const suffixs = [
        {
          key: 'year',
          text: 'trans0531',
          limitBefore: 1 // 向当前位的下多少位取值
        },
        {
          key: 'month',
          text: 'trans0532',
          limitBefore: 1
        },
        {
          key: 'day',
          text: 'trans0533',
          limitBefore: 1
        },
        {
          key: 'hour',
          text: 'trans0534',
          limitBefore: 1
        },
        {
          key: 'minute',
          text: 'trans0535',
          limitBefore: 0
        },
        {
          key: 'second',
          text: 'trans0536',
          limitBefore: 0
        }
      ];
      const timeArr = formatDuration(zone);
      // 将时间数组分割为前后两个，第一个包含年月日，第二个只包含时分秒，两者格式化方式不一致，所以分开处理
      const firstHalfTimeArr = timeArr.filter((item, index) => index < 3);
      let secondHalfTimeArr = timeArr.filter((item, index) => index >= 3);

      const firstEffectiveDateIndex = firstHalfTimeArr.findIndex(val => val); // 找到第一个有值的日期的下标

      // 年月日处理字符串
      let firstDurationStr = '';
      // 时分秒处理字符串
      let durationStr = '';

      // 如果上线时长至少有一个值满足了（年月日）单位，就要处理firstDurationStr
      if (firstEffectiveDateIndex !== -1) {
        firstHalfTimeArr.forEach((item, index) => {
          if (item !== 0) {
            firstDurationStr += item + this.$t(suffixs[index].text);
          }
        });
      }
      // 上线时长不满满足了（年月日）其中任何一个单位，都为0
      secondHalfTimeArr = secondHalfTimeArr.map(item => item.toString().padStart(2, '0'));
      durationStr = secondHalfTimeArr.join(':');
      return firstDurationStr === '' ? durationStr : `${firstDurationStr} ${durationStr}`;
    }

  },
  watch: {
    devicesMap: {
      handler: function temp(v) {
        if (v[this.id].length > 0) {
          if (v[this.id].map(item => item.checked).some(n => !n)) {
            this.checkAll = false;
          } else {
            this.checkAll = true;
          }
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.device-container {
  padding-bottom: 50px;
  border-radius: 8px;
  .tabs {
    padding: 0;
  }
  .table-empty {
    padding-top: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 180px;
      // display: none;
    }
  }
  .offline-handle-wrapper {
    display: flex;
    align-items: center;
    padding-top: 20px;
    // padding-bottom: 0;
    .check-info {
      .m-check-all-box {
        display: none;
      }
    }
    .off-more-message {
      min-width: 161px;
      height: 30px;
      border-radius: 4px;
      padding-right: 10px;
      background-color: #fffbe6;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
      margin-left: 20px;
      display: flex;
      align-items: center;
      border: 1px solid #ffe58f;
      img {
        width: 14px;
        margin: 0 5px 0 10px;
      }
    }
  }
  flex: auto;
  background: white;
  padding: 0 20px;
  .device-wrapper {
    flex: 1;
    .tab {
      font-size: 16px;
      font-weight: bold;
    }
    .title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
    }
    .table-inner {
      margin-top: 20px;
      ul,
      li {
        text-decoration: none;
        list-style: none;
        display: flex;
        color: #333333;
        font-size: 14px;
        overflow: hidden;
      }
      .table-head {
        ul {
          height: 50px;
          padding: 0 25px;
        }
      }
      .table-body {
        margin-bottom: 50px;
        .loading-container {
          display: flex;
          justify-content: center;
          padding: 30px 0;
        }
        ul {
          border-bottom: 1px solid #f1f1f1;
          padding: 15px 25px;
          &:nth-child(2n) {
            background: #f7f7f7;
          }
        }
      }
      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .column-check-box {
        width: 40px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .column-name {
        .name-wrap {
          &.offline {
            display: flex;
          }
          .device-name {
            max-width: 160px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .name_inner_a {
            position: relative;
            cursor: text;
            .current_visit_icon {
              position: absolute;
              top: 0.125rem;
              left: -1.25rem;
              margin: 0;
            }
          }
        }
        .mobile-icon {
          display: none;
        }
        width: 13.75rem;
        overflow: visible;
      }
      .column-ip,
      .column-online-duration {
        .pc-mac {
          display: block;
        }
        span:first-child {
          display: none;
        }
        width: 150px;
      }
      .column-mac {
        display: none;
        span:first-child {
          display: none;
        }
        width: 150px;
      }
      .device-item {
        .overflow-hidden {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &.offline {
          span {
            &:last-child {
              color: #999;
            }
          }
        }
      }
      .column-real-time {
        width: 8.125rem;
        .label {
          display: none;
        }
      }
      .column-band {
        width: 8.75rem;
        .label {
          display: none;
        }
        .value {
          span:last-child {
            margin-left: 2px;
          }
        }
      }
      .column-rssi {
        width: 155px;
      }
      .column-black-list {
        width: 230px;
        .btn-text {
          margin-right: 30px;
          &:last-child {
            margin-right: 0;
          }
        }
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
        .row {
          margin-right: 10px;
          display: inline-block;
          line-height: 1;
          .label {
            display: none;
          }
        }
        span {
          &:first-child {
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid #333;
          }
        }
      }
      .name-inner {
        display: flex;
        justify-content: flex-start;
        a {
          flex: 1;
          text-align: left;
          display: flex;
          cursor: pointer;
          align-items: baseline;
          span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
            max-width: 200px;
            flex-shrink: 0;
          }
          img {
            width: 14px;
            margin-left: 5px;
            flex-shrink: 0;
          }
        }
        &.off-name {
          color: #999;
          a {
            span {
              max-width: 200px;
            }
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
            span:last-child {
              margin-left: 2px;
            }
          }
        }
      }
      .rssi-inner {
        display: flex;
        align-items: center;
        .item {
          text-align: left;
          display: flex;
          align-items: center;
          &.hidden {
            display: none;
          }
          span {
            text-align: left;
            color: #999999;
            font-size: 14px;
            cursor: default;
          }
          img {
            width: 11px;
            height: 8px;
            margin-left: 3px;
          }
          .icon {
            display: block;
          }
          .status {
            display: none;
          }
        }
        .item {
          margin-left: 10px;
          &:first-child {
            margin-left: 0;
          }
          .rssi-icon {
            display: block;
            height: 16px;
            &.bad {
              background: url(../../../assets/images/icon/ic_wifi_bad.png)
                no-repeat center;
              background-size: 100%;
              width: 16px;
            }
            &.normal {
              background: url(../../../assets/images/icon/ic_wifi_normal.png)
                no-repeat center;
              background-size: 100%;
              width: 16px;
            }
            &.good {
              background: url(../../../assets/images/icon/ic_wifi_good.png)
                no-repeat center;
              background-size: 100%;
              width: 16px;
            }
            &.connection-method {
              min-width: 45px;
              // max-width: 100px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              border-radius: 3px;
              border: solid 1px #333;
              color: #333;
              font-size: 12px;
              padding: 0 5px;
            }
            &.rssi-value {
              width: 65px;
              height: 20px;
              font-family: PingFangSC;
              font-size: 14px;
              line-height: normal;
              color: #333;
            }
          }
        }
      }
    }
  }
}
.edit-name-modal {
  .content {
    display: flex;
    flex-direction: column;
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
@media screen and (max-width: 768px) {
  .device-container {
    .table-empty {
      img {
        display: block;
      }
    }
    background: transparent;
    padding: 0 !important;
    .tabs {
      padding: 0 20px;
      .tab {
        font-size: 14px;
      }
    }
    .offline-handle-wrapper {
      flex-direction: column-reverse;
      padding: 10px 20px;
      border-bottom: 1px solid #f1f1f1;
      // padding-left: 0;
      .check-info {
        // padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding-bottom: 10px;
        width: 100%;
        .m-check-all-box {
          display: block;
          height: 18px;
        }
      }
      .btn {
        position: relative;
        right: 0;
      }
      .off-more-message {
        width: 100%;
        justify-content: center;
        margin-left: 0;
        margin-bottom: 10px;
      }
    }
    .device-wrapper {
      .title {
        border: none;
        padding: 0;
        font-size: 16px;
      }
      .table-inner {
        background: transparent;
        margin: 0;
        .column-check-box {
          width: auto;
          margin-left: 0;
          margin-right: 10px;
        }
        .table-head {
          display: none;
        }
        .table-body {
          ul {
            flex-direction: column;
            padding: 0;
            overflow: inherit;
            background: white;
            border-radius: 3px;
            margin: 0 20px;
            width: auto;
            border: none;
            &:nth-child(2n) {
              background: #fff;
            }
            &.expand {
              margin: 0;
              padding: 0 20px;
              background: #f1f1f1;
              position: relative;
              .name-wrap {
                &.wired {
                  height: 120px;
                }
                &.offline {
                  height: 60px;
                  .column-check-box {
                    position: absolute;
                    z-index: 100;
                    left: 20px;
                  }
                }
              }
              .column-name {
                border: 0;
                position: static;
              }
              .name-inner {
                background: #fff;
                padding: 0 20px;
                &.off-name {
                  // padding: 0;
                  left: 0 !important;
                  a {
                    margin-left: 28px;
                  }
                }
              }
            }
            li {
              border-bottom: 1px solid #e0e0e0;
              background: #f1f1f1;
            }
          }
        }
        .small-device-body {
          margin-bottom: 50px;
          .name-inner {
            a {
              &:hover {
                text-decoration: none;
              }
              span {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: pre;
                max-width: 130px;
              }
              img {
              }
            }
            &.off-name {
              color: #333;
              a {
                span {
                  max-width: 200px;
                }
              }
            }
          }
          .column-name {
            // border: 0;
            .mobile-icon {
              display: block;
              display: flex;
              align-items: center;
              // padding-right: 20px;
              img {
                width: 14px;
                height: 7px;
                transition: all 0.3s;
                &.i-collapse {
                  transform: rotate(180deg);
                }
                &.i-expand {
                  transform: rotate(0deg);
                }
              }
            }
            width: 100%;
            background: white;
            border-radius: 3px;
            position: relative;
            overflow: inherit;
            .name-wrap {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              height: 60px;
              .name-inner {
                // height: 120px;
                display: flex;
                position: absolute;
                align-items: center;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                .name_inner_a {
                  cursor: text;
                  position: relative;
                  .current_visit_icon {
                    position: absolute;
                    top: 0.1875rem;
                    left: -1.1875rem;
                    margin: 0;
                  }
                }
                &.off-name {
                  // padding-left: 28px;
                  left: 28px;
                  // right: 20px;
                  // width: auto;
                }
              }
              .des-inner {
                width: 100%;
                background: #f1f1f1;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                margin-top: 60px;
                .row {
                  border-bottom: 1px solid #e1e1e1;
                  align-items: center;
                  display: flex;
                  width: 100%;
                  justify-content: space-between;
                  height: 60px;
                  padding: 0;
                  .label {
                    padding: 0;
                    display: block;
                  }
                }
                span {
                  border: 0;
                  margin: 0;
                }
              }
            }
          }
          .column-real-time {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .label {
              display: block;
            }
            .speed-inner {
              display: flex;
              flex-direction: row;
              .speed-wrap {
                display: flex;
                justify-content: center;
                position: relative;
                .icon {
                  margin: 0;
                }
                .text-inner {
                  padding-left: 2px;
                }
                &:last-child {
                  margin: 0;
                  margin-left: 10px;
                }
              }
            }
          }
          .column-band {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .label {
              display: block;
            }
            .value {
              span {
                display: inline-block;
              }
            }
          }
          .column-ip,
          .column-online-duration {
            .pc-mac {
              display: none;
            }
            span:first-child {
              display: block;
            }
          }
          .column-mac {
            display: block;
            span:first-child {
              display: block;
            }
          }
          .device-item {
            height: 60px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.offline {
              span {
                &:last-child {
                  color: #333;
                }
              }
            }
          }
          .column-rssi {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .rssi-inner {
            justify-content: flex-end;
            .item {
              margin-left: 0;
              span {
                color: #333333;
                &:hover {
                  text-decoration: none;
                }
              }
              .icon {
                width: 11px;
                display: none;
              }
              .status {
                display: block;
                display: flex;
                align-items: center;
                img {
                  width: 7px;
                  height: 12px;
                  margin-left: 10px;
                }
              }
            }
            .rssi-value {
              text-align: right;
            }
            .item:nth-child(1) {
              margin-right: 10px;
            }
            .item:nth-child(2) {
              // margin-right: 10px;
            }
            .item:nth-child(3) {
            }
          }
          .column-black-list {
            width: 100%;
            padding: 15px 0;
            display: flex;
            justify-content: center;
            padding-top: 30px !important;
            padding-bottom: 30px !important;
            border: 0;
          }
          .li-expand {
            display: block;
          }
          .li-collapse {
            display: none;
          }
        }
      }
    }
  }
}
</style>
