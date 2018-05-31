<template>
  <div class="setting-network-container">
    <div class="content">
      <div class="network-info">
        <div class="w-header">
          {{$t('trans0316')}}
        </div>
        <div class="status">
          <div v-if="status===network[0]">
            <img src="../../../assets/images/img_test_internet.png" alt="">
            <p>{{$t('trans0298')}}...</p>
          </div>
          <div v-if="status===network[1]">
            <img src="../../../assets/images/img_no_network_access.png" alt="">
            <p>{{$t('trans0319')}}</p>
          </div>
          <div v-if="status===network[2]">
            <img src="../../../assets/images/img_internet_normal.png" alt="">
            <p>{{$t('trans0318')}}</p>
            <div class="seccess-info">
              <div>
                <label for="">{{$t('trans0302')}}：</label>
                <span>DHCP</span>
              </div>
              <div>
                <label for="">{{$t('trans0151')}}：</label>
                <span>123123213123</span>
              </div>
              <div>
                <label for="">{{$t('trans0152')}}：</label>
                <span>123123123213123</span>
              </div>
              <div>
                <label for="">{{$t('trans0153')}}：</label>
                <span>123123123123123</span>
              </div>
              <div>
                <label for="">{{$t('trans0236')}}：</label>
                <span>123123123123123123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="network-setting">
        <div class="w-header">
          {{$t('trans0142')}}
        </div>
        <div class="setting-info">
          <div class='form'>
            <div class="item">
              <m-select :label="$t('trans0317')" v-model="netType" :options="options"></m-select>
              <div class="note">{{$t('trans0147')}}</div>
            </div>
            <div v-if="netType==='pppoe'">
              <div class="item">
                <m-input :label="$t('trans0155')" type="text" :placeholder="`${$t('trans0321')}${$t('trans0155')}`"></m-input>
              </div>
              <div class="item">
                <m-input :label="$t('trans0156')" type='password' :placeholder="`${$t('trans0321')}${$t('trans0156')}`" />
              </div>
            </div>
            <div v-if="netType==='static'">
              <label for="" class="title"> {{$t('trans0151')}}</label>
              <div>
                <m-input type="text" placeholder="0.0.0.0" />
              </div>
              <div class="item">
                <m-input :label="$t('trans0152')" type="text" placeholder="0.0.0.0" />
              </div>

              <div class="item">
                <m-input :label="$t('trans0153')" type="text" placeholder="0.0.0.0" />
              </div>
              <div class="item">
                <m-input :label="$t('trans0236')" type="text" placeholder="0.0.0.0" />
              </div>
              <div class="item">
                <m-input :label="$t('trans0320')" type="text" placeholder="0.0.0.0" />
              </div>
            </div>

            <div class="btn-info">
              <button class="btn">{{$t('trans0081')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import Input from '../../../component/input/input.vue';
import mSelect from '../../../component/select/index.vue';

export default {
  components: {
    'm-input': Input,
    mSelect
  },
  data() {
    return {
      network: ['testing', 'fail', 'success'],
      status: 'fail',
      netType: 'pppoe',
      options: [
        {
          value: 'dhcp',
          text: 'dhcp'
        },
        {
          value: 'pppoe',
          text: '宽带拨号'
        },
        {
          value: 'static',
          text: '静态IP'
        }
      ]
    };
  },
  methods: {
    showPsd() {
      this.isPsd = !this.isPsd;
    },
    select(v) {
      console.log(v);
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-network-container {
  position: relative;
  padding: 0 30px;
  padding-bottom: 30px;
  .content {
    .w-header {
      height: 60px;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      color: #333333;
      line-height: 60px;
      font-weight: 400;
    }
    .network-info {
      border-radius: 8px;
      padding: 0 20px;
      background: white;
      min-height: 400px;
      .status {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #333333;
        text-align: center;
        p {
          margin: 0;
          padding: 0;
        }
        .seccess-info {
          text-align: left;
          margin-bottom: 30px;
          div {
            margin-top: 10px;
          }
          label {
            display: inline-block;
            min-width: 80px;
            font-size: 14px;
            color: #999999;
          }
          span {
            color: #333333;
            font-size: 14px;
          }
        }
      }
    }
    .network-setting {
      margin-top: 20px;
      min-height: 400px;
      border-radius: 8px;
      padding: 0 20px;
      background: white;
      .setting-info {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .form {
          padding: 30px 0;
          .item {
            margin-bottom: 20px;
          }
          .note {
            font-size: 12px;
            color: #999999;
            padding: 5px 0;
          }
          .title {
            display: inline-block;
            font-size: 14px;
            color: #333333;
            line-height: 1;
            margin-top: 30px;
            height: 30px;
          }
          .btn-info {
            margin-top: 40px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .setting-network-container {
    padding: 10px;
    .content {
      .w-header {
        font-size: 14px;
        height: 44px;
        line-height: 44px;
      }
      .network-info {
        min-height: 300px !important;
        img {
          width: 185px;
        }
      }
      min-height: 510px;
      .form {
        width: 100%;

        .title {
          margin-top: 20px !important;
          margin-bottom: 10px;
          height: auto !important;
        }
        .check-info {
          display: flex;
          align-items: center;
          margin-top: 20px;
          label {
            margin-right: 10px;
            font-size: 16px;
            color: #333333;
          }
        }
        .btn-info {
          margin-top: 30px;
        }
      }
    }
  }
}
</style>

