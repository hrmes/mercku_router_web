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

export default {
  data() {
    return {
      upperApForm: UpperApInitForm,
      upperApFormRules: {
        'upperApForm.ssid': [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0237')
          }
        ]
      },
      originalUpperList: [],
      processedUpperApList: [],
      saveDisable: true,
      selectIsLoading: LoadingStatus.default,
      loadingText: `${this.$t('trans1070')}...`,
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
      this.loadingText = `${this.$t('trans1070')}...`;
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
      this.pwdDisabled = option.encrypt === EncryptMethod.OPEN;
      this.saveDisable = false;
      const {
        ssid,
        password,
        bssid,
        channel,
        band,
        security,
        rssi
      } = this.originalUpperList.find(i => i.ssid === option.value);
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
    connectUpperAp() {
      if (this.$refs.upperApForm.validate()) {
        console.log('upperApInfo is', this.upperApForm);
        this.$loading.open({ template: this.$t('trans1105') });
        setTimeout(() => {
          this.checkoutMeshApclient();
        }, 10000);
      }
    },
    checkoutMeshApclient() {
      this.$http
        .checkoutMeshApclient(undefined, { hideToast: true })
        .then(res => {
          const { status } = res.data.result;
          this.$loading.close();
          if (status) {
            this.stepOption.current = 1;
            this.stepOption.steps[1].success = true;
          } else {
            this.$dialog.info({
              okText: this.$t('trans0024'),
              message: this.$t('trans1103')
            });
          }
        })
        .catch(() => {
          this.$loading.close();
          this.$dialog.info({
            okText: this.$t('trans0024'),
            message: this.$t('trans1103')
          });
        });
    }
  }
};
