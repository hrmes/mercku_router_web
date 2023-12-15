import { isValidPassword } from 'base/util/util';
import { EncryptMethod } from 'base/util/constant';

const LoadingStatus = {
  empty: 0,
  loading: 1,
  failed: 2,
  success: 3,
  default: 4
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

const PageTypes = {
  Initialization: 'initialization',
  ModeChange: 'modeChange'
};

export default {
  data() {
    return {
      upperApForm: UpperApInitForm,
      upperApFormRules: {
        'upperApForm.ssid': [
          {
            rule: value => value,
            message: this.$t('trans0237')
          }
        ]
      },
      originalUpperList: [],
      processedUpperApList: [],
      pwdDisabled: true,
      selectIsLoading: LoadingStatus.default,
      loadingText: `${this.$t('trans1181')}...`,
      getApclientScanTimer: null,
      rescanCounts: 0
    };
  },
  watch: {
    // upperAp表单验证:由于密码是否验证是根据用户选择的上级是否有加密方式来决定的,所有制定两套验证规则
    pwdDisabled(nv) {
      if (nv === true) {
        this.upperApFormRules = {
          // 这一套只验证ssid是否为空
          'upperApForm.ssid': [
            {
              rule: value => value,
              message: this.$t('trans0237')
            }
          ]
        };
      } else {
        this.upperApFormRules = {
          // 这一套要验证ssid和密码
          'upperApForm.ssid': [
            {
              rule: value => value,
              message: this.$t('trans0237')
            }
          ],
          'upperApForm.password': [
            {
              rule: value => value,
              message: this.$t('trans0232')
            },
            {
              rule: value => isValidPassword(value, 8, 64),
              message: this.$t('trans1220').replace('%s', 8)
            },
            {
              rule: value => value.trim() !== '',
              message: this.$t('trans1227')
            },
            {
              rule: value => value.trim() === value,
              message: this.$t('trans1226')
            }
          ]
        };
      }
    }
  },
  methods: {
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
    startApclientScan() {
      if (this.selectIsLoading === LoadingStatus.loading) return;
      this.selectIsLoading = LoadingStatus.loading;
      this.loadingText = `${this.$t('trans1181')}...`;
      this.$http
        .startMeshApclientScan()
        .then(() => {
          setTimeout(() => {
            this.getApclientScanList();
          }, 15000);
        })
        .catch(() => {
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1183');
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

            // result = result.filter(item => !/^\s*$/.test(item.ssid));
            result = this.deweight(result);
            console.log('deweight', result);
            result.sort((a, b) => b.rssi - a.rssi);
            this.originalUpperList = result;
            result.map(i =>
              this.processedUpperApList.push({
                value: i.ssid,
                text: `${i.ssid}`,
                security: i.security,
                rssi: i.rssi,
                band: i.band,
                bssid: i.bssid
              })
            );
            this.selectIsLoading = LoadingStatus.success;
          } else {
            this.getApclientScanTimer = setTimeout(() => {
              if (this.rescanCounts < 2) {
                // eslint-disable-next-line no-plusplus
                this.rescanCounts++;
                this.getApclientScanList();
              } else {
                this.originalUpperList = [];
                this.processedUpperApList = [];
                this.loadingText = this.$t('trans1183');
                this.selectIsLoading = LoadingStatus.failed;
              }
            }, 5000);
          }
        })
        .catch(err => {
          console.log(err);
          this.originalUpperList = [];
          this.processedUpperApList = [];
          this.loadingText = this.$t('trans1183');
          this.selectIsLoading = LoadingStatus.failed;
        });
    },
    selectedChange(option) {
      this.pwdDisabled =
        option.security === EncryptMethod.OPEN ||
        option.security === EncryptMethod.open;
      this.saveDisable = false;
      const {
        ssid,
        bssid,
        password,
        channel,
        band,
        security,
        rssi
      } = this.originalUpperList.find(i => i.bssid === option.bssid);
      this.upperApForm = {
        ssid,
        bssid,
        password,
        channel,
        band,
        security,
        rssi
      };
      console.log('upperAp', this.upperApForm);
    },
    connectUpperAp(mode) {
      this.$loading.open();

      console.log('upperApInfo is', this.upperApForm);
      this.$http
        .updateMeshApclient({ mode, apclient: this.upperApForm })
        .then(() => {
          this.$store.state.changeMode = true;
          this.$store.state.mode = mode;
          localStorage.setItem('mode', mode);

          this.$reconnect({
            timeout: 180,
            delayTime: 95, // 95秒后检测更改模式是否成功
            onsuccess: () => {
              this.$toast(this.$t('trans0040'), 3000, 'success');
              // 如果修改了模式，则跳转到登录页面，否则停留在当前页面
              this.$router.push({ path: '/login' });
            },
            ontimeout: () => {
              this.$router.push({ path: '/unconnect' });
            }
          });
          // this.checkMeshApclient(pageType);
        })
        .catch(() => {
          this.$store.state.changeMode = false;
        })
        .finally(() => {
          this.$loading.close();
        });
    },
    // checkMeshApclient(pageType) {
    //   if (pageType === PageTypes.Initialization) {
    //     this.$loading.close();
    //     this.initializationHandle();
    //   }
    //   if (pageType === PageTypes.ModeChange) {
    //     this.modeChangeHandle();
    //   }
    //   this.$http
    //     .checkMeshApclient(undefined, { hideToast: true })
    //     .then(res => {
    //       const { status } = res.data.result;
    //       if (status) {
    //         if (pageType === PageTypes.Initialization) {
    //           this.$loading.close();
    //           this.initializationHandle();
    //         }
    //         if (pageType === PageTypes.ModeChange) {
    //           this.modeChangeHandle();
    //         }
    //       } else {
    //         this.$dialog.info({
    //           okText: this.$t('trans0024'),
    //           message: this.$t('trans1103')
    //         });
    //         this.$loading.close();
    //       }
    //     })
    //     .catch(() => {
    //       this.$dialog.info({
    //         okText: this.$t('trans0024'),
    //         message: this.$t('trans1103')
    //       });
    //       this.$loading.close();
    //     });
    // },
    initializationHandle() {
      this.stepOption.current = 1;
      this.stepOption.steps[1].success = true;
    },
    modeChangeHandle() {
      this.confirmUpdateMeshMode({ mode: this.mode });
    }
  }
};
