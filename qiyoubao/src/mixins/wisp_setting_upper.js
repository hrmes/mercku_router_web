import {
  isValidPassword,
  isFieldHasSpaces,
  getStringByte
} from 'base/util/util';
import { EncryptMethod, WanType } from 'base/util/constant';

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
      manualWispForm: {
        ssid: '',
        password: '',
        band: '2.4G',
        security: EncryptMethod.wpa2
      },
      upperApFormRules: null,
      manualWispRules: {
        ssid: [
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 32,
            message: this.$t('trans1252')
              .replace('%d', 1)
              .replace('%d', 32)
          }
        ],
        password: [
          {
            rule: value => isFieldHasSpaces(value),
            message: this.$t('trans1020')
          },
          {
            rule: value => !/^\s*$/g.test(value.trim()),
            message: this.$t('trans0232')
          },
          {
            rule: value =>
              getStringByte(value) >= 8 && getStringByte(value) <= 128,
            message: this.$t('trans1252')
              .replace('%d', 8)
              .replace('%d', 128)
          }
        ]
      },
      bandOptions: [
        { value: '2.4G', text: '2.4G' },
        { value: '5G', text: '5G' }
      ],
      encryptMethods: [
        {
          value: EncryptMethod.wpawpa2,
          text: this.$t('trans0557')
        },
        {
          value: EncryptMethod.wpa2,
          text: this.$t('trans0556')
        },
        {
          value: EncryptMethod.wpa3,
          text: this.$t('trans0572')
        },
        {
          value: EncryptMethod.wpa2wpa3,
          text: this.$t('trans0573')
        },
        {
          value: EncryptMethod.open,
          text: this.$t('trans0554')
        }
      ],
      originalUpperList: [],
      processedUpperApList: [],
      pwdDisabled: true,
      selectIsLoading: LoadingStatus.default,
      loadingText: `${this.$t('trans1181')}...`,
      getApclientScanTimer: null,
      rescanCounts: 0,
      modalShow: false
    };
  },
  watch: {
    // upperAp表单验证:由于密码是否验证是根据用户选择的上级是否有加密方式来决定的,所有制定两套验证规则
    pwdDisabled: {
      handler(nv) {
        if (nv === true) {
          this.upperApFormRules = {
            // 这一套只验证ssid是否为空
            'upperApForm.ssid': [
              {
                rule: value => !/^\s*$/g.test(value.trim()),
                message: this.$t('trans0232')
              }
            ]
          };
        } else {
          this.upperApFormRules = {
            // 这一套要验证ssid和密码
            'upperApForm.ssid': [
              {
                rule: value => !/^\s*$/g.test(value.trim()),
                message: this.$t('trans0232')
              }
            ],
            'upperApForm.password': [
              {
                rule: value => isFieldHasSpaces(value),
                message: this.$t('trans1020')
              },
              {
                rule: value => !/^\s*$/g.test(value.trim()),
                message: this.$t('trans0232')
              },
              {
                rule: value => isValidPassword(value, 8, 128),
                message: this.$t('trans1252')
                  .replace('%d', 8)
                  .replace('%d', 128)
              }
            ]
          };
        }
      },
      immediate: true
    }
  },
  computed: {
    isWisp() {
      return this.netType === WanType.wisp;
    },
    upperEncryptIsOpen() {
      return this.manualWispForm.security === EncryptMethod.open;
    }
  },
  methods: {
    // 去除扫描到的上级列表里面，重复的数据
    removeDuplicates(arr) {
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
          }, 10000);
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
            result = this.removeDuplicates(result);
            result.sort((a, b) => {
              // 信号强度降序排列
              if (b.rssi !== a.rssi) {
                return b.rssi - a.rssi;
              }
              // 如果信号强度相同，按照 SSID 的字母/数字顺序升序排列
              return a.ssid.localeCompare(b.ssid);
            });
            console.log('after remove duplicates', result);
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
            console.log('processdUpperList is', this.processedUpperApList);
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
      this.pwdDisabled = option.security.toLowerCase() === EncryptMethod.open;
      this.saveDisable = false;
      const {
        ssid,
        bssid,
        password = '',
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
    onEncryptChange(nv, ov) {
      if (nv === EncryptMethod.wpa3) {
        this.$dialog.confirm({
          okText: this.$t('trans0024'),
          cancelText: this.$t('trans0025'),
          message: this.$t('trans0692'),
          callback: {
            cancel: () => {
              this.manualWispForm.security = ov;
              console.log('cancel', ov);
            }
          }
        });
      }
      if (nv === EncryptMethod.open) {
        this.manualWispForm.password = '';
      }
    },
    hiddenModalShow() {
      this.modalShow = false;
      this.manualWispForm = {
        ssid: '',
        password: '',
        band: '2.4G',
        security: EncryptMethod.wpa2
      };
    }
  }
};
