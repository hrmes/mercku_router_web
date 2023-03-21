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
        <div class="upperApForm__top"
             v-if="currentUpperInfo.show">
          <h4>{{$t('trans1052')}}</h4>
          <div class="upperApForm__top__upperinfo">
            <div class="current-ssid">
              <span class="title">{{$t('trans1072')}}:</span>
              <span class="content">{{currentUpperInfo.ssid}}</span>
            </div>
            <div class="current-pwd">
              <span class="title">{{$t('trans1071')}}:</span>
              <span class="content"
                    :title="currentUpperInfo.security!==EncryptMethod.OPEN?currentUpperInfo.password:'-'">
                {{currentUpperInfo.security!==EncryptMethod.OPEN?currentUpperInfo.password:'-'}}
              </span>
            </div>
          </div>
          <div class="tips">{{$t('trans1086')}}</div>
        </div>
        <div class="upperApForm__bottom"
             v-else>
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
                               @scanApclient="startApclientScan"
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
                v-show="modeHasChange||upperApForm.ssid!==''&&upperApForm.band!==''">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { isValidPassword } from '../../../../../base/src/util/util';
import { EncryptMethod, WanNetStatus } from '../../../../../base/src/util/constant';

const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2
};

const UpperApInitForm = {
  ssid: '', // 必选
  password: '', // 可选
  bssid: '', // 必选
  channel: '', // 必选
  band: '', // 必选
  security: '', // 必选
  rssi: '' // 可选,上级无线信号的强度.获取APClient时必选,更新时可选
};

const HomewayWorkModel = {
  wirelessBridge: 'wireless_bridge',
  bridge: 'bridge'
};

