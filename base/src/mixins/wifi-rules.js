import {
  getStringByte,
  isValidPassword,
  isFieldHasComma,
  isFieldHasSpaces,
  isFieldHasSemicolon,
  isFieldHasBackslash
} from '../util/util';
import { Models } from '../util/constant';

export default {
  methods: {
    getAdvanceSSIDRule() {
      const { id } = process.env.MODEL_CONFIG || {};
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
    // runtimeModelId 可显式传入覆盖；未传时回退 MODEL_CONFIG。
    // 注意 vue-cli 的 DefinePlugin 会把整个 process.env 静态替换为
    // { NODE_ENV, BASE_URL }（resolveClientEnv 返回 { 'process.env': env }），
    // 测试/unified 构建下 process.env.MODEL_CONFIG 恒为 undefined 且运行时
    // 注入无效，因此需要显式参数入口（m6a 等型号构建单独 define 了该键）。
    getAdvancePasswordRule(runtimeModelId) {
      const { id } = process.env.MODEL_CONFIG || {};
      switch (runtimeModelId || id) {
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
        // 分号/反斜杠与后端 mercku-suite sal 层黑名单对齐：
        // 分号是 .dat 多 VAP 分隔符，反斜杠被底座 echo -e 二次解释
        case Models.M6a:
        case Models.M6s:
        case Models.M6s_Nano:
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
              rule: value => isFieldHasSemicolon(value),
              message: this.$t('trans1251')
            },
            {
              rule: value => isFieldHasBackslash(value),
              message: this.$t('trans1252')
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
