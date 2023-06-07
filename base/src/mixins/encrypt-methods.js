import { EncryptMethod, Models } from '../util/constant';

export default {
  data() {
    let encryptMethods = [];
    switch (process.env.MODEL_CONFIG.id) {
      case Models.m2:
        encryptMethods = [
          {
            value: EncryptMethod.wpawpa2,
            text: this.$t('trans0557')
          },
          {
            value: 'wpa',
            text: this.$t('trans0555')
          },
          {
            value: EncryptMethod.wpa2,
            text: this.$t('trans0556')
          },
          {
            value: EncryptMethod.open,
            text: this.$t('trans0554')
          }
        ];
        break;
      case Models.m6:
      case Models.m6c:
        encryptMethods = [
          {
            value: EncryptMethod.wpa2wpa3,
            text: this.$t('trans0573')
          },
          {
            value: EncryptMethod.wpawpa2,
            text: this.$t('trans0557')
          },
          {
            value: EncryptMethod.wpa3,
            text: this.$t('trans0572')
          },
          {
            value: EncryptMethod.wpa2,
            text: this.$t('trans0556')
          },
          {
            value: EncryptMethod.open,
            text: this.$t('trans0554')
          }
        ];
        break;
      case Models.m6a:
      case Models.m6aPlus:
      case Models.homeway:
        encryptMethods = [
          {
            value: EncryptMethod.open,
            text: this.$t('trans0554')
          },
          {
            value: EncryptMethod.wpa2,
            text: this.$t('trans0556')
          },
          {
            value: EncryptMethod.wpa3,
            text: this.$t('trans0572')
          }
        ];
        break;
      default:
        encryptMethods = [
          {
            value: EncryptMethod.wpawpa2,
            text: this.$t('trans0557')
          },
          {
            value: EncryptMethod.wpa2,
            text: this.$t('trans0556')
          },
          {
            value: EncryptMethod.open,
            text: this.$t('trans0554')
          }
        ];
    }
    return {
      encryptMethods
    };
  }
};