export default {
  data() {
    return {
      EncryptMethod,
      currentMode: '',
      modeHasChange: false,
      saveDisable: false,
      selectIsLoading: LoadingStatus.empty,
      mode: '',
      modes: [
        {
          text: this.$t('trans1059'),
          value: HomewayWorkModel.wirelessBridge
        },
        {
          text: this.$t('trans1066'),
          value: HomewayWorkModel.bridge
        }
      ],
      upperApForm: UpperApInitForm,
      currentUpperInfo: {
        show: false,
        ssid: '',
        security: EncryptMethod.OPEN,
        password: ''
      },
      originalUpperList: [],
      processedUpperApList: [],
      upperApFormRules: {
        // 默认为只验证ssid，如果选择了加密方式不为OPEN的就改为验证ssi和pwd
        'upperApForm.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          }
        ]
      },
      pwdDisabled: true,
      wanStatus: WanNetStatus.unlinked,
      loadingText: `${this.$t('trans1070')}...`,
      getApclientScanTimer: null,
      rescanCounts: 0
    };
  },
  mounted() {
    this.getMode();
    this.getWanStatus();
  },
  watch: {
    mode(nv) {
      this.upperApForm = UpperApInitForm;
      this.pwdDisabled = true;

      if (this.currentMode === nv) {
        // 模式没变化，就隐藏修改模式按钮
        this.modeHasChange = false;
        return;
      }
      // 模式有变化，就展示修改模式按钮
      this.modeHasChange = true;
      this.pwdDisabled = true;

      switch (nv) {
        case HomewayWorkModel.wirelessBridge:
          this.saveDisable = true;
          this.upperApForm.ssid = '';
          // this.selectedChange(this.UpperApInitForm);

          // this.startApclientScan();
          break;
        case HomewayWorkModel.bridge:
          this.saveDisable = false;
          // this.upperApForm.ssid = '';
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
            }
          ]
        };
      } else {
        this.upperApFormRules = {
          // 这一套要验证ssid和密码
          'upperApForm.ssid': [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            }
          ],
          'upperApForm.password': [
            {
              rule: value => value !== '',
              message: this.$t('trans0281')
            },
            {
              rule: value => isValidPassword(value, 1, 63),
              message: this.$t('trans1077')
            }
          ]
        };
      }
    }
  },
  methods: {
    getMode() {
      this.$loading.open();
      this.$http
        .getMeshMode()
        .then(res => {
          const {
            data: { result }
          } = res;
          if (result.mode === HomewayWorkModel.wirelessBridge) {
            this.currentUpperInfo.ssid = result.apclient.ssid;
            this.currentUpperInfo.password = result.apclient.password;
            this.currentUpperInfo.security = result.apclient.security;
            this.currentUpperInfo.show = true;
            console.log('upperApform', this.upperApForm);
          }
          this.mode = result.mode;
          this.currentMode = result.mode;
          this.$loading.close();
        })
        .catch(() => {
          this.$loading.close();
        });
    },
    getWanStatus() {
      // 监测网口是否插入网线接口;
      this.$http.getWanStatus()
        .then(res => {
          const { status } = res.data.result;
          this.wanStatus = status;
          console.log(this.wanStatus);
        });
    },
    updateMode() {
      switch (this.mode) {
        // 如果提交的mode为有线桥，就要检测是否插入网线，未插入就提示用户
        case HomewayWorkModel.bridge:
          // 切换为有线桥的时候 要判断一下wanStatus，如果是unlinked就要弹窗提示未插入网线
          if (this.wanStatus === WanNetStatus.unlinked) {
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              // 检测到未插入网线，提示则为目前未插入网线
              message: [this.$t('trans1063'), this.$t('trans1065')],
              callback: {
                ok: () => {
                  this.confirmUpdateMeshMode({ mode: this.mode });
                }
              }
            });
          } else {
            // 2.插入了网线,直接进行mode update
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              // 提示为切换模式网络会中断
              message: this.$t('trans0229'),
              callback: {
                ok: () => {
                  this.confirmUpdateMeshMode({ mode: this.mode });
                }
              }
            });
          }
          break;
        case HomewayWorkModel.wirelessBridge:
          if (this.$refs.upperApForm.validate()) {
            console.log('验证通过');
            const params = {
              mode: this.mode,
              apclient: this.upperApForm
            };
            console.log(params);
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              // 提示为可能会让网络不可用
              message: this.$t('trans0229'),
              callback: {
                ok: () => {
                  this.confirmUpdateMeshMode(params);
                }
              }
            });
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
          this.$store.mode = params.mode;
          localStorage.setItem('mode', params.mode);
          this.$reconnect({
            timeout: 120,
            onsuccess: () => {
              this.$toast(this.$t('trans0040'), 3000, 'success');
              // 如果修改了模式，则跳转到登录页面，否则停留在当前页面
              this.$router.push({ path: '/login' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    // 去除扫描到的上级列表里面，重复的数据
    deweight(arr) {
      const fliteredArr = [];
      arr.forEach(a => {
        const isTrue = fliteredArr.every(b => {
          // 先判断bssid即mac是否存在，不存在直接保存
          if (a.bssid !== b.bssid) {
            return true;
            // 如果bssid已存在，那么判断一下两者的band是否一致，如果不一致则保存
          }
          if (a.bssid === b.bssid && a.band !== b.band) {
            return true;
          }
          // 否则就是重复数据，不保存
          return false;
        });
        isTrue ? fliteredArr.push(a) : '';
      });
      return fliteredArr;
    },
    // eslint-disable-next-line func-names
    startApclientScan() {
      this.originalUpperList = [];
      this.processedUpperApList = [];
      this.selectIsLoading = LoadingStatus.loading;
      this.loadingText = `${this.$t('trans1070')}...`;

      this.$http
        .startMeshApclientScan()
        .then(() => {
          setTimeout(() => {
            this.getApclientScanList();
          }, 10000);
        })
        .catch(() => {
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1078');
          this.selectIsLoading = LoadingStatus.failed;
        });
    },
    getApclientScanList() {
      this.$http
        .getMeshApclientScanList()
        .then(res => {
          this.originalUpperList = [];
          this.processedUpperApList = [];

          let { result } = res.data;
          if (result.length) {
            clearTimeout(this.getApclientScanTimer);
            this.getApclientScanTimer = null;

            result = result.filter(item => item.ssid !== ' ');
            result = this.deweight(result);
            console.log('deweight', result);
            result.sort((a, b) => b.rssi - a.rssi);
            this.originalUpperList = result;
            result.map(i =>
              this.processedUpperApList.push({
                value: i.ssid,
                text: `${i.ssid}`,
                encrypt: i.security,
                rssi: i.rssi,
                band: i.band
              }));
          } else {
            this.getApclientScanTimer = setTimeout(() => {
              if (this.rescanCounts < 2) {
                // eslint-disable-next-line no-plusplus
                this.rescanCounts++;
                this.getApclientScanList();
              } else {
                this.originalUpperList = [];
                this.processedUpperApList = [];
                this.loadingText = this.$t('trans1078');
                this.selectIsLoading = LoadingStatus.failed;
              }
            }, 5000);
          }
        })
        .catch(err => {
          console.log(err);
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1078');
          this.selectIsLoading = LoadingStatus.failed;
        });
    },
    selectedChange(option) {
      this.saveDisable = false;
      this.pwdDisabled = option.encrypt === EncryptMethod.OPEN;
      const {
        ssid,
        password,
        bssid,
        channel,
        band,
        security,
        rssi
      } = this.originalUpperList.find(
        i => i.ssid === option.value
      );
      this.upperApForm = {
        ssid,
        password,
        bssid,
        channel,
        band,
        security,
        rssi
      };
    }
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

    .upperApForm__top__upperinfo {
      width: inherit;
      padding: 10px;
      margin-bottom: 10px;
      background: #f7f7f7;
      border-radius: 4px;
      font-size: 14px;
      .current-pwd {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
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
