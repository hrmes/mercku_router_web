<template>
  <div class="device-container">
    <div class="device-wrapper">
      <m-tabs>
        <m-tab :key="tab.id"
               @click.native="tabChange(tab.id)"
               v-for="tab in tabs"
               :class="{'selected':isCurrentTab(tab)}">
          <i class="iconfont icon"
             :class="tab.icon"></i>
          <span> {{tab.text}}</span>
        </m-tab>
      </m-tabs>
      <div class="table-inner">
        <div class="table-head">
          <ul class="reset-ul">
            <li class="column-name">
              <div class="column-check-box"
                   v-if="isOfflineDevices">
                <m-checkbox v-model="checkAll"
                            @change="offCheckChange"></m-checkbox>
              </div>
              {{$t('trans0005')}}
            </li>
            <!-- 连接设备 -->
            <li class="column-real-time"
                v-if="!isOfflineDevices">{{$t('trans0618')}}</li>
            <li class="column-real-time"
                v-if="!isOfflineDevices">{{$t('trans0367')}}</li>
            <li class="column-band"
                v-if="!isOfflineDevices">{{$t('trans0015')}}</li>
            <li class="column-ip"
                v-if="!isOfflineDevices">{{$t('trans0151')}} /
              {{$t('trans0188')}}</li>
            <!-- 在线时长 -->
            <li class="column-ip"
                v-if="isOfflineDevices">
              {{$t('trans0631')}}</li>
            <!-- 离线时间 -->
            <li class="column-ip"
                v-if="isOfflineDevices">
              {{$t('trans0630')}}</li>
            <li class="column-ip"
                v-if="isOfflineDevices">
              {{$t('trans0188')}}</li>
            <li class="column-limit"
                v-if="!isOfflineDevices && isRouter">{{$t('trans0115')}}</li>
            <li class="column-black-list"
                v-if="!isOfflineDevices && isRouter"></li>
            <li class="column-black-list"
                v-if="isOfflineDevices">
              <div>
                <button class="btn btn-small"
                        :disabled="!offlineCheckedMacs.length"
                        @click="delOfflineDevices(offlineCheckedMacs)">
                  {{$t('trans0033')}}
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div class="table-body small-device-body">
          <div class="offline-handle-wrapper"
               v-if="isMobile&&isOfflineDevices">
            <div class="check-info">
              <div class="m-check-all-box">
                <m-checkbox v-model="checkAll"
                            :text="$t('trans0032')"
                            @change="offCheckChange"></m-checkbox>
              </div>
              <div v-if="isMobile">
                <button class="btn btn-small"
                        :disabled="!offlineCheckedMacs.length"
                        @click="delOfflineDevices(offlineCheckedMacs)">
                  {{$t('trans0033')}}</button>
              </div>
            </div>
            <div class="off-more-message"
                 v-if="devicesMap[id]&&devicesMap[id].length>60">
              <img src="../../../assets/images/icon/ic_hint.png"
                   alt="">
              {{$t('trans0517')}}
            </div>
          </div>
          <div class="loading-container"
               v-if="showLoading">
            <m-loading :color="loadingColor"></m-loading>
          </div>

          <div v-show="!showLoading">
            <ul v-for="(row,i) in devicesMap[id]"
                :key='i'
                :class="{'expand':row.expand}"
                class="reset-ul">
              <li class="column-name"
                  @click.stop="expandTable(row)">
                <div class="column-check-box"
                     v-if="isOfflineDevices">
                  <m-checkbox :stopPropagation="true"
                              v-model="row.checked"></m-checkbox>
                </div>
                <div v-if="!isMobile"
                     class="connect-type-wrap">
                  <img :src="getConnectTypeIcon(row)"
                       alt="">
                </div>
                <div class="name-wrap"
                     :class="{'wired':isWired(row),'offline':isOfflineDevices}">
                  <div class="name-inner"
                       :class="{'off-name':isOfflineDevices}">
                    <a style="cursor:text">
                      <span v-if='row.local &&!isOfflineDevices'
                            class="local-device-wrapper">
                        <img class="localDevice"
                             src="../../../assets/images/icon/ic_local-device.svg"
                             alt=""
                             title="LocalDevice">
                      </span>
                      <span :title='row.name'>{{row.name}}</span>
                      <img style="cursor:pointer"
                           class="btn-text icon-btn"
                           :title="$t('trans0034')"
                           @click.stop='()=>nameModalOpen(row)'
                           v-if='isMobileRow(row.expand)&&!isOfflineDevices'
                           src="../../../assets/images/icon/ic_edit.png"
                           alt="">
                    </a>
                    <div class="mobile-icon">
                      <img :class="{'i-collapse':row.expand,'i-expand':!row.expand}"
                           src="../../../assets/images/icon/ic_side_bar_pick_up.svg"
                           alt="">
                    </div>
                  </div>
                  <div class="des-inner"
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
                  </div>
                </div>
              </li>
              <!-- 连接设备 -->
              <li class="column-ip device-item"
                  v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                <span class="label">{{$t('trans0618')}}</span>
                <span class="overflow-hidden"
                      :title="accessNodeName(row)">{{accessNodeName(row)}}</span>
              </li>
              <li class="column-real-time"
                  v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
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
              <li class="column-band"
                  v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                <span class="label">{{$t('trans0015')}}</span>
                <span class="value">
                  <i class="iconfont icon-ic_device_throughput"></i>
                  <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).value}}</span>
                  <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).unit}}</span>
                </span>
              </li>
              <li class="column-ip device-item"
                  v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                <span class="label">{{$t('trans0151')}}</span>
                <span> {{row.ip}} <br /><span class="pc-mac">{{formatMac(row.mac)}}</span></span>
              </li>
              <!-- 在线时长 -->
              <li class="column-ip device-item"
                  :class="{'offline':isOfflineDevices}"
                  v-if='isMobileRow(row.expand)&&isOfflineDevices'>
                <span class="label">{{$t('trans0631')}}</span>
                <span> {{transformDuration(row.online_info.online_duration)}} </span>
              </li>
              <!-- 离线时间 -->
              <li class="column-ip device-item"
                  :class="{'offline':isOfflineDevices}"
                  v-if='isMobileRow(row.expand)&&isOfflineDevices'>
                <span class="label">{{$t('trans0630')}}</span>
                <span> {{transformOfflineDate(row.offline_time)}} </span>
              </li>
              <li class="column-ip device-item"
                  :class="{'offline':isOfflineDevices}"
                  v-if='isMobileRow(row.expand)&&isOfflineDevices'>
                <span class="label">{{$t('trans0188')}}</span>
                <span>{{formatMac(row.mac)}}</span>
              </li>
              <li class="column-mac device-item"
                  v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                <span class="label">{{$t('trans0188')}}</span>
                <span>{{formatMac(row.mac)}}</span>
              </li>
              <li class="column-limit"
                  v-if='isMobileRow(row.expand) && !isOfflineDevices && isRouter'>
                <div class="limit-inner">
                  <div class="item device-item">
                    <i class="limit-icon time-limit iconfont icon-ic_limit_time_off"
                       :title="$t('trans0075')"
                       v-if="!isMobile"
                       :class="{'active':isTimeLimit(row)}"></i>
                    <span v-if="isMobile"
                          class="label">{{$t('trans0075')}}</span>
                    <span class="status">
                      <span>{{isTimeLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    </span>
                  </div>
                  <div class="item device-item">
                    <i class="limit-icon speed-limit iconfont icon-ic_limit_speed_off"
                       :title="$t('trans0014')"
                       v-if="!isMobile"
                       :class="{'active':isSpeedLimit(row)}"></i>
                    <span v-if="isMobile"
                          class="label">{{$t('trans0014')}}</span>
                    <span class="status">
                      <span>{{isSpeedLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    </span>
                  </div>
                  <div class="item device-item">
                    <i class="limit-icon url-limit iconfont icon-ic_limit_website_off"
                       v-if="!isMobile"
                       :title="$t('trans0076')"
                       :class="{'active':isBlacklsitLimit(row)}"></i>
                    <span v-if="isMobile"
                          class="label">{{$t('trans0076')}}</span>
                    <span class="status">
                      <span>{{isBlacklsitLimit(row)?$t('trans0041'):$t('trans0017')}}</span>
                    </span>
                  </div>
                </div>
              </li>
              <li class="column-black-list"
                  v-if='isMobileRow(row.expand) && !isOfflineDevices && isRouter'>
                <span class="btn-icon"
                      @click="()=>addToBlackList(row)">
                  <i class="add-to-block iconfont icon-ic_blocklist_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0016')}}</span>
                </span>
                <span v-if="isMobile"
                      class="label"
                      @click="()=>addToBlackList(row)">
                  {{$t('trans0016')}}
                </span>
                <span class="btn-icon"
                      @click="()=>forward2limit(row)">
                  <i class="settings iconfont icon-ic_settings_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0019')}}</span>
                </span>
                <span v-if="!isOfflineDevices&&isMobile"
                      class="label"
                      @click="()=>forward2limit(row)">
                  {{$t('trans0019')}}
                </span>
              </li>
              <li class="column-black-list"
                  :class="{'off-btn-handle-info':isOfflineDevices}"
                  v-if='isMobileRow(row.expand) && isOfflineDevices'>
                <span v-if="isOfflineDevices"
                      class="btn-icon"
                      @click="()=>delOfflineDevices([row.mac])">
                  <i class="add-to-block iconfont icon-ic_trash_normal"></i>
                  <span class="icon-hover-popover"> {{$t('trans0033')}}</span>
                </span>
                <span v-if="isMobile&&isOfflineDevices"
                      @click="()=>delOfflineDevices([row.mac])"
                      class="label">{{$t('trans0033')}}</span>
              </li>
            </ul>
            <div class='table-empty'
                 v-if="!devicesMap[id]||(devicesMap[id]&&devicesMap[id].length===0)">
              <img src="../../../assets/images/img_default_empty.webp"
                   alt="">
              <span>{{$t('trans0278')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <m-modal :visible.sync="modalShow"
             :closeOnClickMask="false"
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
import { formatMac, getStringByte, formatDate, formatDuration } from 'base/util/util';
import { BlacklistMode, RouterMode } from 'base/util/constant';

export default {
  data() {
    return {
      showLoading: false,
      BlacklistMode,
      formatMac,
      checkAll: false,
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
            rule: value => !value.match(/^\s*$/),
            message: this.$t('trans0237')
          },
          {
            rule: value => getStringByte(value) <= 20,
            message: this.$t('trans0261')
          }
        ]
      },
      pageActive: true
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
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
    isRouter() {
      return RouterMode.router === this.$store.state.mode;
    },
    isOfflineDevices() {
      return this.id === 'offline';
    },
    tabs() {
      const list = [
        {
          id: 'primary',
          text: this.$t('trans0514'),
          icon: 'icon-ic_devices_mywifi_normal'
        },
        {
          id: 'offline',
          text: this.$t('trans0516'),
          icon: 'icon-ic_devices_offline_normal'
        }
      ];
      if (this.isRouter) {
        list.splice(1, 0, {
          id: 'guest',
          text: this.$t('trans0515'),
          icon: 'icon-ic_devices_guest_normal'
        });
      }
      return list;
    }
  },
  async mounted() {
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
    isTimeLimit(row) {
      if (row.time_limit && row.time_limit.length > 0) {
        return row.time_limit.some(v => v.enabled);
      }
      return false;
    },
    isBlacklsitLimit(row) {
      return row.parent_control && row.parent_control.mode === BlacklistMode.blacklist;
    },
    isSpeedLimit(row) {
      return row.speed_limit && row.speed_limit.enabled;
    },
    forward2limit(row) {
      const limits = {
        deviceName: row.name,
        parent_control: row.parent_control,
        speed_limit: row.speed_limit,
        time_limit: row.time_limit ? row.time_limit.map(v => ({ ...v, expand: false })) : undefined
      };
      this.$store.state.modules.limits[row.mac] = limits;
      sessionStorage.setItem('deviceName', limits.deviceName);
      this.$router.push({ path: `/limit/${row.mac}` });
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
      let timeArr = formatDuration(zone);
      let suffixs = [
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
      const first = timeArr.findIndex(val => val); // 找到第一个有值的日期
      const suffix = suffixs[first];
      const last = first + suffix.limitBefore + 1;
      timeArr = timeArr.slice(first, last);
      suffixs = suffixs.slice(first, last);
      let durationStr = '';
      suffixs.forEach((item, i) => {
        if (timeArr[i]) {
          durationStr += `${timeArr[i]} ${this.$t(suffixs[i].text)} `;
        }
      });
      return durationStr;
    },
    getConnectTypeIcon(row) {
      let icon = '';
      if (this.isOfflineDevices) {
        if (this.isWired(row)) {
          icon = require('../../../assets/images/icon/ic_offline_wired.svg');
          return icon;
        }
        icon = require('../../../assets/images/icon/ic_offline_wireless.svg');
        return icon;
      }
      if (this.isWired(row)) {
        icon = require('../../../assets/images/icon/ic_wired.svg');
        return icon;
      }
      const { online_info: { rssi } } = row;
      if (rssi > -76) {
        icon = require('../../../assets/images/icon/ic_wireless_excellent.svg');
      } else if (rssi < -76 && rssi > -90) {
        icon = require('../../../assets/images/icon/ic_wireless_fair.svg');
      } else {
        icon = require('../../../assets/images/icon/ic_wireless_weak.svg');
      }
      return icon;
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
  border-radius: 10px;
  .tab {
    .icon {
      font-size: 18px;
      font-weight: 400;
      margin-right: 5px;
    }
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
    }
  }
  .offline-handle-wrapper {
    margin: 10px 10px 0px;
    padding: 10px;
    display: flex;
    align-items: center;
    background: var(--table-row-background-color);
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
      margin-top: 10px;
      ul,
      li {
        text-decoration: none;
        list-style: none;
        display: flex;
        font-size: 14px;
        // overflow: hidden;
      }
      .table-head {
        height: 50px;
        border-radius: 10px;
        background: var(--table-row-background-color);
        width: 100%;
        margin-bottom: 5px;
        ul {
          height: 50px;
          padding: 0 15px;
          color: var(--table-header-text-color);
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
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 5px;
          color: var(--text-default-color);
          background: var(--table-row-background-color);
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
        width: 275px;
        position: relative;
        .connect-type-wrap {
          width: 50px;
          height: 50px;
          margin-right: 15px;
          border-radius: 50%;
          overflow: hidden;
          background-color: var(--table-body-connect-icon-bgc);
          > img {
            width: 100%;
            height: 100%;
          }
        }
        .name-wrap {
          &.offline {
            display: flex;
            color: var(--text-default-color);
          }
        }
        .mobile-icon {
          display: none;
        }
      }
      .column-ip {
        .pc-mac {
          display: block;
        }
        span:first-child {
          display: none;
        }
        width: 160px;
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
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .column-real-time {
        width: 170px;
        .label {
          display: none;
        }
      }
      .column-band {
        width: 150px;
        .label {
          display: none;
        }
        .value {
          display: flex;
          align-items: baseline;
          .iconfont {
            color: #ffa953;
            margin-right: 5px;
          }
          span:last-child {
            margin-left: 2px;
          }
        }
      }
      .column-limit {
        width: 120px;
      }
      .column-black-list {
        width: 230px;
        justify-content: flex-end;
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
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 12px;
            text-align: center;
            color: #fff;
            background: var(--dashboard-band-background-color);
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
          align-items: center;
          span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre;
            max-width: 185px;
            flex-shrink: 0;
            font-weight: 550;
          }
          > img {
            width: 15px;
            margin-left: 5px;
            flex-shrink: 0;
            filter: var(--img-brightness);
          }
          .local-device-wrapper {
            position: absolute;
            bottom: -3px;
            left: -3px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--table-local-device-icon-bgc);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: default;
            img {
              width: 70%;
              height: 70%;
            }
          }
        }
        &.off-name {
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
      .limit-inner {
        display: flex;
        align-items: center;
        .item {
          text-align: left;
          display: flex;
          align-items: center;
          span {
            text-align: left;
            font-size: 14px;
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
            color: var(--table-limit-icon-color);
            font-size: 20px;
            &.active {
              color: var(--primaryColor);
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
@media screen and (max-width: 1440px) {
  .device-container {
    .device-wrapper {
      .table-inner {
        .column-name {
          width: 275px;
        }
        .name-inner {
          a {
            span {
              max-width: 170px;
            }
          }
          &.off-name {
            a {
              span {
                max-width: 170px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .device-container {
    background: transparent;
    padding: 0 !important;
    .tabs {
      padding: 0 15px;
      .tab {
        font-size: 14px;
      }
    }
    .offline-handle-wrapper {
      flex-direction: column-reverse;
      .check-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        border-top: 1px solid var(--table-header-hr-color);
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
            padding: 0 10px;
            overflow: inherit;
            background: var(--table-row-background-color);
            border-radius: 3px;
            margin: 5px 10px;
            width: auto;
            border: none;
            > li,
            .name-inner {
              border-bottom: 1px solid transparent;
            }
            &.expand {
              position: relative;
              .name-wrap {
                height: 180px;
                &.wired {
                  height: 120px;
                }
                &.offline {
                  height: 60px;
                }
              }
              .column-name {
                border: 0;
                position: static;
              }
              .name-inner {
                padding: 0 10px;
                border-bottom-color: var(--table-body-hr-color);
                &.off-name {
                  left: 0 !important;
                  a {
                    margin-left: 28px;
                  }
                }
              }
              li {
                border-bottom-color: var(--table-body-hr-color);
                &:last-of-type {
                  border: 0;
                }
                .label {
                  color: var(--table-header-text-color);
                }
              }
            }
          }
        }
        .small-device-body {
          margin-bottom: 35px;
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
                max-width: 200px;
                font-weight: 400;
              }
            }
            &.off-name {
              color: var(--text-default-color);
              a {
                span {
                  max-width: 180px;
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
              img {
                width: 12px;
                height: 12px;
                transition: all 0.3s;
                filter: var(--img-brightness);
                &.i-collapse {
                  transform: rotate(90deg);
                }
                &.i-expand {
                  transform: rotate(0deg);
                }
              }
            }
            width: 100%;
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
                &.off-name {
                  // padding-left: 28px;
                  left: 28px;
                  // right: 20px;
                  // width: auto;
                }
              }
              .des-inner {
                width: 100%;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                margin-top: 60px;
                .row {
                  border-bottom: 1px solid var(--table-body-hr-color);
                  align-items: center;
                  display: flex;
                  width: 100%;
                  justify-content: space-between;
                  height: 60px;
                  padding: 0;
                  background: transparent;
                  .label {
                    color: var(--table-header-text-color);
                    background: transparent;
                    padding: 0;
                    display: block;
                  }
                }
                span {
                  color: var(--text-default-color);
                  font-size: 14px;
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
          .column-ip {
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
            border-bottom: 1px solid var(--table-body-hr-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            &:last-child {
              border: 0;
            }
          }
          .column-limit {
            width: 100%;
            border: 0;
          }
          .limit-inner {
            width: 100%;
            flex-direction: column;
            .item {
              margin-left: 0;
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
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-top: 25px !important;
            padding-bottom: 25px !important;
          }
          .li-expand {
            display: block;
          }
          .li-collapse {
            display: none;
          }
        }
        .name-inner {
          a {
            .local-device-wrapper {
              position: relative;
              left: 0;
              bottom: 0;
              margin-right: 5px;
              background: transparent;
              > img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 280px) {
  .device-container {
    .device-wrapper {
      .tab {
        .iconfont {
          display: block;
        }
      }
    }
  }
}
</style>
