<template>
  <div class="device">
    <div class="device-wrapper">
      <div class="back-wrap">
        <div v-if="hasBackWrap"
             class="btn-container"
             @click="onBack($route.meta.parentPath)">
          <i class="iconfont ic_back_large"></i>
        </div>
        <div v-if="isMobile"
             class="text-container">{{pageName}}</div>
        <m-tabs v-if="!isMobile">
          <m-tab :key="tab.id"
                 @click.native="tabChange(tab.id)"
                 v-for="tab in tabs"
                 :class="{'selected':isCurrentTab(tab)}">
            <i class="iconfont icon"
               :class="tab.icon"></i>
            <span> {{tab.text}}</span>
          </m-tab>
        </m-tabs>
      </div>
      <m-tabs v-if="isMobile">
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
        <div class="off-more-message"
             v-if="isOfflineDevices&&devicesMap[id]&&devicesMap[id].length>60">
          <img src="@/assets/images/icon/ic_hint.png"
               alt="">
          {{$t('trans0517')}}
        </div>
        <div class="table-head"
             v-if="!isMobile">
          <ul class="reset-ul"
              :class="{'offline':isOfflineDevices}">
            <!-- 离线列表的内容 -->
            <template v-if="isOfflineDevices">
              <!-- 设备名称 -->
              <li class="name">
                <div class="column-check-box">
                  <m-checkbox v-model="checkAll"
                              @change="offCheckChange"></m-checkbox>
                </div>
                {{$t('trans0005')}}
              </li>
              <!-- 在线时长 -->
              <li class="online-duration">
                {{$t('trans0631')}}</li>
              <!-- 离线时间 -->
              <li class="offline-time">
                {{$t('trans0630')}}</li>
              <!-- mac -->
              <li class="mac">
                {{$t('trans0188')}}</li>
              <!-- 删除按钮列 -->
              <li class="delete">
                <div>
                  <button class="btn btn-default btn-small"
                          :disabled="!offlineCheckedMacs.length"
                          @click="delOfflineDevices(offlineCheckedMacs)">
                    {{$t('trans0453')}}
                  </button>
                </div>
              </li>
            </template>
            <!-- 在线、访客列表的内容-->
            <template v-else>
              <!-- 设备名称 -->
              <li class="name">{{$t('trans0005')}}</li>
              <!-- 连接设备 -->
              <li class="connected-device">{{$t('trans0618')}}</li>
              <!-- 实时速率 -->
              <li class="speed">{{$t('trans0367')}}</li>
              <!-- 流量消耗 -->
              <li class="throughput">{{$t('trans0015')}}</li>
              <!-- IP/MAC -->
              <li class="ip-mac">{{$t('trans0151')}} / {{$t('trans0188')}}</li>
              <!-- 家长控制 -->
              <li class="control"
                  v-if=" isRouter">{{$t('trans0115')}}</li>
            </template>
          </ul>
        </div>
        <div class="table-body">
          <!-- 离线设备批量管理列 -->
          <div class="offline-handle-wrapper"
               v-if="isMobile && isOfflineDevices">
            <div class="check-info">
              <div class="m-check-all-box">
                <m-checkbox v-model="checkAll"
                            :text="$t('trans0174')"
                            @change="offCheckChange"></m-checkbox>
              </div>
              <div>
                <button class="btn btn-default btn-small"
                        :disabled="!offlineCheckedMacs.length"
                        @click="delOfflineDevices(offlineCheckedMacs)">
                  {{$t('trans0033')}}</button>
              </div>
            </div>
          </div>
          <div class="loading-container"
               v-if="showLoading">
            <m-loading :color="loadingColor"></m-loading>
          </div>
          <div v-else>
            <ul v-for="(row,i) in devicesMap[id]"
                :key='i'
                :class="{'expand':row.expand,
                         'offline':isOfflineDevices,
                         'online':!isOfflineDevices}"
                class="reset-ul">
              <!-- 离线列表体 -->
              <template v-if="isOfflineDevices">
                <!-- 设备名称 -->
                <li class="name"
                    @click.stop="expandTable(row)">
                  <div class="column-check-box">
                    <m-checkbox :stopPropagation="true"
                                v-model="row.checked"></m-checkbox>
                  </div>
                  <div v-if="!isMobile"
                       class="connect-type-wrap">
                    <img :src="getConnectTypeIcon(row)"
                         alt="">
                  </div>
                  <div class="name-wrap offline">
                    <div class="name-inner off-name">
                      <a style="cursor:text">
                        <span :title='row.name'>{{row.name}}</span>
                      </a>
                      <div class="mobile-icon"
                           v-if="isMobile">
                        <img :class="{'i-collapse':row.expand,'i-expand':!row.expand}"
                             src="@/assets/images/icon/ic_side_bar_pick_up.svg"
                             alt="">
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 在线时长 -->
                <li class="online-duration"
                    v-if='isMobileRow(row.expand)'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0631')}}</span>
                  <span> {{transformDuration(row.online_info.online_duration)}} </span>
                </li>
                <!-- 离线时间 -->
                <li class="offline-time"
                    v-if='isMobileRow(row.expand)'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0630')}}</span>
                  <span> {{transformOfflineDate(row.offline_time)}} </span>
                </li>
                <li class="mac"
                    v-if='isMobileRow(row.expand)'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0188')}}</span>
                  <span>{{formatMac(row.mac)}}</span>
                </li>
                <li class="delete"
                    v-if='isMobileRow(row.expand)'>
                  <span class="limit-icon"
                        @click="()=>delOfflineDevices([row.mac])">
                    <i class="iconfont ic_trash"></i>
                    <span class="hover-popover"> {{$t('trans0033')}}</span>
                  </span>
                </li>
              </template>
              <!-- 在线列表体 -->
              <template v-else>
                <!-- 设备名称 -->
                <li class="name"
                    @click.stop="expandTable(row)">
                  <div v-if="!isMobile"
                       class="connect-type-wrap">
                    <img :src="getConnectTypeIcon(row)" />
                    <span v-if='row.local'
                          class="local-device-wrapper">
                      <img class="localDevice"
                           src="@/assets/images/icon/ic_local-device.svg"
                           alt=""
                           title="LocalDevice">
                    </span>
                  </div>
                  <div class="name-wrap"
                       :class="{'wired':isWired(row)}">
                    <div class="name-inner">
                      <a style="cursor:text">
                        <span v-if='isMobile && row.local'
                              class="local-device-wrapper">
                          <img class="localDevice"
                               src="@/assets/images/icon/ic_local-device.svg"
                               alt=""
                               title="LocalDevice">
                        </span>
                        <span :title='row.name'
                              class="overflow-hidden">{{row.name}}</span>
                        <img style="cursor:pointer"
                             class="btn-text icon-btn"
                             :title="$t('trans0034')"
                             @click.stop='()=>nameModalOpen(row)'
                             src="@/assets/images/icon/ic_edit.png"
                             alt="">
                      </a>
                      <div class="mobile-icon"
                           v-if="isMobile">
                        <img :class="{'i-collapse':row.expand,'i-expand':!row.expand}"
                             src="@/assets/images/icon/ic_side_bar_pick_up.svg"
                             alt="">
                      </div>
                    </div>
                    <div class="des-inner">
                      <span class="band"
                            :class="{'wired':isWired(row)}">
                        <span class="value">{{bandMap[`${row.online_info.band}`]}}</span>
                      </span>
                      <span class="connect-quality"
                            v-if="isMobile & !isWired(row)">
                        <img :src="getConnectTypeIcon(row)" />
                      </span>
                      <span class="online-duration">
                        <span
                              class="value">{{transformDate(row.online_info.online_duration)}}</span>
                      </span>
                    </div>
                  </div>
                </li>
                <!-- 连接设备 -->
                <li class="connected-device"
                    v-if='isMobileRow(row.expand)'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0618')}}</span>
                  <span class="value overflow-hidden"
                        :title="accessNodeName(row)">{{accessNodeName(row)}}</span>
                </li>
                <!-- 实时速率 -->
                <li class="speed"
                    v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0367')}}</span>
                  <div class="speed-inner">
                    <div class="speed-wrap">
                      <img class='icon'
                           src="@/assets/images/icon/ic-speed-upload.svg"
                           alt="">
                      <label class="text-inner">
                        <span>{{formatSpeed(row.online_info.realtime_speed.up).value}}</span>
                        <span>{{formatSpeed(row.online_info.realtime_speed.up).unit}}</span>
                      </label>
                    </div>
                    <div class="speed-wrap">
                      <img class='icon'
                           src="@/assets/images/icon/ic-speed-download.svg"
                           alt="">
                      <label class="text-inner">
                        <span>{{formatSpeed(row.online_info.realtime_speed.down).value}}</span>
                        <span>{{formatSpeed(row.online_info.realtime_speed.down).unit}}</span>
                      </label>
                    </div>
                  </div>
                </li>
                <!-- 吞吐量 -->
                <li class="throughput"
                    v-if='isMobileRow(row.expand)&&!isOfflineDevices'>
                  <span v-if="isMobile"
                        class="label">{{$t('trans0015')}}</span>
                  <span class="value">
                    <i class="iconfont ic_device_throughput"></i>
                    <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).value}}</span>
                    <span>{{formatNetworkData
                    (row.online_info.traffic.ul+row.online_info.traffic.dl).unit}}</span>
                  </span>
                </li>
                <!-- IP/Mac -->
                <li class="ip-mac"
                    v-if="!isMobile">
                  <span>
                    {{row.ip}}
                    <br />
                    <span class="pc-mac">
                      {{formatMac(row.mac)}}
                    </span>
                  </span>
                </li>
                <!-- IP -->
                <li class="ip"
                    v-if='isMobile&&isMobileRow(row.expand)'>
                  <span class="label">IP</span>
                  <span> {{row.ip}}</span>
                </li>
                <!-- Mac -->
                <li class="mac"
                    v-if='isMobile&&isMobileRow(row.expand)'>
                  <span class="label">{{$t('trans0188')}}</span>
                  <span>{{formatMac(row.mac)}}</span>
                </li>
                <!-- 家长控制 -->
                <li class="control"
                    v-if='isMobileRow(row.expand) && isRouter'>
                  <div class="limit-inner">
                    <span class="limit-icon"
                          @click="()=>forward2limit(row,'time')">
                      <i class="time-limit iconfont ic_limit_time_off"
                         :class="{'active':isTimeLimit(row)}"></i>
                      <span class="hover-popover">{{$t('trans0075')}}</span>
                    </span>
                    <span class="limit-icon"
                          @click="()=>forward2limit(row,'speed')">
                      <i class="speed-limit iconfont ic_limit_speed_off"
                         :class="{'active':isSpeedLimit(row)}"></i>
                      <span class="hover-popover">{{$t('trans0014')}}</span>
                    </span>
                    <span class="limit-icon"
                          @click="()=>forward2limit(row,'url')">
                      <i class="url-limit iconfont ic_limit_website_off"
                         :class="{'active':isBlacklsitLimit(row)}"></i>
                      <span class="hover-popover">{{$t('trans0076')}}</span>
                    </span>
                    <span class="limit-icon"
                          @click="()=>addToBlackList(row)">
                      <i class="add-block iconfont ic_blocklist"></i>
                      <span class="hover-popover">{{$t('trans0016')}}</span>
                    </span>
                  </div>
                </li>
              </template>
            </ul>
            <div class='table-empty'
                 v-if="!devicesMap[id]||(devicesMap[id]&&devicesMap[id].length===0)">
              <img src="@/assets/images/img_default_empty.png"
                   alt="">
              <span>{{$t('trans0278')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <speed-Limit :visiable.sync="speedLimitInfo.visiable"
                   v-if="speedLimitInfo.visiable"
                   :mac="speedLimitInfo.mac"
                   @speedLimitClose="()=>speedLimitInfo.visiable=false"
                   @refreshDeviceList="updateDeviceList()"></speed-Limit>
    </transition>
    <m-modal :visible.sync="modalShow"
             :type="'confirm'"
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
import {
  formatMac,
  getStringByte,
  formatDate,
  formatDuration
} from 'base/util/util';
import { BlacklistMode, RouterMode } from 'base/util/constant';
import speedLimit from 'base/component/limit/speed/index';

export default {
  components: {
    speedLimit
  },
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
      speedLimitVisiable: false,
      currentMac: '',
      speedLimitInfo: {
        visiable: false,
        mac: ''
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
    pageName() {
      return this.$t(this.$route.meta.text);
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
          icon: 'ic_devices_mywifi_normal'
        },
        {
          id: 'offline',
          text: this.$t('trans0516'),
          icon: 'ic_devices_offline_normal'
        }
      ];
      // if (this.isRouter) {
      //   list.splice(1, 0, {
      //     id: 'guest',
      //     text: this.$t('trans0515'),
      //     icon: 'ic_devices_guest_normal'
      //   });
      // }
      return list;
    },
    hasBackWrap() {
      return this.$route.path.includes('/dashboard/device');
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
    onBack(target) {
      if (target) {
        this.$router.replace({ path: target });
      } else {
        this.$router.go(-1);
      }
    },
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
                this.$toast(this.$t('trans0040'), 2000, 'success');
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
              if (
                a.online_info.band === wired &&
                b.online_info.band === wired
              ) {
                const isLetterOrNumberReg = /[0-9A-Za-z]+/i;
                if (isLetterOrNumberReg.test(a.name) && !isLetterOrNumberReg.test(b.name)) {
                  return -1;
                }
                if (!isLetterOrNumberReg.test(a.name) && isLetterOrNumberReg.test(b.name)) {
                  return 1;
                }
                return a.name.localeCompare(b.name);
              }
              if (a.online_info.band === wired) {
                return 1;
              }
              if (b.online_info.band === wired) {
                return -1;
              }
              return 0;
            }
            return (
              a.online_info.online_duration - b.online_info.online_duration
            );
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
        this.$router.push(`${this.$route.meta.parentPath}/devices/${id}`);
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
      return (
        row.parent_control &&
        row.parent_control.mode === BlacklistMode.blacklist
      );
    },
    isSpeedLimit(row) {
      return row.speed_limit && row.speed_limit.enabled;
    },
    forward2limit(row, suffix) {
      const limits = {
        deviceName: row.name,
        parent_control: row.parent_control,
        speed_limit: row.speed_limit,
        time_limit: row.time_limit
      };
      this.$store.state.modules.limits[row.mac] = limits;
      sessionStorage.setItem('deviceName', limits.deviceName);
      if (suffix === 'speed') {
        this.speedLimitInfo.mac = row.mac;
        this.speedLimitInfo.visiable = true;
      } else {
        this.$router.push({ path: `/limit/${row.mac}/${suffix}` });
      }
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
              curId === 'offline'
                ? this.sortOfflineDevices(result)
                : this.sortDevices(result)
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
    async updateDeviceList() {
      const params = this.devicesParams();
      if (!this.devicesMap[this.id]) this.devicesMap[this.id] = [];

      const curId = this.id;
      const devicesInfo = await this.$http.getDeviceList(params);
      if (curId === this.id) {
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
          [curId]: this.sortDevices(result)
        };
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
          this.$toast(this.$t('trans0040'), 2000, 'success');
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
                this.devicesMap[this.id] = this.devicesMap[this.id].filter(
                  v => v.mac !== row.mac
                );
                this.$toast(this.$t('trans0040'), 2000, 'success');
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
      this.modalShow = true;
      this.row = row;
      this.form.name = row.name;
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
        return `${this.$t('trans0013').replace(
          '%d',
          parseInt(differ / split[1], 10)
        )}`;
      }
      if (differ <= split[1] && differ > split[2]) {
        return `${this.$t('trans0012').replace(
          '%d',
          parseInt(differ / split[2], 10)
        )}`;
      }
      if (differ <= split[2] && differ > split[3]) {
        return `${this.$t('trans0011').replace(
          '%d',
          parseInt(differ / split[4], 10)
        )}`;
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
        return `${this.$t('trans0013').replace(
          '%d',
          parseInt(date / split[1], 10)
        )}`;
      }
      // 小于1小时大于1分钟
      if (date <= split[1] && date > split[2]) {
        return `${this.$t('trans0012').replace(
          '%d',
          parseInt(date / split[2], 10)
        )}`;
      }
      // 小于1分钟大于5秒
      if (date <= split[2] && date > split[3]) {
        return `${this.$t('trans0011').replace('%d', parseInt(date, 10))}`;
      }
      return `${this.$t('trans0010')}`;
    },
    transformDuration(zone) {
      if (
        !zone ||
        window.isNaN(zone) ||
        parseInt(zone, 10) < 0 ||
        !Number.isInteger(zone)
      ) {
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
          icon = require('@/assets/images/icon/ic_offline_wired.svg');
          return icon;
        }
        icon = require('@/assets/images/icon/ic_offline_wireless.svg');
        return icon;
      }

      if (this.isWired(row)) {
        icon = require('@/assets/images/icon/ic_wired.svg');
        return icon;
      }

      const {
        online_info: { rssi }
      } = row;

      if (this.isMobile) {
        if (rssi > -60) {
          icon = require('@/assets/images/icon/ic_signal_excellent.svg');
        } else if (rssi <= -60 && rssi > -75) {
          icon = require('@/assets/images/icon/ic_signal_good.svg');
        } else {
          icon = require('@/assets/images/icon/ic_signal_bad.svg');
        }
      } else if (rssi > -60) {
        icon = require('@/assets/images/icon/ic_wireless_excellent.svg');
      } else if (rssi <= -60 && rssi > -75) {
        icon = require('@/assets/images/icon/ic_wireless_fair.svg');
      } else {
        icon = require('@/assets/images/icon/ic_wireless_weak.svg');
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
.device {
  border-radius: 10px;
  flex: auto;
  .tab {
    .icon {
      font-size: 15px;
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
  .off-more-message {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-100%);
    width: fit-content;
    font-size: 12px;
    color: var(--offline-more-color);
    padding: 0 10px 10px;
    img {
      vertical-align: text-top;
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
  .overflow-hidden {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .device-wrapper {
    flex: 1;
    .table-inner {
      margin-top: 10px;
      position: relative;
      .table-head ul,
      .table-body ul {
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1.2fr 2fr;
        grid-template-areas: 'name connected-device speed throughput ip-mac control';
        grid-column-gap: 10px;
        height: fit-content;
        padding: 10px 20px;
        color: var(--table_header_text-color);
        font-size: 12px;
        font-weight: 500;
        > li {
          width: 100%;
          display: flex;
          align-items: center;
        }
        .name {
          grid-area: name;
          max-width: 350px;
          min-width: 230px;
          .connect-type-wrap {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 49px;
            margin-right: 10px;
            border-radius: 50%;
            background: var(--device_connect_type-bgc);
            img {
              width: 90%;
              height: 90%;
            }
          }
          .local-device-wrapper {
            position: absolute;
            bottom: -3px;
            left: -3px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #fff;
            img {
              width: 70%;
              height: 70%;
            }
          }
          .name-wrap {
            flex: 1;
            overflow: hidden;
            a {
              display: flex;
              align-items: center;
              width: 97%;
              overflow: hidden;
              font-weight: 500;
              > img {
                width: 15px;
                height: 15px;
                margin-left: 5px;
                filter: var(--img-brightness);
              }
            }
            .des-inner {
              color: #fff;
              font-size: 12px;
              margin-top: 3px;
            }
            .band {
              display: inline-block;
              padding: 0 5px;
              min-width: 40px;
              width: auto;
              border-radius: 3px;
              text-align: center;
              background-image: linear-gradient(294deg, #1ad692 20%, #03aa56);
              &.wired {
                background-image: linear-gradient(294deg, #3da8ff 20%, #0c70b8);
              }
            }
            .online-duration {
              color: var(--common_gery-color);
              margin-left: 10px;
            }
          }
        }
        .connected-device {
          grid-area: connected-device;
          max-width: 200px;
          min-width: 160px;
          .value {
            max-width: 100%;
          }
        }
        .speed {
          grid-area: speed;
          max-width: 160px;
          min-width: 90px;
          .select-wrapper {
            margin-bottom: 8px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          img {
            width: 15px;
            height: 16px;
            vertical-align: text-bottom;
            margin-right: 5px;
          }
        }
        .throughput {
          grid-area: throughput;
          max-width: 310px;
          min-width: 180px;
          .iconfont {
            color: #f0a65e;
            margin-right: 5px;
          }
        }
        .ip-mac {
          grid-area: ip-mac;
          max-width: 200px;
          min-width: 140px;
        }
        .control {
          grid-area: control;
          max-width: 350px;
          min-width: 230px;
          justify-content: center;
          .limit-inner {
            display: flex;
          }
          .limit-icon {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
            .iconfont {
              font-size: 20px;
              color: var(--device_limit_icon-color);
              font-weight: 500;
              &.active {
                background-image: var(--header_selected-bgc);
                -webkit-background-clip: text; /* Safari/Chrome */
                background-clip: text;
                color: transparent;
                text-shadow: 0 3px 8px rgba(242, 46, 73, 0.3);
              }
            }
            .hover-popover {
              display: none;
              position: absolute;
              padding: 5px 12px;
              font-size: 12px;
              background: var(--table_action_popover-bgc);
              color: #fff;
              top: -8px;
              left: 50%;
              transform: translate(-50%, -100%);
              border-radius: 10px;
              max-height: 190px;
              word-break: keep-all;
              white-space: nowrap;
              z-index: 10;
              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, 100%);
                width: 0;
                height: 0;
                border: 6px solid transparent;
                border-top-color: var(--table_action_popover-bgc);
              }
            }
            @media screen and (max-width: 768px) {
              .limit-icon {
                color: red;
                &:hover {
                  background-color: transparent;
                  .hover-popover {
                    display: none;
                  }
                }
              }
            }
            &:hover {
              background-color: var(--device_limit_icon-hover-bgc);
              .hover-popover {
                display: block;
              }
            }
          }
        }
        &.offline {
          grid-template-columns: 2fr 1.5fr 1fr 1.5fr 1fr;
          grid-template-areas: 'name online-duration offline-time mac delete';
          padding: 5px 20px;
          .name {
            grid-area: name;
            max-width: 400px;
            min-width: 230px;
            font-weight: 700;
            .column-check-box {
              display: flex;
              align-content: center;
              width: 30px;
            }
          }
          .online-duration {
            grid-area: online-duration;
            max-width: 230px;
            min-width: 150px;
          }
          .offline-time {
            grid-area: offline-time;
            max-width: 230px;
            min-width: 150px;
          }
          .mac {
            grid-area: mac;
            max-width: 230px;
            min-width: 150px;
          }
          .delete {
            grid-area: delete;
            max-width: 350px;
            min-width: 230px;
            justify-content: flex-end;
            .btn-default {
              background-image: linear-gradient(
                  to right,
                  var(--table_header-bgc),
                  var(--table_header-bgc)
                ),
                var(--common_btn_default-bgimg);
            }
            .btn-icon {
              box-shadow: none;
              background: transparent;
              .iconfont {
                font-size: 18px;
              }
            }
          }
        }
      }
      .table-head {
        border-radius: 5px;
        background: var(--table_header-bgc);
        width: 100%;
        margin-bottom: 5px;
      }
      .table-body {
        font-size: 14px;
        .loading-container {
          display: flex;
          justify-content: center;
          padding: 30px 0;
        }
        ul {
          border-radius: 5px;
          margin-bottom: 5px;
          font-size: 14px;
          color: var(--text_default-color);
          background: var(--common_card-bgc);
        }
      }
      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
      .btn-default {
        background-image: linear-gradient(
            to right,
            var(--modal_content-bgc),
            var(--modal_content-bgc)
          ),
          var(--common_btn_default-bgimg) !important;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .device {
    .offline-handle-wrapper {
      padding: 0 20px;
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 5px;
      .check-info {
        padding: 5px 10px;
        background: var(--table_header-bgc);
        border-radius: 5px;
      }
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
        &.btn-default {
          background-image: linear-gradient(
              to right,
              var(--table_header-bgc),
              var(--table_header-bgc)
            ),
            var(--common_btn_default-bgimg);
        }
      }
    }
    .off-more-message {
      position: static;
      width: 100%;
      margin: 0 0 10px;
      padding: 0 20px;
      transform: none;
    }
    .device-wrapper {
      .table-inner {
        .table-body {
          ul {
            &.reset-ul {
              display: flex;
              flex-direction: column;
              padding: 0 20px;
              border-radius: 5px;
              overflow: hidden;
              background: transparent;
              > li {
                max-width: 100% !important;
                min-width: inherit !important;
                width: 100%;
                height: 48px;
                justify-content: space-between;
                padding: 0 10px;
                background: var(--common_card-bgc);
                border-bottom: 1px solid var(--common_hr-color);
                &:first-child {
                  border-bottom: none;
                  margin-bottom: 1px;
                  border-radius: 5px;
                }
                &:nth-child(2) {
                  border-top-left-radius: 5px;
                  border-top-right-radius: 5px;
                }
                &:last-child {
                  border-bottom: none;
                  border-bottom-left-radius: 5px;
                  border-bottom-right-radius: 5px;
                }
              }
              &.online {
                > li {
                  font-size: 13px;
                  &:first-child {
                    font-size: 14px;
                    height: auto;
                    padding: 10px;
                  }
                  .label {
                    color: var(--text_gery-color);
                  }
                }
              }
            }
            .name {
              position: relative;
              justify-content: flex-start !important;
              .name-wrap {
                max-width: 260px;
                @media screen and (max-width: 374px) {
                  max-width: 170px;
                }
              }
              .name-inner {
                display: flex;
                align-items: center;
              }
              .mobile-icon {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
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
              .overflow-hidden {
                max-width: calc(100% - 20px - 18px);
              }
              .local-device-wrapper {
                position: static;
                background: transparent;
                img {
                  width: 15px;
                  height: 15px;
                  margin-right: 3px;
                }
              }
              .connect-quality {
                display: inline-block;
                width: 15px;
                height: 15px;
                margin-left: 5px;
                > img {
                  width: 100%;
                  height: auto;
                  vertical-align: sub;
                }
                // width: ;
              }
            }
            .connected-device {
              .value {
                max-width: 180px;
              }
            }
            .speed {
              .speed-inner {
                display: flex;
                .speed-wrap {
                  &:first-child {
                    margin-right: 10px;
                  }
                }
              }
            }
            .control {
              justify-content: flex-end !important;
              .limit-icon {
                &:hover {
                  background-color: transparent;
                  .hover-popover {
                    display: none;
                  }
                }
              }
            }
            .delete {
              justify-content: flex-end !important;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 280px) {
  .device .device-wrapper .table-inner .table-body ul.reset-ul.online > li {
    &.connected-device-device {
      .value {
        max-width: 180px;
      }
    }
  }
}
</style>
