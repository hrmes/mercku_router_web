import { VPNType } from 'base/util/constant';
import { getStringByte, ipRegWithMask, ipReg } from 'base/util/util';

export default {
  data() {
    return {
      wireGuardInitForm: {
        id: '',
        name: '',
        protocol: VPNType.wireguard,
        wireguard: {
          interface: {
            private_key: '',
            addresses: [''],
            listen_port: null,
            mtu: null
          },
          peers: [
            {
              preshared_key: '',
              public_key: '',
              allowed_ips: ['0.0.0.0/0'],
              endpoint_host: '',
              endpoint_port: 51820,
              persistent_keepalive: 25,
              route_allowed_ips: false
            }
          ]
        }
      },
      wireguardRules: {
        key: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) === 44,
            message: this.$t('trans1209')
          }
        ],
        preshared_key: [
          {
            rule: value => value === '' || getStringByte(value) === 44,
            message: this.$t('trans1209')
          }
        ],
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipRegWithMask.test(value),
            message: this.$t('trans0231')
          }
        ],
        port: [
          {
            rule: value =>
              value === '' || value === null || /^[0-9]+$/.test(value),
            message: this.$t('trans0478')
          },
          {
            rule: value =>
              value === null || value === '' || (value >= 1 && value <= 65535),
            message: this.$t('trans0478')
          }
        ],
        mtu: [
          {
            rule: value =>
              value === '' || value === null || /^[0-9]+$/.test(value),
            message: this.$t('trans1158')
              .replace('%d', 64)
              .replace('%d', 1500)
          },
          {
            rule: value =>
              value === '' || value === null || (value >= 64 && value <= 1500),
            message: this.$t('trans1158')
              .replace('%d', 64)
              .replace('%d', 1500)
          }
        ],
        optional_ip: [
          {
            rule: value => !value || ipReg.test(value),
            message: this.$t('trans0231')
          }
        ]
      },
      isKeepAlive: true
    };
  },
  watch: {
    vpnType(nv) {
      if (this.formType === this.FormType.add && nv === VPNType.wireguard) {
        // 先存一下vpn.name
        this.wireGuardInitForm.name = this.form.name;
        this.form = JSON.parse(JSON.stringify(this.wireGuardInitForm));
      }
      if (
        this.formType === this.FormType.update &&
        nv === VPNType.wireguard &&
        !this.form?.wireguard
      ) {
        // 先存一下vpn.name
        this.wireGuardInitForm.name = this.form.name;
        this.wireGuardInitForm.id = this.form.id;
        this.form = JSON.parse(JSON.stringify(this.wireGuardInitForm));
      }
    },
    keepAliveTime: {
      handler(nv) {
        if (nv) {
          this.isKeepAlive = true;
        } else {
          this.isKeepAlive = false;
        }
      },
      immediate: true
    }
  },
  computed: {
    vpnType() {
      return this.form.protocol;
    },
    keepAliveTime() {
      return this.form?.wireguard?.peers[0]?.persistent_keepalive;
    }
  },
  methods: {
    // 遍历params,删除params对象中值为空的键值对
    deepClean(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((val, i) => {
          if (
            Object.prototype.toString.call(val) === '[object Object]' ||
            Object.prototype.toString.call(val) === '[object Array]'
          ) {
            this.deepClean(val);
          } else if (val === null || val === '') {
            obj.splice(i, 1);
          }
        });
      } else if (Object.prototype.toString.call(obj) === '[object Object]') {
        Object.entries(obj).forEach(([key, val]) => {
          // 始终保留id键值对
          if (key === 'id') return;
          if (
            Object.prototype.toString.call(val) === '[object Object]' ||
            Object.prototype.toString.call(val) === '[object Array]'
          ) {
            this.deepClean(val);
          } else if (val === null || val === '') {
            delete obj[key];
          }
        });
      }
      return obj;
    }
  }
};
