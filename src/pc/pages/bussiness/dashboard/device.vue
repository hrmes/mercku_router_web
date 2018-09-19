<template>
  <div class="device-container">
    <div class="device-wrapper">
      <div class="title">{{$t('trans0235')}}</div>
      <div class="table-inner">
        <m-table :data="devices" stripe>
          <m-table-column :label="$t('trans0005')" align="center" min-width='200'>
            <template slot-scope="scope">
              <div class="name-inner">
                <i class="band" v-if="scope.row.online_info.band==='wired'"><img src="../../../assets/images/ic_device_cable@2x.png" alt=""></i>
                <i class="band" v-else><img src="../../../assets/images/ic_equipment.png" alt=""></i>
                <a>
                  <span> {{scope.row.name}}</span>
                  <img src="../../../assets/images/ic_edit.png" alt="">
                </a>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('连接类型')" align="center" width='100'>
            <template slot-scope="scope">
              <div>
                {{bandMap[`${scope.row.online_info.band}`]}}
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('接入时长')" align="center" width='200'>
            <template slot-scope="scope">
              <div>
                {{transformDate(scope.row.online_info.online_duration)}}
              </div>
            </template>
          </m-table-column>
          <m-table-column prop="ip" :label="$t('trans0151')" align="center" width='200'></m-table-column>
          <m-table-column prop="mac" :label="$t('trans0188')" align="center" width='200'></m-table-column>
          <m-table-column :label="$t('trans0367')" align="center" width='100'>
            <template slot-scope="scope">
              <div>
                {{scope.row.online_info.realtime_speed.up}} {{scope.row.online_info.realtime_speed.down}}
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0015')" align="center" width='120'>
            <template slot-scope="scope">
              <div>
                {{scope.row.online_info.traffic.ul+scope.row.online_info.traffic.dl}}
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('限制')" align="center" width='200'>
            <template slot-scope="scope">
              <div>
                <div>{{$t('限时')}}</div>
                <div>{{$t('限速')}}</div>
                <div>{{$t('网址黑名单')}}</div>
              </div>
            </template>
          </m-table-column>
          <m-table-column :label="$t('trans0020')" align="center" width='160'>
            <template slot-scope="scope">
              <div>
                {{$t('trans0016')}}
              </div>
            </template>
          </m-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>
<script>
import layout from '../../../layout.vue';
import TimePicker from '../../../component/timePicker/index.vue';
import DatePicker from '../../../component/datePicker/index.vue';

export default {
  components: {
    layout,
    'm-time-picker': TimePicker,
    'm-date-picker': DatePicker
  },
  data() {
    return {
      devices: [],
      bandMap: {
        wired: this.$t('trans0253'),
        '2.4g': this.$t('trans0255'),
        '5g': this.$t('trans0256')
      }
    };
  },
  mounted() {
    this.$http.meshDeviceGet().then(res => {
      this.devices = res.data.result;
    });
  },
  methods: {
    transformDate(date) {
      date *= 1000;
      const now = new Date().getTime();
      if (date === 0) {
        return '--';
      } else if (date <= 5) {
        return '刚刚';
      } else if (date <= 60000 && date > 5) {
        return `${parseInt(date / 1000, 10)}秒前`;
      } else if (date <= 3600000 && date > 60000) {
        return `${parseInt(date / 60000, 10)}分钟前`;
      } else if (date <= 3600000 * 24 && date > 3600000) {
        return `${parseInt(date / 3600000, 10)}分钟前`;
      }
      return this.moment(now - date).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>
<style lang="scss" scoped>
.device-container {
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
      .name-inner {
        display: flex;
        align-items: center;
        .band > img {
          width: 30px;
          height: 30px;
        }
        a {
          flex: 1;
          padding-left: 10px;
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
            width: 16px;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
