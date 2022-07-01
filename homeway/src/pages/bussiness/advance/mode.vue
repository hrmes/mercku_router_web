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
        <!-- <div class="upperApForm__top"
             v-if="hasScanedUpper">
          <m-loading :color="loadingColor"
                     :size="48"></m-loading>
          <p>{{`正在扫描上级网关中...`}}</p>
        </div> -->
        <div class="upperApForm__bottom">
          <h4>{{`Upper-level AP`}}</h4>
          <m-form ref="upperApForm"
                  :model="upperApForm"
                  :rules="wifiFormRules">
            <m-form-item class="form-item"
                         prop="ssid">
              <m-select label="SSID"
                        placeholder="请选择一个扫描到的ssid"
                        v-model="upperApForm.ssid"
                        :options="upperApList"
                        :loading="selectIsLoading" />
            </m-form-item>
            <m-form-item class="form-item"
                         prop="password">
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
                v-show="modeHasChange">{{$t('trans0081')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { getStringByte, isValidPassword, isFieldHasComma, isFieldHasSpaces, throttle } from '../../../../../base/src/util/util';

export default {
  computed: {},
  data() {
    return {
      currentMode: '',
      modeHasChange: false,
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
        ssid: '',
        password: ''
      },
      upperApList: [],
      wifiFormRules: {
        // upperApSsid: [
        //   {
        //     rule: value => !/^\s*$/g.test(value),
        //     message: this.$t('trans0237')
        //   },
        //   {
        //     rule: value => getStringByte(value) <= 20,
        //     message: this.$t('trans0261')
        //   },
        //   {
        //     rule: value => isFieldHasComma(value),
        //     message: this.$t('trans0451')
        //   }
        // ],
        upperApPassword: [
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
      },
      hasScanedUpper: true,
    };
  },
  mounted() {
    this.getMode();
  },
  watch: {
    mode(nv) {
      if (this.currentMode === nv) {
        // 模式没变化，就隐藏修改模式按钮
        this.modeHasChange = false;
      } else {
        // 模式有变化，就展示修改模式按钮
        this.modeHasChange = true;
      }
      switch (nv) {
        case 'wireless_bridge':
          this.modeHasChange = false;
          this.getMeshApclientScanList();
          break;
        default:
          break;
      }
    }
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
      // 如果提交的mode为有线桥，就要检测是否插入网线，未插入就提示用户
      if (this.mode === 'bridge') {
        // TODO:监测网口是否插入网线接口待调用;
        // 1.如果没有插入网线
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: [this.$t('trans1063'), this.$t('trans1065')],
          callback: {
            ok: () => {
              this.confirmUpdateMeshMode();
            }
          }
        });
        // 2.插入了网线,直接进行mode update
      }
    },
    confirmUpdateMeshMode() {
      this.$loading.open();
      this.$http
        .updateMeshMode({ mode: this.mode })
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
      axios({
        url: 'http://127.0.0.1:4523/mock/1010011/getMeshApclientScanList?id=1',
        method: 'get'
      })
        .then(res => {
          this.upperApList = [];
          setTimeout(() => {
            console.log(res.data);
            const { data } = res;
            data.map(i => this.upperApList.push({
              value: i.ssid, text: i.ssid
            }));
            console.log(this.upperApList);
            this.hasScanedUpper = false;
          }, 5000);
        });
      // this.$http.getMeshApclientScanList
      //   .then(res => {
      //     console.log(res);
      //   });
    }, 7000)
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
