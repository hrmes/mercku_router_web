import { VPNType } from 'base/util/constant';
import { getStringByte, ipReg } from 'base/util/util';

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
            mtu: ''
          },
          peers: [
            {
              preshared_key: '',
              public_key: '',
              allowed_ips: ['0.0.0.0'],
              endpoint_host: '',
              endpoint_port: '51820',
              persistent_keepalive: true,
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
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans1174')
          }
        ],
        preshared_key: [
          {
            rule: value => (value ? !/^\s*$/g.test(value) : true),
            message: this.$t('trans0232')
          },
          {
            rule: value => getStringByte(value) <= 64,
            message: this.$t('trans1174')
          }
        ],
        ip: [
          {
            rule: value => !/^\s*$/g.test(value),
            message: this.$t('trans0232')
          },
          {
            rule: value => ipReg.test(value),
            message: this.$t('trans0231')
          }
        ],
        port: [
          {
            rule: value => (value ? !value.includes('.') : true),
            message: this.$t('trans0031')
          },
          {
            rule: value => (value ? value >= 1 && value <= 65535 : true),
            message: this.$t('trans0478')
          }
        ],
        mtu: [
          {
            rule: value => (value ? !value.includes('.') : true),
            message: this.$t('trans1158')
              .replace('%d', 64)
              .replace('%d', 1500)
          },
          {
            rule: value => (value ? value >= 64 && value <= 1500 : true),
            message: this.$t('trans1158')
              .replace('%d', 64)
              .replace('%d', 1500)
          }
        ],
        optional_ip: [
          {
            rule: value => (value ? ipReg.test(value) : true),
            message: this.$t('trans0231')
          }
        ]
      }
    };
  },
  watch: {
    vpnType(nv) {
      if (this.formType === this.FormType.add && nv === VPNType.wireguard) {
        this.form = JSON.parse(JSON.stringify(this.wireGuardInitForm));
      }
    }
  },
  computed: {
    vpnType() {
      return this.form.protocol;
    }
  }
};
