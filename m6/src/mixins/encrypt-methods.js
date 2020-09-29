import { EncryptMethod } from '@/util/constant';

export default {
  data() {
    return {
      encryptMethods: [
        {
          value: EncryptMethod.wpa2wpa3,
          text: this.$t('trans0573')
        },
        {
          value: EncryptMethod.wpawpa2,
          text: this.$t('trans0557')
        },
        {
          value: EncryptMethod.wpa,
          text: this.$t('trans0555')
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
          value: EncryptMethod.open,
          text: this.$t('trans0554')
        }
      ]
    };
  }
};
