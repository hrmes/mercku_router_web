import { EncryptMethod } from '../util/constant';

export default {
  data() {
    const encryptMethods = [
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

    if (process.env.CUSTOMER_CONFIG.supportWPA3) {
      encryptMethods.splice(0, 0, {
        value: EncryptMethod.wpa2wpa3,
        text: this.$t('trans0573')
      });
      encryptMethods.splice(2, 0, {
        value: EncryptMethod.wpa3,
        text: this.$t('trans0572')
      });
    }

    return {
      encryptMethods
    };
  }
};
