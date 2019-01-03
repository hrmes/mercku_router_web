<template>
  <div class="device-container">
    <div class="device-wrapper">
      <!-- <div class="title">{{$t('trans0235')}}</div> -->
      <div class="tabs">
        <div v-for="tab in tabs"
             class="tab"
             :class="{'tab-active':tab.id===id}"
             @click="tabChange(tab.id)"
             :key="tab.id">{{tab.text}}</div>
      </div>
      <div class="table-inner">
        <div class="table-head">
          <ul>
            <li class="column-name">
              <div class="column-icon"></div>
              {{$t('trans0005')}}
            </li>
            <li class="column-real-time">{{$t('trans0367')}}</li>
            <li class="column-band">{{$t('trans0015')}}</li>
            <li class="column-ip">{{$t('trans0151')}} / {{$t('trans0188')}}</li>
            <!-- <li class="column-mac">{{$t('trans0188')}}</li> -->
            <li class="column-limit">{{$t('trans0368')}}</li>
            <li class="column-black-list">{{$t('trans0370')}}</li>
          </ul>
        </div>
        <div class="table-body small-device-body">
          <ul v-for="(row,i) in filterDevices"
              :key='i'>
            <li class="column-name"
                @click.stop="expandTable(row)">
              <div class="column-icon">
                <div class="icon-inner">
                  <i class="band"
                     v-if="row.online_info.band==='wired'">
                    <img src="../../../assets/images/ic_device_cable@2x.png"
                         alt=""></i>
                  <i class="band"
                     v-else><img src="../../../assets/images/ic_equipment.png"
                         alt=""></i>
                </div>
              </div>
              <div class="name-wrap">
                <div class="name-inner">
                  <a style="cursor:text">
                    <img v-if='row.local'
                         src="../../../assets/images/ic_user.png"
                         alt=""
                         style="margin-right:5px;margin-left:0;">
                    <span :title='row.name'
                          :class="{'extand-name':row.expand}">{{row.name}}</span>
                    <img style="cursor:pointer"
                         @click.stop='()=>nameModalOpen(row)'
                         v-if='isMobileRow(row.expand)'
                         src="../../../assets/images/ic_edit.png"
                         alt="">
                  </a>
                </div>
                <div class="des-inner"
                     v-if='isMobileRow(row.expand)'>
                  <span> {{bandMap[`${row.online_info.band}`]}}</span>
                  <span v-if="row.online_info.band!=='wired'">
                    {{transformDate(row.online_info.online_duration)}}</span>
                </div>
              </div>
              <div class="mobile-icon">
                <img :class="{'i-collapse':row.expand,'i-expand':!row.expand}"
                     src="../../../assets/images/ic_side_bar_pick_up.png"
                     alt="">
              </div>
            </li>
            <li class="column-real-time"
                v-if='isMobileRow(row.expand)'>
              <div class="speed-inner">
                <div class="speed-wrap">
                  <img class='icon'
                       src="../../../assets/images/ic_device_upload.png"
                       alt="">
                  <label class="text-inner">
                    <span>
                      {{formatSpeed(row.online_info.realtime_speed.up).value}}</span>
                    <span>
                      {{formatSpeed(row.online_info.realtime_speed.up).unit}}/s</span>
                  </label>
                </div>
                <div class="speed-wrap">
                  <img class='icon'
                       src="../../../assets/images/ic_device_download.png"
                       alt="">
                  <label class="text-inner">
                    <span>{{formatSpeed(row.online_info.realtime_speed.down).value}}</span>
                    <span>{{formatSpeed(row.online_info.realtime_speed.down).unit}}/s</span>
                  </label>
                </div>
              </div>
            </li>
            <li class="column-band"
                v-if='isMobileRow(row.expand)'>
              <span>{{$t('trans0015')}}</span>
              <span>
                {{formatNetworkData(row.online_info.traffic.ul+row.online_info.traffic.dl).value}}
              </span>
              <span> {{formatNetworkData
                (row.online_info.traffic.ul+row.online_info.traffic.dl).unit}}</span>
            </li>
            <li class="column-ip device-item"
                v-if='isMobileRow(row.expand)'>
              <span>{{$t('trans0151')}}</span>
              <span> {{row.ip}} <br /><span class="pc-mac">{{formatMac(row.mac)}}</span></span>
            </li>
            <li class="column-mac device-item"
                v-if='isMobileRow(row.expand)'>
              <span>{{$t('trans0188')}}</span>
              <span>{{formatMac(row.mac)}}</span>
            </li>
            <li class="column-limit"
                v-if='isMobileRow(row.expand)'>
              <div class="limit-inner">
                <div class="item device-item"
                     @click="()=>limitClick('time',row)">
                  <span class="limit-icon time-limit"
                        v-show="!isMobile"
                        :class="{'active':isTimeLimit(row)}"></span>
                  <span v-show="isMobile">{{$t('trans0075')}}</span>
                  <span class="status">
                    <span>{{isTimeLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    <img src="../../../assets/images/ic_inter.png"
                         alt="">
                  </span>
                </div>
                <div class="item device-item"
                     @click="()=>limitClick('speed',row)">
                  <span class="limit-icon speed-limit"
                        v-show="!isMobile"
                        :class="{'active':isSpeedLimit(row)}"></span>
                  <span v-show="isMobile">{{$t('trans0014')}}</span>
                  <span class="status">
                    <span>{{isSpeedLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    <img src="../../../assets/images/ic_inter.png"
                         alt="">
                  </span>
                </div>
                <div class="item device-item"
                     @click="()=>limitClick('blacklist',row)">
                  <span class="limit-icon url-limit"
                        v-show="!isMobile"
                        :class="{'active':isBlacklsitLimit(row)}"></span>
                  <span v-show="isMobile">{{$t('trans0076')}}</span>
                  <span class="status">
                    <span>{{isBlacklsitLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    <img src="../../../assets/images/ic_inter.png"
                         alt="">
                  </span>
                </div>
              </div>
            </li>
            <li class="column-black-list"
                v-if='isMobileRow(row.expand)'>
              <span class="black-btn"
                    @click="()=>addToBlackList(row)">
                {{$t('trans0016')}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="edit-name-modal"
         v-if="modalShow">
      <div class="opcity"></div>
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
    </div>
  </div>
</template>
<script>
import { BlacklistMode } from 'util/constant';
import { formatMac, getStringByte, formatDate } from 'util/util';

export default {
  data() {
    return {
      tabs: [
        {
          id: '1',
          text: this.$t('trans0514')
        },
        {
          id: '2',
          text: this.$t('trans0515')
        },
        {
          id: '3',
          text: this.$t('trans0516')
        }
      ],
      BlacklistMode,
      formatMac,
      isMobile: false,
      modalShow: false,
      row: {},
      devices: [],
      localDeviceIP: '',
      timer: null,
      form: {
        name: ''
      },
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      },
      rules: {
        name: [
          {
            rule: value => !value.match(/^\s*$/),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ]
      }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    devicesParams() {
      let params = {
        filters: []
      };
      if (this.id === '1') {
        params = {
          filters: [{ type: 'primary', status: ['online'] }]
        };
      }
      if (this.id === '2') {
        params = {
          filters: [
            {
              type: 'guest',
              status: ['online']
            }
          ]
        };
      }
      if (this.id === '3') {
        params = {
          filters: [
            {
              type: 'guest',
              status: ['offline']
            },
            { type: 'primary', status: ['offline'] }
          ]
        };
      }
      return params;
    },
    filterDevices() {
      const arr = this.devices
        .map(v => {
          if (v.ip === this.localDeviceIP) {
            return { ...v, local: true };
          }
          return { ...v, local: false };
        })
        .sort((a, b) => {
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
        });
      return arr;
    }
  },
  mounted() {
    const that = this;
    this.getIsMobile(that);
    window.onresize = function temp() {
      const w = that.windowWidth();
      if (w <= 768) {
        that.isMobile = true;
      } else {
        that.isMobile = false;
      }
    };
    this.getDeviceList(this.devicesParams);
    this.getLocalDevice();
  },
  destroyed() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  methods: {
    tabChange(id) {
      clearTimeout(this.timer);
      this.timer = null;
      this.$router.push(`/dashboard/device/${id}`);
      this.getDeviceList(this.devicesParams);
    },
    isMobileRow(expand) {
      return this.isMobile ? expand : true;
    },
    isTimeLimit(row) {
      if (row.time_limit && row.time_limit.length > 0) {
        return row.time_limit.some(v => v.enabled);
      }
      return false;
    },
    isBlacklsitLimit(row) {
      return (
        row.parent_control
        && row.parent_control.mode === BlacklistMode.blacklist
      );
    },
    isSpeedLimit(row) {
      return row.speed_limit && row.speed_limit.enabled;
    },
    limitClick(type, row) {
      this.$router.push({ path: `/limit/${type}/${row.mac}` });
      this.$store.state.limits[type] = row;
    },
    expandTable(row) {
      if (this.isMobile) {
        this.devices.forEach(v => {
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
    getLocalDevice() {
      this.$http.getLocalDevice().then(res => {
        this.localDeviceIP = res.data.result.ip;
      });
    },
    getDeviceList(params) {
      this.$http
        .getDeviceList(params)
        .then(res => {
          this.timer = setTimeout(() => {
            this.getDeviceList(params);
          }, 15 * 1000);
          if (res.data.result && res.data.result.length > 0) {
            const result = res.data.result.map(v => ({ ...v, expand: false }));
            if (this.isMobile && this.devices.length > 0) {
              this.devices.forEach(n => {
                result.forEach(m => {
                  if (n.mac === m.mac) {
                    m.expand = n.expand;
                  }
                });
              });
            }
            this.devices = result;
          }
        })
        .catch(() => {
          this.timer = setTimeout(() => {
            this.getDeviceList(params);
          }, 15 * 1000);
        });
    },
    updateDeviceName() {
      if (this.$refs.form.validate()) {
        const params = {
          device: {
            name: this.form.name,
            mac: this.row.mac
          }
        };
        this.$http.meshDeviceUpdate({ ...params }).then(() => {
          this.$toast(this.$t('trans0040'), 3000, 'success');
          this.devices = this.devices.map(v => {
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
      const params = {
        devices: [{ mac: row.mac, name: row.name }]
      };
      this.$dialog.confirm({
        okText: this.$t('trans0024'),
        cancelText: this.$t('trans0025'),
        message: this.$t('trans0036'),
        callback: {
          ok: () => {
            this.$loading.open();
            this.$http
              .addToblackList({
                ...params
              })
              .then(() => {
                this.devices = this.devices.filter(v => v.mac !== row.mac);
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
    transformDate(date) {
      if (date < 0) {
        return '-';
      }
      const split = [3600 * 24, 3600, 60, 5];
      if (date > split[0]) {
        const now = new Date().getTime();
        return formatDate(now - date * 1000);
      }
      if (date <= split[0] && date > split[1]) {
        return `${this.$t('trans0013').replace(
          '%d',
          parseInt(date / split[1], 10)
        )}`;
      }
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace(
          '%d',
          parseInt(date / split[2], 10)
        )}`;
      }
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace(
          '%d',
          parseInt(date / split[3], 10)
        )}`;
      }
      return `${this.$t('trans0010')}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.device-container {
  padding-bottom: 50px;
  border-radius: 8px;
  .edit-name-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1001;
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
    .tabs {
      height: 60px;
      display: flex;
      border-bottom: 1px solid #f1f1f1;
      .tab {
        cursor: pointer;
        font-size: 16px;
        color: #333;
        height: 60px;
        width: 200px;
        line-height: 60px;
        padding-left: 10px;
        font-weight: bold;
        &.tab-active {
          color: #d6001c;
          border-bottom: 3px solid #d6001c;
          &:hover {
            background: transparent;
            color: #d6001c;
          }
        }
        &:hover {
          background: #f1f1f1;
          color: #999999;
        }
      }
    }
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
        margin-bottom: 50px;
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
        .mobile-icon {
          display: none;
        }
        width: 250px;
      }
      .column-ip {
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
      .column-real-time {
        width: 150px;
      }
      .column-band {
        width: 100px;
        span:first-child {
          display: none;
        }
      }
      .column-limit {
        width: 120px;
      }
      .column-black-list {
        width: 120px;
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
        // align-items: end;
        justify-content: flex-start;
        a {
          flex: 1;
          text-align: left;
          display: flex;
          cursor: pointer;
          align-items: baseline;

          // &:hover {
          //   text-decoration: underline;
          // }
          span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
            max-width: 130px;
            flex-shrink: 0;
          }
          img {
            width: 14px;
            margin-left: 5px;
            flex-shrink: 0;
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
        display: flex;
        align-items: center;
        .item {
          text-align: left;
          display: flex;
          align-items: center;
          span {
            text-align: left;
            cursor: pointer;
            color: #999999;
            font-size: 12px;
            &:hover {
              color: #333333;
              text-decoration: underline;
            }
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
          .limit-icon {
            display: block;
            width: 23px;
            height: 23px;
            &.time-limit {
              background: url(../../../assets/images/ic_limit_time_close.png)
                no-repeat center;
              background-size: 100%;
              &.active {
                background: url(../../../assets/images/ic_limit_time.png)
                  no-repeat center;
                background-size: 100%;
              }
            }
            &.speed-limit {
              background: url(../../../assets/images/ic_limit_speed_close.png)
                no-repeat center;
              background-size: 100%;
              &.active {
                background: url(../../../assets/images/ic_limit_speed.png)
                  no-repeat center;
                background-size: 100%;
              }
            }
            &.url-limit {
              background: url(../../../assets/images/ic_limit_website_close.png)
                no-repeat center;
              background-size: 100%;
              &.active {
                background: url(../../../assets/images/ic_limit_website.png)
                  no-repeat center;
                background-size: 100%;
              }
            }
          }
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
    .edit-name-modal {
      .content {
        width: 295px;
        height: 229px;
        border-radius: 5px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
          0 2px 4px 0 rgba(0, 0, 0, 0.12);
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
            width: 255px;
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
        padding: 0;
        font-size: 16px;
      }
      .table-inner {
        background: transparent;
        margin: 0;
        .column-icon {
          width: 40px;
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
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 3px;
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
                &.extand-name {
                  font-size: 18px;
                }
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: pre;
                max-width: 130px;
              }
              img {
              }
            }
          }
          .column-name {
            .mobile-icon {
              display: block;
              display: flex;
              align-items: center;
              // padding-right: 20px;
              img {
                width: 14px;
                height: 7px;
                opacity: 0.7;
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
            height: 60px;
            position: relative;
            overflow: inherit;
            .name-wrap {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              .des-inner {
                position: absolute;
                top: 45px;
                z-index: 111;
                span {
                }
              }
            }

            .column-icon {
              justify-content: flex-start;
              img {
                width: 26px;
                height: 26px;
              }
            }
          }
          .column-real-time {
            margin-top: 50px;
            margin-bottom: 20px;
            width: 100%;
            // padding-left: 20px;
            .speed-inner {
              width: 100%;
              display: flex;
              flex-direction: row;
              .speed-wrap {
                // flex: 1;
                padding-right: 20px;
                display: flex;
                justify-content: center;
                position: relative;
                .text-inner {
                  padding-left: 5px;
                  span:first-child {
                    font-size: 20px;
                  }
                  span:last-child {
                    font-size: 16px;
                  }
                }
                &:first-child ::after {
                  content: '';
                  position: absolute;
                  height: 10px;
                  width: 1px;
                  background: #999999;
                  right: 0;
                  top: 10px;
                }
                &:last-child {
                  margin: 0;
                  margin-left: 20px;
                }
              }
            }
          }
          .column-band {
            width: 100%;
            // padding-left: 20px;
            padding-bottom: 30px;
            span {
              line-height: 30px;
            }
            span:first-child {
              display: block;
              font-size: 14px;
              letter-spacing: -0.6px;
              padding-right: 10px;
            }
            span:nth-child(2) {
              font-size: 20px;
              padding-right: 5px;
            }
          }
          .column-ip {
            .pc-mac {
              display: none;
            }
            border-top: 1px solid #f1f1f1;
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
            border-bottom: 1px solid #f1f1f1;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .column-limit {
            width: 100%;
          }
          .limit-inner {
            width: 100%;
            flex-direction: column;
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
            .item:nth-child(1) {
              .time-active {
                &:hover {
                  color: none;
                  text-decoration: none;
                }
              }
            }
            .item:nth-child(2) {
              .speed-active {
                &:hover {
                  color: none;
                  text-decoration: none;
                }
              }
            }
            .item:nth-child(3) {
              .black-active {
                &:hover {
                  color: none;
                  text-decoration: none;
                }
              }
            }
          }
          .column-black-list {
            width: 100%;
            padding-top: 60px;
            padding-bottom: 50px;
            display: flex;
            justify-content: center;
            .black-btn {
              display: block;
              width: 255px;
              height: 58px;
              border-radius: 4px;
              border: solid 1px #ff0500;
              color: #ff0500;
              text-align: center;
              line-height: 58px;
              cursor: pointer;
              &:hover {
                text-decoration: none;
              }
            }
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
