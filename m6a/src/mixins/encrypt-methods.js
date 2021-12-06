import { EncryptMethod } from 'base/util/constant';

export default {
  data() {
    return {
      encryptMethods: [
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
      ]
    };
  }
};
