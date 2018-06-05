<template>
  <div class="setting-network-container">
    <div class="content">
      <div class="network-info">
        <div class="w-header">
          {{$t('trans0316')}}
        </div>
        <div class="status">
          <div v-if="netStatus==='testing'">
            <img src="../../../assets/images/img_test_internet.png" alt="">
            <p>{{$t('trans0298')}}...</p>
          </div>
          <div v-if="netStatus==='unlinked'||netStatus==='linked'">
            <img src="../../../assets/images/img_no_network_access.png" alt="">
            <p>{{$t('trans0319')}}</p>
          </div>
          <div v-if="netStatus==='connected'">
            <img src="../../../assets/images/img_internet_normal.png" alt="">
            <p>{{$t('trans0318')}}</p>
            <div class="seccess-info" v-if='this.netInfo.netinfo'>
              <div>
                <label for="">{{$t('trans0302')}}：</label>
                <span>
                  {{this.netInfo.type || '—'}}
                </span>
              </div>
              <div>
                <label for="">{{$t('trans0151')}}：</label>
                <span> {{this.netInfo.netinfo?this.netInfo.netinfo.ip : '—'}}</span>
              </div>
              <div>
                <label for="">{{$t('trans0152')}}：</label>
                <span> {{this.netInfo.netinfo?this.netInfo.netinfo.mask : '—'}}</span>
              </div>
              <div>
                <label for="">{{$t('trans0153')}}：</label>
                <span> {{this.netInfo.netinfo?this.netInfo.netinfo.gateway:'—'}}</span>

              </div>
              <div>
                <label for="">{{$t('trans0236')}}：</label>
                <span> {{this.netInfo.netinfo?this.netInfo.netinfo.dns.join('/') :'—'}}</span>
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
            <m-form-item class="item">
              <m-select :label="$t('trans0317')" v-model="netType" :options="options"></m-select>
              <div class="note">{{$t('trans0147')}}</div>
            </m-form-item>
            <m-form v-if="netType==='pppoe'" ref="pppoeForm" :model="pppoeForm" :rules='pppoeRules'>
              <m-form-item class="item" prop='account'>
                <m-input :label="$t('trans0155')" type="text" :placeholder="`${$t('trans0321')}`" v-model="pppoeForm.account"></m-input>
              </m-form-item>
              <m-form-item class="item" prop='password'>
                <m-input :label="$t('trans0156')" type='password' :placeholder="`${$t('trans0321')}`" v-model="pppoeForm.password" />
              </m-form-item>
            </m-form>
            <m-form v-if="netType==='static'" ref="staticForm" :model="staticForm" :rules='staticRules'>
              <m-form-item class="item" prop='ip'>
                <m-input :label="$t('trans0151')" type="text" placeholder="0.0.0.0" v-model="staticForm.ip" />
              </m-form-item>
              <m-form-item class="item" prop='mask'>
                <m-input :label="$t('trans0152')" type="text" placeholder="0.0.0.0" v-model="staticForm.mask" />
              </m-form-item>
              <m-form-item class="item" prop='gateway'>
                <m-input :label="$t('trans0153')" type="text" placeholder="0.0.0.0" v-model="staticForm.gateway" />
              </m-form-item>
              <m-form-item class="item" prop='dns1'>
                <m-input :label="$t('trans0236')" type="text" placeholder="0.0.0.0" v-model="staticForm.dns1" />
              </m-form-item>
              <m-form-item class="item" prop='dns2'>
                <m-input :label="$t('trans0320')" type="text" placeholder="0.0.0.0" v-model="staticForm.dns2" />
              </m-form-item>
            </m-form>
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
import mSelect from '../../../component/select/index.vue';
import Form from '../../../component/form/index.vue';
import FormItem from '../../../component/formItem/index.vue';
import Input from '../../../component/input/input.vue';

export default {
  components: {
    'm-input': Input,
    'm-form-item': FormItem,
    'm-form': Form,
    'm-select': mSelect
  },
  data() {
    const pattern = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
    function expRules(v) {
      return !/^\s*$/g.test(v) ? pattern.test(v) : true;
    }
    return {
      netStatus: 'unlinked', // unlinked: 未连网线，linked: 连网线但不通，connected: 外网正常连接
      netType: 'dhcp',
      netInfo: {},
      staticForm: {
        ip: '',
        mask: '',
        gateway: '',
        dns1: '',
        dns2: ''
      },
      pppoeForm: {
        account: '',
        password: ''
      },
      pppoeRules: {
        account: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => /^.{1,20}$/g.test(value),
            message: this.$t('trans0261')
          }
        ],
        password: [
          { rule: value => !/\s/g.test(value), message: this.$t('trans0232') },
          {
            rule: value => /^[a-zA-Z0-9\W_]{8,24}$/g.test(value),
            message: this.$t('trans0169')
          }
        ]
      },
      staticRules: {
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        mask: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        gateway: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns1: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => pattern.test(value),
            message: this.$t('trans0231')
          }
        ],
        dns2: [
          {
            rule: expRules,
            message: this.$t('trans0231')
          }
        ]
      },
      options: [
        {
          value: 'dhcp',
          text: this.$t('trans0146')
        },
        {
          value: 'pppoe',
          text: this.$t('trans0144')
        },
        {
          value: 'static',
          text: this.$t('trans0148')
        }
      ]
    };
  },
  mounted() {
    this.testWan();
    this.getNet();
  },
  methods: {
    testWan() {
      this.netStatus = 'testing';
      this.$http
        .testWan()
        .then(res => {
          this.netStatus = res.data.result.status;
        })
        .catch(() => {
          this.netStatus = 'unlinked';
        });
    },
    getNet() {
      this.$http.getNet({ type: 'wan' }).then(res => {
        this.netInfo = res.data.result;
      });
    },
    submit() {
      let form = { tyep: this.netType };
      if (this.netType === 'pppoe' && this.$refs.pppoeForm.validate()) {
        form = { ...form, pppoe: { ...this.pppoeForm } };
      } else {
        return;
      }
      if (this.netType === 'static' && this.$refs.staticForm.validate()) {
        form = { ...form, netinfo: { ...this.staticForm } };
      } else {
        return;
      }
      this.$http
        .update({ wan: { ...form } })
        .then(res => {
          this.$dialog.info({});
          this.$reconnect({
            onsuccess: () => {
              this.$router.push({ path: '/home' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/disappear' });
            },
            onprogress: percent => {
              console.log(percent);
            }
          });
          console.log(res);
        })
        .catch(err => {
          if (err && err.error) {
            this.$toast(this.$t(err.error.code));
          } else {
            this.$toast(this.$t('trans0039'));
          }
        });
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
        img {
          width: 220px;
          height: 220px;
        }
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
          padding: 20px 0;
          .item {
            // margin-bottom: 20px;
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

