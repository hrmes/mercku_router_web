<template>
  <div class="page">
    <div v-if="$store.state.isMobile"
         class="page-header">
      {{$t('trans0539')}}
    </div>
    <div class="page-content">
      <div class="page-content__main">
        <div class="row-1">
          <div class="card">
            <div class="form">
              <m-form-item class="last">
                <m-radio-group v-model="mode"
                               :options="modes"
                               direction="vertical"></m-radio-group>
                <p class="note">{{$t('trans0543')}}</p>
              </m-form-item>
            </div>
          </div>
        </div>
        <div class="row-2"
             v-if="mode===RouterMode.wirelessBridge">
          <div class="card"
               v-if="currentUpperInfo.show">
            <div class="upperApForm">
              <div class="upperApForm__top">
                <h4>{{$t('trans1132')}}</h4>
                <div class="upperApForm__top__upperinfo">
                  <div class="current-ssid">
                    <span class="title">{{$t('trans1133')}}</span>
                    <span class="content">{{currentUpperInfo.ssid}}</span>
                  </div>
                  <div class="current-pwd">
                    <span class="title">{{$t('trans1134')}}</span>
                    <span class="content"
                          :title="pwdValue">
                      {{pwdValue}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="upperApForm">
              <div class="upperApForm__bottom">
                <h4>Set upper-level</h4>
                <m-form ref="upperApForm"
                        :model="upperApForm"
                        :rules="upperApFormRules">
                  <m-form-item prop="upperApForm.ssid"
                               :class="{last:pwdDisabled}">
                    <m-loadingSelect label="SSID"
                                     :placeholder="$t('trans1182')"
                                     type='text'
                                     @change="selectedChange"
                                     @scanApclient="startApclientScan"
                                     :popupTop='currentUpperInfo.show||$store.state.isMobile'
                                     :bssid="upperApForm.bssid"
                                     :options="processedUpperApList"
                                     :loading="selectIsLoading"
                                     :loadingText="loadingText" />
                  </m-form-item>
                  <m-form-item v-show="!pwdDisabled"
                               prop="upperApForm.password">
                    <m-input :label="$t('trans0003')"
                             type="password"
                             :placeholder="$t('trans0321')"
                             v-model="upperApForm.password" />
                  </m-form-item>
                </m-form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-content__bottom"
           v-show="modeHasChange||upperApForm.ssid!==''&&upperApForm.band!==''">
        <div class="form-button__wrapper">
          <button class="btn primary"
                  v-defaultbutton
                  @click="updateMode"
                  :disabled="saveDisable">{{$t('trans0081')}}</button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { EncryptMethod, RouterMode } from 'base/util/constant';
import SettingUpperAp from '@/mixins/setting-upperAp';

const UpperApInitForm = {
  ssid: '', // 必选
  password: '', // 可选
  bssid: '', // 必选
  channel: '', // 必选
  band: '', // 必选
  security: '', // 必选
  rssi: '' // 可选,上级无线信号的强度.获取APClient时必选,更新时可选
};
export default {
  mixins: [SettingUpperAp],
  data() {
    return {
      EncryptMethod,
      RouterMode,
      currentMode: '',
      modeHasChange: false,
      saveDisable: false,
      mode: '',
      modes: [
        {
          text: this.$t('trans0541'),
          value: 'router'
        },
        {
          text: this.$t('trans1131'),
          value: 'bridge'
        },
        {
          text: this.$t('trans1130'),
          value: 'wireless_bridge'
        }
      ],
      currentUpperInfo: {
        show: false,
        ssid: '-',
        security: EncryptMethod.OPEN,
        password: ''
      },
      originalUpperList: []
    };
  },
  mounted() {
    this.getMode();
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
        case RouterMode.wirelessBridge:
          this.saveDisable = true;
          this.upperApForm.ssid = '';
          break;
        default:
          this.saveDisable = false;
          break;
      }
    }
  },
  computed: {
    pwdValue() {
      return this.currentUpperInfo.security !== EncryptMethod.OPEN
        ? this.currentUpperInfo.password
        : '-';
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
          if (result.mode === RouterMode.wirelessBridge) {
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
    updateMode() {
      switch (this.mode) {
        // 如果提交的mode为有线桥，就要检测是否插入网线，未插入就提示用户
        case RouterMode.bridge:
        case RouterMode.router:
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

          break;
        case RouterMode.wirelessBridge:
          if (this.$refs.upperApForm.validate()) {
            this.$dialog.confirm({
              okText: this.$t('trans0024'),
              cancelText: this.$t('trans0025'),
              // 提示为可能会让网络不可用
              message: this.$t('trans0229'),
              callback: {
                ok: () => {
                  this.connectUpperAp('modeChange');
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
      // if (params.mode === HomewayWorkModel.bridge) {
      //   this.$loading.open();
      // }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  .note {
    color: #999;
    font-size: 12px;
    margin: 0;
    margin-top: 5px;
    padding-left: 26px;
  }
}
.upperApForm {
  .upperApForm__top {
    color: var(--text-default-color);
    .upperApForm__top__upperinfo {
      width: 100%;
      padding: 10px;
      background: var(--flex-warp-has-menu-bgc);
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
      color: var(--dashboard-gery-color);
    }
    .content {
      font-weight: 600;
    }
  }
  .upperApForm__bottom {
    .tips {
      color: var(--text-default-color);
      font-size: 12px;
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
