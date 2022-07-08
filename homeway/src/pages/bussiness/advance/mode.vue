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
        <div class="upperApForm__bottom">
          <h4>{{`Upper-level AP`}}</h4>
          <m-form ref="upperApForm"
                  :model="upperApForm"
                  :rules="upperApFormRules">
            <m-form-item class="form-item"
                         prop="upperApForm.ssid">
              <m-loadingSelect label="SSID"
                               placeholder="请选择一个扫描到的ssid"
                               type='text'
                               v-model="upperApForm.ssid"
                               @change="selectedChange"
                               :options="processedUpperApList"
                               :loading="selectIsLoading"
                               loadingText="正在扫描上级中" />
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
        <button class="btn primary"
                v-defaultbutton
                @click="updateMode"
                :disabled="saveDisable"
                v-show="modeHasChange">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { isValidPassword, isFieldHasComma, isFieldHasSpaces, throttle } from '../../../../../base/src/util/util';

export default {
  data() {
    return {
      currentMode: '',
      modeHasChange: false,
      saveDisable: false,
      selectIsLoading: true,
      mode: 'router',
      modes: [
        {
          text: this.$t('trans1059'),
          value: 'wireless_bridge'
        },
        {
          text: this.$t('trans1066'),
          value: 'bridge'
        },
        {
          text: this.$t('trans0541'),
          value: 'router'
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
    };
  },
  mounted() {
    this.getMode();
  },
  watch: {
    mode(nv) {
      this.upperApForm.ssid = '';
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
              rule: value => isFieldHasSpaces(value),
              message: this.$t('trans1020')
            },
            {
              rule: value => isFieldHasComma(value),
              message: this.$t('trans0452')
            },
            {
              rule: value => isValidPassword(value),
              message: this.$t('trans0169')
            }
          ],
        };
      }
    },
  },
  methods: {
    getMode() {
      this.$loading.open();
      this.$http
        .getMeshMode()
        .then(res => {
          this.currentMode = res.data.result.mode;
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
          // TODO:监测网口是否插入网线接口待调用;
          this.$http.getMeshMode()
            .then(res => {
              // TODO:网线接入的接口数据
              // {status}=res.data
              console.log(res);
              // if (status === 'unlinked') { // 1.如果没有插入网线
              this.$dialog.confirm({
                okText: this.$t('trans0024'),
                cancelText: this.$t('trans0025'),
                message: [this.$t('trans1063'), this.$t('trans1065')],
                callback: {
                  ok: () => {
                    // this.confirmUpdateMeshMode({ mode: this.mode });
                  }
                }
              });
              // } else { // 2.插入了网线,直接进行mode update
              // this.confirmUpdateMeshMode({ mode: this.mode });
              // }
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
            // this.confirmUpdateMeshMode();
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
    getMeshApclientScanList: throttle(function () {
      // TODO:scanMeshList 接口调用
      axios({
        url: 'http://127.0.0.1:4523/mock/1010011/getMeshApclientScanList?id=1',
        method: 'get'
      })
        .then(res => {
          setTimeout(() => {
            this.originalUpperList = [];
            this.processedUpperApList = [];
            const { data } = res;
            data.sort((a, b) => b.rssi - a.rssi);
            this.originalUpperList = data;
            data.map(i => this.processedUpperApList.push({
              value: i.ssid, text: `${i.ssid}  ${i.rssi}`, encrypt: i.security, rssi: i.rssi
            }));
          }, 100);
        });
      // this.$http.getMeshApclientScanList
      //   .then(res => {
      //   this.originalUpperList = [];
      //       this.processedUpperApList = [];
      //       const { data } = res;
      //       data.sort((a, b) => b.rssi - a.rssi);
      //       this.originalUpperList = data;
      //       data.map(i => this.processedUpperApList.push({
      //         value: i.ssid, text: i.ssid, encrypt: i.security, rssi: i.rssi
      //       }));
      //   });
    }, 7000),
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
  padding-top: 30px;
  .upperApForm__top {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h4 {
    margin-top: 0;
    margin-bottom: 20px;
  }
}
@media screen and (max-width: 768px) {
  .form {
    width: 100%;
  }
}
</style>
