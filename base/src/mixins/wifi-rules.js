import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
  isFieldHasSpaces
} from '../util/util';
import { Models } from '../util/constant';

export default {
  methods: {
    getAdvanceSSIDRule() {
      const { id } = process.env.MODEL_CONFIG;
      switch (id) {
        case Models.M6:
          return [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
            {
              rule: value => getStringByte(value.trim()) <= 20,
              message: this.$t('trans0261')
            },
            {
              rule: value => isFieldHasComma(value),
              message: this.$t('trans0451')
            }
          ];
        default:
          return [
            {
              rule: value => !/^\s*$/g.test(value.trim()),
              message: this.$t('trans0237')
            },
            {
              rule: value => getStringByte(value.trim()) <= 20,
              message: this.$t('trans0261')
            },
            {
              rule: value => isFieldHasComma(value),
              message: this.$t('trans0451')
            },
            {
              rule: value => isFieldHasSpaces(value),
              message: this.$t('trans1021')
            }
          ];
      }
    },
    getAdvancePasswordRule() {
      const id = process.env.MODEL_CONFIG;
      switch (id) {
        // 支持空格但是不支持逗号，8-24位
        case Models.M6:
          return [
            {
              rule: value => isFieldHasComma(value),
              message: this.$t('trans0452')
            },
            {
              rule: value => isValidPassword(value),
              message: this.$t('trans0169')
            }
          ];
        // 不支持空格 支持逗号 8-24位
        case Models.M6a:
        case Models.M6s:
        case Models['M6s Nano']:
          return [
            {
              rule: value => isFieldHasComma(value),
              message: this.$t('trans0452')
            },
            {
              rule: value => isFieldHasSpaces(value),
              message: this.$t('trans1020')
            },
            {
              rule: value => isValidPassword(value),
              message: this.$t('trans0169')
            }
          ];
        // 支持空格和逗号，8-24位
        default:
          return [
            {
              rule: value => isValidPassword(value),
              message: this.$t('trans0169')
            }
          ];
      }
    }
  }
};
