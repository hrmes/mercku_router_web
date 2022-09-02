<template>
  <div class="page">
    <div class="page-header">
      {{$t('trans0539')}}
    </div>
    <div class="page-content">
      <div class="form">
        <m-form-item>
          <m-radio-group v-model="mode"
                         :options="modes"
                         direction="vertical"></m-radio-group>
        </m-form-item>
      </div>
      <div class="form upperApForm"
           v-if="mode==='wireless_bridge'">
        <h4>{{`Upper-level AP`}}</h4>
        <div class="upperApForm__top"
             v-if="currentUpperInfo.show">
          <div class="current-ssid">
            <span class="title">{{$t('trans1072')}}:</span>
            <span class="content">{{currentUpperInfo.ssid}}</span>
          </div>
          <div class="current-security">
            <span class="title">Currently Encrypt:</span>
            <span class="content">{{currentUpperInfo.security}}</span>
          </div>
          <div class="current-pwd">
            <span class="title">{{$t('trans1071')}}:</span>
            <span
                  class="content">{{currentUpperInfo.security!=='open'?currentUpperInfo.password:'-'}}</span>
          </div>
        </div>
        <div class="upperApForm__bottom">
          <m-form ref="upperApForm"
                  :model="upperApForm"
                  :rules="upperApFormRules">
            <m-form-item class="form-item"
                         prop="upperApForm.ssid">
              <m-loadingSelect label="SSID"
                               :placeholder="$t('trans1069')"
                               type='text'
                               v-model="upperApForm.ssid"
                               @change="selectedChange"
                               @scanApclient="getMeshApclientScanList"
                               :options="processedUpperApList"
                               :loading="selectIsLoading"
                               :loadingText="loadingText" />
            </m-form-item>
            <m-form-item v-show="!pwdDisabled"
                         class="form-item"
                         prop="upperApForm.password">
              <m-input :label="$t('trans0003')"
                       type="password"
                       :placeholder="$t('trans0321')"
                       v-model="upperApForm.password" />
            </m-form-item>
          </m-form>
        </div>

      </div>
      <div class="form-button">
        <!-- 提交按钮是否展示逻辑： -->
        <!-- 1.如果模式有更新才显示save，模式没变不展示 -->
        <!-- 2.或者只要upperApForm的ssid不为空，即选择了一个扫描到的上级，就展示save -->
        <button class="btn primary"
                v-defaultbutton
                @click="updateMode"
                :disabled="saveDisable"
                v-show="modeHasChange||upperApForm.ssid!==''">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>

import { isValidPassword } from '../../../../../base/src/util/util';


const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2
};
export default {
  data() {
    return {
      currentMode: '',
      modeHasChange: true,
      saveDisable: false,
      selectIsLoading: LoadingStatus.empty,
      mode: '',
      modes: [
        {
          text: this.$t('trans1059'),
          value: 'wireless_bridge'
        },
        {
          text: this.$t('trans1066'),
          value: 'bridge'
        },
      ],
      upperApForm: {
        ssid: '', // 必选
        password: '', // 可选
        bssid: '', // 必选
        channel: '', // 必选
        band: '', // 必选
        security: '', // 必选
        rssi: ''// 可选,上级无线信号的强度.获取APClient时必选,更新时可选
      },
      currentUpperInfo: {
        show: false,
        ssid: '',
        security: 'open',
        password: ''
      },
      originalUpperList: [],
      processedUpperApList: [],
      upperApFormRules: {
        // 这一套要验证ssid和密码
        'upperApForm.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          },
        ],
      },
      pwdDisabled: true,
      loadingText: `${this.$t('trans1070')}...`
    };
  },
  mounted() {
    this.getMode();
  },
  watch: {
    mode(nv) {
      this.upperApForm = {
        ssid: '', // 必选
        password: '', // 可选
        bssid: '', // 必选
        channel: '', // 必选
        band: '', // 必选
        security: '', // 必选
        rssi: ''// 可选,上级无线信号的强度.获取APClient时必选,更新时可选
      };
      this.pwdDisabled = true;
      if (this.currentMode === nv) {
        // 模式没变化，就隐藏修改模式按钮
        this.modeHasChange = false;
      } else {
        // 模式有变化，就展示修改模式按钮
        this.modeHasChange = true;
        this.pwdDisabled = true;
      }
      switch (nv) {
        case 'wireless_bridge':
          this.saveDisable = true;
          this.getMeshApclientScanList();
          break;
        case 'bridge':
          this.saveDisable = false;
          break;
        default:
          break;
      }
    },
    // upperAp表单验证:由于密码是否验证是根据用户选择的上级是否有加密方式来决定的,所有制定两套验证规则
    pwdDisabled(nv) {
      if (nv === true) {
        this.upperApFormRules = {
          // 这一套只验证ssid是否为空
          'upperApForm.ssid': [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
          ],
        };
      } else {
        this.upperApFormRules = {
          // 这一套要验证ssid和密码
          'upperApForm.ssid': [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
          ],
          'upperApForm.password': [
            {
              rule: value => isValidPassword(value, 1, 63),
              message: this.$t('trans1077')
            }
          ],
        };
      }
    },
  },
  methods: {
    getMode() {
      this.$loading.open();
      this.$http.getMeshMode()
        .then(res => {
          const { data: { result } } = res;
          console.log(result);
          if (result.mode === 'wireless_bridge') {
            this.currentUpperInfo.show = true;
            this.currentUpperInfo.ssid = result.apclient.ssid;
            this.currentUpperInfo.password = result.apclient.password;
            this.currentUpperInfo.security = result.apclient.security;
            console.log(this.upperApForm);
          }
          this.mode = result.mode;
          this.currentMode = result.mode;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    updateMode() {
      switch (this.mode) {
        // 如果提交的mode为有线桥，就要检测是否插入网线，未插入就提示用户
        case 'bridge':
          // 监测网口是否插入网线接口待调用;
          this.$http.getWanStatus()
            .then(res => {
              // 网线接入的接口数据
              const { status } = res.data.result;
              console.log(status);
              if (status === 'unlinked') { // 1.如果没有插入网线
                this.$dialog.confirm({
                  okText: this.$t('trans0024'),
                  cancelText: this.$t('trans0025'),
                  message: [this.$t('trans1063'), this.$t('trans1065')],
                  callback: {
                    ok: () => {
                      this.confirmUpdateMeshMode({ mode: this.mode });
                    }
                  }
                });
              } else { // 2.插入了网线,直接进行mode update
                this.confirmUpdateMeshMode({ mode: this.mode });
              }
            });
          break;
        case 'wireless_bridge':
          if (this.$refs.upperApForm.validate()) {
            console.log('验证通过');
            const params = {
              mode: this.mode,
              apclient: this.upperApForm
            };
            console.log(params);
            this.confirmUpdateMeshMode(params);
          }
          break;
        default:
          break;
      }
    },
    confirmUpdateMeshMode(params) {
      this.$loading.open();
      this.$http
        .updateMeshMode(params)
        .then(() => {
          this.$loading.close();
          this.$reconnect({
            timeout: 120,
            onsuccess: () => {
              this.$toast(this.$t('trans0040'), 3000, 'success');
              // 如果修改了模式，则跳转到登录页面，否则停留在当前页面
              if (this.$store.mode !== this.mode) {
                this.$store.mode = this.mode;
                this.$router.push({ path: '/login' });
              }
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    // eslint-disable-next-line func-names
    getMeshApclientScanList() {
      this.selectIsLoading = LoadingStatus.loading;
      this.$http.getMeshApclientScanList()
        .then(res => {
          this.originalUpperList = [];
          this.originalUpperList = [];
          this.processedUpperApList = [];
          let { result } = res.data;
          result = result.filter(item => item.ssid);
          result.sort((a, b) => b.rssi - a.rssi);
          console.log('@@@@@@@@@@', result);
          this.originalUpperList = result;
          result.map(i => this.processedUpperApList.push({
            value: i.ssid, text: `${i.ssid}`, encrypt: i.security, rssi: i.rssi
          }));
        })
        .catch(() => {
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1078');
          this.selectIsLoading = LoadingStatus.failed;
        });
    },
    selectedChange(option) {
      this.saveDisable = false;
      this.pwdDisabled = option.encrypt === 'open';
      const { ssid, password, bssid, channel, band, security, rssi } = this.originalUpperList.find((i) => i.ssid === option.value);
      this.upperApForm = {
        ssid,
        password,
        bssid,
        channel,
        band,
        security,
        rssi
      };
    },
  }
};
</script>
<style lang="scss" scoped>
.page-content {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.form {
  width: 340px;
  .note {
    color: #999;
    font-size: 12px;
    margin: 0;
    margin-top: 5px;
    padding-left: 26px;
  }
}
.upperApForm {
  border-top: 1px solid #ebebeb;
  padding-top: 20px;
  .upperApForm__top {
    width: 340px;
    background: #f7f7f7;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 20px;
    .title {
      margin-right: 10px;
      color: #808080;
    }
    .content {
      font-weight: 600;
    }
  }
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
